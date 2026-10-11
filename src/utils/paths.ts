import { Match } from '../types'

const WILDCARD_KEY = '*'
const TRAILING_WILDCARD = /(^|\/)\*$/
const REGEXP_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g

const escapeRegExp = (text: string) =>
  text.replace(REGEXP_SPECIAL_CHARS, '\\$&')

const decodeParam = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function compilePath(path: string): {
  regexp: RegExp
  keys: string[]
} {
  const keys: string[] = []
  const hasWildcard = TRAILING_WILDCARD.test(path)
  const pattern = escapeRegExp(
    path
      .replace(TRAILING_WILDCARD, '')
      .replace(/\/$/, '')
      .replace(/^\//, ''),
  ).replace(/:(\w+)/g, (_, key) => {
    keys.push(key)
    return '([^/]+)'
  })

  if (hasWildcard) {
    keys.push(WILDCARD_KEY)
  }

  // Without a wildcard, matches the path as a prefix that ends on a segment boundary
  const prefix = pattern ? `/${pattern}` : ''
  const ending = hasWildcard ? '(?:/(.*))?$' : '(?=/|$)'
  const regexp = new RegExp(`^${prefix}${ending}`)

  return { regexp, keys }
}

export function matchPath(
  pathname: string,
  options: { path: string; exact?: boolean },
): Match | null {
  const { path, exact = false } = options

  const { regexp, keys } = compilePath(path)
  const match = regexp.exec(pathname)

  if (!match) {
    return null
  }

  const [url, ...values] = match
  const params = keys.reduce(
    (acc, key, index) => {
      acc[key] = decodeParam(values[index] ?? '')
      return acc
    },
    {} as Record<string, string>,
  )

  const unmatchedRest = pathname.slice(url.length)
  const isExact = unmatchedRest === '' || unmatchedRest === '/'

  if (exact && !isExact) {
    return null
  }

  return {
    path,
    url: url || '/',
    isExact,
    params,
  }
}

export function normalizePath(path: string): string {
  return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
}

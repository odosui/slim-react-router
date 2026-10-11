import { Match } from '../types'

export function compilePath(path: string): {
  regexp: RegExp
  keys: string[]
} {
  const keys: string[] = []
  const pattern = path
    .replace(/\/$/, '')
    .replace(/^\//, '')
    .replace(/:(\w+)/g, (_, key) => {
      keys.push(key)
      return '([^/]+)'
    })

  // Matches the path as a prefix that ends on a segment boundary
  const prefix = pattern ? `/${pattern}` : ''
  const regexp = new RegExp(`^${prefix}(?=/|$)`)

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
      acc[key] = values[index] ?? ''
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

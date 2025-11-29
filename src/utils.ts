import { Match } from './types'

export function compilePath(path: string): {
  regexp: RegExp
  keys: string[]
} {
  const keys: string[] = []
  let pattern = path
    .replace(/\/$/, '')
    .replace(/^\//, '')
    .replace(/:(\w+)/g, (_, key) => {
      keys.push(key)
      return '([^/]+)'
    })

  pattern = `^/${pattern}/?$`
  const regexp = new RegExp(pattern)

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
  const params: Record<string, string> = {}

  keys.forEach((key, index) => {
    params[key] = values[index]
  })

  const isExact = pathname === url || pathname === url.replace(/\/$/, '')

  if (exact && !isExact) {
    return null
  }

  return {
    path,
    url: url.replace(/\/$/, '') || '/',
    isExact,
    params,
  }
}

export function normalizePath(path: string): string {
  return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
}

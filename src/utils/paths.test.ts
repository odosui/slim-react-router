import { describe, it, expect } from 'vitest'
import { matchPath, compilePath, normalizePath } from './paths'

describe('compilePath', () => {
  it('should compile a simple path', () => {
    const result = compilePath('/home')
    expect(result.regexp).toBeInstanceOf(RegExp)
    expect(result.keys).toEqual([])
  })

  it('should compile a path with parameters', () => {
    const result = compilePath('/users/:id')
    expect(result.keys).toEqual(['id'])
    expect(result.regexp.test('/users/123')).toBe(true)
  })

  it('should compile a path with multiple parameters', () => {
    const result = compilePath('/users/:userId/posts/:postId')
    expect(result.keys).toEqual(['userId', 'postId'])
    expect(result.regexp.test('/users/123/posts/456')).toBe(true)
  })
})

describe('matchPath', () => {
  describe('basic matching', () => {
    it('should match a simple path', () => {
      const match = matchPath('/home', { path: '/home' })
      expect(match).toEqual({
        path: '/home',
        url: '/home',
        isExact: true,
        params: {},
      })
    })

    it('should return null for non-matching path', () => {
      const match = matchPath('/about', { path: '/home' })
      expect(match).toBeNull()
    })

    it('should match root path', () => {
      const match = matchPath('/', { path: '/' })
      expect(match).toEqual({
        path: '/',
        url: '/',
        isExact: true,
        params: {},
      })
    })
  })

  describe('parameters', () => {
    it('should extract single parameter', () => {
      const match = matchPath('/users/123', { path: '/users/:id' })
      expect(match).toEqual({
        path: '/users/:id',
        url: '/users/123',
        isExact: true,
        params: { id: '123' },
      })
    })

    it('should extract multiple parameters', () => {
      const match = matchPath('/users/123/posts/456', {
        path: '/users/:userId/posts/:postId',
      })
      expect(match).toEqual({
        path: '/users/:userId/posts/:postId',
        url: '/users/123/posts/456',
        isExact: true,
        params: { userId: '123', postId: '456' },
      })
    })

    it('should handle alphanumeric parameters', () => {
      const match = matchPath('/users/abc123', { path: '/users/:id' })
      expect(match?.params['id']).toBe('abc123')
    })

    it('should not capture slashes in parameters', () => {
      const match = matchPath('/users/123/extra', { path: '/users/:id' })
      expect(match?.params['id']).toBe('123')
      expect(match?.url).toBe('/users/123')
    })
  })

  describe('exact matching', () => {
    it('should match exactly when exact is true', () => {
      const match = matchPath('/users/123', {
        path: '/users/:id',
        exact: true,
      })
      expect(match).not.toBeNull()
      expect(match?.isExact).toBe(true)
    })

    it('should not match non-exact path when exact is true', () => {
      const match = matchPath('/users/123/posts', {
        path: '/users/:id',
        exact: true,
      })
      expect(match).toBeNull()
    })

    it('should match when exact is false', () => {
      const match = matchPath('/users/123', {
        path: '/users/:id',
        exact: false,
      })
      expect(match).not.toBeNull()
    })
  })

  describe('prefix matching', () => {
    it('should match a nested pathname', () => {
      const match = matchPath('/users/123/posts', { path: '/users' })
      expect(match).toEqual({
        path: '/users',
        url: '/users',
        isExact: false,
        params: {},
      })
    })

    it('should match any pathname against the root path', () => {
      const match = matchPath('/users/123', { path: '/' })
      expect(match).toEqual({
        path: '/',
        url: '/',
        isExact: false,
        params: {},
      })
    })

    it('should only match whole segments', () => {
      const match = matchPath('/users-archive', { path: '/users' })
      expect(match).toBeNull()
    })

    it('should not match a nested pathname when exact is true', () => {
      const match = matchPath('/users/123', { path: '/users', exact: true })
      expect(match).toBeNull()
    })

    it('should treat a trailing slash as an exact match', () => {
      const match = matchPath('/users/', { path: '/users', exact: true })
      expect(match?.isExact).toBe(true)
    })
  })

  describe('special characters', () => {
    it('should match a dot literally', () => {
      expect(matchPath('/file.json', { path: '/file.json' })).not.toBeNull()
      expect(matchPath('/fileXjson', { path: '/file.json' })).toBeNull()
    })

    it('should match regexp syntax literally', () => {
      const match = matchPath('/a(b', { path: '/a(b' })
      expect(match?.url).toBe('/a(b')
    })

    it('should extract a parameter followed by a literal suffix', () => {
      const match = matchPath('/files/report.json', {
        path: '/files/:name.json',
      })
      expect(match?.params).toEqual({ name: 'report' })
    })
  })

  describe('encoded parameters', () => {
    it('should decode parameter values', () => {
      const match = matchPath('/users/John%20Doe', { path: '/users/:name' })
      expect(match?.params).toEqual({ name: 'John Doe' })
    })

    it('should keep a malformed value as is', () => {
      const match = matchPath('/users/%E0%A4%A', { path: '/users/:name' })
      expect(match?.params).toEqual({ name: '%E0%A4%A' })
    })
  })

  describe('wildcard', () => {
    it('should match any pathname', () => {
      const match = matchPath('/anything/here', { path: '*' })
      expect(match).toEqual({
        path: '*',
        url: '/anything/here',
        isExact: true,
        params: { '*': 'anything/here' },
      })
    })

    it('should match the root pathname', () => {
      const match = matchPath('/', { path: '*' })
      expect(match?.params).toEqual({ '*': '' })
    })

    it('should match everything under a prefix', () => {
      const match = matchPath('/files/docs/report.pdf', { path: '/files/*' })
      expect(match?.params).toEqual({ '*': 'docs/report.pdf' })
    })

    it('should match the prefix itself', () => {
      const match = matchPath('/files', { path: '/files/*' })
      expect(match?.params).toEqual({ '*': '' })
    })

    it('should only match whole segments of the prefix', () => {
      expect(matchPath('/filesystem', { path: '/files/*' })).toBeNull()
    })

    it('should combine with parameters', () => {
      const match = matchPath('/users/123/posts/456', { path: '/users/:id/*' })
      expect(match?.params).toEqual({ id: '123', '*': 'posts/456' })
    })

    it('should match when exact is true', () => {
      const match = matchPath('/files/docs', { path: '/files/*', exact: true })
      expect(match).not.toBeNull()
    })

    it('should treat an asterisk inside a segment literally', () => {
      expect(matchPath('/a*b', { path: '/a*b' })).not.toBeNull()
      expect(matchPath('/aXb', { path: '/a*b' })).toBeNull()
    })
  })

  describe('trailing slashes', () => {
    it('should match path with trailing slash', () => {
      const match = matchPath('/home/', { path: '/home' })
      expect(match).not.toBeNull()
      expect(match?.url).toBe('/home')
    })

    it('should match path without trailing slash', () => {
      const match = matchPath('/home', { path: '/home/' })
      expect(match).not.toBeNull()
    })

    it('should handle trailing slash with parameters', () => {
      const match = matchPath('/users/123/', { path: '/users/:id' })
      expect(match).not.toBeNull()
      expect(match?.params['id']).toBe('123')
    })
  })

  describe('edge cases', () => {
    it('should handle empty parameter values', () => {
      const match = matchPath('/users/', { path: '/users/:id' })
      expect(match).toBeNull()
    })

    it('should handle complex paths', () => {
      const match = matchPath('/api/v1/users/123/posts/456', {
        path: '/api/v1/users/:userId/posts/:postId',
      })
      expect(match?.params).toEqual({ userId: '123', postId: '456' })
    })

    it('should return isExact false for non-exact matches', () => {
      const match = matchPath('/users/123/posts', { path: '/users/:id' })
      expect(match?.isExact).toBe(false)
    })
  })
})

describe('normalizePath', () => {
  it('should normalize multiple slashes', () => {
    expect(normalizePath('/home//about///page')).toBe('/home/about/page')
  })

  it('should remove trailing slash', () => {
    expect(normalizePath('/home/')).toBe('/home')
  })

  it('should return / for root', () => {
    expect(normalizePath('/')).toBe('/')
  })

  it('should handle empty string', () => {
    expect(normalizePath('')).toBe('/')
  })

  it('should normalize complex paths', () => {
    expect(normalizePath('//home///about//')).toBe('/home/about')
  })
})

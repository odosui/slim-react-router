import { describe, it, expect } from 'vitest'
import { matchPath, compilePath, normalizePath } from './utils'

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

    it('should not match parameters with slashes', () => {
      const match = matchPath('/users/123/extra', { path: '/users/:id' })
      expect(match).toBeNull()
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
      const match = matchPath('/users/123', { path: '/users/:id' })
      expect(match?.isExact).toBe(true)
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

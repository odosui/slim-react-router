import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  useRouter,
  useHistory,
  useLocation,
  useNavigate,
  useParams,
  useRouteMatch,
  useSearchParams,
} from './hooks'
import { RouterContext, RouteContext } from './context'
import { History, Location, RouterContextValue, Match } from './types'

const createMockHistory = (overrides?: Partial<History>): History => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  goBack: vi.fn(),
  goForward: vi.fn(),
  location: {
    pathname: '/',
    search: '',
    hash: '',
  },
  listen: vi.fn(() => vi.fn()),
  createHref: vi.fn((path: string) => path),
  ...overrides,
})

const createMockLocation = (overrides?: Partial<Location>): Location => ({
  pathname: '/',
  search: '',
  hash: '',
  ...overrides,
})

describe('useRouter', () => {
  it('should return router context', () => {
    const mockHistory = createMockHistory()
    const mockLocation = createMockLocation()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: mockLocation,
    }

    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    expect(result.current).toEqual(contextValue)
    expect(result.current.history).toBe(mockHistory)
    expect(result.current.location).toBe(mockLocation)
  })

  it('should throw error when used outside Router', () => {
    expect(() => {
      renderHook(() => useRouter())
    }).toThrow('useRouter must be used within a Router')
  })
})

describe('useHistory', () => {
  it('should return history object', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    const { result } = renderHook(() => useHistory(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    expect(result.current).toBe(mockHistory)
  })
})

describe('useLocation', () => {
  it('should return location object', () => {
    const mockLocation = createMockLocation({
      pathname: '/home',
      search: '?query=test',
      hash: '#section',
    })
    const contextValue: RouterContextValue = {
      history: createMockHistory(),
      location: mockLocation,
    }

    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    expect(result.current).toEqual({
      pathname: '/home',
      search: '?query=test',
      hash: '#section',
    })
  })
})

describe('useNavigate', () => {
  it('should return navigate function', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    const { result } = renderHook(() => useNavigate(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    expect(typeof result.current).toBe('function')
  })

  it('should call history.push with string path', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    const { result } = renderHook(() => useNavigate(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    result.current('/home')
    expect(mockHistory.push).toHaveBeenCalledWith('/home', undefined)
  })

  it('should call history.push with state', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    const { result } = renderHook(() => useNavigate(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    const state = { from: '/previous' }
    result.current('/home', { state })
    expect(mockHistory.push).toHaveBeenCalledWith('/home', state)
  })

  it('should call history.replace when replace option is true', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    const { result } = renderHook(() => useNavigate(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    result.current('/home', { replace: true })
    expect(mockHistory.replace).toHaveBeenCalledWith('/home', undefined)
    expect(mockHistory.push).not.toHaveBeenCalled()
  })

  it('should call history.go with number', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    const { result } = renderHook(() => useNavigate(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    result.current(-1)
    expect(mockHistory.go).toHaveBeenCalledWith(-1)

    result.current(2)
    expect(mockHistory.go).toHaveBeenCalledWith(2)
  })
})

describe('useParams', () => {
  it('should return params from route context', () => {
    const mockMatch: Match = {
      path: '/users/:id',
      url: '/users/123',
      isExact: true,
      params: { id: '123' },
    }
    const contextValue: RouterContextValue = {
      history: createMockHistory(),
      location: createMockLocation(),
    }

    const { result } = renderHook(() => useParams(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          <RouteContext.Provider value={mockMatch}>
            {children}
          </RouteContext.Provider>
        </RouterContext.Provider>
      ),
    })

    expect(result.current).toEqual({ id: '123' })
  })

  it('should return empty object when no match', () => {
    const contextValue: RouterContextValue = {
      history: createMockHistory(),
      location: createMockLocation(),
    }

    const { result } = renderHook(() => useParams(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          <RouteContext.Provider value={null}>{children}</RouteContext.Provider>
        </RouterContext.Provider>
      ),
    })

    expect(result.current).toEqual({})
  })

  it('should work with typed params', () => {
    const mockMatch: Match = {
      path: '/users/:userId/posts/:postId',
      url: '/users/123/posts/456',
      isExact: true,
      params: { userId: '123', postId: '456' },
    }
    const contextValue: RouterContextValue = {
      history: createMockHistory(),
      location: createMockLocation(),
    }

    const { result } = renderHook(
      () => useParams<{ userId: string; postId: string }>(),
      {
        wrapper: ({ children }) => (
          <RouterContext.Provider value={contextValue}>
            <RouteContext.Provider value={mockMatch}>
              {children}
            </RouteContext.Provider>
          </RouterContext.Provider>
        ),
      },
    )

    expect(result.current.userId).toBe('123')
    expect(result.current.postId).toBe('456')
  })
})

describe('useRouteMatch', () => {
  it('should return match for current location', () => {
    const mockLocation = createMockLocation({ pathname: '/users/123' })
    const contextValue: RouterContextValue = {
      history: createMockHistory(),
      location: mockLocation,
    }

    const { result } = renderHook(() => useRouteMatch('/users/:id'), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    expect(result.current).toEqual({
      path: '/users/:id',
      url: '/users/123',
      isExact: true,
      params: { id: '123' },
    })
  })

  it('should return null for non-matching path', () => {
    const mockLocation = createMockLocation({ pathname: '/about' })
    const contextValue: RouterContextValue = {
      history: createMockHistory(),
      location: mockLocation,
    }

    const { result } = renderHook(() => useRouteMatch('/users/:id'), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    expect(result.current).toBeNull()
  })

  it('should return default match when no path provided', () => {
    const mockLocation = createMockLocation({ pathname: '/any/path' })
    const contextValue: RouterContextValue = {
      history: createMockHistory(),
      location: mockLocation,
    }

    const { result } = renderHook(() => useRouteMatch(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    expect(result.current).toEqual({
      path: '/',
      url: '/any/path',
      isExact: true,
      params: {},
    })
  })

  it('should match array of paths', () => {
    const mockLocation = createMockLocation({ pathname: '/users/123' })
    const contextValue: RouterContextValue = {
      history: createMockHistory(),
      location: mockLocation,
    }

    const { result } = renderHook(
      () => useRouteMatch(['/home', '/users/:id', '/about']),
      {
        wrapper: ({ children }) => (
          <RouterContext.Provider value={contextValue}>
            {children}
          </RouterContext.Provider>
        ),
      },
    )

    expect(result.current).toEqual({
      path: '/users/:id',
      url: '/users/123',
      isExact: true,
      params: { id: '123' },
    })
  })

  it('should handle exact matching', () => {
    const mockLocation = createMockLocation({ pathname: '/users/123/posts' })
    const contextValue: RouterContextValue = {
      history: createMockHistory(),
      location: mockLocation,
    }

    const { result } = renderHook(() => useRouteMatch('/users/:id', true), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    expect(result.current).toBeNull()
  })
})

describe('useSearchParams', () => {
  it('should return URLSearchParams and setter', () => {
    const mockLocation = createMockLocation({
      pathname: '/home',
      search: '?foo=bar&baz=qux',
    })
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: mockLocation,
    }

    const { result } = renderHook(() => useSearchParams(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    const [searchParams, setSearchParams] = result.current

    expect(searchParams.get('foo')).toBe('bar')
    expect(searchParams.get('baz')).toBe('qux')
    expect(typeof setSearchParams).toBe('function')
  })

  it('should update search params with object', () => {
    const mockLocation = createMockLocation({
      pathname: '/home',
      search: '',
    })
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: mockLocation,
    }

    const { result } = renderHook(() => useSearchParams(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    const [, setSearchParams] = result.current
    setSearchParams({ foo: 'bar', test: 'value' })

    expect(mockHistory.replace).toHaveBeenCalledWith('/home?foo=bar&test=value')
  })

  it('should update search params with URLSearchParams', () => {
    const mockLocation = createMockLocation({
      pathname: '/home',
      search: '',
    })
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: mockLocation,
    }

    const { result } = renderHook(() => useSearchParams(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    const [, setSearchParams] = result.current
    const newParams = new URLSearchParams({ key: 'value' })
    setSearchParams(newParams)

    expect(mockHistory.replace).toHaveBeenCalledWith('/home?key=value')
  })

  it('should clear search params when empty object provided', () => {
    const mockLocation = createMockLocation({
      pathname: '/home',
      search: '?foo=bar',
    })
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: mockLocation,
    }

    const { result } = renderHook(() => useSearchParams(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    const [, setSearchParams] = result.current
    setSearchParams({})

    expect(mockHistory.replace).toHaveBeenCalledWith('/home')
  })

  it('should handle empty search params', () => {
    const mockLocation = createMockLocation({
      pathname: '/home',
      search: '',
    })
    const contextValue: RouterContextValue = {
      history: createMockHistory(),
      location: mockLocation,
    }

    const { result } = renderHook(() => useSearchParams(), {
      wrapper: ({ children }) => (
        <RouterContext.Provider value={contextValue}>
          {children}
        </RouterContext.Provider>
      ),
    })

    const [searchParams] = result.current

    expect(searchParams.toString()).toBe('')
  })
})

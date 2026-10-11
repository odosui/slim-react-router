import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Navigate } from './Navigate'
import { RouterContext } from '../context'
import { History, Location, RouterContextValue } from '../types'

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

describe('Navigate', () => {
  it('should replace the current entry by default', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    render(
      <RouterContext.Provider value={contextValue}>
        <Navigate to="/home" />
      </RouterContext.Provider>,
    )

    expect(mockHistory.replace).toHaveBeenCalledWith('/home', undefined)
    expect(mockHistory.push).not.toHaveBeenCalled()
  })

  it('should push when replace prop is false', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    render(
      <RouterContext.Provider value={contextValue}>
        <Navigate to="/home" replace={false} />
      </RouterContext.Provider>,
    )

    expect(mockHistory.push).toHaveBeenCalledWith('/home', undefined)
    expect(mockHistory.replace).not.toHaveBeenCalled()
  })

  it('should pass state when provided', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }
    const state = { from: '/previous' }

    render(
      <RouterContext.Provider value={contextValue}>
        <Navigate to="/home" state={state} />
      </RouterContext.Provider>,
    )

    expect(mockHistory.replace).toHaveBeenCalledWith('/home', state)
  })

  it('should pass state with push', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }
    const state = { from: '/previous' }

    render(
      <RouterContext.Provider value={contextValue}>
        <Navigate to="/home" replace={false} state={state} />
      </RouterContext.Provider>,
    )

    expect(mockHistory.push).toHaveBeenCalledWith('/home', state)
  })

  it('should render nothing', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    const { container } = render(
      <RouterContext.Provider value={contextValue}>
        <Navigate to="/home" />
      </RouterContext.Provider>,
    )

    expect(container.firstChild).toBeNull()
  })

  it('should navigate again when to prop changes', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    const { rerender } = render(
      <RouterContext.Provider value={contextValue}>
        <Navigate to="/home" />
      </RouterContext.Provider>,
    )

    expect(mockHistory.replace).toHaveBeenCalledWith('/home', undefined)
    expect(mockHistory.replace).toHaveBeenCalledTimes(1)

    rerender(
      <RouterContext.Provider value={contextValue}>
        <Navigate to="/about" />
      </RouterContext.Provider>,
    )

    expect(mockHistory.replace).toHaveBeenCalledWith('/about', undefined)
    expect(mockHistory.replace).toHaveBeenCalledTimes(2)
  })

  it('should navigate again when replace prop changes', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    const { rerender } = render(
      <RouterContext.Provider value={contextValue}>
        <Navigate to="/home" replace={false} />
      </RouterContext.Provider>,
    )

    expect(mockHistory.push).toHaveBeenCalledWith('/home', undefined)
    expect(mockHistory.push).toHaveBeenCalledTimes(1)

    rerender(
      <RouterContext.Provider value={contextValue}>
        <Navigate to="/home" replace={true} />
      </RouterContext.Provider>,
    )

    expect(mockHistory.replace).toHaveBeenCalledWith('/home', undefined)
    expect(mockHistory.replace).toHaveBeenCalledTimes(1)
  })

  it('should navigate again when state prop changes', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    const state1 = { from: '/page1' }
    const state2 = { from: '/page2' }

    const { rerender } = render(
      <RouterContext.Provider value={contextValue}>
        <Navigate to="/home" state={state1} />
      </RouterContext.Provider>,
    )

    expect(mockHistory.replace).toHaveBeenCalledWith('/home', state1)
    expect(mockHistory.replace).toHaveBeenCalledTimes(1)

    rerender(
      <RouterContext.Provider value={contextValue}>
        <Navigate to="/home" state={state2} />
      </RouterContext.Provider>,
    )

    expect(mockHistory.replace).toHaveBeenCalledWith('/home', state2)
    expect(mockHistory.replace).toHaveBeenCalledTimes(2)
  })
})

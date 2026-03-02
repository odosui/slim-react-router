import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Link } from './Link'
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
  createHref: (path: string) => path,
  ...overrides,
})

const createMockLocation = (overrides?: Partial<Location>): Location => ({
  pathname: '/',
  search: '',
  hash: '',
  ...overrides,
})

describe('Link', () => {
  it('should render with correct href for browser history', () => {
    const mockHistory = createMockHistory({
      createHref: (path) => path,
    })
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    render(
      <RouterContext.Provider value={contextValue}>
        <Link to="/authors/123">Author</Link>
      </RouterContext.Provider>,
    )

    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/authors/123')
  })

  it('should render with hash prefix for hash history', () => {
    const mockHistory = createMockHistory({
      createHref: (path) => '#' + path,
    })
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    render(
      <RouterContext.Provider value={contextValue}>
        <Link to="/authors/123">Author</Link>
      </RouterContext.Provider>,
    )

    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('#/authors/123')
  })

  it('should call history.push on click', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    render(
      <RouterContext.Provider value={contextValue}>
        <Link to="/authors/123">Author</Link>
      </RouterContext.Provider>,
    )

    const link = screen.getByRole('link')
    fireEvent.click(link)

    expect(mockHistory.push).toHaveBeenCalledWith('/authors/123', undefined)
  })

  it('should call history.replace when replace prop is true', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    render(
      <RouterContext.Provider value={contextValue}>
        <Link to="/authors/123" replace>
          Author
        </Link>
      </RouterContext.Provider>,
    )

    const link = screen.getByRole('link')
    fireEvent.click(link)

    expect(mockHistory.replace).toHaveBeenCalledWith('/authors/123', undefined)
    expect(mockHistory.push).not.toHaveBeenCalled()
  })

  it('should not prevent default when modifier key is pressed', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    render(
      <RouterContext.Provider value={contextValue}>
        <Link to="/authors/123">Author</Link>
      </RouterContext.Provider>,
    )

    const link = screen.getByRole('link')

    fireEvent.click(link, { ctrlKey: true })
    expect(mockHistory.push).not.toHaveBeenCalled()

    fireEvent.click(link, { metaKey: true })
    expect(mockHistory.push).not.toHaveBeenCalled()

    fireEvent.click(link, { shiftKey: true })
    expect(mockHistory.push).not.toHaveBeenCalled()

    fireEvent.click(link, { altKey: true })
    expect(mockHistory.push).not.toHaveBeenCalled()
  })

  it('should not prevent default when target is set', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }

    render(
      <RouterContext.Provider value={contextValue}>
        <Link to="/authors/123" target="_blank">
          Author
        </Link>
      </RouterContext.Provider>,
    )

    const link = screen.getByRole('link')
    fireEvent.click(link)

    expect(mockHistory.push).not.toHaveBeenCalled()
  })

  it('should throw error when used outside Router', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<Link to="/test">Test</Link>)
    }).toThrow('Link must be used within a Router')

    consoleError.mockRestore()
  })

  it('should pass state to history.push', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }
    const state = { from: '/previous' }

    render(
      <RouterContext.Provider value={contextValue}>
        <Link to="/authors/123" state={state}>
          Author
        </Link>
      </RouterContext.Provider>,
    )

    const link = screen.getByRole('link')
    fireEvent.click(link)

    expect(mockHistory.push).toHaveBeenCalledWith('/authors/123', state)
  })

  it('should call custom onClick handler', () => {
    const mockHistory = createMockHistory()
    const contextValue: RouterContextValue = {
      history: mockHistory,
      location: createMockLocation(),
    }
    const onClick = vi.fn()

    render(
      <RouterContext.Provider value={contextValue}>
        <Link to="/authors/123" onClick={onClick}>
          Author
        </Link>
      </RouterContext.Provider>,
    )

    const link = screen.getByRole('link')
    fireEvent.click(link)

    expect(onClick).toHaveBeenCalled()
    expect(mockHistory.push).toHaveBeenCalled()
  })
})

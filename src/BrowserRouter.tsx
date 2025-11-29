import React, { useEffect, useState, useMemo } from 'react'
import { RouterContext } from './context'
import { History, Location } from './types'

interface BrowserRouterProps {
  children: React.ReactNode
}

function createBrowserHistory(): History {
  const listeners: Array<() => void> = []

  const getLocation = (): Location => {
    return {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      state: window.history.state,
    }
  }

  const notify = () => {
    listeners.forEach((listener) => listener())
  }

  const push = (path: string, state?: any) => {
    window.history.pushState(state, '', path)
    notify()
  }

  const replace = (path: string, state?: any) => {
    window.history.replaceState(state, '', path)
    notify()
  }

  const go = (n: number) => {
    window.history.go(n)
  }

  const goBack = () => {
    window.history.back()
  }

  const goForward = () => {
    window.history.forward()
  }

  const listen = (listener: () => void) => {
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  return {
    push,
    replace,
    go,
    goBack,
    goForward,
    get location() {
      return getLocation()
    },
    listen,
  }
}

export const BrowserRouter: React.FC<BrowserRouterProps> = ({ children }) => {
  const history = useMemo(() => createBrowserHistory(), [])
  const [location, setLocation] = useState(history.location)

  useEffect(() => {
    const unlisten = history.listen(() => {
      setLocation(history.location)
    })

    const handlePopState = () => {
      setLocation(history.location)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      unlisten()
      window.removeEventListener('popstate', handlePopState)
    }
  }, [history])

  const value = useMemo(
    () => ({
      history,
      location,
    }),
    [history, location],
  )

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  )
}

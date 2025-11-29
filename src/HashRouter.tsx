import React, { useEffect, useState, useMemo } from 'react'
import { RouterContext } from './context'
import { History, Location } from './types'

interface HashRouterProps {
  children: React.ReactNode
}

function createHashHistory(): History {
  const listeners: Array<() => void> = []

  const getLocation = (): Location => {
    const hash = window.location.hash.slice(1) || '/'
    const searchIndex = hash.indexOf('?')
    const pathname = searchIndex > -1 ? hash.slice(0, searchIndex) : hash
    const search = searchIndex > -1 ? hash.slice(searchIndex) : ''

    return {
      pathname,
      search,
      hash: '',
      state: window.history.state,
    }
  }

  const notify = () => {
    listeners.forEach((listener) => listener())
  }

  const push = (path: string, state?: any) => {
    window.history.pushState(state, '', '#' + path)
    notify()
  }

  const replace = (path: string, state?: any) => {
    window.history.replaceState(state, '', '#' + path)
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

export const HashRouter: React.FC<HashRouterProps> = ({ children }) => {
  const history = useMemo(() => createHashHistory(), [])
  const [location, setLocation] = useState(history.location)

  useEffect(() => {
    const unlisten = history.listen(() => {
      setLocation(history.location)
    })

    const handleHashChange = () => {
      setLocation(history.location)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      unlisten()
      window.removeEventListener('hashchange', handleHashChange)
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

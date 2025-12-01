import { History, Location } from '../types'

// An abstraction over the HTML5 History API
export function createBrowserHistory(): History {
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

// An abstraction over the URL hash for routing
export function createHashHistory(): History {
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

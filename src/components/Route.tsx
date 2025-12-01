import React, { useContext } from 'react'
import { RouterContext, RouteContext } from '../context'
import { RouteProps } from '../types'
import { matchPath } from '../utils/paths'

export const Route: React.FC<RouteProps> = ({
  path,
  exact = false,
  component: Component,
  render,
  element,
  children,
}) => {
  const context = useContext(RouterContext)

  if (!context) {
    throw new Error('Route must be used within a Router')
  }

  const { location } = context

  // If no path is provided, always match
  const match = path
    ? Array.isArray(path)
      ? path
          .map((p) => matchPath(location.pathname, { path: p, exact }))
          .find(Boolean) || null
      : matchPath(location.pathname, { path, exact })
    : {
        path: '/',
        url: location.pathname,
        isExact: true,
        params: {},
      }

  // If no match, render nothing
  if (!match) {
    return null
  }

  // Provide match context to child components
  let content: React.ReactNode = null

  // Render component if provided
  if (Component) {
    content = <Component match={match} />
  } else if (element) {
    content = element
  } else if (render) {
    content = render({ match })
  } else if (children) {
    content = children
  }

  return <RouteContext.Provider value={match}>{content}</RouteContext.Provider>
}

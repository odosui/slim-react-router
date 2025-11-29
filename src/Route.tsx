import React, { useContext } from 'react'
import { RouterContext } from './context'
import { RouteProps } from './types'
import { matchPath } from './utils'

export const Route: React.FC<RouteProps> = ({
  path,
  exact = false,
  component: Component,
  render,
  element,
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

  // Render component if provided
  if (Component) {
    return <Component match={match} />
  }

  if (element) {
    return <>{element}</>
  }

  // Render function if provided
  if (render) {
    return <>{render({ match })}</>
  }

  return null
}

import React, { Children, FC, isValidElement, useContext } from 'react'
import { RouterContext } from '../context'
import { RouteProps, SwitchProps } from '../types'
import { matchPath } from '../utils/paths'

export const Switch: FC<SwitchProps> = ({ children }) => {
  const ctx = useContext(RouterContext)

  if (!ctx) {
    throw new Error('Switch must be used within a Router')
  }

  const { location } = ctx

  // Find the first child that matches the current location
  let matched: React.ReactElement | null = null

  Children.forEach(children, (c) => {
    if (matched !== null || !isValidElement(c)) {
      return
    }

    const { path, exact } = c.props as RouteProps

    if (path) {
      const paths = Array.isArray(path) ? path : [path]
      const hasMatch = paths.some((p) =>
        matchPath(location.pathname, { path: p, exact: exact || false }),
      )

      if (hasMatch) {
        matched = c
      }
    } else {
      // Route without path always matches (can be used as fallback)
      matched = c
    }
  })

  return matched
}

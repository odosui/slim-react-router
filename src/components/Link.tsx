import React, { useContext } from 'react'
import { RouterContext } from '../context'
import { LinkProps } from '../types'

export const Link: React.FC<LinkProps> = ({
  to,
  replace = false,
  state,
  children,
  onClick,
  ...rest
}) => {
  const context = useContext(RouterContext)

  if (!context) {
    throw new Error('Link must be used within a Router')
  }

  const { history } = context

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(event)
    }

    // Don't handle if:
    // - Event is prevented
    // - Click is with modifier keys
    // - Click is not left-click
    // - Target is set to open in new window
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      rest.target
    ) {
      return
    }

    event.preventDefault()

    if (replace) {
      history.replace(to, state)
    } else {
      history.push(to, state)
    }
  }

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

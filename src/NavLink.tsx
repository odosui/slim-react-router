import React from 'react'
import { Link } from './Link'
import { NavLinkProps } from './types'
import { useRouteMatch } from './hooks'

export const NavLink: React.FC<NavLinkProps> = ({
  to,
  exact = false,
  activeClassName,
  activeStyle,
  className,
  style,
  children,
  ...rest
}) => {
  const match = useRouteMatch(to, exact)
  const isActive = !!match

  const cn = typeof className === 'function' ? className(isActive) : className
  const finalClassName =
    isActive && activeClassName ? `${cn || ''} ${activeClassName}`.trim() : cn

  const s = typeof style === 'function' ? style(isActive) : style
  const finalStyle = isActive && activeStyle ? { ...s, ...activeStyle } : s

  const chds = typeof children === 'function' ? children(isActive) : children

  return (
    <Link to={to} className={finalClassName} style={finalStyle} {...rest}>
      {chds}
    </Link>
  )
}

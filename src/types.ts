export interface Location {
  pathname: string
  search: string
  hash: string
  state?: any
}

export interface History {
  push: (path: string, state?: any) => void
  replace: (path: string, state?: any) => void
  go: (n: number) => void
  goBack: () => void
  goForward: () => void
  location: Location
  listen: (listener: () => void) => () => void
}

export interface Match {
  path: string
  url: string
  isExact: boolean
  params: Record<string, string>
}

export interface RouteProps {
  path?: string | string[]
  exact?: boolean
  component?: React.ComponentType<any>
  render?: (props: { match: Match | null }) => React.ReactNode
  element?: React.ReactElement
}

export interface SwitchProps {
  children: React.ReactNode
}

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
  replace?: boolean
  state?: any
}

export interface NavLinkProps
  extends Omit<LinkProps, 'className' | 'style' | 'children'> {
  exact?: boolean
  activeClassName?: string
  activeStyle?: React.CSSProperties
  className?: string | ((isActive: boolean) => string)
  style?: React.CSSProperties | ((isActive: boolean) => React.CSSProperties)
  children?: React.ReactNode | ((isActive: boolean) => React.ReactNode)
}

export interface RouterContextValue {
  history: History
  location: Location
}

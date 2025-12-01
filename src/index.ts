// Router components
export { BrowserRouter } from './components/BrowserRouter'
export { HashRouter } from './components/HashRouter'
export { Route } from './components/Route'
export { Switch } from './components/Switch'
export { Navigate } from './components/Navigate'
export { Link } from './components/Link'
export { NavLink } from './components/NavLink'

// Hooks
export {
  useRouter,
  useHistory,
  useLocation,
  useNavigate,
  useParams,
  useRouteMatch,
  useSearchParams,
} from './hooks'

// Types
export type {
  Location,
  History,
  Match,
  RouteProps,
  SwitchProps,
  LinkProps,
  NavLinkProps,
  NavigateProps,
  RouterContextValue,
} from './types'

// Utils
export { matchPath } from './utils/paths'

// alias for Switch as Routes
export { Switch as Routes } from './components/Switch'
export type { SwitchProps as RoutesProps } from './types'

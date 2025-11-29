// Router components
export { BrowserRouter } from "./BrowserRouter";
export { HashRouter } from "./HashRouter";
export { Route } from "./Route";
export { Switch } from "./Switch";
export { Link } from "./Link";
export { NavLink } from "./NavLink";

// Hooks
export {
  useRouter,
  useHistory,
  useLocation,
  useNavigate,
  useParams,
  useRouteMatch,
  useSearchParams,
} from "./hooks";

// Types
export type {
  Location,
  History,
  Match,
  RouteProps,
  SwitchProps,
  LinkProps,
  NavLinkProps,
  RouterContextValue,
} from "./types";

// Utils
export { matchPath } from "./utils";

// alias for Switch as Routes
export { Switch as Routes } from "./Switch";
export type { SwitchProps as RoutesProps } from "./types";

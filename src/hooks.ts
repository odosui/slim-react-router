import { useContext, useMemo } from "react";
import { RouterContext } from "./context";
import { History, Location, Match } from "./types";
import { matchPath } from "./utils";

export function useRouter() {
  const context = useContext(RouterContext);

  if (!context) {
    throw new Error("useRouter must be used within a Router");
  }

  return context;
}

export function useHistory(): History {
  const { history } = useRouter();
  return history;
}

export function useLocation(): Location {
  const { location } = useRouter();
  return location;
}

export function useNavigate() {
  const history = useHistory();

  return (
    to: string | number,
    options?: { replace?: boolean; state?: any },
  ) => {
    if (typeof to === "number") {
      history.go(to);
    } else {
      const { replace = false, state } = options || {};
      if (replace) {
        history.replace(to, state);
      } else {
        history.push(to, state);
      }
    }
  };
}

export function useParams<
  T extends Record<string, string> = Record<string, string>,
>(): T {
  const match = useRouteMatch();

  return (match?.params || {}) as T;
}

export function useRouteMatch(
  path?: string | string[],
  exact = false,
): Match | null {
  const location = useLocation();

  return useMemo(() => {
    if (!path) {
      return {
        path: "/",
        url: location.pathname,
        isExact: true,
        params: {},
      };
    }

    if (Array.isArray(path)) {
      return (
        path
          .map((p) => matchPath(location.pathname, { path: p, exact }))
          .find(Boolean) || null
      );
    }

    return matchPath(location.pathname, { path, exact });
  }, [location.pathname, path, exact]);
}

export function useSearchParams() {
  const location = useLocation();
  const history = useHistory();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const setSearchParams = (
    params: Record<string, string> | URLSearchParams,
  ) => {
    const newParams =
      params instanceof URLSearchParams ? params : new URLSearchParams(params);
    const newSearch = newParams.toString();
    history.replace(`${location.pathname}${newSearch ? "?" + newSearch : ""}`);
  };

  return [searchParams, setSearchParams] as const;
}

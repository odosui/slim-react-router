<div align="center">
  The <b>slim-react-router</b> is a tiny (<b>~1.8KiB</b>) minimalistic react-router alternative with familiar API and no dependencies.
</div>

<br />

<div align="center">
  <a href="https://github.com/odosui/slim-react-router/actions/workflows/test.yml"><img alt="CI" src="https://github.com/odosui/slim-react-router/actions/workflows/test.yml/badge.svg" /></a>
  <a href="https://bundlephobia.com/package/slim-react-router"><img alt="npm" src="https://img.shields.io/bundlephobia/minzip/slim-react-router" /></a>
</div>

## Features

- Super small (~1.8KiB minzipped)
- Zero dependencies
- Familiar API if you've used React Router (though not a 1:1 match)
- TypeScript support
- Browser-based and hash-based routing
- All the essentials: routes, links, navigation, hooks, etc.

## Trade-offs

- Only supports **browser** and **hash** routing (no memory or native)
- **No nested** routes (flat structure only)

## Installation

```bash
npm install slim-react-router
```

## Usage

```jsx
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  useParams,
} from 'slim-react-router'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Switch>
        <Route path="/" exact element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<User />} />
      </Switch>
    </BrowserRouter>
  )
}

function User() {
  const { id } = useParams()
  return <div>User {id}</div>
}
```

## Components

- **`<BrowserRouter>`** - Router using HTML5 history API
- **`<HashRouter>`** - Router using URL hash
- **`<Route>`** - Renders component when path matches. Supports `path`, `exact`, `element`, `component`, or `render` props
- **`<Switch>` / `<Routes>`** (alias) - Renders first matching route
- **`<Link>`** - Navigation link
- **`<NavLink>`** - Link with active state styling. Supports `activeClassName` and `activeStyle`
- **`<Navigate>`** - Declarative navigation component for redirects

## Hooks

- **`useRouter()`** - Access router context (history + location)
- **`useHistory()`** - Access history object (push, replace, go, etc.)
- **`useLocation()`** - Get current location (pathname, search, hash, state)
- **`useNavigate()`** - Navigate programmatically
- **`useParams()`** - Get URL parameters from dynamic routes
- **`useRouteMatch(path?, exact?)`** - Check if path matches current route
- **`useSearchParams()`** - Get and set query string parameters

### Hooks

#### `useNavigate()`

Navigate programmatically to different routes:

```jsx
import { useNavigate } from 'slim-react-router'

function LoginButton() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    await loginUser()
    // Navigate to dashboard
    navigate('/dashboard')

    // Navigate with state
    navigate('/dashboard', { state: { from: '/login' } })

    // Replace current entry (no back button)
    navigate('/dashboard', { replace: true })

    // Go back/forward
    navigate(-1) // back
    navigate(1) // forward
  }

  return <button onClick={handleLogin}>Login</button>
}
```

#### `useLocation()`

Access the current location:

```jsx
import { useLocation } from 'slim-react-router'

function CurrentPath() {
  const location = useLocation()

  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <p>Query string: {location.search}</p>
      <p>Hash: {location.hash}</p>
      <p>State: {JSON.stringify(location.state)}</p>
    </div>
  )
}
```

#### `useParams()`

Extract URL parameters from dynamic routes:

```jsx
import { useParams } from 'slim-react-router'

function PostDetail() {
  const { userId, postId } = useParams<{ userId: string; postId: string }>()

  return <div>Post {postId} by user {userId}</div>
}
```

#### `useSearchParams()`

Read and update query string parameters:

```jsx
import { useSearchParams } from 'slim-react-router'

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q')
  const page = searchParams.get('page') || '1'

  const updateSearch = (newQuery) => {
    setSearchParams({ q: newQuery, page: '1' })
  }

  const nextPage = () => {
    setSearchParams({ q: query, page: String(Number(page) + 1) })
  }

  return (
    <div>
      <p>Searching for: {query}</p>
      <p>Page: {page}</p>
      <button onClick={nextPage}>Next Page</button>
    </div>
  )
}
```

#### `useHistory()`

Access the history object for advanced navigation:

```jsx
import { useHistory } from 'slim-react-router'

function NavigationControls() {
  const history = useHistory()

  return (
    <div>
      <button onClick={() => history.push('/home')}>Go Home</button>
      <button onClick={() => history.replace('/home')}>
        Replace with Home
      </button>
      <button onClick={() => history.goBack()}>Back</button>
      <button onClick={() => history.goForward()}>Forward</button>
      <button onClick={() => history.go(-2)}>Go back 2 pages</button>
    </div>
  )
}
```

#### `useRouteMatch()`

Check if a path matches the current route:

```jsx
import { useRouteMatch } from 'slim-react-router'

function Sidebar() {
  const userMatch = useRouteMatch('/users/:id')
  const settingsMatch = useRouteMatch('/settings', true) // exact match

  return (
    <div>
      {userMatch && <div>Viewing user: {userMatch.params.id}</div>}

      {settingsMatch && <SettingsPanel />}

      {/* Check multiple paths */}
      {useRouteMatch(['/dashboard', '/home']) && <QuickActions />}
    </div>
  )
}
```

### Components

#### `<Navigate>`

Declaratively navigate to a different route. Useful for redirects:

```jsx
import { Navigate, Routes, Route } from 'slim-react-router'

function App() {
  return (
    <Routes>
      {/* Redirect root to /home */}
      <Route path="/" exact element={<Navigate to="/home" />} />
      <Route path="/home" element={<HomePage />} />

      {/* Conditional redirects */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />

      {/* Replace current history entry */}
      <Route path="/old-path" element={<Navigate to="/new-path" replace />} />

      {/* Navigate with state */}
      <Route
        path="/logout"
        element={<Navigate to="/login" state={{ from: '/logout' }} />}
      />
    </Routes>
  )
}
```

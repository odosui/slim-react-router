import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  HashRouter,
  Route,
  Switch,
  Link,
  useParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from './index'

// Demo components
const Home = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Slim React Router demo!</p>
      <button onClick={() => navigate('/about')}>Go to About</button>
    </div>
  )
}

const About = () => (
  <div>
    <h1>About Page</h1>
    <p>This is a lightweight alternative to React Router.</p>
  </div>
)

const User = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {id}</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  )
}

const Dashboard = () => {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'overview'

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Current tab: {tab}</p>
      <p>Full path: {location.pathname + location.search}</p>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setSearchParams({ tab: 'overview' })}>
          Overview
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'analytics' })}
          style={{ marginLeft: '0.5rem' }}
        >
          Analytics
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'settings' })}
          style={{ marginLeft: '0.5rem' }}
        >
          Settings
        </button>
      </div>
    </div>
  )
}

const NotFound = () => (
  <div>
    <h1>404 - Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  </div>
)

const Nav = () => (
  <nav style={{ padding: '1rem', background: '#f0f0f0', marginBottom: '2rem' }}>
    <Link to="/" style={{ marginRight: '1rem' }}>
      Home
    </Link>
    <Link to="/about" style={{ marginRight: '1rem' }}>
      About
    </Link>
    <Link to="/user/123" style={{ marginRight: '1rem' }}>
      User Profile
    </Link>
    <Link to="/dashboard?tab=overview" style={{ marginRight: '1rem' }}>
      Dashboard
    </Link>
  </nav>
)

// Demo App with BrowserRouter
const AppWithBrowserRouter = () => (
  <BrowserRouter>
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>
        Slim React Router Demo (BrowserRouter)
      </h1>
      <Nav />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/user/:id" component={User} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </BrowserRouter>
)

// Demo App with HashRouter
const AppWithHashRouter = () => (
  <HashRouter>
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>
        Slim React Router Demo (HashRouter)
      </h1>
      <Nav />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/user/:id" component={User} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </HashRouter>
)

// Toggle between BrowserRouter and HashRouter for demo purposes
// Change to AppWithHashRouter to test HashRouter
const App = AppWithBrowserRouter

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

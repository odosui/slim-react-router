import { beforeEach, describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { StrictMode } from 'react'
import { BrowserRouter } from './BrowserRouter'
import { HashRouter } from './HashRouter'
import { Navigate } from './Navigate'
import { Route } from './Route'
import { Switch } from './Switch'

const RedirectingRoutes = ({ redirect = <Navigate to="/home" /> }) => (
  <Switch>
    <Route path="/" exact element={redirect} />
    <Route path="/home" element={<div>Home page</div>} />
  </Switch>
)

describe('redirect on initial render', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('should render the target route in BrowserRouter', () => {
    const { container } = render(
      <BrowserRouter>
        <RedirectingRoutes />
      </BrowserRouter>,
    )

    expect(window.location.pathname).toBe('/home')
    expect(container.textContent).toBe('Home page')
  })

  it('should render the target route in HashRouter', () => {
    const { container } = render(
      <HashRouter>
        <RedirectingRoutes />
      </HashRouter>,
    )

    expect(window.location.hash).toBe('#/home')
    expect(container.textContent).toBe('Home page')
  })

  it('should not add a history entry by default', () => {
    const entriesBefore = window.history.length

    render(
      <BrowserRouter>
        <RedirectingRoutes />
      </BrowserRouter>,
    )

    expect(window.history.length).toBe(entriesBefore)
  })

  it('should add a single history entry in StrictMode when pushing', () => {
    const entriesBefore = window.history.length

    const { container } = render(
      <StrictMode>
        <BrowserRouter>
          <RedirectingRoutes
            redirect={<Navigate to="/home" replace={false} />}
          />
        </BrowserRouter>
      </StrictMode>,
    )

    expect(window.history.length - entriesBefore).toBe(1)
    expect(container.textContent).toBe('Home page')
  })
})

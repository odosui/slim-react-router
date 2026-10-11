import { beforeEach, describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from './BrowserRouter'
import { NavLink } from './NavLink'

const renderNavLinkAt = (pathname: string, exact = false) => {
  window.history.replaceState(null, '', pathname)

  const { getByText } = render(
    <BrowserRouter>
      <NavLink to="/users" exact={exact} activeClassName="active">
        Users
      </NavLink>
    </BrowserRouter>,
  )

  return getByText('Users')
}

describe('NavLink', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('should be active on its own path', () => {
    expect(renderNavLinkAt('/users').className).toBe('active')
  })

  it('should be active on a nested path', () => {
    expect(renderNavLinkAt('/users/123').className).toBe('active')
  })

  it('should not be active on a nested path when exact', () => {
    expect(renderNavLinkAt('/users/123', true).className).toBe('')
  })

  it('should not be active on another path', () => {
    expect(renderNavLinkAt('/about').className).toBe('')
  })
})

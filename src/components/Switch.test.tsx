import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from './BrowserRouter'
import { Route } from './Route'
import { Switch } from './Switch'

const renderRoutesAt = (pathname: string) => {
  window.history.replaceState(null, '', pathname)

  const { container } = render(
    <BrowserRouter>
      <Switch>
        <Route path="/" exact element={<div>Home page</div>} />
        <Route path="/about" element={<div>About page</div>} />
        <Route path="*" element={<div>Not found</div>} />
      </Switch>
    </BrowserRouter>,
  )

  return container.textContent
}

describe('Switch', () => {
  it('should render the first matching route', () => {
    expect(renderRoutesAt('/about')).toBe('About page')
  })

  it('should fall back to the wildcard route', () => {
    expect(renderRoutesAt('/missing/page')).toBe('Not found')
  })

  it('should prefer an earlier route over the wildcard', () => {
    expect(renderRoutesAt('/')).toBe('Home page')
  })
})

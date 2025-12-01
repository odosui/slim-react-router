import React from 'react'
import { createBrowserHistory } from '../utils/history'
import { Router } from './Router'

interface BrowserRouterProps {
  children: React.ReactNode
}

export const BrowserRouter: React.FC<BrowserRouterProps> = ({ children }) => {
  return (
    <Router createHistory={createBrowserHistory} eventName="popstate">
      {children}
    </Router>
  )
}

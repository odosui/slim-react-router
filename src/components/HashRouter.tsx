import React from 'react'
import { createHashHistory } from '../utils/history'
import { Router } from './Router'

interface HashRouterProps {
  children: React.ReactNode
}

export const HashRouter: React.FC<HashRouterProps> = ({ children }) => {
  return (
    <Router createHistory={createHashHistory} eventName="hashchange">
      {children}
    </Router>
  )
}

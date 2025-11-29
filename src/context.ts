import { createContext } from 'react'
import { RouterContextValue } from './types'

export const RouterContext = createContext<RouterContextValue | null>(null)

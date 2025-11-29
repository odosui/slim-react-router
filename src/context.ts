import { createContext } from 'react'
import { Match, RouterContextValue } from './types'

export const RouterContext = createContext<RouterContextValue | null>(null)
export const RouteContext = createContext<Match | null>(null)

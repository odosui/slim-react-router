import React, { useMemo } from 'react'
import { RouterContext } from '../context'
import { History } from '../types'
import {
  HistoryEventName,
  useHistoryLocation,
} from '../utils/useHistoryLocation'

interface RouterProps {
  children: React.ReactNode
  createHistory: () => History
  eventName: HistoryEventName
}

export const Router: React.FC<RouterProps> = ({
  children,
  createHistory,
  eventName,
}) => {
  const history = useMemo(() => createHistory(), [createHistory])
  const location = useHistoryLocation(history, eventName)

  const value = useMemo(
    () => ({
      history,
      location,
    }),
    [history, location],
  )

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  )
}

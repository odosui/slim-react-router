import React, { useEffect, useMemo, useState } from 'react'
import { RouterContext } from '../context'
import { History } from '../types'

interface RouterProps {
  children: React.ReactNode
  createHistory: () => History
  eventName: 'popstate' | 'hashchange'
}

export const Router: React.FC<RouterProps> = ({
  children,
  createHistory,
  eventName,
}) => {
  const history = useMemo(() => createHistory(), [createHistory])
  const [location, setLocation] = useState(history.location)

  useEffect(() => {
    const unlisten = history.listen(() => {
      setLocation(history.location)
    })

    const handleChange = () => {
      setLocation(history.location)
    }

    window.addEventListener(eventName, handleChange)

    return () => {
      unlisten()
      window.removeEventListener(eventName, handleChange)
    }
  }, [history, eventName])

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

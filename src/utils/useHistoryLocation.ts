import { useEffect, useState } from 'react'
import { History, Location } from '../types'

export type HistoryEventName = 'popstate' | 'hashchange'

const isSameLocation = (a: Location, b: Location) =>
  a.pathname === b.pathname &&
  a.search === b.search &&
  a.hash === b.hash &&
  a.state === b.state

export function useHistoryLocation(
  history: History,
  eventName: HistoryEventName,
): Location {
  const [location, setLocation] = useState(history.location)

  useEffect(() => {
    const syncLocation = () => {
      const current = history.location
      setLocation((previous) =>
        isSameLocation(previous, current) ? previous : current,
      )
    }

    const unlisten = history.listen(syncLocation)
    window.addEventListener(eventName, syncLocation)

    // Child effects run first, so they may have navigated before we subscribed
    syncLocation()

    return () => {
      unlisten()
      window.removeEventListener(eventName, syncLocation)
    }
  }, [history, eventName])

  return location
}

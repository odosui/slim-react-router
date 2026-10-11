import { useEffect, useRef } from 'react'
import { useNavigate } from '../hooks'
import { NavigateProps } from '../types'

const isSameNavigation = (a: NavigateProps, b: NavigateProps) =>
  a.to === b.to && a.replace === b.replace && a.state === b.state

export function Navigate({ to, replace = false, state }: NavigateProps) {
  const navigate = useNavigate()
  const lastNavigation = useRef<NavigateProps | null>(null)

  useEffect(() => {
    const navigation = { to, replace, state }

    // StrictMode runs effects twice, which would add a duplicate history entry
    if (
      lastNavigation.current &&
      isSameNavigation(lastNavigation.current, navigation)
    ) {
      return
    }

    lastNavigation.current = navigation
    navigate(to, { replace, state })
  }, [to, replace, state, navigate])

  return null
}

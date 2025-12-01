import { useEffect } from 'react'
import { useNavigate } from '../hooks'
import { NavigateProps } from '../types'

export function Navigate({ to, replace = false, state }: NavigateProps) {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(to, { replace, state })
  }, [to, replace, state, navigate])

  return null
}

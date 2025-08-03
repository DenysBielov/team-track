import { useState, useEffect } from 'react'
import { User } from 'next-auth'
import { joinWaitlist as joinWaitlistRequest, leaveWaitlist as leaveWaitlistRequest, loadWaitlist as loadWaitlistRequest } from '@/lib/requests/waitlist'

export function useWaitlist(positionId: string, userId: string) {
  const [waitlist, setWaitlist] = useState<User[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loadWaitlist = async () => {
    setIsLoading(true)
    try {
      const users = await loadWaitlistRequest(positionId)
      setWaitlist(users)
    } finally {
      setIsLoading(false)
    }
  }

  const joinWaitlist = async () => {
    setIsLoading(true)
    try {
      await joinWaitlistRequest(positionId, userId)
      await loadWaitlist()
    } finally {
      setIsLoading(false)
    }
  }

  const leaveWaitlist = async () => {
    setIsLoading(true)
    try {
      await leaveWaitlistRequest(positionId, userId)
      await loadWaitlist()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWaitlist()
  }, [positionId])

  return {
    waitlist,
    isLoading,
    loadWaitlist,
    joinWaitlist,
    leaveWaitlist
  }
}
/**
 * useJobPolling — polls GET /jobs/:jobId every 2 seconds until
 * the job reaches status "completed" or "failed".
 *
 * Usage:
 *   const { job, isDone, isError } = useJobPolling(jobId)
 */
import { useEffect, useState, useCallback } from 'react'
import { jobsApi } from '@/api/axios'

export function useJobPolling(jobId, { onComplete, onError } = {}) {
  const [job,     setJob]     = useState(null)
  const [isDone,  setIsDone]  = useState(false)
  const [isError, setIsError] = useState(false)

  const poll = useCallback(async () => {
    if (!jobId) return
    try {
      const { data } = await jobsApi.get(jobId)
      setJob(data)

      if (data.status === 'completed') {
        setIsDone(true)
        onComplete?.(data)
      } else if (data.status === 'failed') {
        setIsError(true)
        onError?.(data.error)
      }
    } catch (err) {
      console.error('Job poll error:', err)
    }
  }, [jobId, onComplete, onError])

  useEffect(() => {
    if (!jobId || isDone || isError) return

    poll()
    const interval = setInterval(() => {
      if (!isDone && !isError) poll()
      else clearInterval(interval)
    }, 2000)

    return () => clearInterval(interval)
  }, [jobId, isDone, isError, poll])

  return { job, isDone, isError }
}

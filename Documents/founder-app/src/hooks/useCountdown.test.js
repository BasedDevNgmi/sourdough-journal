import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCountdown } from './useCountdown'

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns positive time when target is in the future', () => {
    const future = new Date(Date.now() + 90061000) // 1d 1h 1m 1s
    const { result } = renderHook(() => useCountdown(future))
    expect(result.current.isExpired).toBe(false)
    expect(result.current.days).toBe(1)
    expect(result.current.hours).toBe(1)
    expect(result.current.minutes).toBe(1)
    expect(result.current.seconds).toBe(1)
  })

  it('returns isExpired when target is in the past', () => {
    const past = new Date(Date.now() - 1000)
    const { result } = renderHook(() => useCountdown(past))
    expect(result.current.isExpired).toBe(true)
    expect(result.current.days).toBe(0)
  })

  it('returns isExpired for invalid date', () => {
    const { result } = renderHook(() => useCountdown(new Date('not-a-date')))
    expect(result.current.isExpired).toBe(true)
  })

  it('ticks every second', () => {
    const future = new Date(Date.now() + 5000)
    const { result } = renderHook(() => useCountdown(future))
    expect(result.current.seconds).toBe(5)

    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current.seconds).toBe(4)

    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current.seconds).toBe(3)
  })

  it('transitions to expired when timer hits zero', () => {
    const future = new Date(Date.now() + 1000)
    const { result } = renderHook(() => useCountdown(future))
    expect(result.current.isExpired).toBe(false)

    act(() => { vi.advanceTimersByTime(1500) })
    expect(result.current.isExpired).toBe(true)
  })

  it('cleans up interval on unmount', () => {
    const future = new Date(Date.now() + 10000)
    const clearSpy = vi.spyOn(global, 'clearInterval')
    const { unmount } = renderHook(() => useCountdown(future))
    unmount()
    expect(clearSpy).toHaveBeenCalled()
  })
})

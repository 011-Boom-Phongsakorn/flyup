import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSEO } from './useSEO'

const getMeta = (sel: string) => document.querySelector<HTMLMetaElement>(sel)?.getAttribute('content')

describe('useSEO', () => {
  beforeEach(() => {
    document.head.querySelectorAll('meta, link[rel="canonical"]').forEach(el => el.remove())
    document.title = ''
  })

  it('appends the site name to the title by default', () => {
    renderHook(() => useSEO({ title: 'โปรเจกต์ X' }))
    expect(document.title).toBe('โปรเจกต์ X — FlyUp')
  })

  it('uses the exact title when exactTitle is set', () => {
    renderHook(() => useSEO({ title: 'Just This', exactTitle: true }))
    expect(document.title).toBe('Just This')
  })

  it('writes description + Open Graph meta tags', () => {
    renderHook(() => useSEO({ title: 'T', description: 'my desc' }))
    expect(getMeta('meta[name="description"]')).toBe('my desc')
    expect(getMeta('meta[property="og:title"]')).toBe('T — FlyUp')
    expect(getMeta('meta[property="og:description"]')).toBe('my desc')
  })

  it('prefixes a relative image with the base url', () => {
    renderHook(() => useSEO({ image: '/cover.png' }))
    expect(getMeta('meta[property="og:image"]')).toBe('https://www.fly-up.app/cover.png')
  })

  it('keeps absolute image urls as-is', () => {
    renderHook(() => useSEO({ image: 'https://cdn.example.com/a.png' }))
    expect(getMeta('meta[property="og:image"]')).toBe('https://cdn.example.com/a.png')
  })
})

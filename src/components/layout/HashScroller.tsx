'use client'

import { useEffect } from 'react'

function findElementByIdCaseInsensitive(id: string): HTMLElement | null {
  if (!id) return null
  // direct match
  const direct = document.getElementById(id)
  if (direct) return direct
  // case-insensitive search
  const all = Array.from(document.querySelectorAll('[id]')) as HTMLElement[]
  const lower = id.toLowerCase()
  return all.find((el) => el.id.toLowerCase() === lower) || null
}

function scrollToElement(el: HTMLElement) {
  if (!el) return
  const header = document.querySelector('header') as HTMLElement | null
  const headerHeight = header?.offsetHeight ?? 80
  const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8
  window.scrollTo({ top, behavior: 'smooth' })
}

export default function HashScroller() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const scrollToHash = (hash: string | null) => {
      if (!hash) return
      const id = decodeURIComponent(hash.replace(/^#/, ''))
      const target = findElementByIdCaseInsensitive(id)
      if (target) {
        // small delay to allow layout to settle
        setTimeout(() => scrollToElement(target), 40)
      }
    }

    // initial load
    scrollToHash(window.location.hash)

    // listen for future hash changes
    const onHashChange = () => scrollToHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)

    // intercept clicks on anchor links to handle smooth scroll and avoid default jump
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null
      if (!target) return
      const href = target.getAttribute('href')
      if (!href) return
      // support anchors like '#Works' or absolute URLs with hashes '/en#Works' by extracting hash part
      const hashIndex = href.indexOf('#')
      if (href.startsWith('#') || hashIndex !== -1) {
        const hash = href.substring(hashIndex !== -1 ? hashIndex : 0)
        // only handle same-page anchors (no scheme, no host) or pure "#hash"
        if (hash) {
          // prevent default to avoid instant jump
          e.preventDefault()
          // update URL without causing default jump
          try {
            history.pushState(null, '', hash)
          } catch (err) {
            // fallback
            location.hash = hash
          }
          scrollToHash(hash)
        }
      }
    }

    document.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('hashchange', onHashChange)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return null
}

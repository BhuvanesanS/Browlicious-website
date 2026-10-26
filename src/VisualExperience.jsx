import { useEffect } from 'react'

// Presentation only: does not intercept links, submissions or application state.
export function VisualExperience() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let observer
    let frame = 0
    let routeTimer = 0
    let activeCard
    let hero
    const resetCard = () => {
      if (!activeCard) return
      activeCard.style.removeProperty('--tilt-x')
      activeCard.style.removeProperty('--tilt-y')
      activeCard.classList.remove('is-tilting')
      activeCard = null
    }
    const updateScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const range = document.documentElement.scrollHeight - window.innerHeight
        document.documentElement.style.setProperty('--reading-progress', range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0)
        if (hero && !reduced.matches && finePointer.matches) {
          const rect = hero.getBoundingClientRect()
          hero.style.setProperty('--hero-drift', `${Math.min(32, Math.max(0, -rect.top * .07))}px`)
        }
      })
    }
    const prepare = () => {
      observer?.disconnect()
      resetCard()
      document.querySelectorAll('.motion-ready').forEach(node => node.classList.remove('motion-ready'))
      hero = document.querySelector('.immersive-hero')
      hero?.style.removeProperty('--hero-drift')
      if (!reduced.matches && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-entered')
            observer.unobserve(entry.target)
          }
        }), { threshold: .08 })
        document.querySelectorAll('.page-transition .section-head, .studio-statement, .signature-grid article, .artist-copy, .results-strip figure, .care-editorial li, .journal-preview, .page-cta-inner, .full-service-grid article, .comparison-grid article, .about-values article, .testimonial-card, .detail-side, .accordions details').forEach((node, index) => {
          if (node.classList.contains('motion-entered')) return
          node.style.setProperty('--reveal-delay', `${index % 3 * 65}ms`)
          node.classList.add('motion-ready')
          observer.observe(node)
        })
      }
      updateScroll()
    }
    const pointerMove = event => {
      if (reduced.matches || !finePointer.matches) return
      const card = event.target.closest?.('.signature-image, .page-hero-image, .testimonial-hero-image, .hero-detail-card')
      if (card !== activeCard) { resetCard(); activeCard = card }
      if (!card) return
      const rect = card.getBoundingClientRect()
      const x = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5))
      const y = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5))
      card.style.setProperty('--tilt-x', `${-y * 7}deg`)
      card.style.setProperty('--tilt-y', `${x * 7}deg`)
      card.classList.add('is-tilting')
    }
    const routeChange = () => { window.clearTimeout(routeTimer); routeTimer = window.setTimeout(prepare, 60) }
    prepare()
    // Include newly filtered service cards without touching the filter itself.
    const mutations = new MutationObserver(routeChange)
    const root = document.querySelector('.page-transition')?.parentElement
    if (root) mutations.observe(root, { childList: true, subtree: true })
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll, { passive: true })
    window.addEventListener('popstate', routeChange)
    document.addEventListener('pointermove', pointerMove, { passive: true })
    document.addEventListener('pointerleave', resetCard)
    reduced.addEventListener('change', prepare)
    return () => {
      observer?.disconnect(); mutations.disconnect(); resetCard()
      cancelAnimationFrame(frame); window.clearTimeout(routeTimer)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
      window.removeEventListener('popstate', routeChange)
      document.removeEventListener('pointermove', pointerMove)
      document.removeEventListener('pointerleave', resetCard)
      reduced.removeEventListener('change', prepare)
      document.querySelectorAll('.motion-ready').forEach(node => node.classList.remove('motion-ready'))
    }
  }, [])
  return <div className="reading-progress" aria-hidden="true" />
}

import { useEffect, useState } from 'react'

import CoreValueSection from '@/components/landing/CoreValueSection'
import FutureVisionSection from '@/components/landing/FutureVisionSection'
import HostTeaserSection from '@/components/landing/HostTeaserSection'
import LandingCTASection from '@/components/landing/LandingCTASection'
import LandingHero from '@/components/landing/LandingHero'
import ProblemSection from '@/components/landing/ProblemSection'
import ProductPreviewSection from '@/components/landing/ProductPreviewSection'
import TrustSection from '@/components/landing/TrustSection'
import UrgentStopFlowSection from '@/components/landing/UrgentStopFlowSection'

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)

    const onScroll = () => {
      setScrollY(window.scrollY)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      mediaQuery.removeEventListener('change', updateMotionPreference)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-[1600px] py-8">
      <div className="space-y-16 sm:space-y-20">
        <LandingHero scrollY={scrollY} reducedMotion={reducedMotion} />
        <ProblemSection />
        <CoreValueSection />
        <TrustSection />
        <UrgentStopFlowSection />
        <ProductPreviewSection />
        <FutureVisionSection />
        <HostTeaserSection />
        <LandingCTASection />
      </div>
    </main>
  )
}

export default LandingPage

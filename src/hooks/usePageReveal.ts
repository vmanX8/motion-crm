import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { motionTokens, prefersReducedMotion } from '../lib/motion'

/**
 * Shared GSAP page reveal.
 */
function usePageReveal() {
    const pageRef = useRef<HTMLDivElement | null>(null)

    useLayoutEffect(() => {
        if (prefersReducedMotion()) {
            return
        }

        const context = gsap.context(() => {
            gsap.fromTo(
                pageRef.current,
                { y: motionTokens.page.distance, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: motionTokens.page.duration,
                    ease: motionTokens.page.ease,
                },
            )

            gsap.fromTo(
                '[data-page-section]',
                { y: motionTokens.page.distance, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: motionTokens.page.duration,
                    stagger: motionTokens.page.stagger,
                    delay: 0.08,
                    ease: motionTokens.page.ease,
                },
            )
        }, pageRef)

        return () => context.revert()
    }, [])

    return pageRef
}

export default usePageReveal

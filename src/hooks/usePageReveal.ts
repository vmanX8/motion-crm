import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Small shared page entrance motion.
 */
function usePageReveal() {
    const pageRef = useRef<HTMLDivElement | null>(null)

    useLayoutEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return
        }

        const context = gsap.context(() => {
            gsap.fromTo(
                pageRef.current,
                { y: 18, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.45,
                    ease: 'power2.out',
                },
            )

            gsap.fromTo(
                '[data-page-section]',
                { y: 18, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.45,
                    stagger: 0.08,
                    delay: 0.06,
                    ease: 'power2.out',
                },
            )
        }, pageRef)

        return () => context.revert()
    }, [])

    return pageRef
}

export default usePageReveal

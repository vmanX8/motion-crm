/**
 * Shared GSAP motion values.
 */
export const motionTokens = {
    page: {
        distance: 16,
        duration: 0.52,
        stagger: 0.1,
        ease: 'power2.out',
    },
    filters: {
        distance: 8,
        duration: 0.24,
        stagger: 0.03,
        ease: 'power1.out',
    },
    table: {
        distance: 6,
        duration: 0.22,
        stagger: 0.025,
        ease: 'power1.out',
    },
    drawerShell: {
        panelDistance: 28,
        openDuration: 0.38,
        closeDuration: 0.22,
        overlayOpenDuration: 0.24,
        overlayCloseDuration: 0.16,
        openEase: 'power3.out',
        closeEase: 'power2.in',
    },
    drawerContent: {
        distance: 6,
        duration: 0.18,
        ease: 'power1.out',
    },
    feedback: {
        duration: 0.16,
        ease: 'power1.out',
    },
    highlight: {
        duration: 0.42,
        ease: 'power2.out',
    },
    asyncState: {
        distance: 4,
        duration: 0.18,
        ease: 'power1.out',
    },
} as const

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Stat card data.
 */
type StatCardProps = {
    title: string
    value: string
    change: string
}

/**
 * Dashboard stat card.
 */
function StatCard({ title, value, change }: StatCardProps) {
    const cardRef = useRef<HTMLDivElement | null>(null)

    useLayoutEffect(() => {
        const card = cardRef.current

        if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return
        }

        const context = gsap.context(() => {
            // Card reveal.
            gsap.fromTo(
                card,
                { y: 28, autoAlpha: 0, scale: 0.97 },
                {
                    y: 0,
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.65,
                    ease: 'power3.out',
                    delay: 0.18,
                },
            )
        }, card)

        const onEnter = () => {
            // Small hover lift.
            gsap.to(card, {
                y: -8,
                scale: 1.015,
                duration: 0.25,
                ease: 'power2.out',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.22)',
            })
        }

        const onLeave = () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            })
        }

        card.addEventListener('mouseenter', onEnter)
        card.addEventListener('mouseleave', onLeave)

        return () => {
            card.removeEventListener('mouseenter', onEnter)
            card.removeEventListener('mouseleave', onLeave)
            context.revert()
        }
    }, [])

    return (
        <div ref={cardRef} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10">
            <p className="text-sm text-zinc-400">{title}</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight">{value}</h3>
            <p className="mt-2 text-sm text-emerald-400">{change}</p>
        </div>
    )
}

export default StatCard

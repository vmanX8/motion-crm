import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { Bell, Search } from 'lucide-react'

/**
 * Top header with quick actions and search.
 */
function Topbar() {
    const headerRef = useRef<HTMLElement | null>(null)

    useLayoutEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return
        }

        const context = gsap.context(() => {
            // Bring the full bar in from the top.
            gsap.fromTo(
                headerRef.current,
                { y: -24, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.65,
                    ease: 'power3.out',
                },
            )

            // Stagger the text and controls for a softer entrance.
            gsap.fromTo(
                '.topbar-copy, .topbar-control',
                { y: 14, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    delay: 0.1,
                    ease: 'power2.out',
                },
            )
        }, headerRef)

        return () => context.revert()
    }, [])

    return (
        <header ref={headerRef} className="border-b border-white/10 bg-zinc-950/80 px-6 py-4 backdrop-blur md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="topbar-copy">
                    <h2 className="text-xl font-semibold tracking-tight">Welcome back</h2>
                    <p className="text-sm text-zinc-400">Here's what's happening with your clients today.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="topbar-control flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-zinc-400">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent text-sm outline-none placeholder:text-zinc-500"
                        />
                    </div>

                    <button className="topbar-control rounded-2xl border border-white/10 bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10 hover:text-white">
                        <Bell size={18} />
                    </button>

                    <div className="topbar-control flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-zinc-900">
                        GK
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Topbar

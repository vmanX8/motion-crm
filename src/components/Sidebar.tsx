import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { LayoutDashboard, Users, FolderKanban, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

// Demo nav links.
const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/clients', label: 'Clients', icon: Users },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/settings', label: 'Settings', icon: Settings },
]

/**
 * Left navigation.
 */
function Sidebar() {
    const containerRef = useRef<HTMLElement | null>(null)

    useLayoutEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return
        }

        const context = gsap.context(() => {
            // Slide in the shell.
            gsap.fromTo(
                containerRef.current,
                { x: -28, autoAlpha: 0 },
                {
                    x: 0,
                    autoAlpha: 1,
                    duration: 0.7,
                    ease: 'power3.out',
                },
            )

            // Stagger the links.
            gsap.fromTo(
                '.sidebar-brand, .sidebar-link',
                { y: 18, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.55,
                    stagger: 0.08,
                    delay: 0.1,
                    ease: 'power2.out',
                },
            )
        }, containerRef)

        return () => context.revert()
    }, [])

    return (
        <aside ref={containerRef} className="hidden w-72 border-r border-white/10 bg-zinc-900/60 px-5 py-6 md:block">
            <div className="sidebar-brand mb-10">
                <h1 className="text-2xl font-bold tracking-tight">MotionCRM</h1>
                <p className="mt-1 text-sm text-zinc-400">Admin dashboard sample</p>
            </div>

            <nav className="space-y-2">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            `sidebar-link flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive
                                ? 'bg-white text-zinc-900'
                                : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar

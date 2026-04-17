import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import type { ClientSummary } from '../data/clients'
import { motionTokens, prefersReducedMotion } from '../lib/motion'

type ClientTableProps = {
    clients: ClientSummary[]
    selectedClientId: number | null
    highlightedClientId: number | null
    onSelectClient: (clientId: number) => void
}

const statusStyles: Record<ClientSummary['status'], string> = {
    Active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    Lead: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    Inactive: 'border-white/10 bg-zinc-900 text-zinc-300',
}

/**
 * Client summary table.
 */
function ClientTable({ clients, selectedClientId, highlightedClientId, onSelectClient }: ClientTableProps) {
    const tableRef = useRef<HTMLDivElement | null>(null)

    useLayoutEffect(() => {
        if (!tableRef.current || prefersReducedMotion()) {
            return
        }

        const context = gsap.context(() => {
            // First table reveal.
            gsap.fromTo(
                '[data-client-row]',
                { y: motionTokens.table.distance, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: motionTokens.table.duration,
                    stagger: motionTokens.table.stagger,
                    ease: motionTokens.table.ease,
                    clearProps: 'transform',
                },
            )
        }, tableRef)

        return () => context.revert()
    }, [])

    useLayoutEffect(() => {
        if (!tableRef.current || highlightedClientId === null || prefersReducedMotion()) {
            return
        }

        const row = tableRef.current.querySelector<HTMLElement>(`[data-client-row-id="${highlightedClientId}"]`)
        const badge = tableRef.current.querySelector<HTMLElement>(`[data-client-status-id="${highlightedClientId}"]`)

        if (!row || !badge) {
            return
        }

        // Highlight saved row.
        const timeline = gsap.timeline()
        timeline.fromTo(
            row,
            { backgroundColor: 'rgba(255,255,255,0.02)' },
            {
                backgroundColor: 'rgba(255,255,255,0.08)',
                duration: motionTokens.highlight.duration * 0.55,
                ease: motionTokens.highlight.ease,
            },
        )
        timeline.to(
            row,
            {
                backgroundColor: 'transparent',
                duration: motionTokens.highlight.duration,
                ease: motionTokens.highlight.ease,
            },
            '>-0.02',
        )
        timeline.fromTo(
            badge,
            { scale: 0.92, autoAlpha: 0.75 },
            {
                scale: 1,
                autoAlpha: 1,
                duration: motionTokens.highlight.duration,
                ease: motionTokens.highlight.ease,
                clearProps: 'transform',
            },
            0,
        )

        return () => {
            timeline.kill()
        }
    }, [highlightedClientId])

    return (
        <div ref={tableRef} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <table className="w-full text-left">
                <thead className="bg-zinc-900/80 text-sm text-zinc-400">
                    <tr>
                        <th className="px-4 py-3 font-medium">Company</th>
                        <th className="px-4 py-3 font-medium">Contact</th>
                        <th className="px-4 py-3 font-medium">Last Touch</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => {
                        const isSelected = client.id === selectedClientId

                        return (
                            <tr
                                key={client.id}
                                data-client-row
                                data-client-row-id={client.id}
                                onClick={() => onSelectClient(client.id)}
                                className={`cursor-pointer border-t border-white/10 transition ${
                                    isSelected ? 'bg-white/8' : 'hover:bg-white/5'
                                }`}
                            >
                                <td className="px-4 py-4">
                                    <div className="font-medium">{client.company}</div>
                                    <div className="mt-1 text-sm text-zinc-400">{client.email}</div>
                                </td>
                                <td className="px-4 py-4 text-zinc-300">{client.contact}</td>
                                <td className="px-4 py-4 text-zinc-400">{client.lastTouch}</td>
                                <td className="px-4 py-4">
                                    <span
                                        data-client-status-id={client.id}
                                        className={`rounded-full border px-3 py-1 text-xs ${statusStyles[client.status]}`}
                                    >
                                        {client.status}
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ClientTable

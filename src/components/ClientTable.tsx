import type { Client } from '../data/clients'

type ClientTableProps = {
    clients: Client[]
    selectedClientId: number | null
    onSelectClient: (clientId: number) => void
}

const statusStyles: Record<Client['status'], string> = {
    Active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    Lead: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    Inactive: 'border-white/10 bg-zinc-900 text-zinc-300',
}

/**
 * Client list table with row selection.
 */
function ClientTable({ clients, selectedClientId, onSelectClient }: ClientTableProps) {
    if (clients.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-white/10 bg-zinc-900/40 p-8 text-center text-sm text-zinc-400">
                No clients match the current filters.
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
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
                                    <span className={`rounded-full border px-3 py-1 text-xs ${statusStyles[client.status]}`}>
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

import { clients } from '../data/clients'

/**
 * Demo client table page.
 */
function Clients() {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Clients</h3>
                    <p className="text-sm text-zinc-400">Manage your client relationships</p>
                </div>

                <button className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:scale-[1.02]">
                    Add Client
                </button>
            </div>

            {/* mock example: production tables usually load, filter, and paginate server data */}
            <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-left">
                    <thead className="bg-zinc-900/80 text-sm text-zinc-400">
                        <tr>
                            <th className="px-4 py-3 font-medium">Company</th>
                            <th className="px-4 py-3 font-medium">Contact</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr
                                key={client.id}
                                className="border-t border-white/10 transition hover:bg-white/5"
                            >
                                <td className="px-4 py-4 font-medium">{client.company}</td>
                                <td className="px-4 py-4 text-zinc-300">{client.contact}</td>
                                <td className="px-4 py-4">
                                    <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
                                        {client.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Clients

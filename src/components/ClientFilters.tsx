import { Search } from 'lucide-react'
import { clientStatuses, type ClientStatus } from '../data/clients'

type ClientFiltersProps = {
    searchValue: string
    statusValue: ClientStatus | 'All'
    resultCount: number
    totalCount: number
    onSearchChange: (value: string) => void
    onStatusChange: (value: ClientStatus | 'All') => void
}

/**
 * Local client filters.
 */
function ClientFilters({
    searchValue,
    statusValue,
    resultCount,
    totalCount,
    onSearchChange,
    onStatusChange,
}: ClientFiltersProps) {
    return (
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-zinc-900/50 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-4 md:flex-row">
                <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-400">
                    <Search size={16} />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search by company, contact, or email"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                    />
                </label>

                <select
                    value={statusValue}
                    onChange={(event) => onStatusChange(event.target.value as ClientStatus | 'All')}
                    className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                >
                    <option value="All">All statuses</option>
                    {clientStatuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            <p className="text-sm text-zinc-400">
                Showing {resultCount} of {totalCount} clients
            </p>
        </div>
    )
}

export default ClientFilters

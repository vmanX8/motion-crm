import { useEffect, useState } from 'react'
import ClientDrawer from '../components/ClientDrawer'
import ClientFilters from '../components/ClientFilters'
import ClientTable from '../components/ClientTable'
import { seedClients, type Client, type ClientStatus } from '../data/clients'

const STORAGE_KEY = 'motion-crm-clients'

const readClientsFromStorage = () => {
    if (typeof window === 'undefined') {
        return seedClients
    }

    const rawValue = window.localStorage.getItem(STORAGE_KEY)
    if (!rawValue) {
        return seedClients
    }

    try {
        return JSON.parse(rawValue) as Client[]
    } catch {
        return seedClients
    }
}

/**
 * Stateful client management page with local persistence.
 */
function Clients() {
    const [clients, setClients] = useState<Client[]>(readClientsFromStorage)
    const [searchValue, setSearchValue] = useState('')
    const [statusValue, setStatusValue] = useState<ClientStatus | 'All'>('All')
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null)

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
    }, [clients])

    const filteredClients = clients.filter((client) => {
        const matchesSearch = [client.company, client.contact, client.email]
            .join(' ')
            .toLowerCase()
            .includes(searchValue.trim().toLowerCase())

        const matchesStatus = statusValue === 'All' || client.status === statusValue

        return matchesSearch && matchesStatus
    })

    const selectedClient = clients.find((client) => client.id === selectedClientId) ?? null

    const handleSaveClient = (updatedClient: Client) => {
        setClients((currentClients) =>
            currentClients.map((client) => (client.id === updatedClient.id ? updatedClient : client)),
        )
        setSelectedClientId(updatedClient.id)
    }

    const handleAddClient = () => {
        const nextClient: Client = {
            id: Date.now(),
            company: 'New Client',
            contact: 'New Contact',
            email: 'hello@example.com',
            phone: '+1 (000) 000-0000',
            status: 'Lead',
            lastTouch: 'Just now',
            notes: 'Add discovery notes here.',
        }

        setClients((currentClients) => [nextClient, ...currentClients])
        setSelectedClientId(nextClient.id)
    }

    return (
        <>
            <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Clients</h3>
                            <p className="text-sm text-zinc-400">Search, filter, and update client details from one place.</p>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddClient}
                            className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:scale-[1.02]"
                        >
                            Add Client
                        </button>
                    </div>

                    <div className="mt-6 space-y-6">
                        <ClientFilters
                            searchValue={searchValue}
                            statusValue={statusValue}
                            resultCount={filteredClients.length}
                            totalCount={clients.length}
                            onSearchChange={setSearchValue}
                            onStatusChange={setStatusValue}
                        />

                        {/* mock example: production tables usually load, filter, and paginate server data */}
                        <ClientTable
                            clients={filteredClients}
                            selectedClientId={selectedClientId}
                            onSelectClient={setSelectedClientId}
                        />
                    </div>
                </div>
            </div>

            <ClientDrawer
                key={selectedClient?.id ?? 'empty'}
                client={selectedClient}
                onClose={() => setSelectedClientId(null)}
                onSave={handleSaveClient}
            />
        </>
    )
}

export default Clients

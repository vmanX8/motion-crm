import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ClientDrawer from '../components/ClientDrawer'
import ClientFilters from '../components/ClientFilters'
import ClientTable from '../components/ClientTable'
import usePageReveal from '../hooks/usePageReveal'
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
    const pageRef = usePageReveal()
    const filtersRef = useRef<HTMLDivElement | null>(null)
    const [clients, setClients] = useState<Client[]>(readClientsFromStorage)
    const [searchValue, setSearchValue] = useState('')
    const [statusValue, setStatusValue] = useState<ClientStatus | 'All'>('All')
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
    }, [clients])

    useLayoutEffect(() => {
        if (!filtersRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return
        }

        const context = gsap.context(() => {
            gsap.fromTo(
                '[data-filter-block]',
                { y: 10, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.26,
                    stagger: 0.04,
                    ease: 'power2.out',
                },
            )
        }, filtersRef)

        return () => context.revert()
    }, [searchValue, statusValue])

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
        setIsDrawerOpen(false)
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
        setIsDrawerOpen(true)
    }

    const handleResetDemoData = () => {
        setClients(seedClients)
        setSearchValue('')
        setStatusValue('All')
        setSelectedClientId(null)
        setIsDrawerOpen(false)
        window.localStorage.removeItem(STORAGE_KEY)
    }

    const handleSelectClient = (clientId: number) => {
        setSelectedClientId(clientId)
        setIsDrawerOpen(true)
    }

    return (
        <>
            <div ref={pageRef} className="space-y-6">
                <div data-page-section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div data-filter-block className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Clients</h3>
                            <p className="text-sm text-zinc-400">Search, filter, and update client details from one place.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={handleResetDemoData}
                                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                            >
                                Reset Demo Data
                            </button>

                            <button
                                type="button"
                                onClick={handleAddClient}
                                className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:scale-[1.02]"
                            >
                                Add Client
                            </button>
                        </div>
                    </div>

                    <div ref={filtersRef} className="mt-6 space-y-6">
                        <div data-filter-block>
                            <ClientFilters
                                searchValue={searchValue}
                                statusValue={statusValue}
                                resultCount={filteredClients.length}
                                totalCount={clients.length}
                                onSearchChange={setSearchValue}
                                onStatusChange={setStatusValue}
                            />
                        </div>

                        {/* mock example: production tables usually load, filter, and paginate server data */}
                        <div data-filter-block>
                            <ClientTable
                                clients={filteredClients}
                                selectedClientId={selectedClientId}
                                onSelectClient={handleSelectClient}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ClientDrawer
                key={selectedClient?.id ?? 'empty'}
                client={selectedClient}
                isOpen={isDrawerOpen && selectedClient !== null}
                onRequestClose={() => setIsDrawerOpen(false)}
                onClosed={() => setSelectedClientId(null)}
                onSave={handleSaveClient}
            />
        </>
    )
}

export default Clients

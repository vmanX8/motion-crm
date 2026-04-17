import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ClientDrawer from '../components/ClientDrawer'
import ClientFilters from '../components/ClientFilters'
import ClientTable from '../components/ClientTable'
import usePageReveal from '../hooks/usePageReveal'
import { motionTokens, prefersReducedMotion } from '../lib/motion'
import { toClientDetails, toClientSummary, type ClientDetails, type ClientStatus, type ClientSummary } from '../data/clients'
import {
    createClient,
    getClientDetailsById,
    getClientSummaries,
    resetClientData,
    updateClientFields,
    updateClientNotes,
    updateClientStatus,
} from '../services/clientService'

const ClientTableSkeleton = () => (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-4 gap-4 border-b border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-500">
            <div>Company</div>
            <div>Contact</div>
            <div>Last Touch</div>
            <div>Status</div>
        </div>

        <div className="space-y-3 p-4">
            {[0, 1, 2, 3].map((row) => (
                <div
                    key={row}
                    className="grid animate-pulse grid-cols-4 gap-4 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-4"
                >
                    <div className="space-y-2">
                        <div className="h-4 w-28 rounded-full bg-white/10" />
                        <div className="h-3 w-36 rounded-full bg-white/5" />
                    </div>
                    <div className="h-4 w-24 self-center rounded-full bg-white/10" />
                    <div className="h-4 w-20 self-center rounded-full bg-white/5" />
                    <div className="h-6 w-16 self-center rounded-full bg-white/10" />
                </div>
            ))}
        </div>
    </div>
)

/**
 * Client list and drawer page.
 */
function Clients() {
    const pageRef = usePageReveal()
    const filtersRef = useRef<HTMLDivElement | null>(null)
    const listStateRef = useRef<HTMLDivElement | null>(null)
    const [clients, setClients] = useState<ClientSummary[]>([])
    const [selectedClientDetails, setSelectedClientDetails] = useState<ClientDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isMutating, setIsMutating] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [statusValue, setStatusValue] = useState<ClientStatus | 'All'>('All')
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
    const [isDetailLoading, setIsDetailLoading] = useState(false)
    const [detailError, setDetailError] = useState<string | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [highlightedClientId, setHighlightedClientId] = useState<number | null>(null)

    useLayoutEffect(() => {
        if (!filtersRef.current || prefersReducedMotion()) {
            return
        }

        const context = gsap.context(() => {
            gsap.fromTo(
                '[data-filter-block]',
                { y: motionTokens.filters.distance, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: motionTokens.filters.duration,
                    stagger: motionTokens.filters.stagger,
                    ease: motionTokens.filters.ease,
                },
            )
        }, filtersRef)

        return () => context.revert()
    }, [])

    useEffect(() => {
        let isMounted = true

        // Load table data once.
        const loadClients = async () => {
            setIsLoading(true)
            setErrorMessage(null)

            try {
                const nextClients = await getClientSummaries()
                if (!isMounted) {
                    return
                }

                setClients(nextClients)
                setSelectedClientId((currentId) =>
                    currentId !== null && nextClients.some((client) => client.id === currentId) ? currentId : null,
                )
            } catch {
                if (isMounted) {
                    setErrorMessage('Could not load clients. Please try again.')
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        void loadClients()

        return () => {
            isMounted = false
        }
    }, [])

    useEffect(() => {
        if (selectedClientId === null) {
            setSelectedClientDetails(null)
            setIsDetailLoading(false)
            setDetailError(null)
            return
        }

        let isMounted = true

        // Load drawer data on selection.
        const loadDetails = async () => {
            setIsDetailLoading(true)
            setDetailError(null)

            try {
                const nextDetails = await getClientDetailsById(selectedClientId)
                if (!isMounted) {
                    return
                }

                setSelectedClientDetails(nextDetails)
            } catch {
                if (isMounted) {
                    setDetailError('Could not load client details. Please try again.')
                }
            } finally {
                if (isMounted) {
                    setIsDetailLoading(false)
                }
            }
        }

        void loadDetails()

        return () => {
            isMounted = false
        }
    }, [selectedClientId])

    const filteredClients = clients.filter((client) => {
        const matchesSearch = [client.company, client.contact, client.email]
            .join(' ')
            .toLowerCase()
            .includes(searchValue.trim().toLowerCase())

        const matchesStatus = statusValue === 'All' || client.status === statusValue

        return matchesSearch && matchesStatus
    })

    const selectedSummary = clients.find((client) => client.id === selectedClientId) ?? null
    const selectedDetails = selectedClientDetails

    useLayoutEffect(() => {
        if (!listStateRef.current || prefersReducedMotion()) {
            return
        }

        gsap.fromTo(
            listStateRef.current,
            { autoAlpha: 0.72, y: motionTokens.asyncState.distance },
            {
                autoAlpha: 1,
                y: 0,
                duration: motionTokens.asyncState.duration,
                ease: motionTokens.asyncState.ease,
                clearProps: 'transform',
            },
        )
    }, [errorMessage, filteredClients.length, isLoading])

    const loadClients = async () => {
        setIsLoading(true)
        setErrorMessage(null)

        try {
            const nextClients = await getClientSummaries()
            setClients(nextClients)
        } catch {
            setErrorMessage('Could not load clients. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddClient = async () => {
        setIsMutating(true)
        setErrorMessage(null)

        try {
            const nextClient = await createClient()
            setClients((currentClients) => [toClientSummary(nextClient), ...currentClients])
            setSelectedClientDetails(toClientDetails(nextClient))
            setSelectedClientId(nextClient.id)
            setIsDrawerOpen(true)
        } catch {
            setErrorMessage('Could not create a new client. Please try again.')
        } finally {
            setIsMutating(false)
        }
    }

    const handleResetDemoData = async () => {
        setIsMutating(true)
        setErrorMessage(null)

        try {
            const nextClients = await resetClientData()
            setClients(nextClients)
            setSelectedClientDetails(null)
            setSearchValue('')
            setStatusValue('All')
            setSelectedClientId(null)
            setIsDrawerOpen(false)
        } catch {
            setErrorMessage('Could not reset the demo data. Please try again.')
        } finally {
            setIsMutating(false)
        }
    }

    const handleSelectClient = (clientId: number) => {
        // Clear old drawer data first.
        setSelectedClientDetails(null)
        setDetailError(null)
        setIsDetailLoading(true)
        setSelectedClientId(clientId)
        setIsDrawerOpen(true)
    }

    const handleRetryDetails = async () => {
        if (selectedClientId === null) {
            return
        }

        setIsDetailLoading(true)
        setDetailError(null)

        try {
            const nextDetails = await getClientDetailsById(selectedClientId)
            setSelectedClientDetails(nextDetails)
        } catch {
            setDetailError('Could not load client details. Please try again.')
        } finally {
            setIsDetailLoading(false)
        }
    }

    const handleSaveStatus = async (status: ClientStatus) => {
        if (selectedClientId === null) {
            return
        }

        const updatedClient = await updateClientStatus(selectedClientId, status)

        // Patch the changed row only.
        setClients((currentClients) =>
            currentClients.map((client) => (client.id === updatedClient.id ? toClientSummary(updatedClient) : client)),
        )
        setSelectedClientDetails(toClientDetails(updatedClient))
        setHighlightedClientId(updatedClient.id)
        window.setTimeout(() => {
            setHighlightedClientId((currentId) => (currentId === updatedClient.id ? null : currentId))
        }, 700)
    }

    const handleSaveProfile = async (profile: {
        company: string
        contact: string
        email: string
        phone: string
    }) => {
        if (selectedClientId === null) {
            return
        }

        const updatedClient = await updateClientFields(selectedClientId, profile)

        // Profile is used in table and drawer.
        setClients((currentClients) =>
            currentClients.map((client) => (client.id === updatedClient.id ? toClientSummary(updatedClient) : client)),
        )
        setSelectedClientDetails(toClientDetails(updatedClient))
    }

    const handleSaveNotes = async (notes: string) => {
        if (selectedClientId === null) {
            return
        }

        const updatedClient = await updateClientNotes(selectedClientId, notes)
        // Notes only live in the drawer.
        setSelectedClientDetails(toClientDetails(updatedClient))
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
                                onClick={() => void handleResetDemoData()}
                                disabled={isLoading || isMutating}
                                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                            >
                                Reset Demo Data
                            </button>

                            <button
                                type="button"
                                onClick={() => void handleAddClient()}
                                disabled={isLoading || isMutating}
                                className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:scale-[1.02]"
                            >
                                Add Client
                            </button>
                        </div>
                    </div>

                    <div ref={filtersRef} className="mt-6 space-y-6">
                        {!isLoading && (
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
                        )}

                        <div ref={listStateRef} data-filter-block className="min-h-[18rem]">
                            {isLoading ? (
                                <div className="space-y-4">
                                    <div className="rounded-3xl border border-dashed border-white/10 bg-zinc-900/40 p-5 text-sm text-zinc-400">
                                        Loading clients...
                                    </div>
                                    <ClientTableSkeleton />
                                </div>
                            ) : errorMessage && clients.length === 0 ? (
                                <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6">
                                    <p className="text-sm font-medium text-rose-200">{errorMessage}</p>
                                    <button
                                        type="button"
                                        onClick={() => void loadClients()}
                                        className="mt-4 rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/5 hover:text-white"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : filteredClients.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-white/10 bg-zinc-900/40 p-8 text-center">
                                    <p className="text-sm font-medium text-zinc-200">No clients found.</p>
                                    <p className="mt-2 text-sm text-zinc-400">
                                        {clients.length === 0
                                            ? 'The client list is empty right now.'
                                            : 'Try adjusting the current search or status filter.'}
                                    </p>
                                </div>
                            ) : (
                                <ClientTable
                                    clients={filteredClients}
                                    selectedClientId={selectedClientId}
                                    highlightedClientId={highlightedClientId}
                                    onSelectClient={handleSelectClient}
                                />
                            )}
                        </div>

                        {errorMessage && clients.length > 0 && (
                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ClientDrawer
                selectedClientId={selectedClientId}
                summary={selectedSummary}
                details={selectedDetails}
                isDetailLoading={isDetailLoading}
                detailError={detailError}
                isOpen={isDrawerOpen && selectedSummary !== null}
                onRequestClose={() => setIsDrawerOpen(false)}
                onClosed={() => setSelectedClientId(null)}
                onRetryDetails={() => void handleRetryDetails()}
                onSaveProfile={handleSaveProfile}
                onSaveStatus={handleSaveStatus}
                onSaveNotes={handleSaveNotes}
            />
        </>
    )
}

export default Clients

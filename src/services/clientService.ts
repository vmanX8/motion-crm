import {
    type ClientStatus,
    type Client,
    type ClientDetails,
    type ClientSummary,
    seedClients,
    toClientDetails,
    toClientSummary,
} from '../data/clients'

const STORAGE_KEY = 'motion-crm-client-store'
const SUMMARY_DELAY_MS = 450
const DETAIL_DELAY_MS = 300

type ClientStore = Client[]

/**
 * Fake client API.
 */
const cloneStore = (store: ClientStore): ClientStore => JSON.parse(JSON.stringify(store)) as ClientStore

const createSeedStore = (): ClientStore => seedClients.map((client) => ({ ...client }))

/**
 * Read saved mock clients.
 */
const readStore = (): ClientStore => {
    if (typeof window === 'undefined') {
        return createSeedStore()
    }

    const rawValue = window.localStorage.getItem(STORAGE_KEY)
    if (!rawValue) {
        return createSeedStore()
    }

    try {
        const parsedValue = JSON.parse(rawValue) as ClientStore
        return Array.isArray(parsedValue) ? parsedValue : createSeedStore()
    } catch {
        return createSeedStore()
    }
}

/**
 * Save mock clients.
 */
const writeStore = (store: ClientStore) => {
    if (typeof window === 'undefined') {
        return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

/**
 * Fake network delay.
 */
const wait = (delayMs: number) =>
    new Promise<void>((resolve) => {
        window.setTimeout(resolve, delayMs)
    })

export const getClientSummaries = async (): Promise<ClientSummary[]> => {
    await wait(SUMMARY_DELAY_MS)
    return readStore().map(toClientSummary)
}

/**
 * Load one client's details.
 */
export const getClientDetailsById = async (clientId: number): Promise<ClientDetails> => {
    await wait(DETAIL_DELAY_MS)

    const client = readStore().find((entry) => entry.id === clientId)
    if (!client) {
        throw new Error('Client details not found.')
    }

    return toClientDetails(client)
}

/**
 * Update one client.
 */
export const updateClientFields = async (clientId: number, updates: Partial<Client>): Promise<Client> => {
    await wait(DETAIL_DELAY_MS)

    const store = readStore()
    const clientIndex = store.findIndex((entry) => entry.id === clientId)

    if (clientIndex === -1) {
        throw new Error('Client not found.')
    }

    store[clientIndex] = {
        ...store[clientIndex],
        ...updates,
    }

    writeStore(store)

    return store[clientIndex]
}

export const updateClientStatus = async (clientId: number, status: ClientStatus): Promise<Client> =>
    updateClientFields(clientId, { status })

export const updateClientNotes = async (clientId: number, notes: string): Promise<Client> =>
    updateClientFields(clientId, { notes })

/**
 * Create a starter client.
 */
export const createClient = async (): Promise<Client> => {
    await wait(DETAIL_DELAY_MS)

    const store = readStore()
    const clientId = Date.now()

    const nextClient: Client = {
        id: clientId,
        company: 'New Client',
        contact: 'New Contact',
        email: 'hello@example.com',
        status: 'Lead',
        lastTouch: 'Just now',
        revenue: 'EUR 0',
        projectCount: 0,
        phone: '+1 (000) 000-0000',
        notes: 'Add discovery notes here.',
        interactions: [],
        tags: ['New'],
        metadata: {
            accountOwner: 'Unassigned',
            plan: 'Prospect',
            preferredChannel: 'Email',
        },
    }

    const nextStore = cloneStore(store)
    nextStore.unshift(nextClient)
    writeStore(nextStore)

    return nextClient
}

export const resetClientData = async (): Promise<ClientSummary[]> => {
    await wait(DETAIL_DELAY_MS)
    const nextStore = createSeedStore()
    writeStore(nextStore)
    return nextStore.map(toClientSummary)
}

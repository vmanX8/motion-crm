/**
 * Small shared types for the client demo flow.
 */
export type ClientStatus = 'Active' | 'Lead' | 'Inactive'

/**
 * Lightweight client shape used by the table/list.
 */
export type ClientSummary = {
    id: number
    company: string
    contact: string
    email: string
    status: ClientStatus
    lastTouch: string
    revenue: string
    projectCount: number
}

/**
 * Drawer/detail fields loaded separately from the list shape.
 */
export type ClientDetails = {
    status: ClientStatus
    phone: string
    notes: string
    interactions: string[]
    tags: string[]
    metadata: {
        accountOwner: string
        plan: string
        preferredChannel: string
    }
}

export type Client = ClientSummary & ClientDetails

export const clientStatuses: ClientStatus[] = ['Active', 'Lead', 'Inactive']

// mock example: in production this data should come from an API or database
export const toClientSummary = (client: Client): ClientSummary => ({
    id: client.id,
    company: client.company,
    contact: client.contact,
    email: client.email,
    status: client.status,
    lastTouch: client.lastTouch,
    revenue: client.revenue,
    projectCount: client.projectCount,
})

export const toClientDetails = (client: Client): ClientDetails => ({
    status: client.status,
    phone: client.phone,
    notes: client.notes,
    interactions: client.interactions,
    tags: client.tags,
    metadata: client.metadata,
})

export const seedClients: Client[] = [
    {
        id: 1,
        company: 'Aegean Design',
        contact: 'Anna Papadopoulou',
        email: 'anna@aegeandesign.gr',
        status: 'Active',
        lastTouch: '2 hours ago',
        revenue: 'EUR 42k',
        projectCount: 3,
        phone: '+30 210 555 0132',
        notes: 'Waiting on the homepage motion mockup review.',
        interactions: ['Homepage mockup review requested', 'Shared updated animation references'],
        tags: ['Priority', 'Website'],
        metadata: {
            accountOwner: 'Eleni K.',
            plan: 'Retainer',
            preferredChannel: 'Email',
        },
    },
    {
        id: 2,
        company: 'Berlin Studio',
        contact: 'Jonas Weber',
        email: 'jonas@berlinstudio.de',
        status: 'Lead',
        lastTouch: 'Yesterday',
        revenue: 'EUR 18k',
        projectCount: 1,
        phone: '+49 30 555 0186',
        notes: 'Qualified lead. Send pricing after the discovery call.',
        interactions: ['Discovery call completed', 'Proposal draft in progress'],
        tags: ['Lead', 'Proposal'],
        metadata: {
            accountOwner: 'Nikos P.',
            plan: 'Prospect',
            preferredChannel: 'Phone',
        },
    },
    {
        id: 3,
        company: 'Roma Digital',
        contact: 'Sara Conti',
        email: 'sara@romadigital.it',
        status: 'Inactive',
        lastTouch: '4 days ago',
        revenue: 'EUR 9k',
        projectCount: 0,
        phone: '+39 06 555 0198',
        notes: 'Paused until next quarter budget opens up.',
        interactions: ['Budget hold confirmed', 'Follow-up scheduled for next quarter'],
        tags: ['Paused'],
        metadata: {
            accountOwner: 'Maria T.',
            plan: 'Past Client',
            preferredChannel: 'Email',
        },
    },
    {
        id: 4,
        company: 'Paris Atelier',
        contact: 'Marc Dubois',
        email: 'marc@parisatelier.fr',
        status: 'Active',
        lastTouch: '1 week ago',
        revenue: 'EUR 31k',
        projectCount: 2,
        phone: '+33 1 55 50 0174',
        notes: 'Need final logo files before the onboarding handoff.',
        interactions: ['Onboarding checklist sent', 'Logo delivery pending'],
        tags: ['Branding', 'Onboarding'],
        metadata: {
            accountOwner: 'Alex R.',
            plan: 'Project',
            preferredChannel: 'Slack',
        },
    },
]

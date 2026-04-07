/**
 * Small shared types for the client demo flow.
 */
export type ClientStatus = 'Active' | 'Lead' | 'Inactive'

/**
 * Client shape used by the table and drawer.
 */
export type Client = {
    id: number
    company: string
    contact: string
    email: string
    phone: string
    status: ClientStatus
    lastTouch: string
    notes: string
}

export const clientStatuses: ClientStatus[] = ['Active', 'Lead', 'Inactive']

// mock example: in production this data should come from an API or database
export const seedClients: Client[] = [
    {
        id: 1,
        company: 'Aegean Design',
        contact: 'Anna Papadopoulou',
        email: 'anna@aegeandesign.gr',
        phone: '+30 210 555 0132',
        status: 'Active',
        lastTouch: '2 hours ago',
        notes: 'Waiting on the homepage motion mockup review.',
    },
    {
        id: 2,
        company: 'Berlin Studio',
        contact: 'Jonas Weber',
        email: 'jonas@berlinstudio.de',
        phone: '+49 30 555 0186',
        status: 'Lead',
        lastTouch: 'Yesterday',
        notes: 'Qualified lead. Send pricing after the discovery call.',
    },
    {
        id: 3,
        company: 'Roma Digital',
        contact: 'Sara Conti',
        email: 'sara@romadigital.it',
        phone: '+39 06 555 0198',
        status: 'Inactive',
        lastTouch: '4 days ago',
        notes: 'Paused until next quarter budget opens up.',
    },
    {
        id: 4,
        company: 'Paris Atelier',
        contact: 'Marc Dubois',
        email: 'marc@parisatelier.fr',
        phone: '+33 1 55 50 0174',
        status: 'Active',
        lastTouch: '1 week ago',
        notes: 'Need final logo files before the onboarding handoff.',
    },
]

/**
 * Basic client shape used by the demo pages.
 */
export type Client = {
    id: number
    company: string
    contact: string
    status: 'Active' | 'Lead' | 'Inactive'
}

// mock example: in production this list should come from an API or database
export const clients: Client[] = [
    { id: 1, company: 'Client Name 1', contact: 'First1 Last1', status: 'Active' },
    { id: 2, company: 'Client Name 2', contact: 'First2 Last2', status: 'Lead' },
    { id: 3, company: 'Client Name 3', contact: 'First3 Last3', status: 'Inactive' },
    { id: 4, company: 'Client Name 4', contact: 'First4 Last4', status: 'Active' },
]

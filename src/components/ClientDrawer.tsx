import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { clientStatuses, type Client } from '../data/clients'

type ClientDrawerProps = {
    client: Client | null
    onClose: () => void
    onSave: (client: Client) => void
}

/**
 * Side drawer for viewing and editing one client.
 */
function ClientDrawer({ client, onClose, onSave }: ClientDrawerProps) {
    const [draft, setDraft] = useState<Client | null>(client)

    useEffect(() => {
        setDraft(client)
    }, [client])

    useEffect(() => {
        if (!client) {
            return
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [client, onClose])

    if (!client || !draft) {
        return null
    }

    const updateField = <Key extends keyof Client>(field: Key, value: Client[Key]) => {
        setDraft((currentDraft) => {
            if (!currentDraft) {
                return currentDraft
            }

            return { ...currentDraft, [field]: value }
        })
    }

    return (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-sm">
            <button
                type="button"
                aria-label="Close client drawer"
                className="flex-1 cursor-default"
                onClick={onClose}
            />

            <aside className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/40">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Client Details</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight">{draft.company}</h3>
                        <p className="mt-1 text-sm text-zinc-400">Edit the client notes and current status locally.</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-white/10 bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-6 space-y-5 overflow-y-auto pr-1">
                    <label className="block">
                        <span className="mb-2 block text-sm text-zinc-400">Company</span>
                        <input
                            type="text"
                            value={draft.company}
                            onChange={(event) => updateField('company', event.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm text-zinc-400">Contact</span>
                        <input
                            type="text"
                            value={draft.contact}
                            onChange={(event) => updateField('contact', event.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                        />
                    </label>

                    <div className="grid gap-5 md:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-sm text-zinc-400">Email</span>
                            <input
                                type="email"
                                value={draft.email}
                                onChange={(event) => updateField('email', event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm text-zinc-400">Phone</span>
                            <input
                                type="text"
                                value={draft.phone}
                                onChange={(event) => updateField('phone', event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                            />
                        </label>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-sm text-zinc-400">Status</span>
                            <select
                                value={draft.status}
                                onChange={(event) => updateField('status', event.target.value as Client['status'])}
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none"
                            >
                                {clientStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm text-zinc-400">Last Touch</span>
                            <input
                                type="text"
                                value={draft.lastTouch}
                                onChange={(event) => updateField('lastTouch', event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="mb-2 block text-sm text-zinc-400">Notes</span>
                        <textarea
                            rows={7}
                            value={draft.notes}
                            onChange={(event) => updateField('notes', event.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                        />
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(draft)}
                        className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:scale-[1.02]"
                    >
                        Save Changes
                    </button>
                </div>
            </aside>
        </div>
    )
}

export default ClientDrawer

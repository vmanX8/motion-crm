import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Check, LoaderCircle, X } from 'lucide-react'
import { clientStatuses, type ClientDetails, type ClientStatus, type ClientSummary } from '../data/clients'
import { motionTokens, prefersReducedMotion } from '../lib/motion'

type ClientDrawerProps = {
    selectedClientId: number | null
    summary: ClientSummary | null
    details: ClientDetails | null
    isDetailLoading: boolean
    detailError: string | null
    isOpen: boolean
    onRequestClose: () => void
    onClosed: () => void
    onRetryDetails: () => void
    onSaveProfile: (profile: ClientProfileForm) => Promise<void>
    onSaveStatus: (status: ClientStatus) => Promise<void>
    onSaveNotes: (notes: string) => Promise<void>
}

type SaveState = 'idle' | 'saving' | 'saved'
type ClientProfileForm = Pick<ClientSummary, 'company' | 'contact' | 'email'> & Pick<ClientDetails, 'phone'>

type ProfileEditorProps = {
    initialProfile: ClientProfileForm
    onSave: (profile: ClientProfileForm) => Promise<void>
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+()\-.\s\d]+$/
const getPhoneDigits = (value: string) => value.replace(/\D/g, '')
const sanitizePhoneInput = (value: string) => value.replace(/[^+()\-.\s\d]/g, '')

/**
 * Contact form with local draft state.
 */
function ProfileEditor({ initialProfile, onSave }: ProfileEditorProps) {
    const [profile, setProfile] = useState(initialProfile)
    const [saveState, setSaveState] = useState<SaveState>('idle')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const sectionRef = useRef<HTMLDivElement | null>(null)
    const saveStatusRef = useRef<HTMLSpanElement | null>(null)

    const emailError =
        profile.email.trim().length > 0 && !emailPattern.test(profile.email.trim())
            ? 'Enter a valid email address.'
            : null
    const phoneDigits = getPhoneDigits(profile.phone)
    const phoneError =
        profile.phone.trim().length > 0 && (!phonePattern.test(profile.phone) || phoneDigits.length < 7 || phoneDigits.length > 15)
            ? 'Enter a valid phone number with 7 to 15 digits.'
            : null

    const hasChanges =
        profile.company !== initialProfile.company ||
        profile.contact !== initialProfile.contact ||
        profile.email !== initialProfile.email ||
        profile.phone !== initialProfile.phone

    const isProfileValid =
        profile.company.trim().length > 0 &&
        profile.contact.trim().length > 0 &&
        profile.email.trim().length > 0 &&
        profile.phone.trim().length > 0 &&
        !emailError &&
        !phoneError

    const updateField = <Key extends keyof ClientProfileForm>(field: Key, value: ClientProfileForm[Key]) => {
        setProfile((currentProfile) => ({
            ...currentProfile,
            [field]: value,
        }))
    }

    const handleSave = async () => {
        if (!hasChanges || !isProfileValid) {
            return
        }

        setSaveState('saving')
        setErrorMessage(null)

        try {
            await onSave(profile)
            setSaveState('saved')
            window.setTimeout(() => {
                setSaveState('idle')
            }, 1500)
        } catch {
            setSaveState('idle')
            setErrorMessage('Could not save contact details. Your changes are still here, so you can retry.')
        }
    }

    useLayoutEffect(() => {
        if (!saveStatusRef.current || saveState === 'idle' || prefersReducedMotion()) {
            return
        }

        gsap.fromTo(
            saveStatusRef.current,
            { autoAlpha: 0.4, y: 4, scale: 0.96 },
            {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: motionTokens.feedback.duration,
                ease: motionTokens.feedback.ease,
                clearProps: 'transform',
            },
        )
    }, [saveState])

    useLayoutEffect(() => {
        if (!sectionRef.current || saveState !== 'saved' || prefersReducedMotion()) {
            return
        }

        const timeline = gsap.timeline()
        timeline.to(sectionRef.current, {
            backgroundColor: 'rgba(34, 197, 94, 0.09)',
            borderColor: 'rgba(34, 197, 94, 0.28)',
            duration: motionTokens.highlight.duration * 0.45,
            ease: motionTokens.highlight.ease,
        })
        timeline.to(sectionRef.current, {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            duration: motionTokens.highlight.duration,
            ease: motionTokens.highlight.ease,
        })

        return () => {
            timeline.kill()
        }
    }, [saveState])

    return (
        <div ref={sectionRef} data-drawer-item className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-zinc-300">Contact Details</p>
                    <p className="mt-1 text-sm text-zinc-500">Edit the core client info shown across the app.</p>
                </div>
                <span
                    ref={saveStatusRef}
                    className={`inline-flex min-h-8 min-w-24 items-center justify-center gap-2 rounded-full px-3 text-xs ${
                        saveState === 'saving'
                            ? 'bg-white/8 text-zinc-200'
                            : saveState === 'saved'
                              ? 'bg-emerald-500/12 text-emerald-200'
                              : 'bg-transparent text-zinc-500'
                    }`}
                >
                    {saveState === 'saving' && <LoaderCircle size={12} className="animate-spin" />}
                    {saveState === 'saved' && <Check size={12} />}
                    {saveState === 'saving' ? 'Saving' : saveState === 'saved' ? 'Saved' : null}
                </span>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">Company</span>
                    <input
                        type="text"
                        value={profile.company}
                        onChange={(event) => updateField('company', event.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">Contact</span>
                    <input
                        type="text"
                        value={profile.contact}
                        onChange={(event) => updateField('contact', event.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">Email</span>
                    <input
                        type="email"
                        value={profile.email}
                        onChange={(event) => updateField('email', event.target.value)}
                        aria-invalid={emailError !== null}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                    />
                    {emailError && <p className="mt-2 text-sm text-rose-300">{emailError}</p>}
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm text-zinc-400">Phone</span>
                    <input
                        type="text"
                        inputMode="tel"
                        value={profile.phone}
                        onChange={(event) => updateField('phone', sanitizePhoneInput(event.target.value))}
                        aria-invalid={phoneError !== null}
                        maxLength={24}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                    />
                    {phoneError && <p className="mt-2 text-sm text-rose-300">{phoneError}</p>}
                </label>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm text-rose-300">{errorMessage}</p>
                <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={!hasChanges || !isProfileValid || saveState === 'saving'}
                    className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Save Details
                </button>
            </div>
        </div>
    )
}

type StatusEditorProps = {
    initialStatus: ClientStatus
    onSave: (status: ClientStatus) => Promise<void>
}

/**
 * Status editor.
 */
function StatusEditor({ initialStatus, onSave }: StatusEditorProps) {
    const [value, setValue] = useState(initialStatus)
    const [saveState, setSaveState] = useState<SaveState>('idle')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const sectionRef = useRef<HTMLDivElement | null>(null)
    const statusRef = useRef<HTMLDivElement | null>(null)

    const hasChanges = value !== initialStatus

    const handleSave = async () => {
        if (!hasChanges) {
            return
        }

        setSaveState('saving')
        setErrorMessage(null)

        try {
            await onSave(value)
            setSaveState('saved')
            window.setTimeout(() => {
                setSaveState('idle')
            }, 1500)
        } catch {
            setValue(initialStatus)
            setSaveState('idle')
            setErrorMessage('Could not save status. Selection was reverted.')
        }
    }

    useLayoutEffect(() => {
        if (!statusRef.current || saveState === 'idle' || prefersReducedMotion()) {
            return
        }

        const target = statusRef.current
        gsap.fromTo(
            target,
            { autoAlpha: 0.4, y: 4, scale: 0.96 },
            {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: motionTokens.feedback.duration,
                ease: motionTokens.feedback.ease,
                clearProps: 'transform',
            },
        )
    }, [saveState])

    useLayoutEffect(() => {
        if (!sectionRef.current || saveState !== 'saved' || prefersReducedMotion()) {
            return
        }

        const timeline = gsap.timeline()
        timeline.to(sectionRef.current, {
            backgroundColor: 'rgba(34, 197, 94, 0.09)',
            borderColor: 'rgba(34, 197, 94, 0.28)',
            duration: motionTokens.highlight.duration * 0.45,
            ease: motionTokens.highlight.ease,
        })
        timeline.to(sectionRef.current, {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            duration: motionTokens.highlight.duration,
            ease: motionTokens.highlight.ease,
        })

        return () => {
            timeline.kill()
        }
    }, [saveState])

    return (
        <div ref={sectionRef} data-drawer-item className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-zinc-300">Status</p>
                    <p className="mt-1 text-sm text-zinc-500">Updates the drawer and the matching row.</p>
                </div>
                <span
                    ref={statusRef}
                    className={`inline-flex min-h-8 min-w-24 items-center justify-center gap-2 rounded-full px-3 text-xs ${
                        saveState === 'saving'
                            ? 'bg-white/8 text-zinc-200'
                            : saveState === 'saved'
                              ? 'bg-emerald-500/12 text-emerald-200'
                              : 'bg-transparent text-zinc-500'
                    }`}
                >
                    {saveState === 'saving' && <LoaderCircle size={12} className="animate-spin" />}
                    {saveState === 'saved' && <Check size={12} />}
                    {saveState === 'saving' ? 'Saving' : saveState === 'saved' ? 'Saved' : null}
                </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
                <select
                    value={value}
                    onChange={(event) => setValue(event.target.value as ClientStatus)}
                    className="flex-1 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none"
                >
                    {clientStatuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={!hasChanges || saveState === 'saving'}
                    className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Save
                </button>
            </div>

            {errorMessage && <p className="mt-3 text-sm text-rose-300">{errorMessage}</p>}
        </div>
    )
}

type NotesEditorProps = {
    initialNotes: string
    onSave: (notes: string) => Promise<void>
}

/**
 * Notes editor with local draft state.
 */
function NotesEditor({ initialNotes, onSave }: NotesEditorProps) {
    const [value, setValue] = useState(initialNotes)
    const [saveState, setSaveState] = useState<SaveState>('idle')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const sectionRef = useRef<HTMLDivElement | null>(null)
    const notesStatusRef = useRef<HTMLSpanElement | null>(null)
    const errorRef = useRef<HTMLParagraphElement | null>(null)

    const hasChanges = value !== initialNotes

    const handleSave = async () => {
        if (!hasChanges) {
            return
        }

        setSaveState('saving')
        setErrorMessage(null)

        try {
            await onSave(value)
            setSaveState('saved')
            window.setTimeout(() => {
                setSaveState('idle')
            }, 1500)
        } catch {
            setSaveState('idle')
            setErrorMessage('Could not save notes. Your text is still here, so you can retry.')
        }
    }

    useLayoutEffect(() => {
        if (!notesStatusRef.current || saveState === 'idle' || prefersReducedMotion()) {
            return
        }

        gsap.fromTo(
            notesStatusRef.current,
            { autoAlpha: 0.4, y: 4, scale: 0.96 },
            {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: motionTokens.feedback.duration,
                ease: motionTokens.feedback.ease,
                clearProps: 'transform',
            },
        )
    }, [saveState])

    useLayoutEffect(() => {
        if (!sectionRef.current || saveState !== 'saved' || prefersReducedMotion()) {
            return
        }

        const timeline = gsap.timeline()
        timeline.to(sectionRef.current, {
            backgroundColor: 'rgba(34, 197, 94, 0.09)',
            borderColor: 'rgba(34, 197, 94, 0.28)',
            duration: motionTokens.highlight.duration * 0.45,
            ease: motionTokens.highlight.ease,
        })
        timeline.to(sectionRef.current, {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            duration: motionTokens.highlight.duration,
            ease: motionTokens.highlight.ease,
        })

        return () => {
            timeline.kill()
        }
    }, [saveState])

    useLayoutEffect(() => {
        if (!errorRef.current || !errorMessage || prefersReducedMotion()) {
            return
        }

        gsap.fromTo(
            errorRef.current,
            { autoAlpha: 0, y: 4 },
            {
                autoAlpha: 1,
                y: 0,
                duration: motionTokens.feedback.duration,
                ease: motionTokens.feedback.ease,
            },
        )
    }, [errorMessage])

    return (
        <div ref={sectionRef} data-drawer-item className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-zinc-300">Notes</p>
                    <p className="mt-1 text-sm text-zinc-500">Draft locally and save intentionally.</p>
                </div>
                <span
                    ref={notesStatusRef}
                    className={`inline-flex min-h-8 min-w-24 items-center justify-center gap-2 rounded-full px-3 text-xs ${
                        saveState === 'saving'
                            ? 'bg-white/8 text-zinc-200'
                            : saveState === 'saved'
                              ? 'bg-emerald-500/12 text-emerald-200'
                              : 'bg-transparent text-zinc-500'
                    }`}
                >
                    {saveState === 'saving' && <LoaderCircle size={12} className="animate-spin" />}
                    {saveState === 'saved' && <Check size={12} />}
                    {saveState === 'saving' ? 'Saving' : saveState === 'saved' ? 'Saved' : null}
                </span>
            </div>

            <textarea
                rows={7}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            />

            <div className="mt-4 flex items-center justify-between gap-3">
                <p ref={errorRef} className="text-sm text-rose-300">{errorMessage}</p>
                <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={!hasChanges || saveState === 'saving'}
                    className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Save Notes
                </button>
            </div>
        </div>
    )
}

/**
 * Client details drawer.
 */
function ClientDrawer({
    selectedClientId,
    summary,
    details,
    isDetailLoading,
    detailError,
    isOpen,
    onRequestClose,
    onClosed,
    onRetryDetails,
    onSaveProfile,
    onSaveStatus,
    onSaveNotes,
}: ClientDrawerProps) {
    const overlayRef = useRef<HTMLDivElement | null>(null)
    const panelRef = useRef<HTMLElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const stateRef = useRef<HTMLDivElement | null>(null)
    const hasOpenedRef = useRef(false)

    useEffect(() => {
        if (!selectedClientId || !isOpen) {
            return
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onRequestClose()
            }
        }

        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [isOpen, onRequestClose, selectedClientId])

    useLayoutEffect(() => {
        if (!overlayRef.current || !panelRef.current) {
            return
        }

        const reduceMotion = prefersReducedMotion()
        const context = gsap.context(() => {
            if (reduceMotion) {
                if (!isOpen && hasOpenedRef.current) {
                    onClosed()
                }
                return
            }

            if (isOpen) {
                hasOpenedRef.current = true

                gsap.set(overlayRef.current, { autoAlpha: 0 })
                gsap.set(panelRef.current, {
                    x: motionTokens.drawerShell.panelDistance,
                    autoAlpha: 1,
                    scale: 0.985,
                    transformOrigin: 'right center',
                })

                const timeline = gsap.timeline()
                timeline.to(overlayRef.current, {
                    autoAlpha: 1,
                    duration: motionTokens.drawerShell.overlayOpenDuration,
                    ease: 'sine.out',
                })
                timeline.to(
                    panelRef.current,
                    {
                        x: 0,
                        scale: 1,
                        duration: motionTokens.drawerShell.openDuration,
                        ease: motionTokens.drawerShell.openEase,
                    },
                    0,
                )
                return
            }

            if (hasOpenedRef.current) {
                const timeline = gsap.timeline({
                    onComplete: onClosed,
                })
                timeline.to(
                    panelRef.current,
                    {
                        x: motionTokens.drawerShell.panelDistance * 0.65,
                        scale: 0.992,
                        duration: motionTokens.drawerShell.closeDuration,
                        ease: motionTokens.drawerShell.closeEase,
                    },
                    0,
                )
                timeline.to(
                    overlayRef.current,
                    {
                        autoAlpha: 0,
                        duration: motionTokens.drawerShell.overlayCloseDuration,
                        ease: 'sine.inOut',
                    },
                    0.03,
                )
            }
        })

        return () => context.revert()
    }, [isOpen, onClosed])

    useLayoutEffect(() => {
        if (!isOpen || !contentRef.current || prefersReducedMotion()) {
            return
        }

        const context = gsap.context(() => {
            // Animate drawer content only.
            if (stateRef.current) {
                gsap.fromTo(
                    stateRef.current,
                    { autoAlpha: 0.72, y: motionTokens.asyncState.distance },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: motionTokens.asyncState.duration,
                        ease: motionTokens.asyncState.ease,
                        clearProps: 'transform',
                    },
                )
            }

            gsap.fromTo(
                '[data-drawer-item]',
                { y: motionTokens.drawerContent.distance, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: motionTokens.drawerContent.duration,
                    ease: motionTokens.drawerContent.ease,
                    clearProps: 'transform',
                },
            )
        }, contentRef)

        return () => context.revert()
    }, [detailError, isDetailLoading, isOpen, selectedClientId])

    if (!selectedClientId || !summary) {
        return null
    }

    return (
        <div ref={overlayRef} className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-sm">
            <button
                type="button"
                aria-label="Close client drawer"
                className="flex-1 cursor-default"
                onClick={onRequestClose}
            />

            <aside ref={panelRef} className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/40">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Client Details</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight">{summary.company}</h3>
                        <p className="mt-1 text-sm text-zinc-400">Load and edit client details on demand.</p>
                    </div>

                    <button
                        type="button"
                        onClick={onRequestClose}
                        className="rounded-2xl border border-white/10 bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div ref={contentRef} className="mt-6 flex-1 overflow-y-auto pr-1">
                    {isDetailLoading ? (
                        <div ref={stateRef} data-drawer-state className="min-h-[20rem] space-y-4">
                            {[0, 1, 2, 3].map((row) => (
                                <div key={row} data-drawer-item className="animate-pulse space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <div className="h-4 w-24 rounded-full bg-white/10" />
                                    <div className="h-11 w-full rounded-2xl bg-white/5" />
                                </div>
                            ))}
                        </div>
                    ) : detailError ? (
                        <div ref={stateRef} data-drawer-state data-drawer-item className="min-h-[20rem] rounded-3xl border border-rose-500/20 bg-rose-500/10 p-5">
                            <p className="text-sm font-medium text-rose-200">{detailError}</p>
                            <button
                                type="button"
                                onClick={onRetryDetails}
                                className="mt-4 rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/5 hover:text-white"
                            >
                                Retry
                            </button>
                        </div>
                    ) : details ? (
                        <div ref={stateRef} data-drawer-state className="min-h-[20rem] space-y-5">
                            <ProfileEditor
                                key={`profile-${selectedClientId ?? 'empty'}`}
                                initialProfile={{
                                    company: summary.company,
                                    contact: summary.contact,
                                    email: summary.email,
                                    phone: details.phone,
                                }}
                                onSave={onSaveProfile}
                            />

                            <div data-drawer-item className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-zinc-500">Last Touch</p>
                                    <p className="mt-1 text-sm text-white">{summary.lastTouch}</p>
                                </div>
                            </div>

                            <StatusEditor
                                key={`status-${selectedClientId ?? 'empty'}`}
                                initialStatus={details.status}
                                onSave={onSaveStatus}
                            />

                            <NotesEditor
                                key={`notes-${selectedClientId ?? 'empty'}`}
                                initialNotes={details.notes}
                                onSave={onSaveNotes}
                            />
                        </div>
                    ) : null}
                </div>
            </aside>
        </div>
    )
}

export default ClientDrawer

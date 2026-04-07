import usePageReveal from '../hooks/usePageReveal'

/**
 * Placeholder page for app settings and legacy tools.
 */
function Settings() {
    const pageRef = usePageReveal()

    return (
        <div ref={pageRef} className="space-y-6">
            <div data-page-section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Settings</h3>
                <p className="mt-2 text-sm text-zinc-400">
                    Place jQuery legacy widget here.
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                    Mock example: static settings.
                </p>
            </div>
        </div>
    )
}

export default Settings

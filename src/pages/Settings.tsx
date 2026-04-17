import LegacyJQueryWidget from '../components/LegacyJQueryWidget'
import usePageReveal from '../hooks/usePageReveal'

/**
 * Settings page with the jQuery demo.
 */
function Settings() {
    const pageRef = usePageReveal()

    return (
        <div ref={pageRef} className="space-y-6">
            <div data-page-section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Settings</h3>
                <p className="mt-2 text-sm text-zinc-400">
                    A small isolated jQuery widget that simulates a legacy tag manager inside the React app.
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                    Mock example: older CRM modules sometimes still manage small admin widgets directly through the DOM.
                </p>

                <LegacyJQueryWidget />
            </div>
        </div>
    )
}

export default Settings

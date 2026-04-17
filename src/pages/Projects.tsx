import usePageReveal from '../hooks/usePageReveal'

/**
 * Placeholder projects page.
 */
function Projects() {
    const pageRef = usePageReveal()

    return (
        <div ref={pageRef} className="space-y-6">
            <div data-page-section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Projects</h3>
                <p className="mt-2 text-sm text-zinc-400">
                    This page will contain project cards, progress bars, and deadlines.
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                    Mock example: project data is not connected yet.
                </p>
            </div>
        </div>
    )
}

export default Projects

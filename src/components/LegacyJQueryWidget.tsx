import { useEffect, useRef } from 'react'
import $ from 'jquery'

const initialTags = [
    'priority',
    'enterprise',
    'needs follow-up',
    'legacy import',
]

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')

/**
 * Isolated jQuery Tag Manager kept away from React-managed DOM.
 */
function LegacyJQueryWidget() {
    const widgetRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const root = $(widgetRef.current)
        let tags = [...initialTags]

        const renderTag = (tag: string, index: number) => `
            <div data-tag-index="${index}" class="group flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/70 px-3 py-2">
                <button
                    type="button"
                    data-edit-tag
                    class="max-w-48 truncate text-sm text-zinc-200 transition group-hover:text-white"
                    title="Click to edit"
                >
                    ${escapeHtml(tag)}
                </button>
                <button
                    type="button"
                    data-remove-tag
                    aria-label="Remove ${escapeHtml(tag)} tag"
                    class="rounded-full border border-white/10 px-2 text-xs text-zinc-500 transition hover:border-rose-400/40 hover:text-rose-200"
                >
                    x
                </button>
            </div>
        `

        const render = () => {
            root.html(`
                <div class="space-y-4">
                    <div>
                        <p class="text-sm uppercase tracking-[0.2em] text-zinc-500">Legacy jQuery Widget</p>
                        <h4 class="mt-2 text-xl font-semibold text-white">Tag Manager</h4>
                        <p class="mt-2 text-sm text-zinc-400">
                            DOM updates in this box are handled by jQuery to simulate an isolated legacy admin tool.
                        </p>
                    </div>

                    <form data-tag-form class="flex flex-col gap-3 md:flex-row">
                        <input
                            data-tag-input
                            type="text"
                            placeholder="Add a client tag"
                            class="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                        />
                        <button
                            type="submit"
                            class="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-zinc-950 transition hover:scale-[1.02]"
                        >
                            Add Tag
                        </button>
                    </form>

                    <div data-tag-list class="flex flex-wrap gap-3">
                        ${tags.map((tag, index) => renderTag(tag, index)).join('')}
                    </div>

                    <div data-tag-empty class="${tags.length === 0 ? '' : 'hidden'} rounded-2xl border border-dashed border-white/10 p-5 text-sm text-zinc-500">
                        No tags yet. Add one above.
                    </div>

                    <p data-tag-status class="text-sm text-zinc-500">${tags.length} active tags</p>
                </div>
            `)
        }

        const updateStatus = () => {
            root.find('[data-tag-status]').text(`${tags.length} active tags`)
            root.find('[data-tag-empty]').toggleClass('hidden', tags.length > 0)
        }

        const renderTags = () => {
            root.find('[data-tag-list]').html(tags.map((tag, index) => renderTag(tag, index)).join(''))
            updateStatus()
        }

        render()

        root.on('submit', '[data-tag-form]', function (event) {
            event.preventDefault()

            const input = root.find('[data-tag-input]')
            const nextTag = String(input.val() ?? '').trim()

            if (!nextTag) {
                return
            }

            tags = [...tags, nextTag]
            input.val('')
            renderTags()
        })

        root.on('click', '[data-remove-tag]', function () {
            const index = Number($(this).closest('[data-tag-index]').data('tagIndex'))
            tags = tags.filter((_, tagIndex) => tagIndex !== index)
            renderTags()
        })

        root.on('click', '[data-edit-tag]', function () {
            const tagRoot = $(this).closest('[data-tag-index]')
            const index = Number(tagRoot.data('tagIndex'))
            const currentTag = tags[index] ?? ''

            tagRoot.html(`
                <input
                    data-edit-input
                    type="text"
                    value="${escapeHtml(currentTag)}"
                    class="w-44 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none"
                />
                <button type="button" data-save-edit class="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-zinc-950">
                    Save
                </button>
            `)
            tagRoot.find('[data-edit-input]').first().focus()
        })

        root.on('click', '[data-save-edit]', function () {
            const tagRoot = $(this).closest('[data-tag-index]')
            const index = Number(tagRoot.data('tagIndex'))
            const editedTag = String(tagRoot.find('[data-edit-input]').val() ?? '').trim()

            if (!editedTag) {
                return
            }

            tags = tags.map((tag, tagIndex) => (tagIndex === index ? editedTag : tag))
            renderTags()
        })

        return () => {
            root.off().empty()
        }
    }, [])

    return (
        <div
            ref={widgetRef}
            className="mt-6 rounded-3xl border border-white/10 bg-zinc-900/50 p-4"
            aria-label="Legacy jQuery tag manager widget"
        />
    )
}

export default LegacyJQueryWidget

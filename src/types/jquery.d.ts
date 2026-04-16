declare module 'jquery' {
    type JQueryElement = {
        addClass: (className: string) => JQueryElement
        append: (content: string | JQueryElement) => JQueryElement
        attr: (name: string, value?: string) => string | JQueryElement
        css: (property: string | Record<string, string | number>, value?: string | number) => JQueryElement
        data: (name: string) => unknown
        empty: () => JQueryElement
        focus: () => JQueryElement
        find: (selector: string) => JQueryElement
        first: () => JQueryElement
        html: (content?: string) => string | JQueryElement
        on: (eventName: string, selector: string, handler: (this: HTMLElement, event: Event) => void) => JQueryElement
        off: () => JQueryElement
        closest: (selector: string) => JQueryElement
        removeClass: (className: string) => JQueryElement
        stop: (clearQueue?: boolean, jumpToEnd?: boolean) => JQueryElement
        text: (content?: string) => string | JQueryElement
        toggleClass: (className: string, state?: boolean) => JQueryElement
        val: (value?: string) => string | number | string[] | JQueryElement | undefined
    }

    type JQueryFactory = (selector: string | HTMLElement | null) => JQueryElement

    const jquery: JQueryFactory
    export default jquery
}

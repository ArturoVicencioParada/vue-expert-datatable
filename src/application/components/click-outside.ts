import type { Directive, DirectiveBinding } from 'vue'

interface ClickOutsideElement extends HTMLElement {
    __vueClickOutside__?: (e: MouseEvent) => void
}

const directive: Directive = {
    mounted(el: ClickOutsideElement, binding: DirectiveBinding) {
        // Provided expression must evaluate to a function.
        if (typeof binding.value !== 'function') {
            const compName = binding.instance?.$options.name
            let warn = '[Vue-click-outside:] provided value is not a function, but has to be'
            if (compName) {
                warn += `Found in component '${compName}'`
            }
            console.warn(warn)
        }

        // Define Handler and cache it on the element
        const bubble = binding.modifiers.bubble
        const handler = (e: MouseEvent) => {
            if (bubble || (!el.contains(e.target as Node) && el !== e.target)) {
                binding.value(e)
            }
        }

        el.__vueClickOutside__ = handler
        // add Event Listeners
        document.addEventListener('mousedown', handler)
    },

    unmounted(el: ClickOutsideElement) {
        // Remove Event Listeners
        if (el.__vueClickOutside__) {
            document.removeEventListener('mousedown', el.__vueClickOutside__)
            el.__vueClickOutside__ = undefined
        }
    }
}

export default directive

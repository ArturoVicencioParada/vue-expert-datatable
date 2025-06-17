import { App } from 'vue'
import type Configuration from './application/interface/configuration'
import VueExpertDatatable from './vue-expert-datatable.vue'
import ClickOutside from './application/components/click-outside'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrash, faTrashAlt, faPlus, faSave, faPen, faPenAlt } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan, faTrashAlt as faTrashRegular, faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Validator from './application/utils/validator'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

// Declare module augmentation for Vue 3
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $expert_datatable_config: Configuration
    }
}

// Add icons to library
library.add(faEdit, faTrash, faTrashAlt, faPlus, faTrashCan, faTrashRegular, faPlusSquare, faSave, faPen, faPenAlt)

export function VueExpertDatatablePlugin(app: App, options: Configuration | undefined = undefined): void {
    if (!options) {
        options = {
            lang: 'EN',
            theme: 'vue-expert-datatable'
        }
    } else {
        if (!options.lang) {
            options.lang = 'EN'
        }
        if (!options.theme) {
            options.theme = 'vue-expert-datatable'
        }
    }

    // Set configuration
    app.config.globalProperties.$expert_datatable_config = options
    
    // Initialize validator
    Validator(options.lang)

    // Register components
    app.component('VueExpertDatatable', VueExpertDatatable)
    app.component('FontAwesomeIcon', FontAwesomeIcon)
    // app.component('ValidationProvider', ValidationProvider)
    // app.component('ValidationObserver', ValidationObserver)

    // Register directives
    app.directive('click-outside', ClickOutside)

    // Use plugins
    app.use(
        VueTippy,
        {
            directive: 'tooltip', // => v-tooltip
            component: 'tooltip', // => <tippy/>
        }
    )
}

export default VueExpertDatatablePlugin

import { defineRule, configure } from 'vee-validate'
import { required, email, numeric, length, min, max, between, integer } from '@vee-validate/rules'
import Language from '../interface/language'
import enEN from '../language/en-EN'
import esEs from '../language/es-ES'
import { localize } from '@vee-validate/i18n'

export default function (lang: 'ES' | 'EN'): void {
    let loadedLang: Language | undefined = undefined
    if (lang === 'EN') {
        loadedLang = enEN
    } else if (lang === 'ES') {
        loadedLang = esEs
    } else {
        loadedLang = enEN
    }

    configure({
        validateOnBlur: true,
        validateOnChange: true,
        validateOnInput: false,
        validateOnModelUpdate: true,
    })

    defineRule('email', email)
    defineRule('required', required)
    defineRule('numeric', numeric)
    defineRule('integer', integer)
    defineRule('length', length)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('min_value', min)
    defineRule('max_value', max)
    defineRule('between', between)
    defineRule('url', (value: string) => validate_url(value))

    if (loadedLang) {
        configure({
            generateMessage: localize(lang.toLowerCase(), {
                messages: {
                    email: loadedLang.rule_email,
                    required: loadedLang.rule_required,
                    numeric: loadedLang.rule_numeric,
                    integer: loadedLang.rule_integer,
                    length: loadedLang.rule_length,
                    min: loadedLang.rule_min,
                    max: loadedLang.rule_max,
                    min_value: loadedLang.rule_min_value,
                    max_value: loadedLang.rule_max_value,
                    between: loadedLang.rule_between,
                    url: loadedLang.rule_url
                }
            })
        })
    }

    const validate_url = (value: string): boolean => {
        const validate = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
        return validate
    }
}

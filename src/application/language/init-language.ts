import Language from '../interface/language';
import enEN from './en-EN'
import esEs from './es-ES'

const prepareText = (text: string, table_name: string) => {
    return text.replace('{table_name}', table_name)
}

export default (language: string, table_name: string) : Language => {
    let lang: Language = Object.assign({}, enEN)
    if (language === 'ES') {
        lang = Object.assign({}, esEs)
    }
    if (language === 'EN') {
        lang = Object.assign({}, enEN)
    }
    let aProperty: string;
    for (aProperty in lang) {
        lang[aProperty as keyof Language] = prepareText(lang[aProperty as keyof Language], table_name)
    }
    return lang as Language
}

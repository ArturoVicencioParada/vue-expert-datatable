import Language from '../interface/language';

const language: Language = {
    add_button_text: 'Agregar {table_name}',
    save_button_text: 'Guardar {table_name}',
    edit_button_text: 'Editar {table_name}',
    delete_button_text: 'Eliminar {table_name}',
    input_placeholder: 'Ingrese {pronoun} {title}',
    rule_required: 'El campo {_field_} es requerido',
    rule_email: 'Ingrese un e-mail válido',
    rule_numeric: 'El campo {_field_} debe ser un número',
    rule_integer: 'El campo {_field_} debe ser un número entero',
    rule_length: '{_field_} debe tener {length} caracteres',
    rule_min: '{_field_} debe tener mínimo {length} caracteres',
    rule_max: '{_field_} debe tener máximo {length} caracteres',
    rule_min_value: '{_field_} debe tener un valor mínimo de {min}',
    rule_max_value: '{_field_} debe tener un valor máximo de {max}',
    rule_url: 'El campo {_field_} es debe ser un URL',
    rule_between: 'El campo {_field_} debe estar entre {min} y {max}',
    fill_required_fields: 'Complete los campos requeridos'
}

export default language

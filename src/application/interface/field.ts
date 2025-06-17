import { ZodTypeAny } from 'zod';

export interface FieldData {
    placeholder?: string;
    thousandSeparator?: '.' | ','; // for autonumeric,
    decimalSeparator?: ',' | '.'; // for autonumeric,
    useDollarSign?: boolean;
    decimals?: number;
    min?: number;
    showEditingIcon?: boolean;
    currencySymbolPlacement?: 'p' | 's';
    date_format?: string;
}

export interface SelectData<T> {
    items?: Array<T>;
    itemText?: string;
    itemValue?: string;
    allowClear?: boolean;
    allowSearch?: boolean;
}

export interface BindData<T = BaseEntity> {
    custom_row: (row: T, index: number) => T;
    custom_header: (field: Field<T>) => T;
    custom_field: (row: T, field: Field<T>, index: number) => T;
    custom_add_field: (field: Field<T>) => T;
    custom_header_row: (field: Field<T>) => T;
    custom_header_footer: (field: Field<T>) => T;
}

export interface SelectOption<T = string | number> {
    value: T;
    label: string;
}

export interface SelectOptionGroup<T = string | number> {
    label: string;
    options: SelectOption<T>[];
}

export interface BaseEntity {
    [key: string]: unknown;
}

export type FieldType =
    | 'text'
    | 'longtext'
    | 'number'
    | 'autonumeric'
    | 'select'
    | 'range'
    | 'checkbox'
    | 'switch'
    | 'date'
    | 'datetime'
    | 'time'
    | 'week'
    | 'month'
    | 'year'
    | 'autocomplete'
    | 'custom'
    | undefined;
export interface Field<T = BaseEntity> {
    align?: 'left' | 'center' | 'right';
    colSpan?: number;
    key: string;
    filterIcon?: string;
    sortable?: boolean;
    title: string;
    width?: string | number;
    visible?: boolean;
    fieldType?: FieldType;
    fieldData?: FieldData;
    fieldAlwaysVisible?: boolean;
    editable?: boolean;
    pronoun?: string;
    rules?: ZodTypeAny
    selectData?: SelectData<SelectOption>;
    bind_data?: BindData<T>;
    default_value?: unknown;
    name?: string;
    size?: number;
}
export default Field;

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

export interface SelectData<T extends Record<string, unknown>> {
	items?: Array<T>;
	itemText?: string;
	itemValue?: string;
	allowClear?: boolean;
	allowSearch?: boolean;
}

export interface BindData<T extends Record<string, unknown>> {
	custom_row: (row: T, index: number) => T;
	custom_header: (field: Field<T>) => T;
	custom_field: (row: T, field: Field<T>, index: number) => T;
	custom_add_field: (field: Field<T>) => T;
	custom_header_row: (field: Field<T>) => T;
	custom_header_footer: (field: Field<T>) => T;
}

export type FieldType = 'text' | 'longtext' | 'number' | 'autonumeric' | 'select' | 'range' | 'checkbox' | 'switch' | 'date' | 'datetime' | 'time' | 'week' | 'month' | 'year' | 'autocomplete' | 'custom' | undefined
export interface Field<T extends Record<string, unknown> = Record<string, unknown>> {
    align?: 'left' | 'center' | 'right',
    colSpan?: number,
    key: string,
    filterIcon?: string,
    sortable?: boolean,
    title: string,
    width?: string | number,
    visible?: boolean,
    fieldType?: FieldType,
	fieldData?: FieldData,
	fieldAlwaysVisible?: boolean,
    editable?: boolean,
    pronoun?: string,
	rules?: string | ((field: Field<T>, item: T | undefined, index: number | string | undefined) => string)
	selectData?: SelectData<T>,
	bind_data?: BindData<T>
	default_value?: unknown;
    name?: string;
}
export default Field;


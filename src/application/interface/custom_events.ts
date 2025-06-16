import Field from './field';

export default interface CustomEvents<T = Record<string, unknown>> {
	before_save?: (row: T, index: number | undefined, field?: Field) => Promise<boolean> | boolean;
	before_edit?: (row: T, index: number | undefined, field?: Field) => Promise<boolean> | boolean;
	before_add?: (row: T, index: number | undefined, field?: Field) => Promise<boolean> | boolean;
	after_save?: (row: T, index: number | undefined, field?: Field) => Promise<boolean> | boolean;
	after_edit?: (row: T, index: number | undefined, field?: Field) => Promise<boolean> | boolean;
	after_add?: (row: T, index: number | undefined, field?: Field) => Promise<boolean> | boolean;
}

import Field, { BaseEntity } from './field';

export default interface CustomEvents<T = BaseEntity> {
	before_save?: (row: T, index: number | undefined, field?: Field<T>) => Promise<boolean> | boolean;
	before_edit?: (row: T, index: number | undefined, field?: Field<T>) => Promise<boolean> | boolean;
	before_add?: (row: T, index: number | undefined, field?: Field<T>) => Promise<boolean> | boolean;
	after_save?: (row: T, index: number | undefined, field?: Field<T>) => Promise<boolean> | boolean;
	after_edit?: (row: T, index: number | undefined, field?: Field<T>) => Promise<boolean> | boolean;
	after_add?: (row: T, index: number | undefined, field?: Field<T>) => Promise<boolean> | boolean;
}

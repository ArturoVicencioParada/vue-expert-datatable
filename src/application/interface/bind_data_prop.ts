export default interface BindDataProp<T = object> {
	top_header?: object;
	header?: object;
	header_row?: object;
	footer_row?: object;
	add_row?: object;
	row?: (row: T, index: number) => T;
	bottom_footer?: object;
}

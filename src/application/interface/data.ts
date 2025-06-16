import { AxiosInstance } from 'axios';
import Field, { BaseEntity } from './field';
import Language from './language';
import Method from './method';


export default interface Data<T = BaseEntity> {
    base_url_testing: string;
    add_method?: Method;
    update_method?: Method;
    get_method?: Method;
    delete_method?: Method;
    http_client: AxiosInstance | undefined
    current_item: T,
    drawer: boolean,
    modal_delete: boolean,
    loading_data: boolean,
    loading_add_update: boolean,
    loading_delete: boolean,
    table_data: T[],
    selected_row: T,
    selected_row_before: T,
    selected_index?: number,
    selected_field?: Field,
    item_record: T,
    item_record_before: T,
    item_record_default: T,
    current_language: Language | undefined,
	is_canceling: boolean,
	show_editing_icon: boolean,
	initialized: boolean
}

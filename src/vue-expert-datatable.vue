<template>
    <div class="vue-expert-datatable" :class="global_class">
        <div
            v-if="initialized"
            v-click-outside="event_blur"
            class="expert-datatable"
            :class="table_class"
            cellspacing="0"
            rowspacing="0"
        >
            <div
                class="expert-row expert-datatable-header"
                v-bind="bindData && bindData.header ? bindData.header : {}"
            >
                <div
                    v-for="field in final_fields.filter((x) => x.visible === true)"
                    :key="`field_${table_identifier}_${field.key}`"
                    v-bind="
                        field.bind_data && field.bind_data.custom_header ? field.bind_data.custom_header(field) : {}
                    "
                    class="expert-datatable-header-column"
                    :style="{ flex: field.size }"
                >
                    <slot :name="'header.' + field.key" :header="field">
                        <span>{{ field.title }}</span>
                    </slot>
                </div>
            </div>
            <div
                v-if="$slots['header_row'] || hasScopedSlotStartsWith('header_row.')"
                class="expert-row header-row"
                v-bind="bindData && bindData.header_row ? bindData.header_row : {}"
            >
                <slot name="header_row">
                    <div
                        v-for="field in final_fields.filter((x) => x.visible === true)"
                        :key="`header_row_column_${table_identifier}_${field.key}`"
                        v-bind="
                            field.bind_data && field.bind_data.custom_header_row
                                ? field.bind_data.custom_header_row(field)
                                : {}
                        "
                        class="expert-column"
                        :class="expert_column_class(field)"
                        :style="{ flex: field.size }"
                    >
                        <slot :name="`header_row.${field.key}`" :field="field"> &nbsp; </slot>
                    </div>
                </slot>
            </div>
            <template v-for="(row, index) in table_data" :key="`record_${table_identifier}_${index}`">
                <div
                    class="expert-row"
                    :class="{
                        selected: selected_index === index,
                    }"
                    v-bind="bindData && bindData.row ? bindData.row(row as ItemGenericType, index) : {}"
                >
                    <div
                        v-for="field in final_fields.filter((x) => x.visible === true)"
                        :key="`record_${index}_${table_identifier}_${field.key}`"
                        class="expert-column"
                        :class="{
                            selectable: field.fieldType !== undefined
                                && is_editable(field, row as ItemGenericType),
                            selected: is_selected_item(index, field)
                                && is_editable(field, row as ItemGenericType),
                        }"
                        :style="{ flex: field.size }"
                    >
                        <VeeForm
                            :ref="'form_edit_item_' + index + '_' + field.key"
                            v-slot="{ errors, handleSubmit }"
                        >
                            <div
                                :class="expert_column_class(field, errors, index)"
                                v-bind="
                                    field.bind_data && field.bind_data.custom_field
                                        ? field.bind_data.custom_field(row as ItemGenericType, field, index)
                                        : {}
                                "
                            >
                                <div
                                    v-if="field.key !== 'actions'"
                                    :ref="`item_${index}_${field.key}`"
                                    :key="`expert_item_${index}_${table_identifier}_${field.key}`"
                                    class="expert-item"
                                    :class="{
                                        selectable: field.fieldType !== undefined
                                            && is_editable(field, row as ItemGenericType),
                                        selected: is_selected_item(index, field)
                                            && is_editable(field, row as ItemGenericType),
                                    }"
                                >
                                    <div
                                        v-show="
                                            (
                                                !is_selected_item(index, field)
                                                || !is_editable(field, row as ItemGenericType)
                                            ) &&
                                                !field.fieldAlwaysVisible
                                        "
                                        class="expert-row-item"
                                    >
                                        <slot
                                            :name="'item.' + field.key"
                                            :events="event_listener_item(row as ItemGenericType, index, field)"
                                            :select-row="event_select_row(row as ItemGenericType, index, field)"
                                            :deselect-row="deSelectRow"
                                            :item="row"
                                            :value="row[field.key as keyof ItemGenericType]"
                                            :header="field"
                                            :selected="is_selected_item(index, field)"
                                            :selected_row="selected_index === index"
                                            :adding="false"
                                            :index="index"
                                            :show="
                                                (
                                                    !is_selected_item(index, field)
                                                    || !is_editable(field, row as ItemGenericType)
                                                ) &&
                                                    !field.fieldAlwaysVisible
                                            "
                                            :errors="errors"
                                            :validate="handleSubmit"
                                        >
                                            <item-text
                                                :key="`item_text_${index}_${table_identifier}_${field.key}`"
                                                :field="field"
                                                :item="(row as ItemGenericType)"
                                                v-on="event_listener_item(row as ItemGenericType, index, field)"
                                            />
                                        </slot>
                                    </div>
                                    <slot
                                        v-if="
                                            (is_selected_item(index, field) || field.fieldAlwaysVisible) &&
                                                is_editable(field, row as ItemGenericType)
                                        "
                                        :name="'edit.' + field.key"
                                        :events="event_listeners_input(row as ItemGenericType, index, field)"
                                        :select-row="event_select_row(row as ItemGenericType, index, field)"
                                        :deselect-row="deSelectRow"
                                        :key_down="event_key_down"
                                        :item="row"
                                        :value="row[field.key as keyof ItemGenericType]"
                                        :header="field"
                                        :selected="
                                            selected_index === index &&
                                                field.key === selected_field?.key &&
                                                selected_field
                                        "
                                        :selected_row="selected_index === index"
                                        :adding="false"
                                        :index="index"
                                        :errors="errors"
                                        :validate="handleSubmit"
                                    >
                                        <template
                                            v-if="field.fieldType 
                                                && is_editable(field, row as ItemGenericType)"
                                        >
                                            <VeeField
                                                :name="field.key"
                                                :rules="prepareRules(field, row as ItemGenericType, index)"
                                            >
                                                <item-field
                                                    :ref="`item_field`"
                                                    :key="`item_field_${index}_${table_identifier}_${field.key}`"
                                                    v-model="row[field.key as keyof ItemGenericType]"
                                                    :field="(field)"
                                                    :table-name="tableName"
                                                    :is-adding="false"
                                                    :index="index"
                                                    :config="global_config"
                                                    @blur="event_blur"
                                                    @keydown="event_key_down"
                                                    @move-to-other-field="moveToOtherField"
                                                    v-on="event_listener_item(row as ItemGenericType, index, field)"
                                                />
                                                <ErrorMessage :name="field.key" />
                                            </VeeField>
                                        </template>
                                        <template v-else>
                                            <item-text
                                                :key="`item_text_${index}_${table_identifier}_${field.key}`"
                                                :field="field"
                                                :item="(row as ItemGenericType)"
                                            />
                                        </template>
                                    </slot>
                                </div>

                                <div v-else>
                                    <slot
                                        v-if="$slots['actions.' + row[keyName as keyof ItemGenericType]]"
                                        :name="'actions.' + row[keyName as keyof ItemGenericType]"
                                        :item="row"
                                        :header="field"
                                        :adding="false"
                                        :index="index"
                                    >
                                        <slot
                                            name="before_actions_buttons"
                                            :item="row"
                                            :header="field"
                                            :adding="false"
                                            :index="index"
                                        />
                                        <button
                                            v-if="showEditButton && is_editable(field, row as ItemGenericType)"
                                            v-tooltip="current_language?.edit_button_text"
                                            type="button"
                                            class="expert-datatable-action-button"
                                            @click="modalEditItem(item_record as ItemGenericType, index)"
                                        >
                                            <font-awesome-icon icon="edit" />
                                        </button>
                                        <button
                                            v-if="showDeleteButton && can_delete(field, row as ItemGenericType)"
                                            v-tooltip="current_language?.delete_button_text"
                                            type="button"
                                            class="expert-datatable-action-button"
                                            @click="
                                                modalDeleteItem(row[field.key as keyof ItemGenericType] as ItemGenericType, index)
                                            "
                                        >
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                        <slot
                                            name="after_actions_buttons"
                                            :item="row"
                                            :header="field"
                                            :adding="false"
                                            :index="index"
                                        />
                                    </slot>
                                    <slot
                                        v-else
                                        name="actions"
                                        :item="row"
                                        :header="field"
                                        :adding="false"
                                        :index="index"
                                        :edit_events="event_listeners_edit_button(row as ItemGenericType, index)"
                                        :delete_events="
                                            event_listeners_delete_button(row as ItemGenericType, index)
                                        "
                                    >
                                        <slot
                                            name="before_actions_buttons"
                                            :item="row"
                                            :header="field"
                                            :adding="false"
                                            :index="index"
                                        />
                                        <button
                                            v-if="showEditButton && is_editable(field, row as ItemGenericType)"
                                            v-tooltip="current_language?.edit_button_text"
                                            type="button"
                                            class="expert-datatable-action-button"
                                            v-on="event_listeners_edit_button(row as ItemGenericType, index)"
                                        >
                                            <font-awesome-icon icon="edit" />
                                        </button>
                                        <button
                                            v-if="showDeleteButton && can_delete(field, row as ItemGenericType)"
                                            v-tooltip="current_language?.delete_button_text"
                                            type="button"
                                            class="expert-datatable-action-button"
                                            v-on="event_listeners_delete_button(row as ItemGenericType, index)"
                                        >
                                            <font-awesome-icon icon="trash" />
                                        </button>
                                        <slot
                                            name="after_actions_buttons"
                                            :item="row"
                                            :header="field"
                                            :adding="false"
                                            :index="index"
                                        />
                                    </slot>
                                </div>
                            </div>
                        </VeeForm>
                    </div>
                </div>
            </template>
            <div
                v-if="$slots['footer_row'] || hasScopedSlotStartsWith('footer_row.')"
                class="expert-row footer-row"
                v-bind="bindData && bindData.footer_row ? bindData.footer_row : {}"
            >
                <slot name="footer_row">
                    <div
                        v-for="field in final_fields.filter((x) => x.visible === true)"
                        :key="`footer_row_column_${table_identifier}_${field.key}`"
                        slim
                        v-bind="
                            field.bind_data && field.bind_data.custom_header_footer
                                ? field.bind_data.custom_header_footer(field)
                                : {}
                        "
                        class="expert-column"
                        :class="expert_column_class(field)"
                        :style="{ flex: field.size }"
                    >
                        <slot :name="`footer_row.${field.key}`" :field="field"> &nbsp; </slot>
                    </div>
                </slot>
            </div>
            <VeeForm
                v-if="allowAdding"
                ref="form_add_item"
                key="tr_add_1"
                v-slot="{ handleSubmit }"
                class="expert-row add-item-row"
                v-bind="bindData && bindData.add_row ? bindData.add_row : {}"
            >
                <VeeField
                    v-for="field in final_fields.filter((x) => x.visible === true)"
                    :key="`record_add_${table_identifier}_${field.key}`"
                    v-slot="{ errors, handleChange }"
                    :name="field.key"
                    :rules="prepareRules(field, item_record as ItemGenericType, 'add')"
                >
                    <div
                        class="expert-column"
                        :class="expert_column_class(field, errors, undefined, true)"
                        v-bind="
                            field.bind_data && field.bind_data.custom_add_field
                                ? field.bind_data.custom_add_field(field)
                                : {}
                        "
                        :style="{ flex: field.size }"
                    >
                        <div
                            v-if="field.key !== 'actions'"
                            :ref="`item_add_${field.key}`"
                            :key="`expert_item_add_${table_identifier}_${field.key}`"
                            class="expert-item"
                        >
                            <slot
                                v-if="$slots['add.' + field.key]"
                                :name="'add.' + field.key"
                                :events="event_listeners_input(undefined, undefined, field)"
                                :select-row="event_select_row(undefined, undefined, field)"
                                :deselect-row="deSelectRow"
                                :key_down="event_key_down"
                                :item="item_record"
                                :value="item_record[field.key]"
                                :header="field"
                                :selected="undefined"
                                :selected_row="undefined"
                                :adding="true"
                                :errors="errors"
                                :validate="handleSubmit"
                                :index="'adding'"
                            >
                                <item-field
                                    v-if="field.editable"
                                    :ref="`item_field_add_${table_identifier}_${field.key}`"
                                    :key="`item_field_add_${table_identifier}_${field.key}`"
                                    :field="(field)"
                                    :table-name="tableName"
                                    :model-value="item_record[field.key]"
                                    :is-adding="true"
                                    :index="'add'"
                                    :config="global_config"
                                    @update:model-value="handleChange"
                                    v-on="event_listeners_input(undefined, undefined, field)"
                                    @move-to-other-field="moveToOtherField"
                                />
                                <ErrorMessage :name="field.key" />
                            </slot>
                            <slot
                                v-else
                                :name="'edit.' + field.key"
                                :events="event_listeners_input(undefined, undefined, field)"
                                :select-row="event_select_row(undefined, undefined, field)"
                                :deselect-row="deSelectRow"
                                :key_down="event_key_down"
                                :item="item_record"
                                :value="item_record[field.key]"
                                :header="field"
                                :selected="undefined"
                                :selected_row="undefined"
                                :adding="true"
                                :errors="errors"
                                :validate="handleSubmit"
                                :index="'adding'"
                            >
                                <item-field
                                    v-if="field.editable"
                                    :ref="`item_field_add_${table_identifier}_${field.key}`"
                                    :key="`item_field_add_${table_identifier}_${field.key}`"
                                    :field="(field)"
                                    :table-name="tableName"
                                    :model-value="item_record[field.key]"
                                    :is-adding="true"
                                    :index="'add'"
                                    :config="global_config"
                                    @update:model-value="handleChange"
                                    v-on="event_listeners_input(undefined, undefined, field)"
                                    @move-to-other-field="moveToOtherField"
                                />
                                <ErrorMessage :name="field.key" />
                            </slot>
                        </div>
                        <span v-else>
                            <slot
                                name="add_buttons"
                                :item="(item_record as ItemGenericType)"
                                :header="field"
                                :index="undefined"
                                :events="event_listeners_add_button"
                            >
                                <button
                                    v-tooltip="current_language?.add_button_text"
                                    type="button"
                                    class="expert-datatable-action-button"
                                    v-on="event_listeners_add_button()"
                                >
                                    <font-awesome-icon icon="save" />
                                </button>
                            </slot>
                        </span>
                    </div>
                </VeeField>
            </VeeForm>
        </div>
    </div>
</template>

<script setup lang="ts" generic="ItemGenericType = BaseEntity">
import { ref, computed, watch, nextTick, onMounted, getCurrentInstance, useSlots, Ref, useTemplateRef } from 'vue';
import axios from 'axios';
import type { BaseEntity, Field } from './application/interface/field';
import MethodInterface from './application/interface/method';
import AlertInterface from './application/interface/alert';
import CustomEvents from './application/interface/custom_events';
import BindDataProp from './application/interface/bind_data_prop';
import ItemField from './application/components/item-field/item-field.vue';
import initLanguage from './application/language/init-language';
import ItemText from './application/components/item-text/item_text.vue';
import Exception from './application/utils/exception';
import clone from 'just-clone';
import dayjs from 'dayjs';
import Language from './application/interface/language';
import Configuration from './application/interface/configuration';
import { HttpClient } from './application/interface/http_client_interface';
import { Form as VeeForm, Field as VeeField, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

interface ExpertDatatableProps<T = BaseEntity> {
    tableName: string;
    fields: Array<Field<T>>;
    data?: Array<T>;
    restApiUrl?: string;
    addMethod?: MethodInterface;
    updateMethod?: MethodInterface;
    getMethod?: MethodInterface;
    deleteMethod?: MethodInterface;
    itemName?: string;
    keyName?: string;
    httpClient?: HttpClient;
    httpHeaders?: Record<string, string>;
    item: T;
    disableAutoCrud?: boolean;
    lang?: string | null;
    size?: 'small' | 'normal' | 'large';
    transformData?: (data: T) => T;
    bordered?: boolean;
    saveOnBlur?: boolean;
    showAlerts?: boolean;
    useEditModal?: boolean;
    useDeleteModal?: boolean;
    allowAdding?: boolean;
    addButtonIcon?: string;
    showEditButton?: boolean;
    showDeleteButton?: boolean;
    showEditingIcon?: boolean;
    hideActionsField?: boolean;
    customEvents?: CustomEvents<T>;
    bindData?: BindDataProp<ItemGenericType>;
    logging?: boolean;
}

const props = withDefaults(defineProps<ExpertDatatableProps<ItemGenericType>>(), {
    data: () => [],
    restApiUrl: undefined,
    addMethod: undefined,
    updateMethod: undefined,
    getMethod: undefined,
    deleteMethod: undefined,
    itemName: 'item',
    keyName: 'id',
    httpClient: undefined,
    httpHeaders: () => ({
        'Content-Type': 'application/json',
    }),
    disableAutoCrud: true,
    lang: null,
    size: 'normal',
    transformData: (data: ItemGenericType) => data,
    bordered: true,
    saveOnBlur: true,
    showAlerts: true,
    useEditModal: true,
    useDeleteModal: true,
    allowAdding: true,
    addButtonIcon: '',
    showEditButton: true,
    showDeleteButton: true,
    showEditingIcon: undefined,
    hideActionsField: false,
    customEvents: () => ({}),
    bindData: () => ({}),
    logging: false,
});

// Emits definition
const emit = defineEmits([
    'update:item',
    'updated-data',
    'load-data',
    'error',
    'alert',
    'edit-item',
    'delete-item',
    'inserted-item',
    'added-item',
    'updated-item',
    'change-item-add',
]);

const slots = useSlots();

// const base_url_testing = ref('http://localhost:1337/');
const get_method = ref<MethodInterface | undefined>(undefined);
const add_method = ref<MethodInterface | undefined>(undefined);
const update_method = ref<MethodInterface | undefined>(undefined);
const delete_method = ref<MethodInterface | undefined>(undefined);
const http_client = ref<HttpClient | undefined>(undefined);
const current_item = ref<ItemGenericType | undefined>(undefined);
// const drawer = ref(false);
// const modal_delete = ref(false);
const loading_data = ref(false);
// const loading_add_update = ref(false);
// const loading_delete = ref(false);
const table_data = ref<ItemGenericType[]>([]) as Ref<ItemGenericType[]>;
const selected_row = ref<ItemGenericType | undefined>(undefined);
const selected_row_before = ref<ItemGenericType | undefined>(undefined);
const selected_index = ref<number | undefined>(undefined);
const selected_field = ref<Field<ItemGenericType> | undefined>(undefined);
const item_record = ref<ItemGenericType | undefined>(undefined);
const item_record_before = ref<ItemGenericType | undefined>(undefined);
const item_record_default = ref<ItemGenericType | undefined>(undefined);
const current_language = ref<Language | undefined>(undefined);
const is_canceling = ref(false);
const show_editing_icon = ref(true);
const initialized = ref(false);

// Computed properties
const final_fields = computed<Array<Field<ItemGenericType>>>(() => {
    const fields: Array<Field<ItemGenericType>> = [];
    for (let index = 0; index < props.fields.length; index++) {
        const field = props.fields[index];
        field.align = field.align ? field.align : 'center';
        field.colSpan = field.colSpan ? field.colSpan : 1;
        field.filterIcon = field.filterIcon ? field.filterIcon : 'fas fa-arrow';
        field.sortable = field.sortable !== undefined && field.sortable !== null ? field.sortable : true;
        field.width = field.width !== undefined && field.width !== null ? field.width : 'auto';
        field.visible = field.visible !== undefined && field.visible !== null ? field.visible : true;
        field.editable = field.editable !== undefined && field.editable !== null ? field.editable : true;
        field.fieldType = field.fieldType ? field.fieldType : undefined;
        field.fieldData = field.fieldData ? field.fieldData : undefined;
        field.fieldAlwaysVisible
            = field.fieldAlwaysVisible !== undefined && field.fieldAlwaysVisible !== null
                ? field.fieldAlwaysVisible
                : true;
        field.size = field.size ? field.size : 1;
        fields.push(field);
    }

    const exists_actions_field = props.fields.find((x) => x.key === 'actions');
    if (exists_actions_field === undefined && !props.hideActionsField) {
        const actions_field: Field<ItemGenericType> = {
            align: 'center',
            colSpan: 1,
            filterIcon: undefined,
            sortable: false,
            width: 'auto',
            title: 'Actions',
            key: 'actions',
            visible: true,
            fieldAlwaysVisible: true,
        };
        fields.push(actions_field);
    }
    return fields;
});

const table_class = computed(() => {
    const classes: string[] = [];
    classes.push('expert-datatable-' + props.size);
    if (props.bordered) {
        classes.push('bordered');
    }
    return classes;
});

const global_config = computed<Configuration>(() => {
    const instance = getCurrentInstance();
    const expert_datatable_config = instance?.appContext.config.globalProperties.$expert_datatable_config;
    if (expert_datatable_config) {
        return expert_datatable_config;
    }
    return {
        lang: 'EN',
        theme: 'vue-expert-datatable',
    };
});

const global_class = computed(() => {
    const classes: string[] = [];
    classes.push(global_config.value?.theme || '');
    return classes;
});

const isWithApi = computed(() => {
    if (props.restApiUrl) {
        return true;
    }
    return false;
});

const adding_row_selected = computed((): boolean => {
    return selected_field.value?.key !== undefined && selected_index.value === undefined;
});

const table_identifier = computed(() => {
    if (props.tableName) {
        return props.tableName.toLowerCase().replaceAll(' ', '_');
    }
    return 'table';
});

// Watchers
watch(
    () => props.item,
    (newVal) => {
        current_item.value = cloneObject(newVal);
    },
    { deep: true }
);

watch(
    () => current_item.value,
    (newVal) => {
        emit('update:item', newVal);
    },
    { deep: true }
);

watch(
    () => props.data,
    (newval) => {
        table_data.value = newval;
    },
    { deep: true }
);

watch(
    () => item_record.value,
    (_newVal, oldVal) => {
        emit('change-item-add', item_record.value, Object.assign({}, oldVal));
    },
    { deep: true }
);

// Methods
const initComponent = () => {
    if (isWithApi.value) {
        initHttpClient();
        initMethods();
    }
};

const initMethods = (): void => {
    if (props.restApiUrl) {
        get_method.value = {
            url: cleanUrl(props.restApiUrl),
            type: 'GET',
        };
        add_method.value = {
            url: cleanUrl(props.restApiUrl),
            type: 'POST',
        };
        update_method.value = {
            url: cleanUrl(props.restApiUrl),
            type: 'PUT',
        };
        delete_method.value = {
            url: cleanUrl(props.restApiUrl),
            type: 'DELETE',
        };
    } else {
        get_method.value = props.getMethod;
        add_method.value = props.addMethod;
        update_method.value = props.updateMethod;
        delete_method.value = props.deleteMethod;
    }
};

const initHttpClient = (): void => {
    if (props.httpClient) {
        http_client.value = props.httpClient;
    } else {
        http_client.value = axios.create({
            headers: props.httpHeaders,
        });
    }
};

const initData = (): void => {
    if (props.logging) console.info('Init table', props.tableName);
    if (props.lang) {
        current_language.value = initLanguage(props.lang, props.tableName);
    } else {
        current_language.value = initLanguage(global_config.value?.lang || 'EN', props.tableName);
    }
    if (global_config.value?.params?.showEditingIcon !== undefined) {
        show_editing_icon.value = global_config.value?.params.showEditingIcon;
    }
    if (props.showEditingIcon !== undefined) {
        show_editing_icon.value = props.showEditingIcon;
    }
    for (let index = 0; index < props.fields.length; index++) {
        const item_field = props.fields[index];
        const default_value = item_field.default_value !== undefined ? item_field.default_value : '';
        item_record.value = {};
        item_record_default.value = {};
        item_record.value[item_field.key] = default_value;
        item_record_default.value[item_field.key] = default_value;
    }
};

const cleanUrl = (url: string): string => {
    const final_url = url.replace(/\/$/, '');
    return final_url;
};

const getTableData = () => {
    if (isWithApi.value) {
        if (get_method.value) {
            loading_data.value = true;
            const http_method = getHttpByMethod<ItemGenericType[]>(get_method.value);
            if (http_method) {
                http_method
                    .then((result) => {
                        table_data.value = result.data;
                        emit('updated-data', table_data.value);
                    })
                    .catch((error) => {
                        emit('error', error);
                    });
            }
        } else {
            console.error('you haven\'t provided a GET method');
        }
    } else {
        table_data.value = props.data;
        emit('load-data');
    }
};

const saveTableData = async (is_adding = false) => {
    return new Promise((resolve) => {
        try {
            if (is_canceling.value) {
                return resolve(undefined);
            }
            const formName = is_adding
                ? 'form_add_item'
                : `form_edit_item_${selected_index.value}_${selected_field.value?.key}`;
            if (props.logging) console.info('formName', formName);
            let form = ref<unknown>(formName);
            if (form.value) {
                const validate = true;
                if (props.logging) console.info('validate', validate);
                if (validate) {
                    if (is_adding) {
                        if (isWithApi.value) {
                            if (add_method.value) {
                                loading_data.value = true;
                                const item_record_copy = clone(item_record.value);
                                if (props.customEvents.before_add && selected_field.value?.key) {
                                    Promise.resolve(
                                        props.customEvents.before_add(
                                            item_record_copy,
                                            selected_index.value,
                                            selected_field.value
                                        )
                                    ).then((cont) => {
                                        if (!cont) {
                                            return false;
                                        }
                                        if (props.customEvents.before_save && selected_field.value?.key) {
                                            return Promise.resolve(
                                                props.customEvents.before_save(
                                                    item_record_copy,
                                                    selected_index.value,
                                                    selected_field.value
                                                )
                                            );
                                        }
                                        return true;
                                    }).then((cont) => {
                                        if (!cont) {
                                            return false;
                                        }
                                        const http_method = getHttpByMethod<ItemGenericType>(
                                            add_method.value || {
                                                url: '/',
                                                type: 'POST',
                                            },
                                            item_record_copy
                                        );
                                        if (http_method) {
                                            http_method.then((response) => {
                                                if (
                                                    response.data['update_table' as keyof ItemGenericType]
                                                    || response.data[props.itemName as keyof ItemGenericType] === undefined
                                                ) {
                                                    getTableData();
                                                } else {
                                                    const item = response.data;
                                                    table_data.value.push(item);
                                                    emit('updated-data', table_data.value);
                                                    emit('inserted-item', item);
                                                }
                                                if (props.customEvents.after_add && selected_field.value?.key) {
                                                    return Promise.resolve(
                                                        props.customEvents.after_add(
                                                            item_record_copy,
                                                            selected_index.value,
                                                            selected_field.value
                                                        )
                                                    );
                                                }
                                                return true;
                                            }).then((cont) => {
                                                if (!cont) {
                                                    return false;
                                                }
                                                if (props.customEvents.after_save && selected_field.value?.key) {
                                                    return Promise.resolve(
                                                        props.customEvents.after_save(
                                                            item_record_copy,
                                                            selected_index.value,
                                                            selected_field.value
                                                        )
                                                    );
                                                }
                                                return true;
                                            }).then((cont) => {
                                                if (!cont) {
                                                    return false;
                                                }
                                                copyObject(item_record.value, item_record_default.value);
                                                copyObject(item_record_before.value, item_record_default.value);
                                                deSelectRow().then(() => {
                                                    resolve(item_record_copy);
                                                });
                                            }).catch((error) => {
                                                copyObject(item_record.value, item_record_default.value);
                                                emit('error', error);
                                                throw new Exception(error.message, 1);
                                            });
                                        }
                                    }).catch((error) => {
                                        throw new Exception(error.message, error.code);
                                    });
                                }
                            } else {
                                throw new Exception('you haven\'t provided an add method');
                            }
                        } else {
                            const item_record_copy = clone(item_record.value);
                            if (props.customEvents.before_add) {
                                Promise.resolve(
                                    props.customEvents.before_add(
                                        item_record_copy,
                                        selected_index.value,
                                        selected_field.value
                                    )
                                ).then((cont) => {
                                    if (!cont) {
                                        return false;
                                    }
                                    if (props.customEvents.before_save) {
                                        return Promise.resolve(
                                            props.customEvents.before_save(
                                                item_record_copy,
                                                selected_index.value,
                                                selected_field.value
                                            )
                                        );
                                    }
                                    return true;
                                }).then((cont) => {
                                    if (!cont) {
                                        return false;
                                    }
                                    table_data.value.push(item_record_copy);
                                    copyObject(item_record.value, item_record_default.value);
                                    copyObject(item_record_before.value, item_record_default.value);
                                    nextTick(() => {
                                        if (props.customEvents.after_add) {
                                            return Promise.resolve(
                                                props.customEvents.after_add(
                                                    item_record_copy,
                                                    selected_index.value,
                                                    selected_field.value
                                                )
                                            );
                                        }
                                        return true;
                                    }).then((cont) => {
                                        if (!cont) {
                                            return false;
                                        }
                                        if (props.customEvents.after_save) {
                                            return Promise.resolve(
                                                props.customEvents.after_save(
                                                    item_record_copy,
                                                    selected_index.value,
                                                    selected_field.value
                                                )
                                            );
                                        }
                                        return true;
                                    }).then((cont) => {
                                        if (!cont) {
                                            return false;
                                        }
                                        emit('updated-data', table_data.value);
                                        emit('added-item', item_record_copy);
                                        deSelectRow().then(() => {
                                            resolve(item_record.value);
                                        });
                                    });
                                }).catch((error) => {
                                    throw new Exception(error.message, error.code);
                                });
                            }
                        }
                    } else {
                        if (isWithApi.value) {
                            if (update_method.value) {
                                loading_data.value = true;
                                const selected_row_copy = clone(selected_row.value);
                                if (props.customEvents.before_edit) {
                                    Promise.resolve(
                                        props.customEvents.before_edit(
                                            selected_row_copy,
                                            selected_index.value,
                                            selected_field.value
                                        )
                                    ).then((cont) => {
                                        if (!cont) {
                                            return false;
                                        }
                                        if (props.customEvents.before_save) {
                                            return Promise.resolve(
                                                props.customEvents.before_save(
                                                    selected_row_copy,
                                                    selected_index.value,
                                                    selected_field.value
                                                )
                                            );
                                        }
                                        return true;
                                    }).then((cont) => {
                                        if (!cont) {
                                            return false;
                                        }
                                        const http_method = getHttpByMethod<ItemGenericType>(
                                            update_method.value || {
                                                url: '/',
                                                type: 'PUT',
                                            },
                                            selected_row_copy
                                        );
                                        if (http_method) {
                                            http_method.then((response) => {
                                                if (
                                                    response.data['update_table' as keyof ItemGenericType]
                                                    || response.data[props.itemName as keyof ItemGenericType] === undefined
                                                ) {
                                                    getTableData();
                                                } else {
                                                    emit('updated-data', table_data.value);
                                                }
                                                if (props.customEvents.after_edit) {
                                                    return Promise.resolve(
                                                        props.customEvents.after_edit(
                                                            selected_row_copy,
                                                            selected_index.value,
                                                            selected_field.value
                                                        )
                                                    );
                                                }
                                                if (props.customEvents.after_save) {
                                                    return Promise.resolve(
                                                        props.customEvents.after_save(
                                                            selected_row_copy,
                                                            selected_index.value,
                                                            selected_field.value
                                                        )
                                                    );
                                                }
                                                emit('updated-item', response.data[props.itemName as keyof ItemGenericType]);
                                                selected_row_before.value = cloneObject(item_record_default.value);
                                                deSelectRow().then(() => {
                                                    resolve(response.data[props.itemName as keyof ItemGenericType]);
                                                });
                                            }).catch((error) => {
                                                throw new Exception(error.message, 1);
                                            });
                                        }
                                    }).catch((error) => {
                                        throw new Exception(error.message, error.code);
                                    });
                                }
                            } else {
                                throw new Exception('you haven\'t provided an update method');
                            }
                        } else {
                            if (props.logging) console.info('EDIT', clone(selected_row.value));
                            const selected_row_copy = clone(selected_row.value);
                            if (props.customEvents.before_edit) {
                                Promise.resolve(
                                    props.customEvents.before_edit(
                                        selected_row_copy,
                                        selected_index.value,
                                        selected_field.value
                                    )
                                ).then((cont) => {
                                    if (!cont) {
                                        return false;
                                    }
                                    if (props.customEvents.before_save) {
                                        return Promise.resolve(
                                            props.customEvents.before_save(
                                                selected_row_copy,
                                                selected_index.value,
                                                selected_field.value
                                            )
                                        );
                                    }
                                    return true;
                                }).then((cont) => {
                                    if (!cont) {
                                        return false;
                                    }
                                    emit('updated-data', table_data.value);
                                    emit('updated-item', selected_row_copy);

                                    selected_row_before.value = cloneObject(selected_row.value);

                                    if (props.customEvents.after_edit) {
                                        return Promise.resolve(
                                            props.customEvents.after_edit(
                                                selected_row_copy,
                                                selected_index.value,
                                                selected_field.value
                                            )
                                        );
                                    }
                                    return true;
                                }).then((cont) => {
                                    if (!cont) {
                                        return false;
                                    }
                                    if (props.customEvents.after_save) {
                                        return Promise.resolve(
                                            props.customEvents.after_save(
                                                selected_row_copy,
                                                selected_index.value,
                                                selected_field.value
                                            )
                                        );
                                    }
                                    return true;
                                }).then((cont) => {
                                    if (!cont) {
                                        return false;
                                    }
                                    deSelectRow().then(() => {
                                        resolve(selected_row_copy);
                                    });
                                }).catch((error) => {
                                    throw new Exception(error.message, error.code);
                                });
                            }
                        }
                    }
                } else {
                    let error_message = current_language.value?.fill_required_fields || '';
                    if (props.logging) console.info('is_adding', is_adding);
                    if (!is_adding) {
                        cancel_editing();
                    }
                    throw new Exception(error_message, 10);
                }
            }
        } catch (error) {
            if (error instanceof Exception) {
                if (props.logging) console.info('ERROR', error.message, error.stack);
                showAlert({
                    type: 'error',
                    message: error.message,
                    code: error.code,
                });
                if (error.code === undefined) {
                    console.error('Unknown Vue Expert Table Error:', error.message, error.stack);
                }
            }
            cancel_editing();
            resolve(undefined);
        }
    });
};

const modalEditItem = (item_record: ItemGenericType, index: number) => {
    emit('edit-item', item_record, index);
};

const modalDeleteItem = (item_record: ItemGenericType, index: number) => {
    emit('delete-item', item_record, index);
};

function getHttpByMethod<T = ItemGenericType>(
    method: MethodInterface,
    data: ItemGenericType | undefined = undefined
) {
    if (http_client.value) {
        let final_data: ItemGenericType | undefined = data ? props.transformData(data) : undefined;
        if (method.transformData && final_data) {
            final_data = method.transformData(final_data);
        }
        switch (method.type) {
        case 'GET':
            return http_client.value.get<T>(method.url);

        case 'POST':
            return http_client.value.post<T>(method.url, data);

        case 'PUT':
            return http_client.value.put<T>(method.url, data);

        case 'DELETE':
            return http_client.value.delete<T>(method.url);

        default:
            return http_client.value.post<T>(method.url, data);
        }
    }
    return undefined;
};

const selectRow = (
    row: ItemGenericType | undefined,
    index: number | undefined = undefined,
    field: Field<ItemGenericType>
) => {
    // console.log('selectRow', row, index, field);
    if (!row) {
        return;
    }
    nextTick(() => {
        if (field.fieldType !== undefined && is_editable(field, row)) {
            selected_row.value = row;
            selected_index.value = index;
            selected_field.value = field;
            copyItem(row);
            focusSelectedInput(field, index);
        } else {
            deSelectRow();
        }
    });
};

const moveToOtherField = (direction: 'left' | 'right' | 'up' | 'down') => {
    const index = selected_index.value || 0;

    if (direction === 'left' || direction === 'right') {
        const editable_fields = props.fields.filter((field) => field.editable);
        const selected_field_index = editable_fields.findIndex((field) => field.key === selected_field.value?.key);
        if (direction === 'left') {
            if (selected_field_index > 0) {
                // console.log('moveToOtherField left', selected_field_index, editable_fields[selected_field_index - 1]);
                selectRow(selected_row.value, index, editable_fields[selected_field_index - 1]);
            }
        }
        if (direction === 'right') {
            if (selected_field_index < props.fields.length - 1) {
                // console.log('moveToOtherField right', selected_field_index, editable_fields[selected_field_index + 1]);
                selectRow(selected_row.value, index, editable_fields[selected_field_index + 1]);
            }
        }
    }
    if (direction === 'up' || direction === 'down') {
        const editable_rows = table_data.value.filter((row) => selected_field.value && is_editable(selected_field.value, row));
        const selected_row_index = editable_rows
            .findIndex((row) => row[props.keyName as keyof ItemGenericType] === selected_row.value?.[props.keyName as keyof ItemGenericType]);

        if (direction === 'up') {
            if (selected_row_index > 0 && selected_field.value) {
                // console.log('moveToOtherField up', selected_row_index, selected_field.value);
                selectRow(editable_rows[selected_row_index - 1], index - 1, selected_field.value);
            }
        }
        if (direction === 'down' && selected_field.value) {
            const editable_rows = table_data.value.filter((row) => selected_field.value && is_editable(selected_field.value, row));
            if (selected_row_index < table_data.value.length - 1) {
                // console.log('moveToOtherField down', selected_row_index, selected_field.value);
                selectRow(editable_rows[selected_row_index + 1], index + 1, selected_field.value);
            }
        }
    }
};
const copyItem = (item: ItemGenericType | undefined) => {
    if (!item) {
        return;
    }
    if (adding_row_selected.value) {
        item_record_before.value = clone(item_record.value);
    } else {
        if (item) {
            selected_row_before.value = clone(item);
        }
    }
};

const deSelectRow = () => {
    return new Promise((resolve) => {
        nextTick(() => {
            selected_field.value = undefined;
            selected_row.value = undefined;
            selected_index.value = undefined;
            resolve(true);
        });
    });
};
interface ItemFieldRef {
    focus: () => void;
    field: Field<ItemGenericType>;
    index: number;
}
const dynamicRefs = useTemplateRef<ItemFieldRef[]>('item_field');

const focusSelectedInput = (field: Field<ItemGenericType>, index: number | undefined = undefined) => {
    nextTick(() => {
        if (field && (index || index === 0)) {
            if (dynamicRefs) {
                const element = dynamicRefs.value?.find((ref) => ref.field.key === field.key && ref.index === index);
                // console.log('focusSelectedInput test', element, index);
                element?.focus();
            }
        }
    });
};

const is_selected_row = (row: ItemGenericType) => {
    if (selected_row.value !== undefined) {
        return selected_row.value[props.keyName] == row[props.keyName as keyof ItemGenericType];
    } else {
        return false;
    }
};

const cancel_editing = async () => {
    is_canceling.value = true;
    if (adding_row_selected.value) {
        if (props.logging)
            console.info('cancel adding before', {
                selected_row: clone(selected_row.value),
                selected_row_before: clone(selected_row_before.value),
            });

        copyObject(item_record.value, item_record_default.value);
        if (props.logging)
            console.info('cancel adding after', {
                selected_row: clone(selected_row.value),
                selected_row_before: clone(selected_row_before.value),
            });
    } else {
        if (props.logging)
            console.info('cancel editing before', {
                selected_row: selected_row.value,
                selected_row_before: selected_row_before.value,
            });
        copyObject(selected_row.value, selected_row_before.value);
        if (props.logging)
            console.info('cancel editing after', {
                selected_row: clone(selected_row.value),
                selected_row_before: clone(selected_row_before.value),
            });
        await deSelectRow();
    }
};

const event_input = (e: unknown) => {
    if (props.logging) console.info('EVENT INPUT VED', e);
    if (selected_field.value?.key) {
        if (props.logging) console.info('EVENT INPUT VED', e);
        const name = selected_field.value.key;
        const is_adding = selected_index.value === undefined;
        if (name) {
            let inputValue = '';
            inputValue = e as string;
            if (props.logging) console.info('inputValue', inputValue);
            if (selected_row.value && !is_adding) {
                selected_row.value[name] = inputValue;
            } else if (is_adding && item_record.value && adding_row_selected.value) {
                item_record.value[name] = inputValue;
            }
        } else {
            console.error('input does not have name attribute');
        }
    }
};

const event_blur = async () => {
    if (selected_row.value || adding_row_selected.value) {
        if (!adding_row_selected.value && !is_canceling.value) {
            if (props.saveOnBlur) {
                await saveTableData();
            } else {
                cancel_editing();
            }
        }
        await deSelectRow();
    }
    is_canceling.value = false;
};

const event_key_down = (e: KeyboardEvent) => {
    if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter') {
        saveTableData(adding_row_selected.value);
    }
    if (e.keyCode === 27 || e.which === 27 || e.key === 'Escape' || e.key === 'Esc') {
        cancel_editing();
    }
};

const event_focus = (row: ItemGenericType, index: number | undefined = undefined, field: Field<ItemGenericType>) => {
    if (!row && !index) {
        selectRow(row, index, field);
    }
};

const is_selected_item = (index: number | undefined, field: Field<ItemGenericType>) => {
    if (selected_index.value === index && selected_field.value?.key && field.key === selected_field.value?.key) {
        return true;
    }
    return false;
};

const showAlert = (alert: AlertInterface) => {
    if (props.showAlerts) {
        // Implement alert display logic here
    }
    emit('alert', alert);
};

const expert_column_class = (
    field: Field<ItemGenericType>,
    errors: Partial<Record<string, string | undefined>> | string[] | undefined = undefined,
    index: number | undefined = undefined,
    is_adding = false
) => {
    const classes: Record<string, boolean> = {};
    classes[`align-${field.align}`] = true;
    if (is_adding) {
        if (is_selected_item(index, field)) {
            classes['column-selected'] = true;
        }
    } else {
        if (is_selected_item(index, field) && index !== undefined) {
            classes['column-selected'] = true;
        }
    }
    if (errors && Object.keys(errors).length > 0) {
        classes['has-error'] = true;
    }
    return classes;
};

const resetForm = () => {
    // const formName = adding_row_selected.value
    //     ? 'form_add_item'
    //     : `form_edit_item_${selected_index.value}_${selected_field.value?.key}`;
    // let form: any = refs[formName];
    // if (form) {
    //     if (Array.isArray(refs[formName])) {
    //         form = form[0];
    //     }
    //     if (adding_row_selected.value) {
    //         nextTick(() => {
    //             form.reset();
    //         });
    //     } else {
    //         form.reset();
    //     }
    // }
};

const event_listeners_input = (
    row: ItemGenericType | undefined = undefined,
    index: number | undefined = undefined,
    field: Field<ItemGenericType>
) => {
    if (!row) {
        return undefined;
    }
    return {
        onBlur: () => event_blur(),
        onFocus: () => event_focus(row, index, field),
        onInput: (e: unknown) => event_input(e),
        onChange: (e: unknown) => event_input(e),
        onKeydown: (e: KeyboardEvent) => event_key_down(e),
        'onUpdate:modelValue': (value: unknown) => event_input(value),
        deselectRow: () => deSelectRow(),
    };
};

const event_listeners_add_button = () => {
    return {
        click: () => saveTableData(true),
    };
};

const event_listeners_edit_button = (row: ItemGenericType, index: number) => {
    return {
        click: () => modalEditItem(row, index),
    };
};

const event_listeners_delete_button = (row: ItemGenericType, index: number) => {
    return {
        click: () => modalDeleteItem(row, index),
    };
};

const event_listener_item = (row: ItemGenericType, index: number, field: Field<ItemGenericType>) => {
    return {
        click: () => selectRow(row, index, field),
    };
};

const event_select_row = (
    row: ItemGenericType | undefined,
    index: number | undefined = undefined,
    field: Field<ItemGenericType>
) => {
    if (!row) {
        return;
    }
    return {
        click: () => selectRow(row, index, field),
    };
};

const show_editing_icon_validate = (
    _row: ItemGenericType,
    index: number,
    field: Field<ItemGenericType>
): boolean => {
    if (is_selected_item(index, field) && field.editable) {
        if (field.fieldData && field.fieldData.showEditingIcon !== undefined) {
            return field.fieldData.showEditingIcon;
        } else {
            return show_editing_icon.value;
        }
    }
    return false;
};

const hasScopedSlot = (name: string) => {
    const keys = Object.keys(slots);
    return keys.includes(name);
};

const hasScopedSlotStartsWith = (name: string) => {
    const keys = Object.keys(slots);
    return keys.find((x) => x.startsWith(name)) !== undefined;
};

const copyObject = (target: ItemGenericType, source: ItemGenericType): ItemGenericType => {
    const targetCopy: ItemGenericType = Object.assign({}, source);
    if (props.logging) console.info('copy object source', source);
    for (const prop in source) {
        if (typeof target[prop] !== 'undefined') {
            if (Array.isArray(source[prop])) {
                targetCopy[prop as keyof ItemGenericType] = clone(source[prop]);
            } else if (dayjs.isDayjs(source[prop])) {
                targetCopy[prop] = source[prop].clone() as ItemGenericType[Extract<keyof ItemGenericType, string>];
            } else if (typeof source[prop] === 'object' && !!source[prop]) {
                copyObject(targetCopy[prop] as ItemGenericType, source[prop] as ItemGenericType);
            } else {
                targetCopy[prop] = source[prop];
            }
        }
    }
    if (props.logging) console.info('copy object final', targetCopy);
    Object.assign(target as object, targetCopy);
    return clone(target as object) as ItemGenericType;
};

const cloneObject = (source: ItemGenericType): ItemGenericType => {
    return clone(source as object) as ItemGenericType;
};

const formatValue = (val: unknown, field: Field<ItemGenericType>) => {
    if (field.fieldType && field.fieldType === 'autonumeric') {
        if (!val) {
            return 0;
        }
    }
    return val;
};

const cleanForm = async () => {
    copyObject(item_record.value, item_record_before.value);
    copyObject(item_record_before.value, item_record_default.value);
    await deSelectRow();
    resetForm();
};

const is_editable = (field: Field<ItemGenericType>, item: ItemGenericType) => {
    if (item) {
        if (item['ved_can_edit' as keyof ItemGenericType] !== undefined) {
            return item['ved_can_edit' as keyof ItemGenericType];
        }
    }
    if (field.key === 'actions') {
        return true;
    }
    return field.editable || false;
};

const can_delete = (field: Field<ItemGenericType>, item: ItemGenericType) => {
    if (item) {
        if (item['ved_can_delete' as keyof ItemGenericType] !== undefined) {
            return item['ved_can_delete' as keyof ItemGenericType];
        }
    }
    if (field.key === 'actions') {
        return true;
    }
    return field.editable || false;
};

const prepareRules = (
    field: Field<ItemGenericType>,
    _item: ItemGenericType | undefined,
    _index: number | string
): Record<string, unknown> => {
    const schema = toTypedSchema(field.rules || z.any());
    return schema as unknown as Record<string, unknown>;
};

// Lifecycle hooks
onMounted(() => {
    initData();
    initComponent();
    getTableData();
    nextTick(() => {
        initialized.value = true;
    });
});

// Export the component
defineExpose({
    saveTableData,
    modalEditItem,
    modalDeleteItem,
    getHttpByMethod,
    selectRow,
    copyItem,
    deSelectRow,
    focusSelectedInput,
    is_selected_row,
    cancel_editing,
    event_input,
    event_blur,
    event_key_down,
    event_focus,
    is_selected_item,
    showAlert,
    expert_column_class,
    resetForm,
    event_listeners_input,
    event_listeners_add_button,
    event_listeners_edit_button,
    event_listeners_delete_button,
    event_listener_item,
    event_select_row,
    show_editing_icon_validate,
    hasScopedSlot,
    hasScopedSlotStartsWith,
    copyObject,
    cloneObject,
    formatValue,
    cleanForm,
    is_editable,
    can_delete,
    prepareRules,
});
</script>

<style lang="scss">
@use './style.module.scss';
</style>

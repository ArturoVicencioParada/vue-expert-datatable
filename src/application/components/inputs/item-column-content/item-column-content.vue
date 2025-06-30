<template>
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
                :key="`expert_item_${index}_${tableIdentifier}_${field.key}`"
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
                        :selected-row="selectedIndex === index"
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
                            :key="`item_text_${index}_${tableIdentifier}_${field.key}`"
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
                        selectedIndex === index &&
                            field.key === selectedField?.key &&
                            selectedField
                    "
                    :selected-row="selectedIndex === index"
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
                                :key="`item_field_${index}_${tableIdentifier}_${field.key}`"
                                :model-value="row[field.key as keyof ItemGenericType]"
                                :field="field"
                                :table-name="tableName"
                                :is-adding="false"
                                :index="index"
                                :config="global_config"
                                @update:model-value="(value) => $emit('update:itemRecord', { ...row, [field.key]: value })"
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
                            :key="`item_text_${index}_${tableIdentifier}_${field.key}`"
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
                        v-tooltip="currentLanguage?.edit_button_text"
                        type="button"
                        class="expert-datatable-action-button"
                        @click="modalEditItem(itemRecord as ItemGenericType, index)"
                    >
                        <font-awesome-icon icon="edit" />
                    </button>
                    <button
                        v-if="showDeleteButton && can_delete(field, row as ItemGenericType)"
                        v-tooltip="currentLanguage?.delete_button_text"
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
                        v-tooltip="currentLanguage?.edit_button_text"
                        type="button"
                        class="expert-datatable-action-button"
                        v-on="event_listeners_edit_button(row as ItemGenericType, index)"
                    >
                        <font-awesome-icon icon="edit" />
                    </button>
                    <button
                        v-if="showDeleteButton && can_delete(field, row as ItemGenericType)"
                        v-tooltip="currentLanguage?.delete_button_text"
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
</template>

<script setup lang="ts" generic="ItemGenericType = BaseEntity">
import { nextTick, computed, getCurrentInstance, useTemplateRef } from 'vue';
import type { BaseEntity, Field } from '@/application/interface/field';
import { Form as VeeForm, Field as VeeField, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import ItemField from '../../item-field/item-field.vue';
import ItemText from '../../item-text/item_text.vue';
import Language from '@/application/interface/language';
import Configuration from '@/application/interface/configuration';
import clone from 'just-clone';
import dayjs from 'dayjs';
import type AlertInterface from '@/application/interface/alert';

interface ItemColumnContentProps {
    row: ItemGenericType;
    index: number;
    field: Field<ItemGenericType>;
    tableName: string;
    tableIdentifier: string;
    selectedIndex: number | undefined;
    selectedField: Field<ItemGenericType> | undefined;
    itemRecord: ItemGenericType | undefined;
    currentLanguage: Language | undefined;
    keyName: string;
    showEditButton: boolean;
    showDeleteButton: boolean;
    selectedRow: ItemGenericType;
    selectedRowBefore: ItemGenericType;
    itemRecordBefore: ItemGenericType;
    itemRecordDefault: ItemGenericType;
    isCanceling: boolean;
    addingRowSelected: boolean;
    saveOnBlur: boolean;
    logging: boolean;
}

const props = defineProps<ItemColumnContentProps>();

const emit = defineEmits<{
    (e: 'update:itemRecord', value: ItemGenericType): void;
    (e: 'edit-item', item: ItemGenericType, index: number): void;
    (e: 'delete-item', item: ItemGenericType, index: number): void;
    (e: 'alert', alert: AlertInterface): void;
    (e: 'updated-data', data: ItemGenericType[]): void;
    (e: 'updated-item', item: ItemGenericType): void;
    (e: 'move-to-other-field', direction: 'left' | 'right' | 'up' | 'down'): void;
    (e: 'update:selectedRow', value: ItemGenericType | undefined): void;
    (e: 'update:selectedRowBefore', value: ItemGenericType | undefined): void;
    (e: 'update:itemRecordBefore', value: ItemGenericType | undefined): void;
    (e: 'update:isCanceling', value: boolean): void;
}>();

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

// Methods copied from main datatable
const is_selected_item = (index: number | undefined, field: Field<ItemGenericType>) => {
    if (props.selectedIndex === index && props.selectedField?.key && field.key === props.selectedField?.key) {
        return true;
    }
    return false;
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

const selectRow = (
    row: ItemGenericType | undefined,
    _index: number | undefined = undefined,
    field: Field<ItemGenericType>
) => {
    if (!row) {
        return;
    }
    nextTick(() => {
        if (field.fieldType !== undefined && is_editable(field, row)) {
            emit('update:selectedRow', row);
            copyItem(row);
        } else {
            deSelectRow();
        }
    });
};

const copyItem = (item: ItemGenericType | undefined) => {
    if (!item) {
        return;
    }
    if (props.addingRowSelected) {
        if (props.itemRecord) {
            emit('update:itemRecordBefore', clone(props.itemRecord));
        }
    } else {
        if (item) {
            emit('update:selectedRowBefore', clone(item));
        }
    }
};

const deSelectRow = () => {
    return new Promise((resolve) => {
        nextTick(() => {
            resolve(true);
        });
    });
};

const event_input = (e: unknown) => {
    if (props.logging) console.info('EVENT INPUT VED', e);
    if (props.selectedField?.key) {
        const name = props.selectedField.key;
        const is_adding = props.selectedIndex === undefined;
        if (name) {
            let inputValue = '';
            inputValue = e as string;
            if (props.logging) console.info('inputValue', inputValue);
            if (props.selectedRow && !is_adding) {
                const updatedRow = { 
                    ...props.selectedRow, 
                    [name]: inputValue 
                };
                emit('update:selectedRow', updatedRow);
            } else if (is_adding && props.itemRecord && props.addingRowSelected) {
                const updatedItemRecord = { 
                    ...props.itemRecord, 
                    [name]: inputValue 
                };
                emit('update:itemRecord', updatedItemRecord);
            }
        } else {
            console.error('input does not have name attribute');
        }
    }
};

const event_blur = async () => {
    if (props.selectedRow || props.addingRowSelected) {
        if (!props.addingRowSelected && !props.isCanceling) {
            if (props.saveOnBlur) {
                // Note: saveTableData is managed by parent
            } else {
                cancel_editing();
            }
        }
        await deSelectRow();
    }
    emit('update:isCanceling', false);
};

const event_key_down = (e: KeyboardEvent) => {
    if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter') {
        // Note: saveTableData is managed by parent
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

const cancel_editing = async () => {
    emit('update:isCanceling', true);
    if (props.addingRowSelected) {
        if (props.itemRecord && props.itemRecordDefault) {
            copyObject(props.itemRecord, props.itemRecordDefault);
        }
    } else {
        if (props.selectedRow && props.selectedRowBefore) {
            copyObject(props.selectedRow, props.selectedRowBefore);
        }
        await deSelectRow();
    }
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

const moveToOtherField = (direction: 'left' | 'right' | 'up' | 'down') => {
    emit('move-to-other-field', direction);
};

const modalEditItem = (itemRecord: ItemGenericType, index: number) => {
    emit('edit-item', itemRecord, index);
};

const modalDeleteItem = (itemRecord: ItemGenericType, index: number) => {
    emit('delete-item', itemRecord, index);
};

const event_listeners_input = (
    row: ItemGenericType | undefined,
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

const prepareRules = (
    field: Field<ItemGenericType>,
    _item: ItemGenericType | undefined,
    _index: number | string
): Record<string, unknown> => {
    const schema = toTypedSchema(field.rules || z.any());
    return schema as unknown as Record<string, unknown>;
};

const input = useTemplateRef<{ focus: () => void }>('item_field');
const focus = () => {
    console.log('focus item-field-content', input.value);
    if (input) {
        input.value?.focus();
    }
};

defineExpose({
    focus,
    field: props.field,
    index: props.index
})
</script>

<style lang="scss" scoped>

</style>

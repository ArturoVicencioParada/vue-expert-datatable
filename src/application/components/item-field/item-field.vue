<template>
    <div :key="`div_item_field_${index}_${field.key}`" class="expert-item-field">
        <expert-datatable-input
            v-if="field.fieldType === 'text' || field.fieldType === 'longtext'"
            :ref="'input_' + field.key"
            v-model="(localValue as string | number)"
            :placeholder="inputPlaceholder(field)"
            :field="field"
            :input-name="field.key"
            :input-key="`item_field_input_${index}_${field.key}`"
            @blur="eventBlur"
            @focus="eventFocus"
            @keydown="eventKeyDown"
        ></expert-datatable-input>
        <a-input-number
            v-if="field.fieldType === 'number' || field.fieldType === 'autonumeric'"
            :ref="'input_' + field.key"
            v-model="localValue"
            :placeholder="inputPlaceholder(field)"
            :field="field"
            :input-name="field.key"
            :input-key="`item_field_input_${index}_${field.key}`"
            @blur="eventBlur"
            @focus="eventFocus"
            @keydown="eventKeyDown"
        ></a-input-number>
        <expert-datatable-autonumeric
            v-if="field.fieldType === 'autonumeric'"
            :ref="'input_' + field.key"
            v-model="(localValue as string | number)"
            :placeholder="inputPlaceholder(field)"
            :field="field"
            :input-name="field.key"
            :input-key="`item_field_input_${index}_${field.key}`"
            @blur="eventBlur"
            @focus="eventFocus"
            @keydown="eventKeyDown"
        ></expert-datatable-autonumeric>
        <expert-datatable-select
            v-if="field.fieldType === 'select' || field.fieldType === 'autocomplete'"
            :ref="'input_' + field.key"
            v-model="(localValue as string | number)"
            :placeholder="inputPlaceholder(field)"
            :field="field"
            :input-name="field.key"
            :input-key="`item_field_input_${index}_${field.key}`"
            @blur="eventBlur"
            @focus="eventFocus"
            @keydown="eventKeyDown"
            @deselect-row="deselectRow"
        ></expert-datatable-select>
        <div
            v-if="field.fieldType === 'custom'"
            :ref="'input_' + field.key"
            :field="field"
            :inputName="field.key"
            :input-key="`item_field_input_${index}_${field.key}`"
            @blur="eventBlur"
            @focus="eventFocus"
            @keydown="eventKeyDown"
        ></div>
        <date-picker
            v-if="
                field.fieldType === 'date' ||
                    field.fieldType === 'datetime' ||
                    field.fieldType === 'time' ||
                    field.fieldType === 'week' ||
                    field.fieldType === 'month' ||
                    field.fieldType === 'year'
            "
            v-model="(localValue as string | number | Date | null)"
            :field="field"
            :placeholder="inputPlaceholder(field)"
            @change="handleChange"
            @focus="eventFocus"
            @blur="eventBlur"
        />
    </div>
</template>

<script setup lang="ts" generic="ItemGenericType = BaseEntity">
import { ref, watch, onMounted, nextTick, useTemplateRef } from 'vue';
import type { BaseEntity, Field } from '@/application/interface/field';
import enEN from '@/application/language/en-EN';
import initLanguage from '@/application/language/init-language';
import ExpertDatatableInput from '../inputs/input/expert_datatable_input.vue';
import ExpertDatatableAutonumeric from '../inputs/auto-numeric/expert_datatable_auto_numeric.vue';
import ExpertDatatableSelect from '../inputs/select/expert_datatable_select.vue';
import DatePicker from '../inputs/date-picker/date-picker.vue';
import Configuration from '@/application/interface/configuration';
import Language from '@/application/interface/language';

interface ItemFieldProps {
    modelValue: unknown;
    field: Field<ItemGenericType>;
    tableName: string;
    isAdding: boolean;
    index: number | string;
    config: Configuration;
}

const props = defineProps<ItemFieldProps>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: unknown): void;
    (e: 'focus'): void;
    (e: 'blur'): void;
    (e: 'keydown', event: KeyboardEvent): void;
    (e: 'deselect-row'): void;
}>();

// State
const localValue = ref<unknown>(props.modelValue);
const language = ref<Language>(enEN);

// Methods
const inputPlaceholder = (field: Field<ItemGenericType>): string => {
    let text = language.value.input_placeholder.replace(' {pronoun} ', field.pronoun ? ` ${field.pronoun} ` : ' ');
    text = text.replace('{title}', field.title.toLowerCase());
    return text;
};

const handleSubmit = (e: Event) => {
    e.preventDefault();
    eventBlur();
};

const eventFocus = () => {
    emit('focus');
};

const eventBlur = () => {
    nextTick(() => {
        console.log('event blur field');
        emit('blur');
    });
};

const eventKeyDown = (e: KeyboardEvent) => {
    emit('keydown', e);
};

const deselectRow = () => {
    emit('deselect-row');
};

const handleChange = (value: unknown) => {
    localValue.value = value;
};

const input = useTemplateRef<{ focus: () => void }>(`input_${props.field.key}`);
const focus = () => {
    console.log('focus item-field', input.value);
    if (input) {
        input.value?.focus();
    }
};

// Watchers
watch(
    () => localValue.value,
    (newValue) => {
        console.log('localValue watcher', newValue);
        emit('update:modelValue', newValue);
    }
);

watch(
    () => props.modelValue,
    (newValue) => {
        console.log('modelValue watcher', newValue);
        localValue.value = newValue;
    }
);

// Lifecycle hooks
onMounted(() => {
    language.value = initLanguage(props.config.lang, props.tableName);
});

defineExpose({
    focus
})
</script>

<style lang="scss">
    .mx-datepicker {
        width: 100%;

        .mx-input {
            background-color: transparent;
            border: none;
            box-shadow: none;
        }
    }
</style>

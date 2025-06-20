<template>
    <div class="expert-datatable-input-wrapper">
        <input
            :key="inputKey"
            ref="inputRef"
            v-model="localValue"
            class="expert-datatable-input datatable-field"
            :placeholder="placeholder"
            :name="field.key"
            :type="htmlType"
            @blur="handleBlur"
            @focus="handleFocus"
            @keydown="handleKeyDown"
        />
    </div>
</template>

<script setup lang="ts" generic="ItemGenericType = BaseEntity">
import { ref, watch } from 'vue'
import Field, { BaseEntity } from '@/application/interface/field'
import { nextTick } from 'process';
const inputRef = ref(null);

interface Props {
    field: Field<ItemGenericType>
    modelValue: string | number
    placeholder?: string
    htmlType?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file' | 'hidden' | 'submit'
    inputKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    htmlType: 'text',
    inputKey: 'key'
})
const localValue = ref(props.modelValue);

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
    (e: 'focus', event: FocusEvent): void
    (e: 'blur', event: FocusEvent): void
    (e: 'keydown', event: KeyboardEvent): void
}>()

const focused = ref(false)

watch(
    () => localValue.value,
    (newValue) => {
        emit('update:modelValue', newValue);
    }
);

watch(
    () => props.modelValue,
    (newValue) => {
        localValue.value = newValue;
    }
);

const handleFocus = (e: FocusEvent) => {
    focused.value = true
    emit('focus', e)
}

const handleBlur = (e: FocusEvent) => {
    focused.value = false
    emit('blur', e)
}

const handleKeyDown = (e: KeyboardEvent) => {
    emit('keydown', e)
}

const focus = () => {
    const input = inputRef.value as unknown as HTMLInputElement;
    if (input) {
        input.focus();
        nextTick(() => {
            input.setSelectionRange(input.value.length, input.value.length);
        });
    }
}

defineExpose({
    focus
})
</script>

<style lang="scss">
.expert-datatable-input-wrapper {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	color: rgba(0, 0, 0, .65);
	font-variant: tabular-nums;
	line-height: 1.5;
	list-style: none;
	font-feature-settings: "tnum";
	position: relative;
	display: inline-block;
	width: 100%;
	text-align: start;

	.expert-datatable-input {
		width: 100%;
		padding: 0;
		background-color: transparent;
		color: rgba(0, 0, 0, 0.65);
		outline: none!important;
		border: none;
	}
}
</style>

<template>
    <div class="expert-datatable-input-wrapper">
        <input
            :key="inputKey"
            class="expert-datatable-input datatable-field"
            :placeholder="placeholder"
            :value="modelValue"
            :name="field.key"
            :type="htmlType"
            @input="handleInput"
            @blur="handleBlur"
            @focus="handleFocus"
            @keydown="handleKeyDown"
        />
    </div>
</template>

<script setup lang="ts" generic="ItemGenericType extends Record<string, unknown>">
import { ref } from 'vue'
import Field from '@/application/interface/field'

interface Props {
    field: Field<ItemGenericType>
    modelValue: string | number
    placeholder?: string
    htmlType?: 'button' | 'submit'
    inputKey?: string
}

withDefaults(defineProps<Props>(), {
    placeholder: '',
    htmlType: 'button',
    inputKey: 'key'
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'focus', event: FocusEvent): void
    (e: 'blur', event: FocusEvent): void
    (e: 'keydown', event: KeyboardEvent): void
}>()

const focused = ref(false)

const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    emit('update:modelValue', target ? target.value : '')
}

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

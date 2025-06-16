<template>
    <div class="expert-datatable-input-wrapper">
        <input
            class="expert-datatable-input datatable-field"
            :placeholder="placeholder"
            :value="modelValue"
            :name="field.value"
            :key="inputKey"
            ref="inputRef"
            @input="handleInput"
            @blur="handleBlur"
            @focus="handleFocus"
            @keydown="handleKeyDown"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Field from '@/application/interface/field'

interface Props {
    field: Field
    modelValue: string | number
    placeholder?: string
    decimals?: number
    inputKey?: string
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    decimals: 0,
    inputKey: 'key'
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: number | ''): void
    (e: 'focus', event: FocusEvent): void
    (e: 'blur', event: FocusEvent): void
    (e: 'keydown', event: KeyboardEvent): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const focused = ref(false)
const oldValue = ref('')
const oldSelectionStart = ref<number | null>(null)
const oldSelectionEnd = ref<number | null>(null)

// Create regex pattern based on decimals
const getNumberPattern = (decimals: number): RegExp => {
    if (decimals === 0) {
        return /^-?\d*$/
    }
    return new RegExp(`^-?\\d*[.,]?\\d{0,${decimals}}$`)
}

// Validate input value
const validateInput = (value: string): boolean => {
    const pattern = getNumberPattern(props.decimals)
    return pattern.test(value)
}

// Handle input changes
const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    const value = target.value

    if (validateInput(value)) {
        oldValue.value = value
        oldSelectionStart.value = target.selectionStart
        oldSelectionEnd.value = target.selectionEnd

        // Emit parsed number or empty string
        const parsedValue = value ? parseFloat(value) : ''
        emit('update:modelValue', parsedValue)
    } else if (oldValue.value !== undefined) {
        // Restore old value if invalid
        target.value = oldValue.value
        if (oldSelectionStart.value !== null && oldSelectionEnd.value !== null) {
            target.setSelectionRange(oldSelectionStart.value, oldSelectionEnd.value)
        }
    } else {
        target.value = ''
    }
}

// Handle focus event
const handleFocus = (e: FocusEvent) => {
    focused.value = true
    emit('focus', e)
}

// Handle blur event
const handleBlur = (e: FocusEvent) => {
    focused.value = false
    emit('blur', e)
}

// Handle keydown event
const handleKeyDown = (e: KeyboardEvent) => {
    emit('keydown', e)
}

// Setup input validation on mount
onMounted(() => {
    if (inputRef.value) {
        const events = [
            'input',
            'keydown',
            'keyup',
            'mousedown',
            'mouseup',
            'select',
            'contextmenu',
            'drop'
        ]

        events.forEach(event => {
            inputRef.value?.addEventListener(event, (e: Event) => {
                const target = e.target as HTMLInputElement
                if (!validateInput(target.value)) {
                    e.preventDefault()
                    if (oldValue.value !== undefined) {
                        target.value = oldValue.value
                        if (oldSelectionStart.value !== null && oldSelectionEnd.value !== null) {
                            target.setSelectionRange(oldSelectionStart.value, oldSelectionEnd.value)
                        }
                    } else {
                        target.value = ''
                    }
                }
            })
        })
    }
})

// Watch for model value changes
watch(() => props.modelValue, (newValue) => {
    if (inputRef.value && typeof newValue === 'number') {
        inputRef.value.value = newValue.toString()
    }
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

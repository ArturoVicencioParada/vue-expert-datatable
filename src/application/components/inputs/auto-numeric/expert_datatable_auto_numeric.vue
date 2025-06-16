<template>
    <div
        class="w-100 expert-datatable-input-wrapper"
        :class="clases_input"
        v-bind="$attrs"
    >
        <input
            ref="inputRef"
            type="text"
            class="expert-datatable-input datatable-field"
            :name="field.key"
            :value="formattedValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readOnly"
            autocomplete="off"
            @input="handleInput"
            @focus="focus"
            @blur="handleBlur"
            @keydown="keyDown"
        />
    </div>
</template>

<script setup lang="ts" generic="ItemGenericType extends Record<string, unknown>">
import { ref, computed, watch, onMounted } from 'vue'
import Field from '@/application/interface/field'

interface Props {
    field: Field<ItemGenericType>
    modelValue: string | number
    placeholder?: string
    readOnly?: boolean
    disabled?: boolean
    inputKey?: string
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    readOnly: false,
    disabled: false,
    inputKey: 'key'
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
    (e: 'change', value: number): void
    (e: 'focus'): void
    (e: 'blur', value: number): void
    (e: 'keydown', event: KeyboardEvent): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const rawValue = ref<string>('')

// Computed properties for field configuration
const useDollarSign = computed(() => {
    return props.field.fieldData?.useDollarSign || false
})

const decimals = computed(() => {
    return props.field.fieldData?.decimals || 0
})

const min = computed(() => {
    return props.field.fieldData?.min || 0
})

const currencySymbolPlacement = computed(() => {
    return props.field.fieldData?.currencySymbolPlacement || 'p'
})

const thousandSeparator = computed(() => {
    return props.field.fieldData?.thousandSeparator || '.'
})

const decimalSeparator = computed(() => {
    if (props.field.fieldData?.decimalSeparator) {
        return props.field.fieldData.decimalSeparator
    }
    return thousandSeparator.value === '.' ? ',' : '.'
})

// Format number with separators and currency symbol
const formatNumber = (value: number): string => {
    if (isNaN(value)) return ''
    
    const parts = value.toFixed(decimals.value).split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator.value)
    
    let formatted = parts.join(decimalSeparator.value)
    
    if (useDollarSign.value) {
        formatted = currencySymbolPlacement.value === 'p' 
            ? `$${formatted}`
            : `${formatted}$`
    }
    
    return formatted
}

// Parse formatted string back to number
const parseFormattedValue = (value: string): number => {
    if (!value) return 0
    
    // Remove currency symbol and separators
    let cleanValue = value.replace(/[^\d.,-]/g, '')
    cleanValue = cleanValue.replace(thousandSeparator.value, '')
    cleanValue = cleanValue.replace(decimalSeparator.value, '.')
    
    const number = parseFloat(cleanValue)
    return isNaN(number) ? 0 : number
}

// Computed property for formatted display value
const formattedValue = computed(() => {
    const numValue = typeof props.modelValue === 'string' 
        ? parseFloat(props.modelValue) 
        : props.modelValue
    
    return formatNumber(numValue)
})

// Handle input changes
const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    const value = parseFormattedValue(input.value)
    
    if (value >= min.value) {
        emit('update:modelValue', value)
        emit('change', value)
    }
}

// Handle blur event
const handleBlur = () => {
    const value = parseFormattedValue(rawValue.value)
    emit('blur', value)
}

// Handle focus event
const focus = () => {
    emit('focus')
}

// Handle keydown event
const keyDown = (event: KeyboardEvent) => {
    emit('keydown', event)
}

// Computed property for input classes
const clases_input = computed(() => ({
    readonly: props.readOnly,
    'expert-disabled': props.disabled
}))

// Watch for model value changes
watch(() => props.modelValue, (newValue) => {
    if (typeof newValue === 'number') {
        rawValue.value = formatNumber(newValue)
    }
}, { immediate: true })

// Initialize on mount
onMounted(() => {
    if (typeof props.modelValue === 'number') {
        rawValue.value = formatNumber(props.modelValue)
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

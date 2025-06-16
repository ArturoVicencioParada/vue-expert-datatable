<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
    <span class="expert-item-text" @click="clickEvent">
        {{ formattedText }}
    </span>
</template>

<script setup lang="ts" generic="ItemGenericType extends Record<string, unknown>">
import { computed } from 'vue'
import type { Field, SelectOption } from '@/application/interface/field'

interface ItemTextProps {
    field: Field<ItemGenericType>;
    item: ItemGenericType;
}

const props = defineProps<ItemTextProps>()
const emit = defineEmits<{ (e: 'click', item: ItemGenericType): void }>()

const isDate = computed(() => {
    return [
        'date',
        'datetime',
        'time',
        'month',
        'year',
    ].includes(props.field.fieldType || '')
})

const dateFormat = computed(() => {
    if (!isDate.value) return 'YYYY-MM-DD'
    if (props.field.fieldData && props.field.fieldData.date_format) {
        return props.field.fieldData.date_format
    }
    switch (props.field.fieldType) {
    case 'date':
        return 'YYYY-MM-DD'
    case 'datetime':
        return 'YYYY-MM-DD HH:mm:ss'
    case 'time':
        return 'HH:mm:ss'
    case 'month':
        return 'YYYY-MM'
    case 'year':
        return 'YYYY'
    default:
        return 'YYYY-MM-DD'
    }
})

const fieldSelectSelected = computed(() => {
    const selectData = props.field.selectData
    if (selectData && selectData.items) {
        if (selectData.itemValue && selectData.itemText) {
            return selectData.items.find((x) => {
                if (
                    typeof x === 'object'
                    && selectData.itemValue
                    && selectData.itemText
                ) {
                    return x[selectData.itemValue as keyof SelectOption] === props.item[props.field.key as string]
                } else {
                    return false
                }
            })
        } else {
            return selectData.items.find((x) => {
                return x === props.item[props.field.key as string]
            })
        }
    }
    return undefined
})

function formatDate(val: unknown, format: string): string {
    // Simple ISO date formatter fallback
    if (!val) return ''
    if (typeof val !== 'string' && typeof val !== 'number' && !(val instanceof Date)) {
        return ''
    }
    const d = new Date(val)
    if (isNaN(d.getTime())) return ''
    // Only basic formatting for common cases
    if (format === 'YYYY-MM-DD') {
        return d.toISOString().slice(0, 10)
    } else if (format === 'YYYY-MM-DD HH:mm:ss') {
        return d.toISOString().replace('T', ' ').slice(0, 19)
    } else if (format === 'HH:mm:ss') {
        return d.toTimeString().slice(0, 8)
    } else if (format === 'YYYY-MM') {
        return d.toISOString().slice(0, 7)
    } else if (format === 'YYYY') {
        return d.getFullYear().toString()
    }
    return d.toISOString()
}

function formatNumber(number: string, separator: string) {
    if (typeof number === 'undefined' || number === null) {
        return '0'
    }
    if (!number || isNaN(parseInt(number))) {
        return '0'
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

const formattedText = computed(() => {
    let formatted = ''
    const selectData = props.field.selectData
    if (
        selectData
        && selectData.itemText
        && !fieldSelectSelected.value
        && props.item
    ) {
        const item_object = props.item[props.field.key as string]
        if (item_object && typeof item_object === 'object') {
            const item_object_object: Record<string, unknown> = item_object as Record<string, unknown>
            formatted = item_object_object[selectData.itemText as string] as string
        } else {
            formatted = item_object as string
        }
    } else if (
        fieldSelectSelected.value
        && selectData
        && selectData.itemText
    ) {
        formatted = fieldSelectSelected.value[selectData.itemText as keyof SelectOption] as string
    } else if (isDate.value) {
        formatted
            = props.item[props.field.key as string]
                && formatDate(props.item[props.field.key as string], dateFormat.value)
                ? formatDate(props.item[props.field.key as string], dateFormat.value)
                : ''
    } else {
        formatted = props.item[props.field.key as string] as string
    }

    if (props.field.fieldData) {
        if (props.field.fieldData.thousandSeparator) {
            formatted = formatNumber(
                formatted,
                props.field.fieldData.thousandSeparator
            )
        }
        if (props.field.fieldData.useDollarSign) {
            formatted = `$${formatted}`
        }
    }
    return formatted
})

function clickEvent() {
    emit('click', props.item)
}
</script>

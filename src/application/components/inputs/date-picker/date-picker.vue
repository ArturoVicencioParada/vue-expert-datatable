<template>
    <div class="expert-datatable-datepicker">
        <Datepicker
            v-model="localValue"
            :format="format"
            :enable-time-picker="enableTimePicker"
            :auto-apply="true"
            :enable-seconds="enableSeconds"
            :placeholder="placeholder"
            :disabled="disabled"
            :input-class-name="'ant-input'"
            @update:model-value="handleChange"
            @closed="handleBlur"
            @opened="handleFocus"
        />
    </div>
</template>

<script setup lang="ts" generic="ItemGenericType = BaseEntity">
import { ref, watch, computed } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import type Field from '@/application/interface/field'
import { BaseEntity } from '@/application/interface/field';

interface Props {
    modelValue: string | Date | number | null
    field: Field<ItemGenericType>
    placeholder?: string
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    disabled: false
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | Date | null): void
    (e: 'change', value: string | Date | null): void
    (e: 'focus'): void
    (e: 'blur'): void
}>()

// State
const localValue = ref(props.modelValue)

// Computed
const format = computed(() => {
    if (props.field.fieldType === 'datetime') {
        return 'yyyy-MM-dd HH:mm:ss'
    } else if (props.field.fieldType === 'time') {
        return 'HH:mm:ss'
    } else if (props.field.fieldType === 'year') {
        return 'yyyy'
    } else if (props.field.fieldType === 'week') {
        return '\'Week\' w, yyyy'
    }
    return 'yyyy-MM-dd'
})

const enableTimePicker = computed(() => {
    return props.field.fieldType === 'datetime' || props.field.fieldType === 'time'
})

const enableSeconds = computed(() => {
    return props.field.fieldType === 'datetime' || props.field.fieldType === 'time'
})

// Methods
const handleChange = (value: string | Date | null) => {
    emit('update:modelValue', value)
    emit('change', value)
}

const handleFocus = () => {
    emit('focus')
}

const handleBlur = () => {
    emit('blur')
}

// Watchers
watch(() => props.modelValue, (newValue) => {
    localValue.value = newValue
})
</script>

<style lang="scss">
.expert-datatable-datepicker {
    width: 100%;

    .dp__input {
        width: 100%;
        height: 32px;
        padding: 4px 11px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        transition: all 0.3s;

        &:hover {
            border-color: #40a9ff;
        }

        &:focus {
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
            outline: none;
        }

        &::placeholder {
            color: #bfbfbf;
        }
    }

    .dp__disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
}
</style>

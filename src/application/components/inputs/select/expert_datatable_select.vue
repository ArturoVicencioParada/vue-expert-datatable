<template>
    <div ref="mainDiv" class="expert-datatable-select-wrapper">
        <div
            v-click-outside="handleClickOutside"
            class="expert-datatable-select ant-input-affix-wrapper"
            :tabindex="tabIndex"
            @focus="handleFocus"
        >
            <div class="selected-item-div" @click="() => openSelect()">
                <div v-show="!isOpen && selectedItem" class="selected-item">
                    <slot name="selected-item" :item="selectedItem">
                        <span v-if="selectData.itemText && typeof selectedItem === 'object'">
                            {{ (selectedItem as ItemGenericType)[selectData.itemText as keyof ItemGenericType] }}
                        </span>
                        <span v-else>{{ selectedItem }}</span>
                    </slot>
                </div>
                <div v-show="!isOpen && !selectedItem" class="select-placeholder">
                    <slot name="placeholder" :item="selectedItem">
                        {{ placeholder }}
                    </slot>
                </div>
                <input
                    v-show="isOpen"
                    :key="inputKey"
                    v-bind="$attrs"
                    ref="searchInput"
                    v-model="searchText"
                    :name="field.name"
                    type="text"
                    :placeholder="placeholder"
                    class="expert-datatable-select-search-input"
                />
            </div>
            <span class="expert-datatable-select-suffix border-left pl-2">
                
            </span>
            <div
                class="expert-datatable-select-items at-bottom"
                :class="{ 'show-select': isOpen && filteredItems.length > 0 }"
            >
                <div class="expert-datatable-select-list-items">
                    <div
                        v-for="(item, index) in filteredItems"
                        :key="getItemKey(item, index)"
                        class="expert-datatable-select-item"
                        @click="handleItemClick(item)"
                    >
                        <slot name="item-list" :item="item">
                            <span v-if="selectData.itemText">{{ item[selectData.itemText] }}</span>
                            <span v-else>{{ item }}</span>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="ItemGenericType extends Record<string, unknown>">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import Field, { SelectData } from '@/application/interface/field'

interface Props {
    field: Field<ItemGenericType>
    modelValue: string | number | object | undefined
    placeholder?: string
    items?: ItemGenericType[]
    itemText?: string
    itemValue?: string
    allowClear?: boolean
    allowSearch?: boolean
    tabIndex?: number
    focusOnInit?: boolean
    inputKey?: string
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    items: () => [],
    itemText: undefined,
    itemValue: undefined,
    allowClear: true,
    allowSearch: true,
    tabIndex: 0,
    focusOnInit: false,
    inputKey: 'key'
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number | object | undefined): void
    (e: 'change', value: string | number | object | undefined): void
    (e: 'focus'): void
    (e: 'blur'): void
    (e: 'open', value: boolean): void
    (e: 'selected-item', item: ItemGenericType): void
    (e: 'deselect-row'): void
}>()

// Refs
const mainDiv = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const searchText = ref('')
const selectedItem = ref<ItemGenericType | undefined>(undefined)

// Computed
const selectData = computed<SelectData<ItemGenericType>>(() => {
    if (props.field.selectData) {
        return {
            items: props.field.selectData.items || [],
            itemText: props.field.selectData.itemText,
            itemValue: props.field.selectData.itemValue,
            allowClear: props.field.selectData.allowClear ?? true,
            allowSearch: props.field.selectData.allowSearch ?? true
        }
    }
    return {
        items: props.items,
        itemText: props.itemText,
        itemValue: props.itemValue,
        allowClear: props.allowClear,
        allowSearch: props.allowSearch
    }
})

const filteredItems = computed<ItemGenericType[]>(() => {
    if (!selectData.value.items) return []

    if (!searchText.value) return selectData.value.items

    return selectData.value.items.filter((item) => {
        if (selectData.value.itemText && selectData.value.itemValue) {
            const text = selectData.value.itemText ? String(item[selectData.value.itemText] || '') : ''
            const value = selectData.value.itemValue ? String(item[selectData.value.itemValue] || '') : ''
            return text.toLowerCase().includes(searchText.value.toLowerCase())
                || value.toLowerCase().includes(searchText.value.toLowerCase())
        } else if (selectData.value.itemText) {
            const text = String(item[selectData.value.itemText] || '')
            return text.toLowerCase().includes(searchText.value.toLowerCase())
        } else if (selectData.value.itemValue) {
            const value = String(item[selectData.value.itemValue] || '')
            return value.toLowerCase().includes(searchText.value.toLowerCase())
        } else {
            const value = String(item)
            return value.toLowerCase().includes(searchText.value.toLowerCase())
        }
    })
})

// Methods
const getItemKey = (item: ItemGenericType, index: number): string => {
    if (selectData.value.itemValue) {
        return `item_${item[selectData.value.itemValue]}`
    }
    return typeof item === 'object' ? `item_${index}` : `item_${item}`
}

const handleItemClick = (item: ItemGenericType) => {
    selectedItem.value = item
    const value = selectData.value.itemValue ? item[selectData.value.itemValue] : item
    emit('update:modelValue', value as string | number | object | undefined)
    emit('change', value as string | number | object | undefined)
    emit('selected-item', item)
	
    nextTick(() => {
        isOpen.value = false
        searchText.value = ''
    })
}

const openSelect = (triggerFocus = false) => {
    isOpen.value = true
    emit('focus')
    emit('open', true)

    if (triggerFocus) {
        nextTick(() => {
            if (searchInput.value) {
                searchInput.value.focus()
                if (searchInput.value.setSelectionRange) {
                    searchInput.value.setSelectionRange(0, searchInput.value.value.length)
                }
            }
        })
    }
}

const handleClickOutside = () => {
    isOpen.value = false
    emit('open', false)
    emit('blur')
    emit('deselect-row')
}

const handleFocus = () => {
    openSelect(true)
}

// Watch for model value changes
watch(() => props.modelValue, (newValue) => {
    if (!newValue) {
        selectedItem.value = undefined
        searchText.value = ''
        return
    }

    if (selectData.value.items) {
        if (selectData.value.itemValue) {
            selectedItem.value = selectData.value.items.find((item) => item[selectData.value.itemValue!] === newValue)
        } else {
            selectedItem.value = selectData.value.items.find((item) => item === newValue)
        }

        if (selectedItem.value) {
            searchText.value = selectData.value.itemText 
                ? selectedItem.value[selectData.value.itemText]
                : String(selectedItem.value)
        }
    }
}, { immediate: true })

// Watch for field.selectData changes
watch(() => props.field.selectData, (newValue: SelectData<ItemGenericType> | undefined) => {
    if (newValue) {
        // Re-initialize select data
        selectedItem.value = undefined
        searchText.value = ''
        if (props.modelValue) {
            // Re-select current value with new data
            const value = props.modelValue
            if (newValue.items) {
                if (newValue.itemValue) {
                    selectedItem.value = newValue.items.find((item) => item[newValue.itemValue!] === value)
                } else {
                    selectedItem.value = newValue.items.find((item) => item === value)
                }
            }
        }
    }
}, { deep: true })

// Initialize on mount
onMounted(() => {
    if (props.focusOnInit) {
        openSelect(true)
    }
})
</script>

<style lang="scss">
.expert-datatable-select-wrapper {
	display: inline-block;
	width: 100%;
	box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    display: inline-block;
    width: 100%;

	.expert-datatable-select {
		display: inline-block;
		width: 100%;
		position: relative;

		.expert-datatable-select-suffix {
			position: absolute;
			top: 50%;
			z-index: 2;
			display: flex;
			align-items: center;
			color: rgba(0, 0, 0, 0.65);
			line-height: 0;
			transform: translateY(-50%);
		}

		.expert-datatable-select-search-input {
			width: 100%;
			padding: 0;
			background-color: transparent;
			color: rgba(0, 0, 0, 0.65);
			outline: none!important;
			border: none;
		}

		.expert-datatable-select-items {
			max-width: 100%;
			width: 100%;
			pointer-events: none;
			visibility: hidden;
			opacity: 0;
			max-height: 200px;
			overflow-y: scroll;

			transition: opacity .1s;
			position: absolute;
			z-index: 8;
			transform-origin: left top 0;
			background-color: #fff;
			border: 1px solid #ced4da;
			border-radius: .25rem;
			box-shadow: 0 2px 11px -2px rgb(0 0 0 / 19%);

			&.at-bottom {
				border-top: 0;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
			}

			.expert-datatable-select-list-items {
				overflow-y: auto;
    			overflow-x: hidden;
			}

			&.show-select {
				pointer-events: auto;
				visibility: visible;
				opacity: 1;
			}

			.expert-datatable-select-item {
				cursor: pointer;
				padding: 8px 12px;
				transition: .3s cubic-bezier(.25,.8,.5,1);
				text-align: left;

				&:hover {
					background-color: #f2f2f2;
				}
			}
		}
	}
}
</style>

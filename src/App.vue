<template>
    <div class="app-container">
        <h1>Vue Expert Datatable Demo</h1>
        
        <vue-expert-datatable
            table-name="users"
            :fields="fields"
            :data="tableData"
            :rest-api-url="apiUrl"
            :add-method="addMethod"
            :update-method="updateMethod"
            :get-method="getMethod"
            :delete-method="deleteMethod"
            :item-name="'user'"
            :key-name="'id'"
            :http-headers="headers"
            :item="defaultItem"
            :disable-auto-crud="false"
            :lang="'ES'"
            :size="'normal'"
            :bordered="true"
            :save-on-blur="true"
            :show-alerts="true"
            :use-edit-modal="true"
            :use-delete-modal="true"
            :allow-adding="true"
            :show-edit-button="true"
            :show-delete-button="true"
            :show-editing-icon="true"
            :hide-actions-field="false"
            :logging="true"
            @updated-data="onDataUpdated"
            @load-data="onLoadData"
            @error="onError"
            @alert="onAlert"
            @edit-item="onEditItem"
            @delete-item="onDeleteItem"
            @inserted-item="onItemInserted"
            @added-item="onItemAdded"
            @updated-item="onItemUpdated"
            @change-item-add="onItemAddChange"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VueExpertDatatable from './vue-expert-datatable.vue';
import type { Field } from './application/interface/field';
import type { Method } from './application/interface/method';

// Configuración de campos
const fields = ref<Field[]>([
    {
        title: 'ID',
        align: 'left',
        key: 'id',
        visible: true,
        editable: false,
        pronoun: 'el',
    },
    {
        title: 'Nombre',
        align: 'left',
        key: 'name',
        visible: true,
        fieldType: 'text',
        editable: true,
        pronoun: 'el',
        rules: 'required|min:3',
    },
    {
        title: 'Email',
        align: 'left',
        key: 'email',
        visible: true,
        fieldType: 'text',
        editable: true,
        pronoun: 'el',
        rules: 'required|email',
    },
    {
        title: 'Rol',
        align: 'left',
        key: 'role',
        visible: true,
        fieldType: 'select',
        editable: true,
        pronoun: 'el',
        selectData: {
            items: [
                {
                    value: 'admin',
                    label: 'Administrador' 
                },
                {
                    value: 'user',
                    label: 'Usuario' 
                },
                {
                    value: 'guest',
                    label: 'Invitado' 
                },
            ]
        },
        rules: 'required',
    },
    {
        title: 'Activo',
        align: 'center',
        key: 'active',
        visible: true,
        fieldType: 'checkbox',
        editable: true,
        pronoun: 'el',
    },
    {
        title: 'Acciones',
        align: 'center',
        key: 'actions',
        visible: true,
    },
]);

// Datos de ejemplo
const tableData = ref([
    {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        role: 'admin',
        active: true,
    },
    {
        id: 2,
        name: 'María García',
        email: 'maria@example.com',
        role: 'user',
        active: true,
    },
    {
        id: 3,
        name: 'Carlos López',
        email: 'carlos@example.com',
        role: 'guest',
        active: false,
    },
]);

// Configuración de la API
const apiUrl = ref('http://localhost:3000/api/users');

// Métodos HTTP
const addMethod: Method = {
    url: 'http://localhost:3000/api/users',
    type: 'POST',
};

const updateMethod: Method = {
    url: 'http://localhost:3000/api/users',
    type: 'PUT',
};

const getMethod: Method = {
    url: 'http://localhost:3000/api/users',
    type: 'GET',
};

const deleteMethod: Method = {
    url: 'http://localhost:3000/api/users',
    type: 'DELETE',
};

// Headers HTTP
const headers = ref({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token-here',
});

// Item por defecto para nuevos registros
const defaultItem = ref({
    id: undefined,
    name: '',
    email: '',
    role: 'user',
    active: true,
});

// Eventos
const onDataUpdated = (data: any[]) => {
    console.log('Datos actualizados:', data);
};

const onLoadData = () => {
    console.log('Datos cargados');
};

const onError = (error: any) => {
    console.error('Error:', error);
};

const onAlert = (alert: any) => {
    console.log('Alerta:', alert);
};

const onEditItem = (item: any, index: number) => {
    console.log('Editando item:', item, 'índice:', index);
};

const onDeleteItem = (item: any, index: number) => {
    console.log('Eliminando item:', item, 'índice:', index);
};

const onItemInserted = (item: any) => {
    console.log('Item insertado:', item);
};

const onItemAdded = (item: any) => {
    console.log('Item añadido:', item);
};

const onItemUpdated = (item: any) => {
    console.log('Item actualizado:', item);
};

const onItemAddChange = (newValue: any, oldValue: any) => {
    console.log('Cambio en item de añadir:', {
        newValue,
        oldValue 
    });
};
</script>

<style scoped>
.app-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #2c3e50;
    margin-bottom: 20px;
    text-align: center;
}
</style>

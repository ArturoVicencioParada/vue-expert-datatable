<template>
    <div class="app-container">
        <h1>Vue Expert Datatable Demo</h1>
        
        <vue-expert-datatable
            table-name="users"
            :fields="fields"
            :data="tableData"
            :key-name="'id'"
            :item="defaultItem"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VueExpertDatatable from './vue-expert-datatable.vue';
import type { Field } from './application/interface/field';
import type { Method } from './application/interface/method';
import { z } from 'zod';

interface User {    
    id: number | undefined;
    name: string;
    email: string;
    role: string;
    active: boolean;
}

// Configuración de campos
const fields = ref<Field<User>[]>([
    {
        title: 'ID',
        align: 'left',
        key: 'id',
        visible: true,
        editable: false,
        pronoun: 'el',
        size: 0.4,
    },
    {
        title: 'Nombre',
        align: 'left',
        key: 'name',
        visible: true,
        fieldType: 'text',
        editable: true,
        pronoun: 'el',
        rules: z.object({
            name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres')
        }),
        size: 2,
    },
    {
        title: 'Email',
        align: 'left',
        key: 'email',
        visible: true,
        fieldType: 'text',
        editable: true,
        pronoun: 'el',
        rules: z.object({
            email: z.string().email('Email inválido').min(1, 'El email es requerido')
        }),
        size: 1.5,
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
            ],
            itemText: 'label',
            itemValue: 'value',
        },
        rules: z.object({
            role: z.string().min(1, 'El rol es requerido')
        }),
        size: 2,
    },
    {
        title: 'Activo',
        align: 'center',
        key: 'active',
        visible: true,
        fieldType: 'checkbox',
        editable: true,
        pronoun: 'el',
        size: 0.5,
    },
    {
        title: 'Acciones',
        align: 'center',
        key: 'actions',
        visible: true,
        size: 0.5,
    },
]);

// Datos de ejemplo
const tableData = ref<User[]>([
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
const defaultItem = ref<User>({
    id: undefined,
    name: '',
    email: '',
    role: 'user',
    active: true,
});
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

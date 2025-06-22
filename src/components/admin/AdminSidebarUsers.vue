<script setup>
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';
</script>


<template>
    <h2>Users</h2>
    <ul class="user-list">
        <li v-for="user in users" :key="user.id" :class="{ active: user.id === selectedUserId }"
            @click="selectUser(user)">
            {{ user.username }}
        </li>

    </ul>
</template>

<script>

export default {
    data() {
        return {
            users: [],
            selectedUserId: null
        }
    },
    methods: {
        selectUser(user) {
            this.selectedUserId = user.id
            this.$emit('selectedUser', user)
        }
    },
    mounted() {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/`, tokenStore().headers)
            .then(response => {
                this.users = response.data.filter(user => user.username !== 'admin');
            })
            .catch(error => console.log(error.response.data));
    }
}


</script>

<style scoped>
h2 {
    font-size: 1.2rem;
    font-weight: bold;
    color: #3BA9FF;
    margin-bottom: 1rem;
    text-transform: uppercase;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    background-color: #1a1a1a;
    border: 1px solid #3BA9FF;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    color: #fff;
}

li:hover {
    background-color: #3BA9FF;
    color: #000;
    transform: translateY(-1px);
}

li.active {
    background-color: #3BA9FF;
    color: #000;
}
</style>

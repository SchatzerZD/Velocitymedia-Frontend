<script setup>
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';
</script>

<template>
    <h2>Projects</h2>
    <div v-if="!user">Select a user to view projects</div>
    <ul class="project-list">
        <li v-for="project in projects" :key="project.id" @click="selectProject(project)"
            :class="{ active: project.id === selectedProjectId }">
            {{ project.name }}
        </li>
    </ul>

</template>

<script>

export default {
    props: {
        user: {
            type: Object,
            required: false
        }
    },
    data() {
        return {
            projects: [],
            selectedProjectId: null
        }
    },
    watch: {
        user: {
            immediate: true,
            handler(newUser) {
                if (newUser && newUser.id) {
                    axios
                        .get(`${import.meta.env.VITE_BACKEND_URL}/user/projects/admin/${newUser.id}`, tokenStore().headers)
                        .then((response) => {
                            this.projects = response.data
                            this.selectedProjectId = null
                        })
                        .catch((error) => {
                            console.error('Error fetching projects:', error.response?.data || error)
                            this.projects = []
                        })
                } else {
                    this.projects = []
                }
            }
        }
    },
    methods: {
        selectProject(project) {
            this.selectedProjectId = project.id
            this.$emit('selectedProject', project)
        }
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

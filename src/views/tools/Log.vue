<script setup>
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';
</script>

<template>
    <div class="log-container">
        <div v-if="loading" class="loading-state">
            <h2>Loading...</h2>
        </div>

        <div v-else class="log-grid">
            <div v-for="(log, index) in logs.slice(0, maxLogs)" :key="log.id" class="log-card">
                <h3>{{ formatDate(log.logCreatedDate) }}</h3>
                <p>{{ log.log.length > 200 ? log.log.slice(0, 200) + '...' : log.log }}</p>
                <span class="read-more">Click to read more</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        maxLogs: {
            type: Number,
            default: Infinity
        },
        projectId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            logs: [],
            loading: false
        };
    },
    methods: {
        formatDate(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }
    },
    async mounted() {
        this.loading = true;
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/log/` + tokenStore().user.projectId, tokenStore().headers);
            this.logs = response.data.reverse();
        } catch (error) {
            console.log("Logs could not be retrieved: " + error);
        }
        this.loading = false;
    },
    watch: {
        projectId(newId, oldId) {
            if (newId !== oldId) {
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/log/` + tokenStore().user.projectId, tokenStore().headers)
                    .then(response => {
                        this.logs = response.data.reverse();
                    })
                    .catch(error => console.log(error))
            }
        }
    }
};
</script>

<style scoped>
.log-container {
    background-color: #000;
    color: #fff;
    padding: 2rem 1rem;
    display: flex;
    justify-content: center;
    text-align: left;
}

.loading-state {
    text-align: center;
}

.log-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    max-width: 1010px;
    width: 100%;
    margin: 0 auto;
}

.log-card {
    background-color: #000000;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(255, 255, 255, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.log-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.log-card h3 {
    margin: 0 0 0.5rem;
    color: #ffffff;
    font-weight: 900;
}

.read-more {
    display: inline-block;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #bbb;
    cursor: pointer;
}
</style>

<script setup>
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';
</script>

<template>
    <div class="log-container">
        <h1>Production Logs</h1>

        <div v-if="loading" class="loading-state">
            <h2>Loading...</h2>
        </div>

        <div v-else class="log-grid">
            <div v-for="log in logs" :key="log.id" class="log-card" @click="selectLog(log)">
                <h3>{{ formatDate(log.logCreatedDate) }}</h3>
                <p>{{ log.log.length > 200 ? log.log.slice(0, 200) + '...' : log.log }}</p>
                <span class="read-more">Click to read more</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            logs: [],
            loading: false,
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
        },
        selectLog(log) {
            console.log('Selected log:', log);
        },
    },
    async mounted() {
        this.loading = true;
        try {
            const response = await axios.get('http://localhost:8080/log/', tokenStore().headers);
            this.logs = response.data.reverse();
        } catch (error) {
            console.log(error.response.data);
        }
        this.loading = false;
    },
};
</script>

<style scoped>
.log-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    color: #f5f5f5;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #bfc9ff;
}

.loading-state {
    text-align: center;
    font-size: 1.2rem;
}

.log-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    padding: 0 1rem;
}

.log-card {
    background: linear-gradient(135deg, #0d0d1a, #1a1a2e, #23234d);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.log-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
}

.log-card h3 {
    color: #8ec5fc;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
}

.log-card p {
    color: #e0e0e0;
    font-size: 0.95rem;
    line-height: 1.4;
}

.read-more {
    display: block;
    margin-top: 1rem;
    font-size: 0.85rem;
    color: #74c0fc;
    text-align: right;
}
</style>

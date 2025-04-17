<script setup>
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';
import Modal from '@/components/Modal.vue';
import Sidebar from '@/components/Sidebar.vue'
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


    <Sidebar :visible="showModal">
        <div v-for="[date, logsByDate] in groupedLogs" :key="date" class="sidebar-date-section">
            <h4 class="sidebar-date-title">{{ date }}</h4>
            <div v-for="log in logsByDate" :key="log.id" class="sidebar-log-preview"
                :class="{ active: selectedLog && selectedLog.id === log.id }" @click="selectLog(log)">
                <p>{{ log.log }}</p>
            </div>
        </div>
    </Sidebar>



    <Modal v-if="showModal" @closeModal="toggleModal" theme="black">
        <div class="log-modal-content">
            <h3>{{ formatDate(selectedLog.logCreatedDate) }}</h3>
            <div class="log-scroll">
                <p>{{ selectedLog.log }}</p>
            </div>
        </div>
    </Modal>




</template>

<script>
export default {
    data() {
        return {
            logs: [],
            loading: false,
            showModal: false,
            selectedLog: null
        };
    },
    computed: {
        groupedLogs() {
            const groups = {};
            this.logs.forEach(log => {
                const dateStr = this.formatDate(log.logCreatedDate);
                if (!groups[dateStr]) groups[dateStr] = [];
                groups[dateStr].push(log);
            });


            return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
        }
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
            this.selectedLog = log
            this.showModal = true
        },
        toggleModal() {
            this.showModal = !this.showModal
        }
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

.log-modal-content {
    max-width: 700px;
    width: 100%;
    height: 58vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 12px;
}


.log-modal-content h3 {
    font-size: 1.3rem;
    color: #8ec5fc;
    margin-bottom: 1rem;
}

.log-scroll {
    overflow-y: auto;
    flex-grow: 1;
    padding-right: 0.5rem;
    margin-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 1rem;
}

.log-scroll::-webkit-scrollbar {
    width: 6px;
}

.log-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

@media (max-width: 768px) {
    .log-modal-content {
        height: 80vh;
        padding: 1rem;
    }
}



.log-scroll p {
    line-height: 1.6;
    font-size: 1rem;
    color: #e0e0e0;
    white-space: pre-wrap;
}

.sidebar-log-preview {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: background 0.2s ease;
    cursor: pointer;
    color: #bfc9ff;
}

.sidebar-log-preview:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-log-preview p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.9rem;
    margin: 0;
}

.sidebar-log-preview.active {
    background-color: rgba(255, 255, 255, 0.15);
}

.sidebar-date-section {
    margin-bottom: 1rem;
    padding: 0 1rem;
}

.sidebar-date-title {
    color: #a5b4fc;
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.25rem;
}
</style>

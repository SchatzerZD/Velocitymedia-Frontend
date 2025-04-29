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

<style scoped></style>

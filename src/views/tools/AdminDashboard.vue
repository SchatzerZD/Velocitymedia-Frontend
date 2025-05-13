<template>
    <div class="dashboard-container">
        <aside class="sidebar users-sidebar">
            <AdminSidebarUsers @selectedUser="selectUser" />
        </aside>

        <aside class="sidebar projects-sidebar">
            <AdminSidebarProjects :user="selectedUser" @selectedProject="selectProject" />
        </aside>

        <main class="main-content">
            <div v-if="selectedUser && selectedProject">
                <!-- You can create separate components for content: e.g., ProjectDetails.vue -->
                <h2>Project: {{ selectedProject.name }}</h2>
                <!-- Placeholders for future components -->
                <p>Upload videos/images/logs/contracts here.</p>
                <button>Flag Project</button>
                <button>Flag Video</button>
            </div>
            <div v-else>
                <p>Please select a user and a project to view details.</p>
            </div>
        </main>
    </div>
</template>

<script>
import AdminSidebarUsers from '@/components/admin/AdminSidebarUsers.vue'
import AdminSidebarProjects from '@/components/admin/AdminSidebarProjects.vue'

export default {
    components: {
        AdminSidebarUsers,
        AdminSidebarProjects
    },
    data() {
        return {
            selectedUser: null,
            selectedProject: null
        }
    },
    methods: {
        selectUser(user) {
            this.selectedUser = user
            this.selectedProject = null
        },
        selectProject(project) {
            this.selectedProject = project
        }
    }
}
</script>

<style scoped>
.dashboard-container {
    display: flex;
    height: 100vh;
    background-color: #0d0d0d;
    font-family: 'Inter', sans-serif;
    color: #ffffff;
    margin: 2rem;
}

.sidebar {
    background-color: #111111;
    border-right: 1px solid #3BA9FF;
    padding: 1rem;
    overflow-y: auto;
}

.users-sidebar {
    width: 220px;
}

.projects-sidebar {
    width: 240px;
}

.main-content {
    flex: 1;
    padding: 2rem;
    background-color: #0d0d0d;
    overflow-y: auto;
    border-left: 1px solid #3BA9FF;
}
</style>

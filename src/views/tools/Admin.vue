<script setup>
import axios from 'axios';
import { tokenStore } from '@/stores/tokenStore';
</script>

<template>
    <div class="admin-container">
        <h1>Admin Panel</h1>

        <div class="user-select-container">
            <label for="user-select">Select User:</label>
            <select id="user-select" v-model="selectedUser">
                <option disabled value="">-- Choose a user --</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.username }}
                </option>
            </select>
        </div>

        <div v-if="!uploading" class="upload-grid">

            <div class="upload-card">
                <h2>Upload Draft Video</h2>
                <form @submit.prevent="draftUpload">
                    <input type="file" accept="video/mp4" @change="onFileChangeDraft" />
                    <button type="submit">Upload</button>
                </form>
            </div>

            <div class="upload-card log-card">
                <h2>Add Log Entry</h2>
                <form @submit.prevent="logUpload">
                    <textarea v-model="logText" placeholder="Enter log text..."></textarea>
                    <button type="submit">Submit</button>
                </form>
            </div>

            <div class="upload-card">
                <h2>Upload BTS Image</h2>
                <form @submit.prevent="btsUpload">
                    <input type="file" accept="image/*" @change="onFileChangeImage" />
                    <button type="submit">Upload</button>
                </form>
            </div>

        </div>

        <div v-else class="uploading-message">
            <h3>Uploading...</h3>
        </div>
    </div>
</template>


<script>

export default {
    data() {
        return {
            users: [],
            video: null,
            image: null,
            selectedUser: null,
            uploading: false,
            logText: ''
        }
    },
    methods: {
        async draftUpload() {
            this.uploading = true
            if (this.video && this.selectedUser) {

                var formData = new FormData()
                formData.append('file', this.video)

                await axios.post('http://localhost:8080/video/' + this.selectedUser, formData, {
                    headers: {
                        "Authorization": "Bearer " + tokenStore().user.jwt,
                    }
                })
                    .then(response => console.log(response.data))
                    .catch(error => console.log(error))
                this.selectedUser = null
                this.uploading = false
            }
        },
        async btsUpload() {
            this.uploading = true
            if (this.image && this.selectedUser) {

                var formData = new FormData()
                formData.append('file', this.image)

                await axios.post('http://localhost:8080/image/' + this.selectedUser, formData, {
                    headers: {
                        "Authorization": "Bearer " + tokenStore().user.jwt,
                    }
                }).then(response => console.log(response.data))
                this.selectedUser = null
                this.uploading = false
            }
        },
        async logUpload() {
            this.uploading = true
            if (this.logText && this.selectedUser) {

                var log = {
                    log: this.logText
                }

                await axios.post('http://localhost:8080/log/' + this.selectedUser, log, tokenStore().headers)
                    .then(response => console.log(response.data))
                this.selectedUser = null
                this.uploading = false
            }

        },
        onFileChangeDraft(e) {
            this.video = e.target.files[0]
        },
        onFileChangeImage(e) {
            this.image = e.target.files[0]
        }
    },
    mounted() {
        axios.get('http://localhost:8080/user/', tokenStore().headers)
            .then(response => {
                this.users = response.data
                this.users = this.users.filter(user => user.username !== 'admin');
            })
            .catch(error => console.log(error.response.data))
    }
}

</script>

<style scoped>
.admin-container {
    padding: 2rem;
    color: #f5f5f5;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2rem;
    color: #bfc9ff;
}

.upload-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.upload-card {
    background: linear-gradient(135deg, #0d0d1a, #1a1a2e, #23234d);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    border-radius: 12px;
    padding: 2rem;
    transition: transform 0.3s ease;
}

.upload-card:hover {
    transform: translateY(-5px);
}

.upload-card h2 {
    margin-bottom: 1rem;
    color: #8ec5fc;
    font-size: 1.3rem;
    font-weight: 600;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

input[type="file"],
input[type="text"],
select {
    padding: 0.5rem;
    border-radius: 8px;
    border: none;
    background-color: #1f1f3a;
    color: #f5f5f5;
    font-size: 1rem;
}

input::placeholder {
    color: #bbb;
}

button {
    background: linear-gradient(135deg, #4a90e2, #36d1dc);
    color: white;
    border: none;
    padding: 0.6rem;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
}

button:hover {
    background: linear-gradient(135deg, #36d1dc, #4a90e2);
}

.uploading-message {
    text-align: center;
    font-size: 1.4rem;
    color: #ffffff;
}

.user-select-container {
    text-align: center;
    margin-bottom: 2rem;
}

.user-select-container label {
    margin-right: 1rem;
    font-weight: bold;
    font-size: 1.1rem;
    color: #cfd9ff;
}

.user-select-container select {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background-color: #1f1f3a;
    color: #f5f5f5;
    font-size: 1rem;
    border: none;
}

textarea {
    min-height: 150px;
    resize: vertical;
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 8px;
    background-color: #1f1f3a;
    color: #f5f5f5;
    border: none;
    font-family: inherit;
}

textarea::placeholder {
    color: #bbb;
}

.log-card {
    grid-column: span 2;
}
</style>
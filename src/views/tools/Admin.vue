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

<style scoped></style>
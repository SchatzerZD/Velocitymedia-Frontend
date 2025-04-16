<script setup>
import Row from '@/components/Row.vue'
import Box from '@/components/Box.vue'
import axios from 'axios';
import { tokenStore } from '@/stores/tokenStore';
</script>

<template>

    <h1>Admin</h1>

    <div v-if="!uploading">
        <form @submit.prevent="fileUpload">
            <input type="file" accept="video/mp4" capture @change="onFileChange($event)"/>
            <select v-model="selectedUser">
                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.username }}</option>
            </select>
            <button>submit</button>
        </form>
    </div>
    <div v-else>
        <h3>Uploading...</h3>
    </div>


</template>

<script>

export default {
    data() {
        return {
            users: [],
            video: null,
            selectedUser: null,
            uploading: false
        }
    },
    methods:{
        async fileUpload(){
            this.uploading = true
            if(this.video && this.selectedUser){

                var formData = new FormData()
                formData.append('file', this.video)

                await axios.post('http://localhost:8080/video/' + this.selectedUser, formData, {
                    headers:{
                        "Authorization": "Bearer " + tokenStore().user.jwt,
                    }
                }).then(response => console.log(response.data))
                this.selectedUser = null
                this.uploading = false
            }
        },
        onFileChange(e){
            this.video = e.target.files[0]
        }
    },
    mounted(){
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


.selected{
    background-color: blue;
    color:white
}

</style>
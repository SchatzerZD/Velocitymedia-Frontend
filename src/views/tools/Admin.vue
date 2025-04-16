<script setup>
import Row from '@/components/Row.vue'
import Box from '@/components/Box.vue'
import axios from 'axios';
import { tokenStore } from '@/stores/tokenStore';
</script>

<template>

    <h1>Admin</h1>

    <form @submit.prevent="fileUpload">
        <input type="file" accept="video/mp4" capture @change="onFileChange($event)"/>
        <button>submit</button>
    </form>

    <Row style="scale: 0.5">
            <div v-for="user in users" :key="user.id">
                <Box @click="selectUser" :id="user.id">
                    <h1>
                        {{ user.username }}
                    </h1>
                </Box>
            </div>
    </Row>

</template>

<script>

export default {
    data() {
        return {
            users: [],
            video: null,
            selectedUser: null
        }
    },
    methods:{
        async fileUpload(){
            if(this.video && this.selectedUser){

                var formData = new FormData()
                formData.append('file', this.video)

                await axios.post('http://localhost:8080/video/' + this.selectedUser, formData, {
                    headers:{
                        "Authorization": "Bearer " + tokenStore().user.jwt,
                    }
                }).then(response => console.log(response.data))

                var elements = document.querySelectorAll('.box')

                elements.forEach(e => e.classList.remove('selected'))
                this.selectedUser = null
            }
        },
        onFileChange(e){
            this.video = e.target.files[0]
        },
        selectUser(e){
            this.selectedUser = e.target.id
            var elements = document.querySelectorAll('.box')

            elements.forEach(e => e.classList.remove('selected'))
            e.target.classList.add('selected')
            

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
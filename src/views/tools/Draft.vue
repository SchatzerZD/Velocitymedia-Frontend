<script setup>
import axios from 'axios';
import Row from '../../components/Row.vue'
import { tokenStore } from '@/stores/tokenStore';
import Box from '../../components/Box.vue'
</script>


<template>
    <div class="container">
        <h1>Draft</h1>

        <div v-if="users.length">
            <form @submit.prevent="fileUpload">
                <input type="file" accept="video/mp4" capture @change="onFileChange($event)"/>
                <button>submit</button>
            </form>
        </div>
        <div v-else>    
            
            <video v-for="video in videos" :key="video.id" width="848" height="480" controls>
                <source :src="'../../../media//videos/' + video.videoName" type="video/mp4"></source>
            </video>

        </div>

        <Row style="scale: 0.5">
            <div v-for="user in users" :key="user.id">
                <Box @click="selectUser" :id="user.id">
                    <h1>
                        {{ user.username }}
                    </h1>
                </Box>
            </div>
        </Row>
    </div>


</template>

<script>

export default {

    data() {
        return {
            users: [],
            videos: [],
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
        
        if(tokenStore().user.admin){
            axios.get('http://localhost:8080/user/', tokenStore().headers)
                .then(response => {
                this.users = response.data
                this.users = this.users.filter(user => user.username !== 'admin');
            })
            .catch(error => console.log(error.response.data))
        }else{
            axios.get('http://localhost:8080/video/', tokenStore().headers)
                .then(response => {
                    this.videos = response.data
                })
                .catch(error => console.log(error.response.data))
        }
    }


}

</script>


<style scoped>

.container{
    display: flex;
    align-items: center;
    flex-direction: column;
}


.selected{
    background-color: blue;
    color:white
}



</style>
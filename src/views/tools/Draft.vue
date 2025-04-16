<script setup>
import axios from 'axios';
import Row from '../../components/Row.vue'
import { tokenStore } from '@/stores/tokenStore';
import Box from '../../components/Box.vue'
</script>


<template>
    <div class="container">
        <h1>Draft</h1>
        <div>    
            <video v-for="video in videos" :key="video.id" width="848" height="480" controls>
                <source :src="'../../../media//videos/' + video.videoName" type="video/mp4"></source>
            </video>
        </div>
    </div>


</template>

<script>

export default {

    data() {
        return {
            videos: []
        }
    },
    methods:{
        
    },  

    mounted(){
        axios.get('http://localhost:8080/video/', tokenStore().headers)
            .then(response => {
                this.videos = response.data
            })
            .catch(error => console.log(error.response.data))
    }


}

</script>


<style scoped>

.container{
    display: flex;
    align-items: center;
    flex-direction: column;
}



</style>
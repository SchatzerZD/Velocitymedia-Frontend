<script setup>
import axios from 'axios';
import Row from '../../components/Row.vue'
import { tokenStore } from '@/stores/tokenStore';
import Box from '../../components/Box.vue'
import Modal from '@/components/Modal.vue';
import Video from '@/components/Video.vue'
</script>


<template>
    <div class="container">
        <h1>Draft</h1>
        <div class="videos">
            <video v-for="video in videos" :key="video.id" width="352rem" height="196rem"
                @click="selectVideo(video.id, video.videoName)">
                <source :src="'../../../media//videos/' + video.videoName" type="video/mp4">
                </source>
            </video>
        </div>
    </div>


    <Modal v-if="showModal" @closeModal="closeCurrentVideo" theme="black">
        <Video :timestamp="currentTime" :videoId="selectedVideoId" @goToTimestamp="setVideoTimestamp">
            <video width="960rem" height="540rem" controls @timeupdate="updateTime($event)" id="selectedVideo">
                <source :src="'../../../media//videos/' + selectedVideoName" type="video/mp4">
                </source>
            </video>
        </Video>


    </Modal>


</template>

<script>

export default {

    data() {
        return {
            videos: [],
            currentTime: 0,
            comment: "",
            showModal: false,
            selectedVideoId: null,
            selectedVideoName: ''
        }
    },
    methods: {
        updateTime(event) {
            this.currentTime = event.target.currentTime;
        },
        uploadComment() {
            console.log(this.comment)
        },
        selectVideo(videoId, videoName) {
            this.showModal = true
            this.selectedVideoId = videoId
            this.selectedVideoName = videoName
        },
        closeCurrentVideo() {
            this.showModal = false
            this.selectedVideoId = null
            this.selectedVideoName = ''
            this.currentTime = 0
        },
        setVideoTimestamp(timestamp) {
            var videoElement = document.querySelector('#selectedVideo')
            videoElement.currentTime = timestamp
        }
    },

    mounted() {
        axios.get('http://localhost:8080/video/', tokenStore().headers)
            .then(response => {
                this.videos = response.data
            })
            .catch(error => console.log(error.response.data))
    }


}

</script>


<style scoped>
.videos {
    display: flex;
    flex-direction: column;
    gap: 5rem;
}

.videos video:hover {
    scale: 1.1;
    transition-duration: 0.3s;
    cursor: pointer;
}

.container {
    display: flex;
    align-items: center;
    flex-direction: column;
}
</style>
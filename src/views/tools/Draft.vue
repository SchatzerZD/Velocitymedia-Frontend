<script setup>
import axios from 'axios';
import Row from '../../components/Row.vue'
import { tokenStore } from '@/stores/tokenStore';
import Box from '../../components/Box.vue'
import Modal from '@/components/Modal.vue';
import Video from '@/components/Video.vue'
</script>


<template>
    <div v-if="loading" class="container">
        <h1>Loading...</h1>
    </div>
    <div v-else class="container">
        <div class="videos">
            <div class="video-card" v-for="video in videos" :key="video.id"
                @click="selectVideo(video.id, video.videoName)">
                <img class="thumbnail" :src="'../../../media//videos/' + video.videoName.replace(/\.[^/.]+$/, '.jpg')"
                    alt="Video thumbnail" />
                <div class="video-info">
                    <h3 class="video-title">{{ video.videoName }}</h3>
                </div>
            </div>
        </div>
    </div>



    <Modal v-if="showModal" @closeModal="closeCurrentVideo" theme="black">
        <div class="modal-video-wrapper">
            <Video :timestamp="currentTime" :videoId="selectedVideoId" @goToTimestamp="setVideoTimestamp">
                <video controls @timeupdate="updateTime($event)" id="selectedVideo">
                    <source :src="'../../../media//videos/' + selectedVideoName" type="video/mp4" />
                </video>
            </Video>
        </div>
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
            selectedVideoName: '',
            loading: false
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

    async mounted() {
        this.loading = true
        await axios.get('http://localhost:8080/video/', tokenStore().headers)
            .then(response => {
                this.videos = response.data
            })
            .catch(error => console.log(error.response.data))
        this.loading = false
    }


}

</script>


<style scoped>
.container {
    padding: 3rem 1.5rem;
    color: #f5f5f5;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.videos {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
}

.video-card {
    display: flex;
    cursor: pointer;
    gap: 1.5rem;
    transition: transform 0.2s ease, box-shadow 0.3s ease;
    padding: 1rem;
    border-radius: 16px;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.03);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
    position: relative;
    backdrop-filter: blur(4px);
}

.video-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #5b86e5, #36d1dc);
    clip-path: polygon(100% 0, 0% 100%, 100% 100%);
    border-bottom-right-radius: 16px;
    box-shadow: 0 0 10px rgba(86, 204, 242, 0.4);
}

.video-card:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    background-color: rgba(255, 255, 255, 0.06);
    color: white;
}

.thumbnail {
    width: 352px;
    height: 196px;
    object-fit: cover;
    border-radius: 12px;
    transition: transform 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.video-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.video-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #8ec5fc;
}

.modal-video-wrapper {
    width: 75vw;
    height: 70vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    overflow: hidden;
    margin: 0 auto;
}

.modal-video-wrapper video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
}
</style>
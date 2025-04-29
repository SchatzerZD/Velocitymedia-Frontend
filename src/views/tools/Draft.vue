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

        <div class="selected-video">
            <div class="modal-video-wrapper">
                <Video :timestamp="currentTime" :videoId="selectedVideoId" @goToTimestamp="setVideoTimestamp">
                    <video controls @timeupdate="updateTime($event)" id="selectedVideo">
                        <source :src="'../../../media//videos/' + selectedVideoName" type="video/mp4" />
                    </video>
                </Video>
            </div>
        </div>

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

</template>

<script>

export default {

    data() {
        return {
            videos: [],
            currentTime: 0,
            comment: "",
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
            var savedScrollTop = window.scrollY;

            this.selectedVideoId = videoId;
            this.selectedVideoName = videoName;

            this.$nextTick(() => {
                const video = document.getElementById("selectedVideo");
                if (video) {
                    video.load();
                }
                window.scrollTo(0, savedScrollTop);
            });
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
                this.selectedVideoName = this.videos[0].videoName
                this.selectedVideoId = this.videos[0].id
            })
            .catch(error => console.log(error.response.data))
        this.loading = false
    }


}

</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
}


.videos {
    display: flex;
    flex-direction: row;
    gap: 2rem;
}

.thumbnail {
    width: 352px;
    height: 196px;
    object-fit: cover;
    border-radius: 12px;
    transition: transform 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.selected-video {
    display: flex;
    flex-direction: row;
}

.video-card {
    cursor: pointer;
}

.modal-video-wrapper {
    width: 75vw;
}
</style>
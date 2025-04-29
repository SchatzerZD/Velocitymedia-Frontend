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
                <Video :timestamp="currentTime" :videoId="selectedVideoId" @goToTimestamp="setVideoTimestamp"
                    :videoName="selectedVideoName">
                    <video controls @timeupdate="updateTime($event)" id="selectedVideo">
                        <source :src="'../../../media//videos/' + selectedVideoName" type="video/mp4" />
                    </video>
                </Video>
            </div>
        </div>

        <div class="drafts-title">
            <h3>UTKAST</h3>
        </div>

        <div class="videos-wrapper">
            <div class="videos">
                <div class="video-card" :class="{ selected: video.id === selectedVideoId }" v-for="video in videos"
                    :key="video.id" @click="selectVideo(video.id, video.videoName)">
                    <img class="thumbnail"
                        :src="'../../../media//videos/' + video.videoName.replace(/\.[^/.]+$/, '.jpg')"
                        alt="Video thumbnail" />
                    <div class="video-info">
                        <h3 class="video-title">{{ video.videoName }}</h3>
                    </div>
                </div>
            </div>

            <div class="video-placeholder video-card">
                <img src="../../../media//images/static/pluss.jpg" alt="Placeholder" />
                <div class="video-info">
                    <h3 class="video-title">REVISJONER</h3>
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
            loading: false,
            savedScrollTop: 0
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
            this.savedScrollTop = window.scrollY;

            this.selectedVideoId = videoId;
            this.selectedVideoName = videoName;

            this.$nextTick(() => {
                const video = document.getElementById("selectedVideo");
                if (video) {
                    video.load();
                }
                window.scrollTo(0, this.savedScrollTop);
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
    width: 90%;
    margin: 0 auto;
    margin-bottom: 5rem;
}


.videos {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 2rem;
    overflow-x: auto;
    padding: 1rem 0;
    width: 82%;
}

.videos::-webkit-scrollbar {
    height: 8px;
}

.videos::-webkit-scrollbar-thumb {
    background-color: #444;
    border-radius: 8px;
}

.videos::-webkit-scrollbar-track {
    background: transparent;
}

.thumbnail {
    width: 352px;
    height: 196px;
    object-fit: cover;
    border-radius: 0;
    transition: transform 0.3s ease;
    display: block;
}


.video-card {
    flex: 0 0 auto;
    cursor: pointer;
    position: relative;
    border: 3px solid transparent;
    border-radius: 12px;
    overflow: hidden;
    transition: border 0.3s ease;
}

.video-card.selected {
    border: 3px solid #3390ff;
}

.video-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    text-align: center;
    padding: 0.5rem 0;
    font-size: 1rem;
}

.modal-video-wrapper {
    width: 85vw;
}

.drafts-title {
    width: 90%;
}

.drafts-title h3 {
    color: #3390ff;
    text-align: left;
    margin: 0;
}

.videos-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 90%;
    gap: 2rem;
}

.videos {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 2rem;
    flex-grow: 1;
}

.video-placeholder {
    width: 352px;
    height: 196px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.video-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
}

.video-placeholder img:hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    border: 0.2rem solid #3390ff;
}
</style>
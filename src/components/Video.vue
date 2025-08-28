<script setup>
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
</script>


<template>
    <div class="video-header">
        <div class="back-button-wrapper">
            <div class="back-button" @click="$router.go(-1)">
                <ArrowLeftIcon class="icon" />
                <span>Tilbake</span>
            </div>
        </div>
        <div>
            <h3 id="comment-header">KOMMENTARER</h3>
        </div>

    </div>

    <div class="video-container">
        <div class="video">
            <slot></slot>
        </div>

        <div class="comments">
            <ul class="comment-list">
                <li class="comment-item" v-for="comment in comments" :key="comment.id"
                    @click="goToTimestamp(comment.timestampInSeconds)">
                    <div class="comment-body">
                        <span class="username">{{ comment.timestampInSeconds.slice(0, 3) }}</span>
                        <p class="comment-text">{{ comment.comment }}</p>
                    </div>
                </li>
            </ul>

            <div class="under-video">
                <p class="timestamp">{{ timestamp.toFixed(2) }}s</p>
                <input type="text" placeholder="Legg til kommentar..." class="comment-input" v-model="commentText" />
                <button :class="{ 'active': commentText.length > 0 }" :disabled="commentText.length === 0"
                    class="comment-btn" @click="comment">Kommenter</button>
            </div>
        </div>
    </div>
    <div class="video-title">
        <a :href="videoUrl + videoName" :download="videoName" class="download-link">
            <ArrowDownTrayIcon class="upload-icon" />
        </a>
        <h3>{{ videoName.slice(0, -18) }}</h3>
    </div>

</template>



<script>
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';


export default {

    props: ['timestamp', 'videoId', 'videoName'],
    emits: ['goToTimestamp'],
    data() {
        return {
            commentText: '',
            comments: []
        }
    },
    methods: {
        comment() {
            this.comments.push({
                comment: this.commentText,
                timestampInSeconds: this.timestamp
            })

            var comment = {
                comment: this.commentText,
                timestampInSeconds: this.timestamp
            }

            axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/` + this.videoId + '/comment', comment, tokenStore().headers)
                .then(response => console.log(response))
                .catch(error => console.log(error))
        },
        goToTimestamp(timestamp) {
            this.$emit('goToTimestamp', timestamp)
        }
    },
    computed: {
        videoUrl() {
            const backend = import.meta.env.VITE_BACKEND_URL;
            return `${backend}/media/videos/`;
        }
    },

    mounted() {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/` + this.videoId + '/comment', tokenStore().headers)
            .then(response => {
                this.comments = response.data
            })
            .catch(error => console.log(error))
    },
    watch: {
        videoId(newId, oldId) {
            if (newId !== oldId) {
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/${newId}/comment`, tokenStore().headers)
                    .then(response => {
                        this.comments = response.data
                    })
                    .catch(error => console.log(error))
            }
        }
    }



}

</script>


<style scoped>
.video-container {
    display: flex;
    flex-direction: row;
    gap: 5rem;
    background-color: #000000;
    padding: 2rem;
    border-radius: 10px;
    color: white;
    max-width: 100%;
    padding-bottom: 1rem;
}

.video {
    flex: 3;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

:deep(video) {
    border-radius: 10px;
    width: 66rem;
    height: auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
}

.timestamp {
    color: white;
    font-weight: bold;
    font-size: 1rem;
}

.comment-input {
    flex: 1;
    padding: 0.6rem 1rem;
    border-radius: 12px;
    border: none;
    outline: none;
    font-size: 1rem;
    background-color: #1a1a1a;
    color: white;
}

.comment-btn {
    background-color: #333;
    color: #aaa;
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 12px;
    cursor: not-allowed;
    transition: 0.3s;
}

.comment-btn.active {
    background-color: #3390ff;
    color: white;
    cursor: pointer;
}

.comment-item {
    background-color: #222;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.3s;
}

.comment-item:hover {
    background-color: #2a2a2a;
}

.comment-body {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.username {
    font-weight: bold;
    color: #3390ff;
    margin-bottom: 0.3rem;
}

.comment-text {
    color: #ccc;
    font-size: 0.8rem;
    line-height: 1.4;
}

.comments {
    flex: 2;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    padding: 1rem;
    min-height: 37.5rem;
    max-height: 37.5rem;
    overflow: hidden;
    max-width: 29rem;
}

.comment-list {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    padding: 0;
    margin: 0;
    scrollbar-width: thin;
    scrollbar-color: #555 transparent;
}

.comment-list::-webkit-scrollbar {
    width: 8px;
}

.comment-list::-webkit-scrollbar-thumb {
    background-color: #444;
    border-radius: 8px;
}

.comment-list::-webkit-scrollbar-track {
    background: transparent;
}

.under-video {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
}

h3 {
    margin: 0;
}

.video-header {
    display: flex;
    flex-direction: row;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: space-between;
    padding: 0 4rem;
}

.video-title {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding-left: 2rem;
}

.upload-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
}

h3#comment-header {
    color: #3390ff;

}

.back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #3390ff;
    font-weight: 500;
    margin: 1rem 0;
    transition: color 0.3s ease;
    width: 5rem;
}

.back-button:hover {
    color: #1e70d7;
    cursor: pointer;
}

.back-button .icon {
    width: 24px;
    height: 24px;
}

.download-link {
    display: flex;
    align-items: center;
    color: white;
    transition: color 0.3s ease;
}

.download-link:hover .upload-icon {
    color: #3390ff;
}
</style>
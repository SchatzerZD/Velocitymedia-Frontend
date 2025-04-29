<template>

    <div class="video-container">
        <div class="video">
            <slot></slot>

            <div class="under-video">
                <p class="timestamp">{{ timestamp.toFixed(2) }}s</p>
                <input type="text" placeholder="Add a comment with the current timestamp..." class="comment-input"
                    v-model="commentText" />
                <button :class="{ 'active': commentText.length > 0 }" :disabled="commentText.length === 0"
                    class="comment-btn" @click="comment">Comment</button>
            </div>

        </div>
        <div class="comments">
            <ul class="comment-list">
                <li class="comment-item" v-for="comment in comments" :key="comment.id"
                    @click="goToTimestamp(comment.timestampInSeconds)">
                    <div class="comment-body">
                        <span class="username">{{ comment.timestampInSeconds }}</span>
                        <p class="comment-text">{{ comment.comment }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>



</template>


<script>
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';


export default {

    props: ['timestamp', 'videoId'],
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

            axios.post('http://localhost:8080/video/' + this.videoId + '/comment', comment, tokenStore().headers)
                .then(response => console.log(response))
                .catch(error => console.log(error))
        },
        goToTimestamp(timestamp) {
            this.$emit('goToTimestamp', timestamp)
        }
    },
    mounted() {
        axios.get('http://localhost:8080/video/' + this.videoId + '/comment', tokenStore().headers)
            .then(response => {
                this.comments = response.data
            })
            .catch(error => console.log(error))
    },
    updated() {
        axios.get('http://localhost:8080/video/' + this.videoId + '/comment', tokenStore().headers)
            .then(response => {
                this.comments = response.data
            })
            .catch(error => console.log(error))
    }


}

</script>


<style scoped>
.video-container {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    background-color: #000;
    padding: 2rem;
    border-radius: 20px;
    color: white;
    max-width: 100%;
}

.video {
    flex: 3;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.video ::v-deep video {
    border-radius: 20px;
    width: 100%;
    height: auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
}

.under-video {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
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

.comments {
    flex: 2;
    display: flex;
    flex-direction: column;
    background-color: #111;
    border-radius: 20px;
    padding: 1rem;
    overflow-y: auto;
    max-height: 100%;
}

.comment-list {
    list-style: none;
    padding: 0;
    margin: 0;
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
}

.username {
    font-weight: bold;
    color: #3390ff;
    margin-bottom: 0.3rem;
}

.comment-text {
    color: #ccc;
    font-size: 0.95rem;
    line-height: 1.4;
}
</style>
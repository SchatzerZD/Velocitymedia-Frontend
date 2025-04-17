<template>

    <div class="video-container">
        <div class="video">
            <slot></slot>

            <div class="under-video">
                <p class="timestamp">{{ timestamp.toFixed(2) }}s</p>
                <input type="text" placeholder="Add a comment..." class="comment-input" v-model="commentText" />
                <button :class="{ 'active': commentText.length > 0 }" :disabled="commentText.length === 0"
                    class="comment-btn" @click="comment">Comment</button>
            </div>

        </div>
        <div class="comments">
            <ul class="comment-list">
                <li class="comment-item" v-for="comment in comments" :key="comment.id">
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
                timestamp: this.timestamp,
                text: this.commentText
            })

            var comment = {
                comment: this.commentText,
                timestampInSeconds: this.timestamp
            }

            axios.post('http://localhost:8080/video/' + this.videoId + '/comment', comment, tokenStore().headers)
                .then(response => console.log(response))
                .catch(error => console.log(error))
        }
    },
    mounted() {
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
    gap: 4rem;
}

.video {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.comments {
    max-width: 400px;
    max-height: 56vh;
    overflow-y: auto;
    padding-right: 8px;
    scrollbar-gutter: stable;
}


.under-video {
    display: flex;
    flex-direction: row;
    gap: 3rem;
}

.comment-input {
    width: 100%;
    max-width: 600px;
    padding: 10px 12px;
    font-size: 16px;
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    background-color: transparent;
    transition: border-color 0.3s;
    color: white;
}

.comment-input:focus {
    border-bottom: 2px solid #065fd4;
    background-color: transparent;
}

.comment-input::placeholder {
    color: #606060;
    font-size: 16px;
}

.comment-list {
    list-style: none;
    padding: 0;
    margin: 20px 0;
}

.comment-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 0;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 2rem;
}



.comment-body {
    flex: 1;
}

.comment-text {
    font-size: 14px;
    color: white;
    line-height: 1.4;
    word-wrap: break-word;
    white-space: normal;
    min-width: 20vw;
}

.comment-btn {
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 5px;
    background-color: #f2f2f2;
    color: #606060;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
}

.comment-btn:hover {
    background-color: #e0e0e0;
}

.comment-btn:disabled {
    background-color: #f2f2f2;
    color: #aaa;
    cursor: default;
}

.comment-btn.active {
    background-color: #065fd4;
    color: #fff;
}

.username {
    display: block;
    font-weight: 500;
    margin-bottom: 4px;
    color: #aaa;
}

.timestamp {
    color: #aaa;
}
</style>
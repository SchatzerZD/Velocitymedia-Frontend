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
    }

}

</script>


<style scoped></style>
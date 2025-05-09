<script setup>
import Row from '../components/Row.vue'
import Box from '../components/Box.vue';
import Log from './tools/Log.vue';
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';
import { useRoute } from 'vue-router';

</script>

<template>

    <Row v-if="loggedIn" class="container">

        <RouterLink to="/">
            <div class="dots" :class="{ completeDots: contractComplete }">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </RouterLink>

        <RouterLink to="/BTS">
            <Box :class="{ complete: productionComplete }">
                <h2>FILMING</h2>
            </Box>
        </RouterLink>

        <template v-for="flag in videoFlags" :key="flag">
            <div class="dots">
                <span></span><span></span><span></span>
            </div>
            <RouterLink :to="{ name: 'Draft', query: { flag: flag } }">
                <Box :class="{ complete: completedFlags.includes(flag) }">
                    <h2 :class="{ blue: !completedFlags.includes(flag) }">{{ flag }}</h2>
                </Box>
            </RouterLink>
        </template>

        <RouterLink to="/">
            <div class="dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </RouterLink>

    </Row>


</template>

<script>


export default {

    data() {
        return {
            loggedIn: false,

            contractComplete: false,

            productionComplete: false,
            clippingComplete: false,

            videoFlags: null,
            completedFlags: []

        }
    },
    mounted() {
        if (tokenStore().user.jwt) {
            this.loggedIn = true;
        }

        const route = useRoute()
        this.contractComplete = route.query.contractComplete === 'true'

        axios.get(`http://localhost:8080/user/projects/${tokenStore().user.projectId}/flags`, tokenStore().headers)
            .then(response => {
                const backendFlags = response.data;

                const enumOrder = ['CLIPPING', 'GRADING', 'VFX', 'SFX'];
                this.videoFlags = enumOrder.filter(flag => backendFlags.includes(flag));
            })
            .catch(error => console.log(error));
    }


}

</script>

<style scoped>
.container {
    margin-top: 8rem;
}

.dots {
    color: #3aaaff;
    font-size: 4rem;
    font-weight: bold;
    margin: auto 0.6rem;
    display: flex;
    flex-direction: row;
    height: 6rem;
    gap: 1rem;
    justify-content: center;
    align-items: center;
}

.dots span {
    border: 0.45rem solid #3aaaff;
    border-radius: 4px;
    padding: none;
    margin: none;
    height: 0.1rem;
}

.row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 3rem;
}

a {
    text-decoration: none;
    color: inherit;
}

.blue {
    color: #3aaaff
}

.complete {
    background-color: #3aaaff;
    color: white;
}

.container {
    transform: scale(0);
    animation: zoomIn 0.5s ease forwards;
}


@keyframes zoomIn {
    from {
        transform: scale(0);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.completeDots {
    background-color: #3aaaff;
    height: 50%;
    border-radius: 100px;
}





@media(max-width:750px) {
    .row {
        flex-direction: column
    }

    .dots {
        flex-direction: column;
    }

    .box {
        min-width: 220px;
    }
}
</style>
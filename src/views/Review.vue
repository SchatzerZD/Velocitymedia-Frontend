<script setup>
import Row from '../components/Row.vue'
import Box from '../components/Box.vue';
import Log from './tools/Log.vue';
import { tokenStore } from '@/stores/tokenStore';
import axios from 'axios';

</script>

<template>

    <Row v-if="loggedIn" class="container">
        <RouterLink to="/BTS">
            <Box :class="{ complete: productionComplete }">
                <h2>PRODUKSJON</h2>
            </Box>
        </RouterLink>

        <div class="dots">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <RouterLink :to="{ name: 'Draft' }">
            <Box>
                <h2 :class="{ blue: !productionComplete }">KLIPPING</h2>
            </Box>
        </RouterLink>

        <div class="dots">
            <span></span>
            <span></span>
            <span></span>
        </div>


    </Row>


</template>

<script>


export default {

    data() {
        return {
            loggedIn: false,

            productionComplete: false,
            clippingComplete: false,


        }
    },
    async mounted() {
        if (tokenStore().user.jwt) {
            this.loggedIn = true
        }

        await axios.get('http://localhost:8080/video/', tokenStore().headers)
            .then(response => {
                if (response.data.length > 0) {
                    this.productionComplete = true
                }
            })
            .catch(error => console.log(error.response.data))

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
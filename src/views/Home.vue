<script setup>
import Row from '../components/Row.vue'
import Box from '../components/Box.vue';
import Log from './tools/Log.vue';
import { tokenStore } from '@/stores/tokenStore';
</script>

<template>

    <Row v-if="loggedIn">
        <RouterLink to="/404">
            <Box>
                <h2>KONTRAKT</h2>
            </Box>
        </RouterLink>

        <div class="dots">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <RouterLink :to="{ name: 'Draft' }">
            <Box>
                <h2>GJENNOMGANG</h2>
            </Box>
        </RouterLink>

        <div class="dots">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <RouterLink to="/404">
            <Box>
                <h2>FAKTURA</h2>
            </Box>
        </RouterLink>

    </Row>

    <div class="log-wrapper">
        <Log maxLogs="3" />
    </div>


</template>

<script>


export default {

    data() {
        return {
            loggedIn: false
        }
    },
    mounted() {
        if (tokenStore().user.jwt) {
            this.loggedIn = true
        }
    }

}

</script>

<style scoped>
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

.log-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
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
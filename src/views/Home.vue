<script setup>
import Row from '../components/Row.vue'
import Box from '../components/Box.vue';
import { tokenStore } from '@/stores/tokenStore';
</script>

<template>

    <h1>VELOCITY <span>FLOW</span></h1>

    <Row v-if="loggedIn">
        <RouterLink :to="{ name: 'BTS' }">
            <Box>
                <h2>KONTRAKT</h2>
            </Box>
        </RouterLink>

        <div class="dots">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <RouterLink :to="{ name: 'Log' }">
            <Box>
                <h2>GJENNOMGANG</h2>
            </Box>
        </RouterLink>

        <div class="dots">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <RouterLink :to="{ name: 'Draft' }">
            <Box>
                <h2>FAKTURA</h2>
            </Box>
        </RouterLink>

    </Row>

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
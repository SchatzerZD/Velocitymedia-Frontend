<script setup>
import Row from '../components/Row.vue'
import Box from '../components/Box.vue';
import { tokenStore } from '@/stores/tokenStore';
</script>

<template>

    <h1>HOME PAGE</h1>

    <Row v-if="loggedIn">
        <RouterLink :to="{ name: 'BTS' }">
            <Box>
                <h2>BTS</h2>
            </Box>
        </RouterLink>

        <RouterLink :to="{ name: 'Log' }">
            <Box>
                <h2>Log</h2>
            </Box>
        </RouterLink>

        <RouterLink :to="{ name: 'Draft' }">
            <Box>
                <h2>Draft</h2>
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
a {
    text-decoration: none;
}

h1 {
    text-align: center;
    margin: 0 auto;
    margin-top: 3rem;
    margin-bottom: 11rem;
}
</style>
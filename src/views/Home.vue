<script setup>
import Row from '../components/Row.vue'
import Box from '../components/Box.vue';
import { tokenStore } from '@/stores/tokenStore';
</script>

<template>

<h1>HOME PAGE</h1>


    <Row>
        <Box>
            <h2>test1</h2>
        </Box>
        <Box>
            <h2>test2</h2>
        </Box>
        <Box>
            <h2>test3</h2>
        </Box>
    </Row>

</template>

<script>


export default {

    data() {
        return {
            
        }
    },
    mounted() {
        console.log(tokenStore().user.jwt)
        console.log(tokenStore().user.username)
    }

}

</script>

<style scoped>


h1{
    text-align: center;
    margin: 0 auto;
    margin-top: 3rem;
    margin-bottom: 16rem;
}

</style>
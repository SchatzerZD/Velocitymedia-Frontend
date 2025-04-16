

<template>

<h1>HOME PAGE</h1>


</template>

<script>
import { tokenStore } from '@/stores/tokenStore';


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
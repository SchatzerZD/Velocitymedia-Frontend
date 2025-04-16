

<template>

<h1>HOME PAGE</h1>


<div class="row">
    <div class="box">
        
    </div>
    <div class="box">

    </div>
    <div class="box">

    </div>
</div>


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

<style scoped>

.row{
    display:flex
}

h1{
    text-align: center;
    margin: 0 auto;
    margin-top: 3rem;
}

</style>
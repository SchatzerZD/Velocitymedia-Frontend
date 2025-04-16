<template>

    <div class="box">
        <slot></slot>
    </div>


    
</template>


<script>

export default {

}

</script>


<style scoped>

.box{
    background-color: lightgray;
    width: 17rem;
    height: 12rem;
    color: black;
    border-radius: 1rem;
    box-shadow: 10px 5px 5px black;
}

.box:hover{
    cursor: pointer;
    scale: 1.1;
    transition-duration: 0.3s;
}

</style>
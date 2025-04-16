<template>

    <div class="row">
        <slot></slot>
    </div>


</template>


<style scoped>

.row{
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex: 0 0 33.3333%;
    margin: 0 auto;
    width: 66%;
    margin-bottom: 15%;
    gap: 5rem;
    justify-content: center;
}


</style>
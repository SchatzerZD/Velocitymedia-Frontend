<template>

<div class="backdrop">
    <div class="modal" :class="{ black: theme === 'black'}">
        <div id="top">
            <span id="closeButton" @click="closeModal">X</span>
        </div>

        <slot></slot>
    </div>
</div>
    
    
</template>

<script>

export default {

    props:['theme'],
    data(){
        return{

        }
    },
    methods:{
        closeModal(){
            this.$emit('closeModal')
        }
    }

}

</script>


<style scoped>

.modal {
    padding: 5rem;
    max-width: 93%;
    margin: 5rem auto;
    background: white;
    border-radius: 10px;
    display: inline-block;
}

.black{
    background-color: rgb(24, 22, 22);
}

.backdrop {
    top: 0;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    z-index: 1003;
    align-items: center;
    justify-content: center;
    display: flex;
}

#top{
    text-align: right;
    font-size: 30px;
    font-weight: bold;
    color: gray;
}

#closeButton:hover{
    cursor: pointer;
    color: red;
}


</style>
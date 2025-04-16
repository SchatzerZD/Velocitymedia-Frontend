<template>

<div class="backdrop">
    <div class="modal">
        <div id="top">
            <span id="closeButton" @click="closeModal">X</span>
        </div>

        <slot></slot>
    </div>
</div>
    
    
</template>

<script>

export default {

    methods:{
        closeModal(){
            this.$emit('closeModal')
        }
    }

}

</script>


<style scoped>

.modal {
    width: 25rem;
    padding: 20px;
    margin: 5rem auto;
    background: white;
    border-radius: 10px;

}

.backdrop {
    top: 0;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    z-index: 1003;
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
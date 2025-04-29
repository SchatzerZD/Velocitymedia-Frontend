<template>

    <div class="backdrop">
        <div class="modal" :class="{ black: theme === 'black' }">
            <div id="top">
                <span id="closeButton" @click="closeModal">X</span>
            </div>

            <slot></slot>
        </div>
    </div>


</template>

<script>

export default {

    props: ['theme'],
    data() {
        return {

        }
    },
    methods: {
        closeModal() {
            this.$emit('closeModal')
        }
    }

}

</script>


<style scoped>
.modal {
    background-color: white;
}
</style>
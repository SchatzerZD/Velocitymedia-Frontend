<template>
    <div class="backdrop">
        <div class="modal" :class="{ black: theme === 'black' }">
            <div id="top">
                <span id="closeButton" @click="closeModal">×</span>
            </div>

            <div class="modal-content" :class="{ large: theme === 'large' }">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['theme'],
    methods: {
        closeModal() {
            this.$emit('closeModal');
        }
    }
}
</script>

<style scoped>
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background-color: white;
    color: black;
    border-radius: 16px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 30px rgba(0, 123, 255, 0.3);
    border: 2px solid #007bff;
    font-family: 'Arial', sans-serif;
}

.modal.black {
    background-color: #0d0d0d;
    color: white;
}

#top {
    display: flex;
    justify-content: flex-end;
}

#closeButton {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10;
    transition: color 0.3s;
}

#closeButton:hover {
    color: #00bfff;
}

.modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.large {
    width: 50vw;
}
</style>
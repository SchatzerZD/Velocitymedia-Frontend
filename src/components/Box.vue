<template>
    <div class="box">
        <slot id="slot"></slot>
    </div>
</template>

<script>
export default {}
</script>

<style scoped>
.box {
    border: 3px solid #3aaaff;
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    margin: 0 1rem;
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.box:hover {
    transform: translateY(-5px);
    background-color: rgba(58, 170, 255, 0.1);
}
</style>
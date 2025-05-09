<template>

    <div class="container">
        <h1>404</h1>
        <h2>Page not found</h2>
    </div>


</template>

<script>
export default {
    mounted() {
        this.$emit('notFound')
    }
}

</script>

<style scoped></style>
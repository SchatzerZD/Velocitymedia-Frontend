<template>

    <div class="row">
        <slot></slot>
    </div>

</template>

<script>


</script>


<style scoped>
.row {
    opacity: 0;
    animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
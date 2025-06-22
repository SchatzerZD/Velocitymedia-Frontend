<template>
    <transition name="slide">
        <div class="sidebar" v-if="visible">
            <nav class="sidebar-content">
                <slot></slot>
            </nav>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style scoped></style>
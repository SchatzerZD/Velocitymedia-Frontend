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

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.4s ease, opacity 0.4s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.sidebar {
    height: 100vh;
    background: linear-gradient(135deg, #0d0d1a, #1a1a2e, #23234d);
    width: 15vw;
    min-width: 200px;
    max-width: 280px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1004;
    box-shadow: 4px 0 15px rgba(0, 0, 0, 0.6);
    padding: 2rem 1rem;
    overflow-y: auto;
}

.sidebar-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

:deep(.sidebar-content a),
:deep(.sidebar-content button),
:deep(.sidebar-content div) {
    color: #bfc9ff;
    font-size: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    transition: background 0.2s, transform 0.2s;
    cursor: pointer;
    text-decoration: none;
}

:deep(.sidebar-content a:hover),
:deep(.sidebar-content button:hover),
:deep(.sidebar-content div:hover) {
    background-color: rgba(255, 255, 255, 0.07);
    transform: translateX(5px);
    color: #ffffff;
}
</style>
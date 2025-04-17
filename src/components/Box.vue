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
    background: linear-gradient(135deg, #1a1a2e, #23234d);
    width: 17rem;
    height: 12rem;
    color: #f5f5f5;
    border-radius: 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.4s ease;
    position: relative;
    overflow: hidden;
}

.box:hover {
    cursor: pointer;
    transform: scale(1.05);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.75);
    background: linear-gradient(135deg, #2f2f5a, #3a3a6f);
}

.box::after {
    content: "";
    position: absolute;
    inset: 0;
    border: 2px solid rgba(86, 204, 242, 0.15);
    border-radius: inherit;
    pointer-events: none;
    transition: border 0.3s ease;
}

.box:hover::after {
    border-color: rgba(86, 204, 242, 0.35);
}
</style>
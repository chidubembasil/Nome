<template>
    <HeaderView/>
    <main>

    </main>
    <FooterView/>
</template>
<script setup>
import HeaderView from '../components/HeaderView.vue';
import FooterView from '../components/FooterView.vue';
</script>
<style scoped>
    main{
        width: 100%;
        height: fit-content;
        background-color: transparent;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: var(--foreground);
        margin-top: 10dvh;
    }
</style>

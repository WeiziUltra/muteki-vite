<template>
    <van-nav-bar title="我的"/>
    <wei-tabbar activeTab="me"></wei-tabbar>
</template>

<script>
    import {defineAsyncComponent} from 'vue';
    import {NavBar} from 'vant';

    export default {
        name: "Me",
        components: {
            [NavBar.name]: NavBar,
            'wei-tabbar': defineAsyncComponent(() => import('@/components/tabbar/Index.vue'))
        },
    }
</script>
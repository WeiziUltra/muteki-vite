<template>
    <van-nav-bar title="自定义页面"/>
    <wei-tabbar activeTab="customize"></wei-tabbar>
</template>

<script>
    import {defineAsyncComponent} from 'vue';
    import {NavBar} from 'vant';

    export default {
        name: "Customize",
        components: {
            [NavBar.name]: NavBar,
            'wei-tabbar': defineAsyncComponent(() => import('@/components/tabbar/Index.vue'))
        },
    }
</script>
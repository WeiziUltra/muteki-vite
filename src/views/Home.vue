<template>
    <NavBar title="首页"/>
    <template v-for="nav in navList" :key="nav.title">
        <Cell is-link
              :title="nav.title"
              :to="nav.to"/>
    </template>
    <WeiTabbar activeTab="home"></WeiTabbar>
</template>

<script setup>
    import {NavBar, Cell} from 'vant';
    import {ref, reactive} from 'vue';
    import WeiTabbar from '@/components/tabbar/Index.vue';

    //路由列表
    let navList = reactive([
        {title: '登录页', to: '/login'},
        {title: '分页列表', to: '/demo/list'},
        {title: 'demo', to: '/demo/demo'},
        {title: '高德地图', to: '/demo/amap'},
        {title: 'ant组件', to: '/demo/ant'},
        {title: '预览pdf', to: '/demo/pdf'},
    ]);

</script>
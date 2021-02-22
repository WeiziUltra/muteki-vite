<template>
    <van-nav-bar title="首页"/>
    <template v-for="nav in navList" :key="nav.title">
        <van-cell is-link
                  :title="nav.title"
                  :to="nav.to"/>
    </template>
    <wei-tabbar activeTab="home"></wei-tabbar>
</template>

<script>
    import {NavBar, Cell} from 'vant';
    import {defineAsyncComponent, ref, reactive} from 'vue';

    export default {
        name: 'Home',
        components: {
            [NavBar.name]: NavBar,
            [Cell.name]: Cell,
            'wei-tabbar': defineAsyncComponent(() => import('@/components/tabbar/Index.vue'))
        },
        setup() {
            //路由列表
            let navList = reactive([
                {title: '登录页', to: '/login'},
                {title: '分页列表', to: '/demo/list'},
                {title: 'demo', to: '/demo/demo'},
            ]);

            return {
                navList
            }
        }
    }
</script>
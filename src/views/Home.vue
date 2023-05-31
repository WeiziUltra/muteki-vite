<template>
    <van-nav-bar title="首页"/>
    <template v-for="item in nav.list" :key="item.title">
        <van-cell :title="item.title" is-link
                  @click="nav.click(item)"/>
    </template>
    <WeiTabbar activeTab="home"></WeiTabbar>
</template>

<script setup>
    import {ref, reactive} from 'vue';
    import WeiTabbar from '@/components/tabbar/Index.vue';
    import {useRouter} from 'vue-router';
    import $vant from '@/utils/vant';

    const $router = useRouter();

    //路由
    let nav = reactive({
        list: [
            {title: '分页列表', to: '/demo/list'},
            {title: 'demo', to: '/demo/demo'},
            {title: '高德地图', to: '/demo/amap'},
            {title: 'ant组件', to: '/demo/ant', routerDisable: true},
            {title: '预览pdf', to: '/demo/pdf', routerDisable: true},
        ],
        click(item) {
            if (item['routerDisable']) {
                $vant.toast('请在router/index.js里面放开注释');
                return;
            }
            $router.push(item['to']);
        }
    });

</script>
<template>
    <NavBar title="登录"
            left-text="返回" left-arrow
            @clickLeft="navLeftClick"/>
    <Empty description="自动登录中。。。"/>
</template>

<script setup>
    import {NavBar, Empty} from 'vant';
    //引入router
    import {useRouter} from 'vue-router';

    const $router = useRouter();
    const navLeftClick = () => {
        $router.go(-1);
    }

</script>
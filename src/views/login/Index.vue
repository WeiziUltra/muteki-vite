<template>
    <van-nav-bar title="登录"
                 left-text="返回" left-arrow
                 @clickLeft="navLeftClick"/>
    <van-empty description="自动登录中。。。"/>
</template>

<script setup>
    //引入router
    import {useRouter} from 'vue-router';

    const $router = useRouter();
    const navLeftClick = () => {
        $router.go(-1);
    }

</script>
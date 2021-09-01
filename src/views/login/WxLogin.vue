<template>
    <div></div>
</template>

<script setup>
    //引入router
    import {useRouter, useRoute} from 'vue-router';
    import {onMounted} from 'vue';
    import $global from '@/utils/global';
    import $axios from '@/utils/axios';
    import $function from '@/utils/function';

    const $router = useRouter();

    /**
     * 获取页面中的code
     * @param key
     */
    const getCode = () => {
        let url = window.location.href;
        if (!url.includes('?')) {
            return '';
        }
        let startIndex = url.indexOf('?') + 1;
        let str = url.substr(startIndex);
        let strArr = str.split('&');
        let code = '';
        for (let i = 0; i < strArr.length; i++) {
            let arr = strArr[i].split('=');
            if ('code' !== arr[0]) {
                continue;
            }
            code = arr[1];
        }
        return code;
    }

    onMounted(() => {
        //如果是开发环境
        if ('development' === import.meta.env.MODE) {
            $function.setLocationStorage('token', '111');
            $router.push('/home');
            return;
        }

        let code = getCode();
        if ('' === code) {
            //如果没有code,请求后台重定向
            window.location.href = `${import.meta.env.VITE_APP_URL}${$global.api.getRedirectUri}`;
            return;
        }
        $axios({
            url: $global.api.login,
            method: 'post',
            data: {
                code
            },
            success(data) {
                $function.setLocationStorage('token', data);
                let {origin, pathname} = window.location;
                /**
                 * 解决hash路由多余参数问题
                 * http://xxx.jingbo.net/wechat/?code=011s4Fkl2GmdB64Gxbol2eh5zF4s4Fky&state=666#/
                 * ↓↓↓↓↓跳转到↓↓↓↓↓
                 * http://xxx.jingbo.net/wechat/#/home
                 */
                window.location.href = `${origin}${pathname}#/home`;
            }
        });
    });

</script>
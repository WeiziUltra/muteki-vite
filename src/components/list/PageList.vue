<template>
    <van-pull-refresh v-model="pull.loading"
                      :pulling-text="pullingText"
                      :loosing-text="loosingText"
                      :success-text="successText"
                      @refresh="pull.onRefresh">
        <van-list v-model:loading="onLoad.loading"
                  :finished="onLoad.finish"
                  :finished-text="finishText"
                  v-model:error="error.error"
                  :error-text="error.errorText"
                  :offset="offset"
                  :loading-text="loadingText"
                  @load="onLoad.load">
            <template v-if="!error.error">
                <slot></slot>
            </template>
        </van-list>
    </van-pull-refresh>
</template>
<!--分页列表，包含下拉刷新和上拉加载-->
<!--@change:list改变时触发，内置参数list(改变后的数组)-->
<script setup>
    import {showLoadingToast, allowMultipleToast} from 'vant';
    import 'vant/es/toast/style';
    import 'vant/es/dialog/style';
    import 'vant/es/notify/style';

    /**引入axios*/
    import axios from "axios";
    /**引入参数处理*/
    import Qs from 'qs';
    import {ref, reactive, computed, defineEmits} from 'vue';
    import $function from '@/utils/function.ts';
    import $vant from '@/utils/vant.ts';
    //引入router
    import {useRouter} from 'vue-router';

    //允许同时存在多个toast
    allowMultipleToast();

    const props = defineProps({
        //是否允许请求
        allowRequest: {
            type: Boolean,
            default: true
        },
        //请求的url
        url: {
            type: String
        },
        //请求的参数
        data: {
            type: Object,
            default: () => {
            }
        },
        //请求方式
        method: {
            type: String,
            default: 'get'
        },
        //contentType
        contentType: {
            type: String,
            default: 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        //请求超时时间
        timeout: {
            type: Number,
            default: 20000
        },
        //每页数量
        pageSize: {
            type: Number,
            default: 10
        },
        //下拉过程提示文案
        pullingText: {
            type: String,
            default: '下拉即可刷新...'
        },
        //释放过程提示文案
        loosingText: {
            type: String,
            default: '释放即可刷新...'
        },
        //刷新成功提示文案
        successText: {
            type: String,
            default: '刷新成功'
        },
        //刷新成功提示展示时长(ms)
        successDuration: {
            type: Number,
            default: 500
        },
        //动画时长
        animationDuration: {
            type: Number,
            default: 300
        },
        //滚动条与底部距离小于 offset 时触发load事件
        offset: {
            type: Number,
            default: 100
        },
        //加载过程中的提示文案
        loadingText: {
            type: String,
            default: '加载中...'
        },
        //加载完成后的提示文案
        finishedText: {
            type: String,
            default: ''
        },
        //是否在初始化时立即执行滚动位置检查
        immediateCheck: {
            type: Boolean,
            default: true
        },
        //多长时间之后显示加载中动画,单位毫秒
        timeShowLoadAnimation: {
            type: Number,
            default: 222
        }
    });

    const $router = useRouter();

    let $emit = defineEmits(["change"]);

    //加载失败
    let error = reactive({
        error: false,
        text: '加载失败，请重试'
    });

    //分页
    let pageInfo = reactive({
        //当前页码
        pageNum: 1,
        //数据
        list: [],
    });

    //下拉刷新
    let pull = reactive({
        loading: false,
        onRefresh: () => {
            pull.loading = true;
            resetDataRequest();
        }
    });

    //上拉加载
    let onLoad = reactive({
        //加载中
        loading: false,
        //加载完成
        finish: false,
        //加载
        load: () => {
            onLoad.loading = true;
            requestData();
        }
    });

    //重置参数
    const resetDataRequest = () => {
        pageInfo.pageNum = 1;
        pageInfo.list = [];
        onLoad.finish = false;
        requestData();
    };

    //获取数据
    const requestData = () => {
        let {url, method, contentType, timeout, data = {}, pageSize, timeShowLoadAnimation, allowRequest} = props;
        if (!allowRequest) {
            onLoad.loading = false;
            return;
        }
        let _axios = {
            //请求的url
            url: import.meta.env.VITE_APP_URL + url,
            method,
            headers: {
                'Content-Type': contentType,
            },
            timeout
        };
        if (!$function.isBlank($function.getLocationStorage('token'))) {
            _axios['headers']['token'] = $function.getLocationStorage('token');
        }
        /**axios请求参数添加随机字符串*/
        data['__t'] = (new Date()).getTime();
        data['pageNum'] = pageInfo.pageNum;
        data['pageSize'] = pageSize;
        /**axios请求处理不同请求方式时的参数*/
        //get
        if ('GET' === method.toUpperCase()) {
            _axios['params'] = data;
        } else {
            _axios['data'] = Qs.stringify(data, {indices: false});
        }
        //开启加载中，防止重复请求数据
        onLoad.loading = true;
        /**timeShowLoadAnimation时间之后开启加载中动画*/
        let loading = null;
        let loadingTimer = setTimeout(() => {
            loading = showLoadingToast({
                message: '加载中...',
                forbidClick: true
            });
        }, timeShowLoadAnimation);
        axios(_axios).then((res) => {
            /**关闭加载中动画*/
            clearTimeout(loadingTimer);
            if (null != loading) {
                loading.close();
            }
            pull.loading = false;
            onLoad.loading = false;
            try {
                let {code, msg} = res['data'];
                /**token过期处理*/
                if (401 === code) {
                    error.error = true;
                    error.errorText = `登陆过期，自动登录中。。。`;
                    //保存最后一个页面
                    $function.setSessionStorage('_lastHref', window.location.href);
                    $router.replace('/ddLogin');
                    return;
                }
                /**处理code不为0的出错请求*/
                if (200 !== code) {
                    $vant.errorMsg(message || msg);
                    error.error = true;
                    error.errorText = message || msg;
                    console.warn(`url:${url}:请求出错，详情"${JSON.stringify(res['data'])}`)
                    return;
                }
                try {
                    let {list} = res['data']['data'];
                    error.error = false;
                    //如果为空，代表没数据
                    if (null == list || 0 >= list.length) {
                        onLoad.finish = true;
                    } else {
                        pageInfo.pageNum++;
                        pageInfo.list = pageInfo.list.concat(list);
                    }
                    try {
                        //对外抛出change事件
                        $emit('change', pageInfo.list);
                    } catch (e) {
                        console.error(e);
                    }
                } catch (e) {
                    error.errorText = `返回格式错误，示例:${JSON.stringify({
                        List: [],
                        pageNum: 1,
                        pageSize: 10
                    })}`;
                    console.warn(`url:${url}:请求出错，详情"${e}`);
                }
            } catch (e) {
                error.errorText = `加载失败，请重试。${e}`;
                console.warn(`url:${url}:请求出错，详情"${e}`);
            }
        }).catch(e => {
            /**关闭加载中动画*/
            clearTimeout(loadingTimer);
            if (null != loading) {
                loading.close();
            }
            pull.loading = false;
            onLoad.loading = false;
            error.error = true;
            error.errorText = `加载失败，请重试。${e}`;
            console.warn(`url:${url}:请求出错，详情"${e}`);
        });
    }

    //没有更多了
    let finishText = computed(() => {
        if (null == pageInfo.list
                || 0 >= pageInfo.list.length) {
            return '';
        }
        return '没有更多了';
    });

    /**
     * 对外抛出
     */
    defineExpose({
        resetDataRequest
    });

</script>
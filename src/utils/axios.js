/**引入axios*/
import axios from "axios";
/**引入参数处理*/
import Qs from 'qs';
/**引入vant组件*/
import {showLoadingToast} from 'vant';
/*引入全局方法*/
import $function from './function'
//引入封装的vant
import $vant from './vant';
//引入router
import $router from '../router/index.js';

//请求拦截器
axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        // 对请求错误的处理
        return Promise.reject(error);
    }
);

/**
 *
 * 封装axios请求
 *
 * @param isLock 启用锁，解决短时间多次点击,开启后相同的请求不会提交
 * @param allUrl 请求的url为完整url
 * @param allSuccess 返回所有成功回调,不包含status不是200的出错请求
 * @param url 请求地址
 * @param method 请求方式
 * @param contentType 请求头contentType
 * @param data 请求参数
 * @param timeout 请求超时时间---某些请求需要单独设置超时时间
 * @param timeShowLoadAnimation 多长时间之后显示加载中动画,单位毫秒
 * @param errShowAlert 异常信息展示弹窗
 * @param success 成功回调
 * @param fail 失败回调
 */
const myAxios = function (
    {
        isLock = false,
        allUrl = false,
        allSuccess = false,
        url = '',
        method = 'get',
        contentType = 'application/x-www-form-urlencoded; charset=UTF-8',
        data = {},
        timeout = parseInt(import.meta.env.VITE_APP_AXIOS_TIMEOUT || 20000),
        timeShowLoadAnimation = 555,
        errShowAlert = false,
        success = function () {
        },
        fail = function () {
        }
    } = {}) {
    //锁 key
    let lockKey = null;
    //开启锁
    if (isLock) {
        //创建key
        lockKey = $function.md5(url + '_' + method + '_' + JSON.stringify(data));
        //如果有值,代表请求中
        if ($function.getSessionStorage(lockKey)) {
            return;
        }
        //设置为true
        $function.setSessionStorage(lockKey, true);
    }
    /**timeShowLoadAnimation时间之后开启加载中动画*/
    let loading = null;
    let loadingTimer = setTimeout(() => {
        loading = showLoadingToast({
            message: '加载中...',
            forbidClick: true,
            duration: 0,
        });
        /*加载中页面无法操作，移除锁*/
        if (isLock) {
            $function.removeSessionStorage(lockKey);
        }
    }, timeShowLoadAnimation);
    let _axios = {
        //请求的url是否为全部url
        url: allUrl ? url : (import.meta.env.VITE_APP_URL + url),
        method,
        headers: {
            'Content-Type': contentType,
        },
        timeout
    };
    if (!$function.isBlank($function.getLocationStorage('token'))){
        _axios['headers']['token'] = $function.getLocationStorage('token');
    }
    /**axios请求参数添加随机字符串*/
    data['__t'] = (new Date()).getTime();
    /**axios请求处理不同请求方式时的参数*/
    //如果是文件
    if (contentType.includes('multipart/form-data')) {
        _axios['data'] = data;
    } else {
        //不是文件
        if ('GET' === method.toUpperCase()) {
            _axios['params'] = data;
        } else {
            _axios['data'] = Qs.stringify(data, {indices: false});
        }
    }
    axios(_axios).then((res) => {
        /*移除锁*/
        if (isLock) {
            $function.removeSessionStorage(lockKey);
        }
        /**关闭加载中动画*/
        clearTimeout(loadingTimer);
        if (null != loading) {
            loading.close();
        }
        /***请求的url如果是全部url的话,返回所有res['data']响应***/
        if (allUrl) {
            try {
                success(res['data']);
            } catch (e) {
                console.error(e);
            }
            return;
        }
        /**token过期处理*/
        if (401 === res.data.code) {
            //保存最后一个页面
            $function.setSessionStorage('_lastHref', window.location.href);
            $router.replace('/ddLogin');
            return;
        }
        /**返回所有成功回调,不包含status不是401的出错请求*/
        if (allSuccess) {
            try {
                success(res.data);
            } catch (e) {
                console.error(e);
            }
            return;
        }
        /**处理code不为0的出错请求*/
        if (200 !== res.data.code) {
            if (errShowAlert) {
                $vant.alert({
                    message: res.data.message || res.data.msg
                });
            } else {
                $vant.errorMsg(res.data.message || res.data.msg);
            }
            consoleWarnTable(`请求出错url:${url}`, res['data']);
            return;
        }
        /**成功回调*/
        try {
            success(res.data.data);
        } catch (e) {
            console.error(e);
        }
    }).catch((error) => {
        /*移除锁*/
        if (isLock) {
            $function.removeSessionStorage(lockKey);
        }
        /**关闭加载中动画*/
        clearTimeout(loadingTimer);
        if (null != loading) {
            loading.close();
        }
        // 如果请求被取消则进入该方法
        if (axios.isCancel(error)) {
            try {
                fail(error);
            } catch (e) {
                console.error(e);
            }
            return;
        }
        $vant.alert({
            title: '系统异常',
            message: (
                `message:${error['message']}`
                + `\r\n url:${url}`)
        });
        console.warn(`请求失败url:${url}`, error);
        try {
            fail(error);
        } catch (e) {
            console.error(e);
        }
    });
}

/**
 * 打印
 * @param msg
 * @param object
 */
function consoleWarnTable(msg, object = {}) {
    console.warn(msg);
    try {
        if (object instanceof Object) {
            console.table(object);
        } else {
            console.log(object);
        }
    } catch (e) {
        console.log('此浏览器不支持console.table()', e, '---错误详情:', object);
    }
    console.warn('↑↑以上为错误详情↑↑↑↑↑');
}

/**
 * 对外抛出
 */
export default myAxios;
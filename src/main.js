import {createApp} from 'vue'
import App from './App.vue'
import router from './router';
import $function from './utils/function';

// 这个库会在桌面端自动将mouse事件转换成对应的touch事件，使得组件能够在桌面端使用。
import '@vant/touch-emulator';

//判断新老版本是否一致
if (!reloadPage()) {
    //版本一致，正常执行
    createApp(App)
        .use(router)
        .mount('#app');
}

/**
 * 是否需要刷新页面
 */
function reloadPage() {
    //获取版本号
    let dom = document.getElementById('_appLastVersion');
    if (null == dom || null == dom.innerText) {
        return false;
    }
    let appLastVersion = dom.innerText;
    let oldAppLastVersion = $function.getLocationStorage('_appLastVersion');

    //如果原来没版本号
    if (null == oldAppLastVersion) {
        //设置版本
        $function.setLocationStorage('_appLastVersion', appLastVersion);
        return false;
    }

    //如果新老版本一致
    if (appLastVersion === oldAppLastVersion) {
        return false;
    }
    //新老版本不一致
    console.log('************************');
    console.log('发现发布新版本，即将刷新页面');
    console.log('************************');
    //设置版本
    $function.setLocationStorage('_appLastVersion', appLastVersion);
    //新老不一致，代表新版本发布,重载页面
    window.location.reload(true);
    return true;
}
import {createApp} from 'vue'
import App from './App.vue'
import router from './router';

// 这个库会在桌面端自动将mouse事件转换成对应的touch事件，使得组件能够在桌面端使用。
import '@vant/touch-emulator';
//引入vant常用弹窗样式
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';

let app = createApp(App);

app.use(router)
    .mount('#app');
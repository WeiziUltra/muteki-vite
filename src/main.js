import {createApp} from 'vue'
import App from './App.vue'
import router from './router';

// 这个库会在桌面端自动将mouse事件转换成对应的touch事件，使得组件能够在桌面端使用。
import '@vant/touch-emulator';

createApp(App)
    .use(router)
    .mount('#app');
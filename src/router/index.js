import {createRouter, createWebHashHistory} from 'vue-router';
/*浏览器上面进度条*/
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
    showSpinner: false, // 是否显示加载ico
});

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/Index.vue')
    },
    {
        path: '/me',
        name: 'me',
        meta: {
            title: '我的'
        },
        component: () => import('@/views/me/Index.vue')
    },
    {
        path: '/customize',
        name: 'customize',
        component: () => import('@/views/customize/Index.vue')
    },
    {
        path: '/demo',
        name: 'demo',
        component: () => import('@/views/demo/Index.vue'),
        redirect: '/demo/demo',
        children: [
            {
                path: 'demo',
                name: 'demo',
                component: () => import('@/views/demo/Demo.vue')
            },
            {
                path: 'list',
                name: 'list',
                component: () => import('@/views/demo/List.vue')
            },
            {
                path: 'amap',
                name: 'amap',
                component: () => import('@/views/demo/Amap.vue')
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        redirect: '/'
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    //如果设置标题就显示，没设置使用默认
    if (null != to.meta && null != to.meta.title && '' !== to.meta.title) {
        document.title = to.meta.title || import.meta.env.VITE_APP_TITLE;
    } else {
        document.title = import.meta.env.VITE_APP_TITLE;
    }
    //浏览器上方显示进度条
    NProgress.start();
    //正常放行
    next();
});

router.afterEach(transition => {
    //关闭浏览器上方的进度条
    NProgress.done();
});

export default router;
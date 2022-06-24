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
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/login',
        component: () => import('@/views/login/Index.vue')
    },
    {
        path: '/wxLogin',
        component: () => import('@/views/login/WxLogin.vue')
    },
    {
        path: '/me',
        meta: {
            title: '我的'
        },
        component: () => import('@/views/me/Index.vue')
    },
    {
        path: '/customize',
        component: () => import('@/views/customize/Index.vue')
    },
    {
        path: '/demo',
        component: () => import('@/views/demo/Index.vue'),
        redirect: '/demo/demo',
        children: [
            {
                path: 'demo',
                component: () => import('@/views/demo/Demo.vue')
            },
            {
                path: 'list',
                meta: {
                    title: '分页列表'
                },
                component: () => import('@/views/demo/List.vue')
            },
            {
                path: 'amap',
                meta: {
                    title: '高德地图'
                },
                component: () => import('@/views/demo/Amap.vue')
            },
            {
                path: 'ant',
                component: () => import('@/views/demo/Ant.vue')
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
    let title = import.meta.env.VITE_APP_TITLE;
    //如果设置标题就显示，没设置使用默认
    if (null != to.meta && null != to.meta.title && '' !== to.meta.title) {
        title = to.meta.title;
    }
    //非生产环境添加标识
    if ('production' !== import.meta.env.MODE) {
        title = title + ` (${import.meta.env.MODE})`;
    }
    if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
        setTimeout(function () {
            document.title = title;
            let _iframe = document.createElement('iframe');
            _iframe.style.display = 'none';
            _iframe.onload = function () {
                setTimeout(function () {
                    document.body.removeChild(_iframe);
                }, 0);
            };
            document.body.appendChild(_iframe);
        }, 0);
    } else {
        document.title = title;
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

/**
 * 捕获错误
 */
router.onError(error => {
    console.warn('路由router错误，error:', error);
    alert('路由错误error:' + error);
});

export default router;
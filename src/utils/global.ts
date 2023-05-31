//全局常量

export default {
    //session和location存放数据的前缀，用于和同域名/ip项目区分
    storagePrefix: import.meta.env.VITE_APP_STORAGE_PREFIX,
    //请求的接口地址
    api: {
        //登录
        login: '/api/login',
        //钉钉鉴权
        getJsApiTicketConfig: '/api/dingTalk/getJsApiTicketConfig',
        //微信公众号重定向
        getRedirectUri: '/api/wx/getRedirectUri',
        //用户部分
        user: {
            //获取用户信息
            getInfo: '/api/user/getInfo'
        }
    }
}
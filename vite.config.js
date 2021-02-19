//生产环境---静态常量
const PRODUCTION = 'production';
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require("path")

// https://cn.vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    /**
     * https://cn.vitejs.dev/config/#base
     * 绝对 URL 路径名，例如 /foo/
     * 完整的 URL，例如 https://foo.com/
     * 空字符串或 ./（用于开发环境）
     */
    base: './',
    resolve: {
        //别名配置
        alias: {
            '@': path.resolve(__dirname, './src')
        },
    },
    server: {
        port: 80,
    },
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // css预设器配置项
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        requireModuleExtension: true
    },
});
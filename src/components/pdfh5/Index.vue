<template>
    <div id="pdfh5"></div>
</template>

<script setup>
    import $Pdfh5 from "pdfh5/js/pdfh5.js";
    import "pdfh5/css/pdfh5.css";
    import $vant from '@/utils/vant';
    import {ref, reactive, onMounted, nextTick} from 'vue';

    const props = defineProps({
        //文件地址
        fileUrl: {
            type: String
        },
    });

    onMounted(() => {
        nextTick(() => {
            let myPdfh5 = new $Pdfh5("#pdfh5", {
                pdfurl: props['fileUrl']
            });

            /**
             * 监听加载失败，msg信息，time耗时
             */
            myPdfh5.on("error", (status, msg, time) => {
                $vant.alert({
                    message: `pdf加载失败`
                });
                console.warn('pdfh5加载失败，详情:', {
                    status, msg, time
                });
            });
        });
    });
</script>
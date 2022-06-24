<template>
    <van-nav-bar title="pdf预览"
                 left-text="返回" left-arrow
                 @clickLeft="navLeftClick"/>
    <div class="pdf">
        <BwPdfh5 :fileUrl="myPdf.fileUrl"></BwPdfh5>
    </div>
</template>

<script setup>
    //引入router
    import {useRouter} from 'vue-router';
    import {onMounted, ref, reactive} from 'vue';
    import BwPdfh5 from '@/components/pdfh5/Index.vue';

    const $router = useRouter();
    const navLeftClick = () => {
        $router.go(-1);
    }

    let myPdf = reactive({
        fileUrl: 'http://82.156.70.219/upload/muteki/vite/vant.pdf'
    })

</script>

<style lang="less" scoped>
    .pdf {
        height: calc(100vh - 50px);
    }
</style>
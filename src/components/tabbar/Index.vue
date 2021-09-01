<template>
    <Tabbar v-model="activeTab">
        <template v-for="item in tabbar.list" :key="item.name">
            <template v-if="!item.slot">
                <TabbarItem :name="item.name"
                            :to="`/${item.name}`"
                            :icon="item.icon">{{ item.title }}
                </TabbarItem>
            </template>
            <template v-else>
                <TabbarItem :name="item.name"
                            :to="`/${item.name}`">
                    <span>{{ item.title }}</span>
                    <template #icon="props">
                        <img :src="activeTab === item.name ? item.activeImg : item.unActiveImg"/>
                    </template>
                </TabbarItem>
            </template>
        </template>
    </Tabbar>
</template>

<script setup>
    import {Tabbar, TabbarItem} from 'vant';
    import {ref, reactive} from 'vue';
    //引入本地图片
    import LogoImg from '@/assets/logo.png';

    const props = defineProps({
        activeTab: {
            type: String,
            default: 'home'
        }
    })

    let tabbar = reactive({
        list: [
            {title: '首页', icon: 'home-o', name: 'home'},
            {
                title: '自定义', slot: true, name: 'customize',
                //网络图片
                activeImg: 'https://img.yzcdn.cn/vant/user-active.png',
                //本项目图片
                unActiveImg: LogoImg,
            },
            {title: '我的', icon: 'search', name: 'me'},
        ]
    });

</script>

<style lang="less" scoped>
    .van-tabbar {
        .van-tabbar-item {
            .van-tabbar-item__icon {
                img {
                    width: 30px;
                }
            }
        }
    }
</style>
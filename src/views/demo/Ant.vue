<template>
    <van-nav-bar title="ant列表" left-text="返回" left-arrow
                 @clickLeft="navLeftClick"/>
    <a-configProvider :locale="zhCN">
        <div class="box">
            <div class="form">
                <a-form layout="inline">
                    <a-form-item>
                        <a-input v-model:value="bwTable.form.name" placeholder="姓名" allow-clear/>
                    </a-form-item>
                    <a-form-item>
                        <a-select v-model:value="bwTable.form.status" style="width: 150px"
                                  placeholder="状态" allowClear>
                            <template v-for="item in ['开始','进行中','结束',]"
                                      :key="item">
                                <a-select-option :value="item">{{ item }}</a-select-option>
                            </template>
                        </a-select>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" @click="bwTable.getData">查询</a-button>
                        <a-button type="primary" @click="myModel.visible = true;">弹窗</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div class="table">
                <a-table rowKey="id"
                         size="small" bordered
                         :scroll="bwTable.scroll"
                         :dataSource="bwTable.dataSource"
                         :columns="bwTable.columns"
                         :pagination="false"
                         :row-selection="bwTable.rowSelection">
                </a-table>
            </div>
            <div class="pagination">
                <a-pagination :current="pagination.current"
                              :pageSize="pagination.pageSize"
                              showSizeChanger
                              :total="pagination.total"
                              :pageSizeOptions="pagination.pageSizeOptions"
                              :show-total="(total) => `总计 ${total} 条`"
                              @change="pagination.change"
                              @showSizeChange="pagination.showSizeChange"/>
            </div>
        </div>
        <div>
            <a-modal v-model:visible="myModel.visible"
                     title="弹窗"
                     :maskClosable="false"
                     cancel-text="关闭"
                     okText="确定"
                     @ok="myModel.handleOk"
                     @cancel="myModel.handleCancel">
                <h1>我是弹窗</h1>
                <h1>穿透样式 .ant-modal-wrap 不然微信内置浏览器可能不生效</h1>
            </a-modal>
        </div>
    </a-configProvider>
</template>

<script setup>
    import {
        message as $message,
    } from "ant-design-vue";
    import {NavBar} from "vant";
    import {ref, reactive, onMounted, nextTick} from "vue";
    import $axios from "@/utils/axios";
    import $global from "@/utils/global";
    import {useRouter, useRoute} from "vue-router";
    import zhCN from 'ant-design-vue/lib/locale/zh_CN';

    let $router = useRouter();
    let $route = useRoute();

    let bwTable = reactive({
        scroll: {
            x: true,
            y: 500,
        },
        //数据
        dataSource: [],
        //字段
        columns: [
            {
                title: "方法名",
                dataIndex: "methodName",
                width: 120,
                fixed: "left",
            },
            {
                title: "处理结果",
                dataIndex: "methodName",
                width: 150,
                customRender({text, record, index}) {
                    return `666-${text}`;
                },
            },
            {
                title: "所在行",
                dataIndex: "lineNumber",
                width: 80,
            },
            {
                title: "异常",
                dataIndex: "className",
                width: 150,
            },
            {
                title: "备注",
                dataIndex: "remark",
            },
            {
                title: "创建时间",
                dataIndex: "createTime",
                width: 180,
            },
        ],
        //表单
        form: {},
        //多选
        rowSelection: {
            columnWidth: 30,
            fixed: "left",
            selectedRowKeys: [],
            selectedRows: [],
            onChange(selectedRowKeys, selectedRows) {
                bwTable.rowSelection.selectedRowKeys = selectedRowKeys;
                bwTable.rowSelection.selectedRows = selectedRows;
            },
        },
        //获取数据
        getData() {
            bwTable.rowSelection.selectedRowKeys = [];
            bwTable.rowSelection.selectedRows = [];
            let data = JSON.parse(JSON.stringify(bwTable.form));
            data["pageNum"] = pagination.current;
            data["pageSize"] = pagination.pageSize;
            $axios({
                url: "/test/getPageList",
                data,
                success(data = {}) {
                    bwTable.dataSource = data["list"];
                    pagination.total = data["total"];
                },
            });
        },
    });

    /**
     * 分页器
     */
    let pagination = reactive({
        current: 1,
        pageSize: 10,
        total: 0,
        pageSizeOptions: ["10", "20", "50"],
        change(page, pageSize) {
            pagination.current = page;
            bwTable.getData();
        },
        showSizeChange(current, size) {
            pagination.pageSize = size;
            bwTable.getData();
        },
    });

    /**
     * 弹窗
     */
    let myModel = reactive({
        visible: false,
        handleOk() {
            $message.warning("点击了确定！", 3);
            myModel.visible = false;
        },
        handleCancel() {
            $message.warning("点击了取消！", 3);
            myModel.visible = false;
        },
    });

    onMounted(() => {
        bwTable.getData();
        nextTick(() => {
            let boxHeight = document
                    .getElementsByClassName("box")[0]
                    .getBoundingClientRect().height;
            let formHeight = document
                    .getElementsByClassName("form")[0]
                    .getBoundingClientRect().height;
            let paginationHeight = document
                    .getElementsByClassName("pagination")[0]
                    .getBoundingClientRect().height;
            bwTable.scroll.y = boxHeight - formHeight - paginationHeight - 70;
        });
    });

    /**
     * 返回上一页
     */
    const navLeftClick = () => {
        $router.go(-1);
    };
</script>

<style lang="less" scoped>
    .box {
        margin: 0 20px;
        height: calc(100vh - 50px);

        .form {
            .ant-form-item {
                margin-bottom: 10px;
            }

            button {
                margin-right: 20px;
            }
        }

        .table {
            margin: 0 0 10px;
        }
    }
</style>

<style lang="less">

    .ant-modal-wrap {
        top: 0;
        width: 100%;
        bottom: 0;
    }

</style>
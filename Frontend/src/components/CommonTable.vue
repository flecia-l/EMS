<template>
    <div class="common-table">
        <el-table :data="tableData" height="93%">
            <el-table-column
            show-overflow-tooltip
            v-for="item in tableConfig"
            :key="item.label"
            :label="item.label"
            :width="item.width ? item.width : 150"
            >
                <template slot-scope="scope">
                    <span style="margin-left:10px">{{scope.row[item.prop]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="180">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" @click="handleDelete(scope.row)" type = "danger">
                        <slot name = "edit_button" :row="scope.row">删除</slot>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pager"
            layout="prev, pager, next"
            background
            :total="localPageConfig.total"
            :current-page="localPageConfig.page"
            @current-change="changePage"
        >

        </el-pagination>
    </div>
</template>

<script>
    export default {
        name:'CommonTable',
        props: {
            tableConfig: Array,
            tableData: Array,
            pageConfig: Object,
        },
        data() {
            return {
                // table_config: this.tableConfig,
                // table_data: this.tableData,
                // page_config: this.pageConfig,
                localPageConfig: { ...this.pageConfig }  // 创建 pageConfig 的本地副本
            };
        },
        methods: {
            handleEdit(row) {
                this.$emit('edit',row);
            },
            handleDelete(row) {
                this.$emit('del',row);
            },
            changePage(page) {
                this.localPageConfig.page = page;  // 修改本地副本的页码
                this.$emit('changePage', page);
            },
        },
        watch: {
            // tableData(val) {
            //     this.table_data = val;
            // },
            // pageConfig(val) {
            //     this.page_config = val;
            // },
            pageConfig(newVal) {
                this.localPageConfig = { ...newVal };
    }
        },
    }
</script>

<style lang="less" scoped>
.common-table {
    height: calc(100% - 62px);
    background-color: #fff;
    position: relative;
    .pager {
        position: absolute;
        bottom: 0;
        right: 20px;
    }
}
</style>
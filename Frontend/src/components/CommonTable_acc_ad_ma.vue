<template>
    <div class="common-table">
        <el-table :data="table_data" height="93%">
            <el-table-column
            show-overflow-tooltip
            v-for="item in table_config"
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
                    <!--el-button size="mini" @click="handleDelete(scope.row)" type="danger">降职</el-button-->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pager"
            layout="prev, pager, next"
            background
            :total="page_config.total"
            :current-page.sync="page_config.page"
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
                table_config: this.tableConfig,
                table_data: this.tableData,
                page_config: this.pageConfig,
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
                this.$emit('changePage', page);
            },
        },
        watch: {
            tableData(val) {
                this.table_data = val;
            },
            pageConfig(val) {
                this.page_config = val;
            },
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
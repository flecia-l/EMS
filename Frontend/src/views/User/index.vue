<template>
    <div class="manage">
        <div v-if="isShow">
            <el-dialog
                :title="operateType === 'add' ? '添加用户' : '编辑用户'"
                :visible.sync="isShow"
            >
                <common-form 
                    :formConfig="formConfig" 
                    :formData="formData"
                    :inline="true"
                    ref="form"
                >
                </common-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShow=false;isChange=false">取 消</el-button>
                    <el-button type="primary" @click="confirm">确 定</el-button>
                </div>
            </el-dialog>
        </div>

        <div class="manage-header">
            <el-button type="primary" @click="addUser">+ 新增</el-button>
            <common-form 
                :formConfig="searchFormConfig" 
                :formData="searchFormData"
                :inline="true"
                ref="form"
            >
                <el-button type="primary" @click="getList(searchFormData.keyword)">搜索</el-button>
            </common-form>
        </div>
        <common-table
            :tableConfig="tableConfig"
            :tableData="tableData"
            :pageConfig="pageConfig"
            @edit="editUser"
            @del="delUser"
            @changePage="getList()"
        >
        </common-table>
    </div>
</template>

<script>
    import CommonForm from '@/components/CommonForm'
    import CommonTable from '@/components/CommonTable'
    import { getUser } from '@/api/data'

    export default {
        name:'User',
        components: {
            CommonForm,
            CommonTable,
        },
        data() {
            return {
                operateType: 'add',
                isShow: false,
                formConfig: [
                    {
                        label: '姓名',
                        type: 'input',
                        model: 'name',
                    },
                    {
                        label: '年龄',
                        type: 'input',
                        model: 'age',
                    },
                    {
                        label: '性别',
                        type: 'select',
                        model: 'gender',
                        opts: [
                            {
                                label: '男',
                                value: '1',
                            },
                            {
                                label: '女',
                                value: '0',
                            },
                        ],
                    },
                    {
                        label: '生日',
                        type: 'date',
                        model: 'birthday',
                    },
                    {
                        label: '地址',
                        type: 'input',
                        model: 'address',
                    },
                ],
                formData: {
                    name: '',
                    age: '',
                    gender: '',
                    birthday: '',
                    address: '',
                },
                searchFormConfig: [
                    {
                        label: '',
                        type: 'input',
                        model: 'keyword',
                    },  
                ],
                searchFormData: {
                    keyword: '',
                },
                tableConfig: [
                    {
                        prop: 'name',
                        label: '姓名',
                    },
                    {
                        prop: 'age',
                        label: '年龄',
                    },
                    {
                        prop: 'gender',
                        label: '性别',
                    },
                    {
                        prop: 'birthday',
                        label: '生日',
                        width: 200,
                    },
                    {
                        prop: 'address',
                        label: '地址',
                        width: 350
                    },
                ],
                tableData: [],
                pageConfig: {
                    page: 1,
                    total: 100,
                },
            };
        },
        methods: {
            confirm() {
                if(this.operateType === 'edit') {
                    this.$http.post('/user/edit', this.formData).then(res => {
                        // console.log(res);
                        this.isShow = false;
                        this.getList();
                    });
                } else {
                    this.$http.post('/user/add', this.formData).then(res => {
                        // console.log(res);
                        this.isShow = false;
                        this.getList();
                    });
                }
            },
            addUser() {
                this.operateType = 'add';
                this.isShow = true;
                this.formData = {
                    name: '',
                    age: '',
                    gender: '',
                    birthday: '',
                    address: '',
                };
            },
            editUser(row) {
                this.operateType = 'edit';
                this.isShow = true;
                this.formData = {...row};
            },
            delUser(row) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const id = row.id;
                    this.$http.get('/user/del', {
                        params:{id}
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                       this.getList();
                    })
                }).catch((err) => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                        console.log(err)
                        this.getList(); 
                    });
            },
            getList(name = '') {
                this.pageConfig.loading = true;
                this.pageConfig.page = name ? 1 : this.pageConfig.page;
                getUser({
                    page: this.pageConfig.page,
                    name
                }).then(res => {
                    this.tableData = res.data.list && res.data.list.map(item => {
                        item.gender = item.sex === 0 ? '女' : '男'
                        return item
                    })
                    this.tableConfig.total = res.data.count
                    this.tableConfig.loading = false
                });
            }
        },
        created() {
            this.getList();
        },
    }
</script>

<style lang="less" scoped>
.manage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

</style>
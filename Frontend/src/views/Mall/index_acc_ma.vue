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
            <el-button type="primary" @click="addAccount">+ 新增</el-button>
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
            @edit="updateAccount"
            @changePage="getList()"
        >
        </common-table>
    </div>
</template>

<script>
    import CommonForm from '@/components/CommonForm'
    import CommonTable from '@/components/CommonTable_acc_em_and_ma'
    import { getManagerAccounts, addManagerAccount, updateManagerPassword, deleteManagerDown } from '@/api/axios';

    export default {
        name:'Account',
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
                        label: '工号',
                        type: 'input',
                        model: 'username',
                    },
                    {
                        label: '密码',
                        type: 'input',
                        model: 'password',
                    },
                ],
                formData: {
                    username: '',
                    password: '',
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
                        prop: 'User_name',
                        label: '工号',
                    },
                    {
                        prop: 'Password',
                        label: '密码',
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
                    const { username, password } = this.formData;
                    updateManagerPassword( username, password ).then(res => {
                        this.isShow = false;
                        const flag = res.code === 200 ? 'success' : 'error';
                        this.getList();
                        this.$message({
                            type: flag,
                            message: res.message
                        });
                    });
                } else {
                    const { username, password } = this.formData;
                    addManagerAccount( username, password ).then(res => {
                        this.isShow = false;
                        const flag = res.code === 200 ? 'success' : 'error';
                        this.getList();
                        this.$message({
                            type: flag,
                            message: res.message
                        });
                    });
                }
            },
            addAccount() {
                this.operateType = 'add';
                this.isShow = true;
                this.formData = {
                    username: '',
                    password: '',
                };
            },
            updateAccount(row) {
                this.operateType = 'edit';
                this.isShow = true;
                this.formData = {...row};
            },
            deleteAccount(row) {
                this.$confirm('此操作将该用户降职为员工, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const username = row.User_name;
                    console.log('row',row)
                    console.log('username',username)
                    deleteManagerDown(username
                    ).then(() => {
                        this.$message({
                            type: 'success',
                            message: '降职成功!'
                        });
                       this.getList();
                    })
                }).catch((err) => {
                        this.$message({
                            type: 'info',
                            message: '已取消降职'
                        });
                        console.log(err)
                        this.getList(); 
                    });
            },
            getList(name = '') {
                this.pageConfig.loading = true;
                this.pageConfig.page = name ? 1 : this.pageConfig.page;
                getManagerAccounts().then(res => {
                    this.tableData = res.data
                    console.log(res.data)
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
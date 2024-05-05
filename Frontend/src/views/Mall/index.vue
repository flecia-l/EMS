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
                    <el-button @click="isShow=false;isChange=false">取消</el-button>
                    <el-button type="primary" @click="confirm">确认</el-button>
                </div>
            </el-dialog>
        </div>

        <div class="manage-header">
            <el-button type="primary" @click="addAccount">+ 添加</el-button>
            <common-form 
                :formConfig="searchFormConfig" 
                :formData="searchFormData"
                :inline="true"
                ref="form"
            >
                <el-button type="primary" @click="getList(searchFormData.keyword)">查找</el-button>
            </common-form>
        </div>
        <common-table
            :tableConfig="tableConfig"
            :tableData="tableData"
            :pageConfig="pageConfig"
            @edit="updateAccount"
            @del="deleteAccount"
            @changePage="getList()"
        >
        <template v-slot:edit_button="{ row }">
            职位变动
        </template>
        </common-table>
    </div>
</template>

<script>
    import CommonForm from '@/components/CommonForm'
    import CommonTable from '@/components/CommonTable'
    import { getAccounts, addAccount, updateEmployeePassword, deleteEmployeeUp, deleteManagerDown } from '@/api/axios';
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
                    {
                        label: '职位',
                        type: 'select',
                        model: 'type',
                        opts: [
                            {
                                label: 'Manager',
                                value: 'Manager',
                            },
                            {
                                label: 'Employee',
                                value: 'Employee',
                            },
                        ],
                    },
                ],
                formData: {
                    username: '',
                    password: '',
                    type: '',
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
                        prop: 'type',
                        label: '职位',
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
                    const { username, password, type} = this.formData;
                    updateEmployeePassword( username, password, type).then(res => {
                        this.isShow = false;
                        const flag = res.code === 200 ? 'success' : 'error';
                        this.getList();
                        this.$message({
                            type: flag,
                            message: res.message
                        });
                    });
                } else {
                    const { username, password, type } = this.formData;
                    addAccount( username, password, type ).then(res => {
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
                    type: '',
                };
            },
            updateAccount(row) {
                this.operateType = 'edit';
                this.isShow = true;
                this.formData = {...row};
            },
            deleteAccount(row) {
                const action = row.type === 'Employee' ? 'Promotion' : 'Demotion';
                this.$confirm(`This action puts the user${action}, confirm or cancel ?`, 'Warning', {
                    confirmButtonText: 'confirm!',
                    cancelButtonText: 'cancel!',
                    type: 'warning'
                }).then(() => {
                    const username = row.User_name;
                    console.log('row',row)
                    console.log('username',username)
                    console.log('type',row.type);
                    if (row.type === 'Employee') {
                        deleteEmployeeUp(username).then(() => {
                            this.$message({
                                type: 'success',
                                message: 'Employee promotion successfully!'
                            });
                            this.getList();
                        }).catch(err => {
                            this.$message({
                                type: 'error',
                                 message: 'Failure' + err.message
                            });
                        });
                    }else if (row.type === 'Manager') { 
                        deleteManagerDown(username).then(() => {
                            this.$message({
                                type: 'success',
                                message: 'Manager deomotion successfully!'
                            });
                            this.getList();
                        }).catch(err => {
                            this.$message({
                                type: 'error',
                                message: 'Failure: ' + err.message
                            });
                        });
                    } 
                }).catch((err) => {
                    this.$message({
                        type: 'info',
                        message: 'cancel'
                    });
                    console.log(err);
                });
            },
            getList(name = '') {
                this.pageConfig.loading = true;
                this.pageConfig.page = name ? 1 : this.pageConfig.page;
                getAccounts().then(res => {
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
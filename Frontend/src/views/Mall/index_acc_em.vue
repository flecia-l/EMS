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
            <div class="placeholder" style="flex: 1;"></div>
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
            @changePage="getList()"
        >
        </common-table>
    </div>
</template>

<script>
    import CommonForm from '@/components/CommonForm'
    import CommonTable from '@/components/CommonTable_acc_em_and_ma'
    import { getAccounts, addAccount, updateEmployeePassword } from '@/api/axios';

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
                        label: 'Id',
                        type: 'input',
                        model: 'username',
                    },
                    {
                        label: 'Password',
                        type: 'input',
                        model: 'password',
                    },
                    {
                        label: 'type',
                        type: 'select',
                        model: 'type',
                        opts: [
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
                    type:'Employee',
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
                        label: 'Id',
                    },
                    {
                        prop: 'type',
                        label: 'type',
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
                    const { username, password, type } = this.formData;
                    updateEmployeePassword( username, password, type ).then(res => {
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
                    addAccount( username, password ).then(res => {
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
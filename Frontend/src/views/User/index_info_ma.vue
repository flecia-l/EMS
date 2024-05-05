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
    import { getManagers, addManager, updateManager, deleteManager, deleteEmployee } from '@/api/axios';

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
                        label: 'Id',
                        type: 'input',
                        model: 'id',
                    },
                    {
                        label: 'Name',
                        type: 'input',
                        model: 'name',
                    },
                    {
                        label: 'Gender',
                        type: 'select',
                        model: 'gender',
                        opts: [
                            {
                                label: 'Male',
                                value: 'Male',
                            },
                            {
                                label: 'Female',
                                value: 'Female',
                            },
                        ],
                    },
                    {
                        label: 'Age',
                        type: 'input',
                        model: 'age',
                    },

                    {
                        label: 'Dept',
                        type: 'input',
                        model: 'dept',
                    },
                    {
                        label: 'type',
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
                    id: '',
                    name: '',
                    gender: '',
                    age: '',
                    dept: '',
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
                        prop: 'Id',
                        label: 'Id',
                    },
                    {
                        prop: 'Name',
                        label: 'Name',
                    },
                    {
                        prop: 'Gender',
                        label: 'Gender',
                    },
                    {
                        prop: 'Age',
                        label: 'Age',
                    },
                    {
                        prop: 'Dept',
                        label: 'Dept',
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
                    const { id, name, gender, age, dept, type } = this.formData;
                    updateManager( id, name, gender, age, dept, type ).then(res => {
                        this.isShow = false;
                        const flag = res.code === 200 ? 'success' : 'error';
                        this.getList();
                        this.$message({
                            type: flag,
                            message: res.message
                        });
                    });
                } else {
                    const { id, name, gender, age, dept, type } = this.formData;
                    addManager( id, name, gender, age, dept, type ).then(res => {
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
            addUser() {
                this.operateType = 'add';
                this.isShow = true;
                this.formData = {
                    id: '',
                    name: '',
                    gender: '',
                    age: '',
                    dept: '',
                    type: '',
                };
            },
            editUser(row) {
                this.operateType = 'edit';
                this.isShow = true;
                this.formData = {...row};
            },
            delUser(row) {
                const action = row.type === 'Employee' ? 'Delete employee' : 'Delete manager';
                this.$confirm(`This operation will be permanently${action}, confirm or concel?`, 'Warning', {
                    confirmButtonText: 'confirm',
                    cancelButtonText: 'concel',
                    type: 'warning'
                }).then(() => {
                    const id = row.Id;
                    console.log('row', row)
                    console.log('id', id)
                    if (row.type === 'Employee') {
                        deleteEmployee(id).then(() => {
                            this.$message({
                            type: 'success',
                            message: 'Delete employee successfully!'
                        });
                        this.getList();
                    }).catch(err => {
                        this.$message({
                            type: 'error',
                            message: 'Failure: ' + err.message
                        });
                    });
                } else if (row.type === 'Manager') {
                    deleteManager(id).then(() => {
                        this.$message({
                            type: 'success',
                            message: 'Delete manager successfully!'
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
                getManagers().then(res => {
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
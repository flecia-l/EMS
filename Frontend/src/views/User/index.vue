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
            @changePage="handlePageChange"
        >
        </common-table>
    </div>
</template>

<script>
    import CommonForm from '@/components/CommonForm'
    import CommonTable from '@/components/CommonTable'
    import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '@/api/axios';

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
                        label: '工号',
                        type: 'input',
                        model: 'id',
                    },
                    {
                        label: '姓名',
                        type: 'input',
                        model: 'name',
                    },
                    {
                        label: '性别',
                        type: 'select',
                        model: 'gender',
                        opts: [
                            {
                                label: '男',
                                value: '男',
                            },
                            {
                                label: '女',
                                value: '女',
                            },
                        ],
                    },
                    {
                        label: '年龄',
                        type: 'input',
                        model: 'age',
                    },
                    {
                        label: '部门',
                        type: 'input',
                        model: 'dept',
                    },
                    {
                        label: '职位',
                        type: 'select',
                        model: 'type',
                        opts: [
                            {
                                label: '员工',
                                value: 'Employee',
                            },
                            {
                                label: '经理',
                                value: 'Manager',
                            },
                        ],
                    }
                ],
                formData: {
                    id: '',
                    name: '',
                    gender: '',
                    age: '',
                    dept: '',
                    type: ''
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
                        label: '工号',
                    },
                    {
                        prop: 'Name',
                        label: '姓名',
                    },
                    {
                        prop: 'Gender',
                        label: '性别',
                    },
                    {
                        prop: 'Age',
                        label: '年龄',
                    },
                    {
                        prop: 'Dept',
                        label: '部门',
                    },
                    {
                        prop: 'Type',
                        label: '职位',
                    }
                ],
                tableData: [],
                pageConfig: {
                    page: 1,
                    total: 100,
                    pageSize: 5
                },
            };
        },
        methods: {
            confirm() {
                if(this.operateType === 'edit') {
                    const { id, name, gender, age, dept, type } = this.formData;
                    updateEmployee( id, name, gender, age, dept, type ).then(res => {
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
                    addEmployee( id, name, gender, age, dept, type ).then(res => {
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
                    type: ''
                };
            },
            editUser(row) {
                console.log(row)
                this.operateType = 'edit';
                this.isShow = true;
                this.formData.id = row.Id;
                this.formData.name = row.Name;
                this.formData.gender = row.Gender;
                this.formData.age = row.Age;
                this.formData.dept = row.Dept;
                this.formData.type = row.Type;
            },
            delUser(row) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const id = row.Id;
                    console.log('row',row)
                    console.log('id',id)
                    deleteEmployee(id
                    ).then(() => {
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
            handlePageChange(newPage) {
                // 更新 pageConfig.page，并重新获取数据
                this.pageConfig.page = newPage;
                this.getList();  // 获取新页数据
            },
            getList(searchValue = '') {
                this.pageConfig.loading = true;
                this.pageConfig.page = searchValue ? 1 : this.pageConfig.page;
                const { page, pageSize } = this.pageConfig;  // 获取当前页码和每页条目数
                getEmployees(searchValue, page, pageSize).then(res => {
                    this.tableData = res.data;
                    this.pageConfig.total = res.total;
                    this.tableConfig.loading = false;
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
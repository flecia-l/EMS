<template>
    <div class="login-container">
        <h3 class="login-title">员工管理系统登录</h3>
        <common-form 
            :formConfig="loginFormConfig" 
            :formData="loginFormData"
            :rules="rules"
            :width="width"
            ref="form"
        >
        </common-form>
        <div slot>
            <el-button type="primary" class="login-submit" @click="login">登录</el-button>
        </div>
    </div>

</template>

<script>
    import CommonForm from '@/components/CommonForm'
    // import Mock from 'mockjs'
    // import { getMenu } from '@/api/data'
    import { loginPermission } from '@/api/axios'
    // import Mock from 'mockjs'
    // import { getMenu } from '@/api/data'
    import { loginPermission } from '@/api/axios'

    export default {
        name:'Login',
        components: {
            CommonForm,
        },
        data(){
            return {
                width: '70px',
                loginFormConfig: [
                    {
                        label: '用户名',
                        type: 'input',
                        model: 'username',
                    },
                    {
                        label: '密码',
                        type: 'input',
                        model: 'password',
                    },
                ],
                loginFormData: {
                    username: '',
                    password: '',
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                },
            }
        },
        methods: {
            login(){
                // getMenu(this.loginFormData).then(({data:res}) => {
                //     if(res.code === 20000){
                //         this.$store.commit('tab/DEL_MENU');
                //         this.$store.commit('tab/SET_MENU', res.data.menu);
                //         this.$store.commit('user/SET_TOKEN',res.data.token);
                //         this.$store.commit('tab/ADD_MENU',this.$router);
                //         this.$router.push({ name: 'home' })
                //     } else {
                //         this.$message.warning(res.data.message)
                //     }
                // })
                // const token = Mock.Random.guid()
                const { username, password } = this.loginFormData;
                loginPermission( username, password ).then((res) => {
                    console.log(res)
                    localStorage.setItem('token', res.data.token);
                    if(res.code === 200){
                // getMenu(this.loginFormData).then(({data:res}) => {
                //     if(res.code === 20000){
                //         this.$store.commit('tab/DEL_MENU');
                //         this.$store.commit('tab/SET_MENU', res.data.menu);
                //         this.$store.commit('user/SET_TOKEN',res.data.token);
                //         this.$store.commit('tab/ADD_MENU',this.$router);
                //         this.$router.push({ name: 'home' })
                //     } else {
                //         this.$message.warning(res.data.message)
                //     }
                // })
                // const token = Mock.Random.guid()
                const { username, password } = this.loginFormData;
                loginPermission( username, password ).then((res) => {
                    console.log(res)
                    localStorage.setItem('token', res.data.token);
                    if(res.code === 200){
                        this.$store.commit('tab/DEL_MENU');
                        this.$store.commit('tab/SET_MENU', res.data.menu);
                        console.log(res.data.menu)
                        console.log(res.data.menu)
                        this.$store.commit('user/SET_TOKEN',res.data.token);
                        this.$store.commit('tab/ADD_MENU',this.$router);
                        this.$router.push({ name: 'home' })
                        this.$store.commit('user/SET_TOKEN', res.token)
                        this.$store.commit('user/SET_TOKEN', res.token)
                    } else {
                        this.$message.error(res.data.message || '用户名或密码错误');
                    }
                }).catch((error)=> {
                    this.$message.error('登录请求失败: ' + error.message);
                });
                // this.$store.commit('user/SET_TOKEN', token)
            }
        }
    }
</script>

<style lang="less" scoped>
.login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin:180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background-color: #fff;
    border: 1px solid #ebeef5;
    box-shadow: 0 0 25px rgba(0,0,0,.1);
}

.login-title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
    font-size: 20px;
    font-weight: bold;
}

.login-submit {
    margin: 10px auto 0px auto;
    display: block;
}
</style>
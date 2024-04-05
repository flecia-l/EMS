<template>
    <div class="background-container">
        <div class="login-container">
            <!-- 增加间距的标题 -->
            <h3 class="login-title">系统登录</h3>
            <common-form :formConfig="loginFormConfig" :formData="loginFormData" :rules="rules" ref="form" />
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


export default {
    name: 'Login',
    components: {
        CommonForm,
    },
    data() {
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
                    type: 'password',
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
        login() {
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
            loginPermission(username, password).then((res) => {
                console.log(res)
                localStorage.setItem('token', res.data.token);
                if (res.code === 200) {
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
                    loginPermission(username, password).then((res) => {
                        console.log(res)
                        localStorage.setItem('token', res.data.token);
                        if (res.code === 200) {
                            this.$store.commit('tab/DEL_MENU');
                            this.$store.commit('tab/SET_MENU', res.data.menu);
                            console.log(res.data.menu)
                            console.log(res.data.menu)
                            this.$store.commit('user/SET_TOKEN', res.data.token);
                            this.$store.commit('tab/ADD_MENU', this.$router);
                            this.$router.push({ name: 'home' })
                            this.$store.commit('user/SET_TOKEN', res.token)
                            this.$store.commit('user/SET_TOKEN', res.token)
                        } else {
                            this.$message.error(res.data.message || '用户名或密码错误');
                        }
                    }).catch((error) => {
                        this.$message.error('登录请求失败: ' + error.message);
                    });
                    // this.$store.commit('user/SET_TOKEN', token)
                }
            })
        },
    },
}
</script>

<style lang="less" scoped>
.background-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: url('./background.png');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-container {
    border-radius: 15px;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background-color: #fff;
    border: 1px solid #ebeef5;
    box-shadow: 0 0 25px rgba(0, 0, 0, .1);
}

.login-title {
    text-align: center;
    color: #505458;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px;
    /* 增加底部外边距以添加间距 */
}

/* 表单标签和输入框左对齐 */
.common-form label,
.common-form input {
    text-align: left;
    /* 文本左对齐 */
    display: block;
    /* 块级显示，使它们占据全行 */
}

/* 登录按钮样式保持不变 */
.login-submit {
    display: block;
    width: 100%;
    box-sizing: border-box;
}
</style>
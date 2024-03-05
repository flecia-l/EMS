<template>
    <div>
        <el-container style="height:100vh">
        <el-aside width="auto">
            <common-aside></common-aside>
        </el-aside>
        <el-container>
            <el-header>
                <common-header></common-header>
            </el-header>
            <common-tag></common-tag>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
        </el-container>
    </div>
</template>

<script>
    import commonAside from '@/components/CommonAside';
    import CommonHeader from '@/components/CommonHeader';
    import CommonTag from '@/components/CommonTag';

    export default {
        name:'Home',
        components:{
            commonAside,
            CommonHeader,
            CommonTag,
        },
        data(){
            return {
            }
        }
    }
</script>

<style lang="less" scoped>
.el-header {
    background-color: #333;
}
.el-main {
    padding-top: 0;
}
.el-aside {
    overflow: auto;
}

</style>
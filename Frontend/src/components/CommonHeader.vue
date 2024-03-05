<template>
    <header>
        <div class="l-content">
            <el-button @click="handleMenu" plain icon="el-icon-menu" size="mini"></el-button>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="item in tags" :key="`${item.path}`" :to="{ path: item.path }">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="r-content">
            <el-dropdown trigger="click" szie="mini">
                <span>
                    <img class="user" :src="userImg">
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人中心</el-dropdown-item>
                    <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </header>

</template>

<script>
    import {mapState,mapGetters,mapMutations,mapActions} from 'vuex';

    export default {
        name: 'CommonHeader',
        data() {
            return {
                userImg: require('@/assets/images/user.png')
            }
        },
        methods: {
            ...mapMutations('tab',{
                handleMenu: 'SET_COLLAPSE',
            }),
            logOut() {
                this.$store.commit('user/DEL_TOKEN');
                this.$store.commit('tab/DEL_MENU');
                this.$router.push('/login');
            }
        },
        computed: {
            ...mapState('tab',{
                tags: 'tabList',
            })
        },

    }
</script>

<style lang="less" scoped>
header {
    display: flex;
    height: 100%;
    justify-content: space-between;
    align-items: center;
}
.l-content {
    display: flex;
    align-items: center;
    .el-button {
        margin-right: 20px;
    }
}
.r-content {
    .user {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
}
.el-breadcrumb ::v-deep .el-breadcrumb__inner {
    color: #f4f0eb !important;
}
</style>
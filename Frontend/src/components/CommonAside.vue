<template>
  <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :background-color="'#545c64'" :text-color="'#fff'" :active-text-color="'#ffd04b'" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
    <h3 :collapse-transition="false">{{ isCollapse ? 'EMS' : '员工管理系统' }}</h3>
    <!-- 其他菜单项 -->
    <el-menu-item @click="clickMenu(item)" v-for="item in noChildren" :index="`${item.path}`" :key="item.path">
      <i :class="'el-icon-' + item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <!-- 退出菜单项已被删除 -->
  </el-menu>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'CommonAside',
  methods: {
    ...mapMutations('tab', ['SELECT_MENU', 'CLEAR_USER_DATA']),
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    clickMenu(item) {
      this.$router.push(item.path);
      this.SELECT_MENU(item);
    },
    logout() {
      // 清除本地存储中的token或其他认证数据
      localStorage.removeItem('token');
      // 清空vuex中的用户信息
      this.CLEAR_USER_DATA();
      // 跳转到登录页面
      this.$router.push('/login');
    },
  },
  computed: {
    ...mapState('tab', {
      isCollapse: state => state.isCollapse,
      menu: state => state.menu
    }),
    noChildren() {
      return this.menu.filter(item => !item.children);
    },
    hasChildren() {
      return this.menu.filter(item => item.children);
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu {
  min-height: 100vh;
  height: auto;
  border: none;
  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
  }
}
</style>

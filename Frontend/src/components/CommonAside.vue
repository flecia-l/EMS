<template>
  <el-menu default-active="1-4-1" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
    <h3 :collapse-transition=false>{{isCollapse?'后台':'通用后台管理系统'}}</h3>
    <el-menu-item @click="clickMenu(item)" v-for="item in noChildren" :index="`${item.path}`" :key="item.path">
      <i :class="'el-icon-' + item.icon"></i>
      <span slot="title">{{item.label}}</span>
    </el-menu-item>
    <el-submenu v-for="(item,index) in hasChildren" :index="index.toString()" :key="item.path">
      <template slot="title">
        <i :class="'el-icon-' + item.icon"></i>
        <span slot="title">{{item.label}}</span>
      </template>
      <el-menu-item-group v-for="(subItem, subIndex) in item.children" :key="subItem.path">
        <el-menu-item @click="clickMenu(subItem)" :index="subIndex.toString()">{{subItem.label}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
  import {mapState,mapGetters,mapMutations,mapActions} from 'vuex';

  export default {
    name: 'CommonAside',
    data() {
      return {
        // menu: [
        //   {
        //     path: '/',
        //     name: 'home',
        //     label: '首页',
        //     icon: 's-home',
        //     url: 'Home/Home'
        //   },
        //   {
        //     path: '/mall',
        //     name: 'mall',
        //     label: '商品管理',
        //     icon: 's-order',
        //     url: 'MallManage/MallManage'
        //   },
        //   {
        //     path: '/user',
        //     name: 'user',
        //     label: '用户管理',
        //     icon: 's-check',
        //     url: 'UserManage/UserManage'
        //   },
        //   {
        //     label: '其他',
        //     icon: 's-opportunity',
        //     children: [
        //       {
        //         path: '/page1',
        //         name: 'page1',
        //         label: '页面1',
        //         icon: 'setting',
        //         url: 'Other/PageOne'
        //       },
        //       {
        //         path: '/page2',
        //         name: 'page2',
        //         label: '页面2',
        //         icon: 'setting',
        //         url: 'Other/PageTwo'
        //       }
        //     ]
        //   }
        // ],
        // menu: [],
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      clickMenu(item){
          this.$router.push(item.name);
          this.$store.commit('tab/SELECTMENU',item);
      },
    },
    computed: {
      ...mapState('tab', ['isCollapse']),
      ...mapState('tab', ['menu']),
      noChildren() {
          return this.menu.filter(item => !item.children);
      },
      hasChildren() {
          return this.menu.filter(item => item.children);
      },


    },
  }
  
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  // min-height: 400px;
  // height: 100%;
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
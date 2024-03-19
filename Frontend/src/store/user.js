// 引入Cookies库
import Cookies from "js-cookie";

export default {
  namespaced: true,
  state: {
    token: '',
  },
  mutations: {
    SET_TOKEN(state, val) {
      state.token = val;
      Cookies.set('token', val); // 保存token到Cookie
    },
    DEL_TOKEN(state) {
      state.token = '';
      Cookies.remove('token'); // 从Cookie中删除token
    },
    GET_TOKEN(state) {
      state.token = state.token || Cookies.get('token'); // 从Cookie中获取token，如果state中已有token则不覆盖
    }
  },
  actions: {
    // 登录Action
    login({ commit }, token) {
      commit('SET_TOKEN', token);
    },
    // 登出Action
    logout({ commit }) {
      commit('DEL_TOKEN');
    },
    // 获取Token Action
    getToken({ commit }) {
      commit('GET_TOKEN');
    }
  }
};

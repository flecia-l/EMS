import Cookies from "js-cookie";

export default {
    namespaced: true,
    state: {
        token: '',
    },
    mutations: {
        SET_TOKEN(state, val) {
            state.token = val;
            Cookies.set('token', val);
        },
        DEL_TOKEN(state) {
            state.token = '';
            Cookies.remove('token');
        },
        GET_TOKEN(state) {
            state.token =  state.token || Cookies.get('token');
        }
    }
}
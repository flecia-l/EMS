import Cookie from "js-cookie";

export default {
    namespaced: true,
    state: {
        isCollapse: false,
        tabList: [
            {
                path: '/',
                name: 'home',
                label: '首页',
                icon: 's-home',
            },
        ],
        currentMenu: null,
        menu: [],
    },
    actions: {
        
    },
    mutations: {
        SET_COLLAPSE(state) {
            state.isCollapse = !state.isCollapse;
        },
        SELECTMENU(state, val) {
            if (val.name !== 'home') {
                state.currentMenu = val;
                let result = state.tabList.findIndex(item => item.name === val.name);
                result === -1 ? state.tabList.push(val) : '';
            } else {
                state.currentMenu = null;
            }
        },
        DEL_TAG(state, val) {
            let result = state.tabList.findIndex(item => item.name === val.name);
            state.tabList.splice(result, 1);
        },
        SET_MENU(state, val) {
            state.menu = val;
            Cookie.set('menu', JSON.stringify(val));
        },
        DEL_MENU(state) {
            state.menu = [];
            Cookie.remove('menu');
        },
        ADD_MENU(state, router) {
            if(!Cookie.get('menu')) {
                return
            }
            let menu = JSON.parse(Cookie.get('menu'));
            state.menu = menu;
            let menuArr = [
                   {
                        path: "/",
                        redirect: "/login",
                        name: 'main',
                        component: () => import('@/views/Main'),
                        children: []
                   }
            ];
            menu.forEach(item => {
                if(item.children) {
                    item.children.map(item => {
                        item.component = () => import(`@/views/${item.url}`);
                        return item
                    })
                    menuArr[0].children.push(...item.children);
                }
                else {
                    item.component = () => import(`@/views/${item.url}`);
                    menuArr[0].children.push(item);
                }
            });
            // menuArr.forEach(item => {
            //     console.log(router)
            //     console.log(menuArr)
            //     router.addRoute('main', item)
            // })
            router.addRoutes(menuArr);
        },

    }
}
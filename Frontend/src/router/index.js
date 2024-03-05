import store from "@/store";
import Vue from "vue";
import VueRouter from "vue-router";

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        // {
        //     path: "/",
        //     redirect: "/home",
        //     name: 'main',
        //     component: () => import('../views/Main'),
        //     children: [
        //         {
        //             path: "home",
        //             name: 'home',
        //             component: () => import('../views/Home'),
        //         },
        //         {
        //             path: "user",
        //             name: 'user',
        //             component: () => import('../views/User'),
        //         },
        //         {
        //             path: "mall",
        //             name: 'mall',
        //             component: () => import('../views/Mall'),
        //         },
        //         {
        //             path: "page1",
        //             name: 'page1',
        //             component: () => import('../views/Others/pageOne'),
        //         },
        //         {
        //             path: "page2",
        //             name: 'page2',
        //             component: () => import('../views/Others/pageTwo'),
        //         }
        //     ]
        // },
        {
            path: "/login",
            name: 'login',
            component: () => import('../views/Login'),
        }

    ]
})

router.beforeEach((to, from, next) => {
    store.commit('user/GET_TOKEN');
    const token = store.state.user.token;
    if(!token && to.path !== '/login') {
        next('/login');
    } else if (token && to.path === '/login') {
        next({ path: '/home' });
    }
    else {
        next();
    }
})

export default router
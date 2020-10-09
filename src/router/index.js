import Vue from "vue";
import VueRouter from "vue-router";

const Login = ()=>import('../components/Login')
const Home = ()=>import('../components/Home')
const Welcome = ()=>import('../components/Welcome')
const User = ()=>import('../components/User')
const Rights = ()=>import('../components/power/Rights')
const Roles = ()=>import('../components/power/Roles')
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect:'/login',
    },
    {
        path:'/login',
        component:Login
    },
    {
        path:'/home',
        component:Home,
        children:[
            {
                path: '/',
                redirect:'/welcome',
            },
            {
                path:'/welcome',
                component:Welcome
            },
            {
                path:'/users',
                component:User
            },
            {
                path:'/rights',
                component:Rights
            },
            {
                path:'/roles',
                component:Roles
            },
        ]
    }
];

const router  = new VueRouter({
    routes,
    mode:'history',
});

router.beforeEach((to,from,next)=>{
    if(to.path==='/login'){
        return next();
    }
    //获取token
    const token = window.sessionStorage.getItem('token');
    if(!token) next('/login');
    next();
})

export default router;
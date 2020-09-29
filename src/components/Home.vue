<template>
    <el-container class="home-conrainer">
        <el-header>
            <div>
                <img src="../assets/img/heima.png"/>
                <span>电商后台管理系统</span>
            </div>
            <el-button @click="logout" type="info">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                        :default-active="activeitem"
                        class="el-menu-vertical-demo"
                        background-color="#333744"
                        text-color="#fff"
                        unique-opened
                        router
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        active-text-color="#409EFF">
                    <!--一级菜单-->
                    <el-submenu v-for="(item,index) in menuList" :index="item.id+''"  :key="index">
                        <template slot="title">
                            <i :class="iconObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item v-for="(subItem,index) in item.children" :index="'/'+subItem.path" :key="index" @click="savaAciveItem(subItem.path)">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import {getMenus} from "@/network/home";
    export default {
        name: "Home",
        data(){
          return{
              menuList:[],
              iconObj:{
                  '125':'iconfont icon-user',
                  '103':'iconfont icon-tijikongjian',
                  '101':'iconfont icon-shangpin',
                  '102':'iconfont icon-danju',
                  '145':'iconfont icon-baobiao'
              },
              isCollapse:false,
              activeitem:'',
          }
        },
        created(){
            this.getMenus();
            this.activeitem=window.sessionStorage.getItem('activeitem')
        },
        methods:{
            logout(){
                window.sessionStorage.clear();
                this.$router.push('/login');
            },
            getMenus(){
                getMenus().then(res=>{
                    if(res.meta.status!==200){
                        this.$message.error(res.meta.msg);
                        return;
                    }
                    this.menuList = res.data;
                })
            },
            toggleCollapse(){
                this.isCollapse=!this.isCollapse;
            },
            savaAciveItem(item){
                window.sessionStorage.setItem('activeitem','/'+item);
                this.activeitem='/'+item;
            }
        },

    }
</script>

<style scoped>
    .el-header{
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 20px;
    }
    .el-header div{
        display: flex;
        align-items: center;
    }
    .el-header span{
        padding-left: 10px;
    }
    .el-aside{
        background-color: #333744;
    }
    .el-main{
        background-color: #eee;
    }
    .home-conrainer{
        height: 100%;
    }
    .iconfont{
        padding-right: 10px;
    }
    .el-aside .el-menu{
        border: none;
    }
    .toggle-button{
        background-color: #4A5064;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        color: white;
        cursor: pointer;
        letter-spacing: 0.2em;
    }
</style>
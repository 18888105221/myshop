<template>
    <div class="login">
        <div class="login-box">
            <div class="avater_box">
                <img src="../assets/logo.png">
            </div>
            <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm" >重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {login} from "@/network/login";
    export default {
        name: "Login",
        data(){
            return{
                loginForm:{
                    username:'admin',
                    password:'123456'
                },
                rules:{
                    username:[
                        { required: true, message: '请输入登录名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        methods:{
            resetLoginForm(){
                this.$refs.loginFormRef.resetFields();
            },
            login(){
                this.$refs.loginFormRef.validate(vaild=>{
                    if (!vaild){
                        return;
                    }
                    login(this.loginForm).then(res=>{
                        if(res.meta.status!=200){
                            this.$message.error(res.meta.msg);
                        }else {
                            this.$message({
                                message: '登录成功',
                                type: 'success'
                            });
                            window.sessionStorage.setItem("token",res.data.token);
                            this.$router.push('/home');
                        }
                    })
                });
            }
        }
    }
</script>

<style scoped>
    .login{
        background-color: #2b4b6b;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .login-box{
        width: 350px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: relative;
    }
    .avater_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eeeeee;
        border-radius: 50%;
        padding: 10px;
        background-color: white;
        box-shadow: #eeeeee;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-65px);
    }
    .avater_box img{
        width: 100%;
        height: 100%;
        border-radius: 40%;
        background-color: #eeeeee;
    }
    .login-form{
        position: absolute;
        bottom: 0px;
        width: 100%;
        padding: 0px 20px;
        box-sizing: border-box;
    }
    .btns{
        display: flex;
        flex-direction: row-reverse;
    }
</style>
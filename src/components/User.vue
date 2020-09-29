<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getUserList">
                        <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-table :data="userlist" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDialog(scope.row.id)"></el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
                    <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top">
                        <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1,2,5,10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>

        <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible"
                width="50%"
                @close="addDialogClosed"
        >
            <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="修改用户"
                :visible.sync="editdialogVisible"
                width="50%"
                @close="editDialogClosed"
                >
            <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input :disabled="true" v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getUserList,userStateChanged,addUser,showEditDialog,editUserInfo,removeUserById} from "@/network/home";
    export default {
        name: "User",
        data(){
            //验证邮箱
            var checkEmail = (rule,value,cb) =>{
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if(regEmail.test(value)){
                    return cb();
                }
                cb(new Error('请输入合法的邮箱'));
            }
            var checkMobile = (rule,value,cb)=>{
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if(regMobile.test(value)){
                    return cb();
                }
                cb(new Error('请输入合法的号码'));
            }
            return{
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:2
                },
                userlist:[],
                total:0,
                dialogVisible:false,
                addForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
                },
                addFormrules:{
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        {validator:checkEmail,trigger: 'blur'}
                    ],
                    mobile:[
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        {validator:checkMobile,trigger: 'blur'}
                    ],
                },
                editdialogVisible:false,
                editForm:{},
                editFormrules:{
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        {validator:checkEmail,trigger: 'blur'}
                    ],
                    mobile:[
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        {validator:checkMobile,trigger: 'blur'}
                    ],
                },
            }
        },
        created(){
            this.getUserList();
        },
        methods: {
            getUserList() {
                getUserList(this.queryInfo).then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error("获取用户列表失败|");
                    }
                    this.userlist = res.data.users;
                    this.total = res.data.total;
                })
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getUserList();
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getUserList();
            },
            userStateChange(userInfo) {
                userStateChanged(userInfo).then(res => {
                    console.log(res);
                    if (res.meta.status !== 200) {
                        userInfo.mg_state = !userInfo.mg_state
                        return this.$message.error('更新用户状态失败');
                    }
                    return this.$message.success('更新用户状态成功');
                })
            },
            addDialogClosed(){
                this.$refs.addFormRef.resetFields();
            },
            addUser(){
                this.$refs.addFormRef.validate(res=>{
                    if(!res){
                        return;
                    }
                    addUser(this.addForm).then(res=>{
                        if(res.meta.status!==201){
                            this.$message.error('添加用户失败')
                        }

                        this.$message.success('添加用户成功')

                        this.dialogVisible = false;
                        this.getUserList();
                    })

                })
            },
            showDialog(id){
                showEditDialog(id).then(res=>{
                    if (res.meta.status !== 200) {
                        return this.$message.error('查询用户失败');
                    }
                    this.editForm = res.data;
                })
                this.editdialogVisible = true;
            },
            editDialogClosed(){
                this.$refs.editFormRef.resetFields();
            },
            editUserInfo(){
                this.$refs.editFormRef.validate(valid=>{
                    if(!valid){
                        return
                    }
                    editUserInfo(this.editForm).then(res=>{
                        if (res.meta.status !== 200) {
                            return this.$message.error('更新用户失败');
                        }
                        this.editdialogVisible = false;
                        this.getUserList();
                        this.$message.success('更新用户信息成功');
                    })
                })
            },
            async removeUserById(id){
             const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
             })
                if(confirmResult!=='confirm'){
                    return this.$message.info('已取消删除')
                }
                removeUserById(id).then(res=>{
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除用户失败');
                    }
                    this.$message.success('删除用户成功');
                    this.getUserList();
                })
            },
        }
    }
</script>

<style scoped>

</style>
<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',index1===0?'bdtop':'','vcenter']" v-for="(item1,index1) in scope.row.children" :key="index1">
                            <el-col :span="5">
                                <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[index2 !==0?'bdtop':'','vcenter']" v-for="(item2,index2) in item1.children" :key="index2">
                                    <el-col :span="6">
                                        <el-tag @close="removeRightById(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag closable v-for="(item3,index3) in item2.children" :key="index3" type="warning" @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-edit" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!--分配权限对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="50%"
                @close="setRightDialogclosed">
            <el-tree ref="treeRef" :data="rightList" :props="defaultProps" show-checkbox node-key="id"
                     default-expand-all :default-checked-keys="defKeys"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getRolesList,removeRights,showSetRightDialog,addRights} from "@/network/power";
    export default {
        name: "Roles",
        data(){
            return{
                rolesList:[],
                setRightDialogVisible:false,
                rightList:{},
                defaultProps:{
                    label:'authName',
                    children:'children'
                },
                defKeys:[],
                //当前准备分配权限的roleId
                roleId:''
            }
        },
        created(){
            this.getRolesList();
        },
        methods:{
           getRolesList(){
                getRolesList().then(res=>{
                    if(res.meta.status !==200){
                        return this.$message.error("获取角色列表失败");
                    }
                    this.rolesList = res.data;
                });
            },
            async removeRightById(row,id){
                const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                })
                if(confirmResult!=='confirm'){
                    return this.$message.info('取消删除该权限');
                }
                removeRights(row,id).then(res=>{
                  if(res.meta.status!==200){
                      return this.$message.error("删除失败");
                  }
                  row.children=res.data;
                })
            },
            showSetRightDialog(role){
                this.roleId = role.id;
                showSetRightDialog().then(res=>{
                    if(res.meta.status!==200){
                        return this.$message.error("获取权限失败");
                    }
                    this.rightList = res.data;
                    //递归获取三级节点id
                    this.getLeafKeys(role, this.defKeys)
                    this.setRightDialogVisible=true;
                })
            },
            /*通过递归的形式，获取角色下所有三级权限的id ,并保存到defkeys*/
            getLeafKeys(node,arr){
               if(!node.children){
                   return arr.push(node.id)
               }
               node.children.forEach(item=>{
                   this.getLeafKeys(item,arr)
               })
            },
            setRightDialogclosed(){
                this.defKeys=[];
            },
            addRights(){
                const keys=[...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys(),];
                const idStr=keys.join(',')
                addRights(this.roleId,idStr).then(res=>{
                    if(res.meta.status!==200){
                        return this.$message.error("更新权限失败");
                    }
                    this.getRolesList();
                    this.setRightDialogVisible = false;
                    return this.$message.success("更新权限成功");
                })
            }
        }
    }
</script>

<style scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
</style>
import axios from "@/network/axios";
import da from "element-ui/src/locale/lang/da";

export function login(data){
    return axios({
        method:'post',
        url:'/login',
        data:data
    })
}
import axios from "@/network/axios";

export function login(data){
    return axios({
        method:'post',
        url:'/login',
        data:data
    })
}
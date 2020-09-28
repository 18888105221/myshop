import originAxios from 'axios';

export default function axios(option) {
    return new Promise((resolve,reject)=>{
        const instance = originAxios.create({
            baseURL:'http://127.0.0.1:8888/api/private/v1',
            timeout:5000
        });
        instance.interceptors.request.use(config=>{


            return config;
        })

        instance.interceptors.response.use(response=>{
            return response.data
        },err=>{
            if(err&&err.response){
                switch (err.response.status) {
                    case 400:
                        err.message='请求错误'
                        break
                    case 401:
                        err.message='未授权的访问'
                        break
                }
            }
            return err;
        })

        instance(option).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })

}
import axios, { AxiosResponse } from 'axios'
import { useRouter } from 'next/router';
// import storeLocal from "store";
// import store from '@/store'

// axios.defaults.withCredentials = true;
const request = axios.create({
    timeout: 10 * 1000,
    // showLoading: false,
    baseURL: '/api/',
    // baseURL: 'http://localhost:5000',
    // baseURL: 'http://183.237.126.131:18080/api/',
    // authURL: process.env.NODE_ENV === 'development' ? 'http://192.168.0.150:8000/api/v2/auth/wxmp/{next_url}/' : '/api/v2/auth/wxmp/{next_url}/'
})


// 异常拦截处理器
const errorHandler = (error: any) => {
    // const {showLoading} = error.config;
    // if (showLoading) Toast.clear();

    console.log('request errorHandler', error);
    let errMessage = "";
    if (error.response) {
        switch (error.response.status) {
            case 400:
                errMessage = '请求错误(400)';
                break;
            case 401:
                errMessage = '未授权，请重新登录(401)';
                break;
            case 403:
                errMessage = '拒绝访问(403)';
                break;
            case 404:
                errMessage = '服务请求出错(404)';
                break;
            case 408:
                errMessage = '请求超时(408)';
                break;
            case 500:
                errMessage = '服务器错误(500)';
                break;
            case 501:
                errMessage = '服务未实现(501)';
                break;
            case 502:
                errMessage = '网络错误(502)';
                break;
            case 503:
                errMessage = '服务不可用(503)';
                break;
            case 504:
                errMessage = '网络超时(504)';
                break;
            case 505:
                errMessage = 'HTTP版本不受支持(505)';
                break;
            default:
                errMessage = `连接出错(${error.response.status})!`;
        }
        // router.replace({name: 'Deny',params:{'code':error.response.status, 'message':errMessage}});
    } else {
        errMessage = '网络不可用，请检查您的网络后重试!'
        // store.commit('core/setNetworkStatus', false);
        // router.replace({name: 'Error',params:{'code':'Network Error', 'message':errMessage}});
    }

    if (error.response.status === 401) {
        //     store.commit('core/setAuthStatus', false);
        // store.commit('core/setAuthStatus', false);
        return Promise.reject(error);
    }

    // if(error.response.status === 401) {
    //     const currentUrl = window.location.href;
    //     const targetUrl = error.config.authURL.replace('{next_url}', encodeURI(window.btoa(currentUrl)));
    //     console.log('$$$$$$$$$$$$', targetUrl);
    //     window.location = targetUrl;
    //     return;
    // }

    // if(error.response.status === 403) {
    //     router.replace({name: 'Http403'});
    //     Notify({type: 'warning', message: '没有权限'});
    //     return Promise.reject(error)
    // }


    if (error.message.includes('timeout')) {
        // Notify({type: 'warning', message: '请求超时'});
        return Promise.reject(error)
    }

    // Notify({type: 'danger', message: '网络异常'});
    // Notify({type: 'danger', message:errMessage});
    console.log(errMessage)
    // Toast.fail({ message:errMessage,duration:3000});
    return Promise.reject(error);
}

request.interceptors.request.use(config => {
    // const { showLoading } = config;
    // if (showLoading) {
    //     // Toast.loading({forbidClick: true, duration: 0});
    // }
    // const cateyes_token = storeLocal.get('cateyes_token');
    // if (cateyes_token && cateyes_token.authToken) {
    //     // config.headers['authToken'] = cateyes_token.authToken;
    // }
    // // const cateyes_uuid = storeLocal.get('cateyes_uuid').uuid;
    // // if(cateyes_uuid){
    // //     console.log('3333333333333')
    // //     config.headers['CATEYES_UUID'] = cateyes_uuid;
    // //
    // // }
    // if (config.url.toLocaleLowerCase().startsWith('http')) {
    //     config.baseURL = ''
    // }

    // console.log('$$$$$$$$$$$',config.data,config.params)
    // if (config.params) {
    //     config.params = {
    //         q: Base64.encode(Base64.stringToUint8Array(JSON.stringify(config.params)))
    //     }
    // } else if (config.data) {
    //     config.data = Base64.encode(Base64.stringToUint8Array(JSON.stringify(config.data)))
    // }
    // console.log('$$$$$$$$$$$',config.data,config.params)
    // config.headers['CATEYES-BASE64'] = 1
    // console.log('body',config.body)
    // console.log('body',config)
    return config
}, errorHandler)

request.interceptors.response.use(async response => {
    // const { showLoading } = response.config;
    // if (showLoading) {
    // Toast.clear();
    // }
    // response.data.data = JSON.parse(Base64.Uint8ArrayToString(Base64.decode(response.data.data)))
    // console.log('$$$$$$$$$',response)
    return response.data;
}, errorHandler)

async function fetcher<T>(url: string, method: string, data?: object, options?: object): Promise<AxiosResponse<T>> {
    const opt = options || {};
    // const token = storeLocal.get('cateyes_token')
    return request({
        url: url,
        method: method,
        data: method === 'get' ? undefined : { ...data },
        params: method === 'get' ? { ...data } : undefined,
        headers: {
            'Authorization': "Bearer " + localStorage?.getItem('token'),
        },
        ...opt
    }).then(res => {
        return Promise.resolve(res);
    }).catch(res => {
        console.log(res)
        if (res.response.status === 401 || res.response.status === 403) {
            setTimeout(() => {
                window.location.href = '/auth/signin';
            }, 1000)
        }
        return Promise.reject(res);
    });
}


// export default request
export { request, fetcher }

// export {
//     request as axios
// }
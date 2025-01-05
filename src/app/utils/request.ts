import axios, { AxiosResponse } from 'axios'


// axios.defaults.withCredentials = true;
const request = axios.create({
    timeout: 10 * 1000,
    // showLoading: false,
    baseURL: '/api/',
    // baseURL: 'http://localhost:5000',
    // baseURL: 'http://183.237.126.131:18080/api/',
})


const errorHandler = (error: any) => {
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
    }

    if (error.response.status === 401) {
        return Promise.reject(error);
    }


    if (error.message.includes('timeout')) {
        return Promise.reject(error)
    }

    // console.log(errMessage)
    return Promise.reject(error);
}

request.interceptors.request.use(config => {
    return config
}, errorHandler)

request.interceptors.response.use(async response => {
    return response.data;
}, errorHandler)

async function fetcher<T>(url: string, method: string, data?: object, options?: object): Promise<AxiosResponse<T>> {
    const opt = options || {};
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


export { request, fetcher }

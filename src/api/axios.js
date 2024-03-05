import axios from 'axios'
import config from '@/config'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

class HttpRequest {
    constructor(baseUrl){
        this.baseUrl = baseUrl
    }

    getInsideConfig(){
        const config = {
            baseURL: this.baseUrl,
            headers: {}
        }
        return config
    }
    interceptors(instance){
        // 请求拦截
        instance.interceptors.request.use(config => {
            return config
        }, error => {
            return Promise.reject(error)
        })
        // 响应拦截
        instance.interceptors.response.use(res => {
            return res
        }, error => {
            return Promise.reject(error)
        })
    }
    request(options){
        const instance = axios.create()
        options = { ...this.getInsideConfig(), ...options}
        this.interceptors(instance)
        return instance(options)
    }
}

export default new HttpRequest(baseUrl)
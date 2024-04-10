// import axios from 'axios'
// import config from '@/config'

// const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

// class HttpRequest {
//     constructor(baseUrl){
//         this.baseUrl = baseUrl
//     }

//     getInsideConfig(){
//         const config = {
//             baseURL: this.baseUrl,
//             headers: {}
//         }
//         return config
//     }
//     interceptors(instance){
//         // 请求拦截
//         instance.interceptors.request.use(config => {
//             return config
//         }, error => {
//             return Promise.reject(error)
//         })
//         // 响应拦截
//         instance.interceptors.response.use(res => {
//             return res
//         }, error => {
//             return Promise.reject(error)
//         })
//     }
//     request(options){
//         const instance = axios.create()
//         options = { ...this.getInsideConfig(), ...options}
//         this.interceptors(instance)
//         return instance(options)
//     }
// }

// export default new HttpRequest(baseUrl)

import axios from 'axios';

// 设置axios的基本URL，这应该是你的后端服务地址
axios.defaults.baseURL = 'http://localhost:3000/api';

// 用于保存JWT令牌的变量
let token = null;

// 登陆验证函数
export const loginPermission = async (username, password) => {
  try {
    const response = await axios.post('/login', { username, password });
    token = response.data.data.token; // 保存服务器返回的JWT令牌
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // 设置后续请求的认证头
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw error;
  }
};

// 获取员工列表函数
export const getEmployees = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/employees', { 
      headers: { 
        Authorization: `Bearer ${token}` 
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Get employees error:', error.response.data);
    throw error;
  }
};

// 添加员工函数
export const addEmployee = async (id, name, gender, age, dept) => {
  try {
    const response = await axios.post('/employees', { id, name, gender, age, dept });
    return response.data;
  } catch (error) {
    console.error('Add employee error:', error.response.data);
    throw error;
  }
};

// 更新员工信息函数
export const updateEmployee = async (id, name, gender, age, dept) => {
  try {
    const response = await axios.put(`/employees/${id}`, { name, gender, age, dept });
    return response.data;
  } catch (error) {
    console.error('Update employee error:', error.response.data);
    throw error;
  }
};

// 删除员工函数
export const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete employee error:', error.response.data);
    throw error;
  }
};

// 获取经理列表函数
export const getManagers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/managers', { 
      headers: { 
        Authorization: `Bearer ${token}` 
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Get managers error:', error.response.data);
    throw error;
  }
};

// 添加经理函数
export const addManager = async (id, name, gender, age, dept) => {
  try {
    const response = await axios.post('/managers', { id, name, gender, age, dept });
    return response.data;
  } catch (error) {
    console.error('Add manager error:', error.response.data);
    throw error;
  }
};

// 更新经理信息函数
export const updateManager  = async (id, name, gender, age, dept) => {
  try {
    const response = await axios.put(`/managers/${id}`, { name, gender, age, dept });
    return response.data;
  } catch (error) {
    console.error('Update manager error:', error.response.data);
    throw error;
  }
};

// 删除经理函数
export const deleteManager  = async (id) => {
  try {
    const response = await axios.delete(`/managers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete manager error:', error.response.data);
    throw error;
  }
};

// 获取员工账号信息函数
export const getEmployeeAccounts = async () => {
  try {
    const token = localStorage.getItem('token');    
    const response = await axios.get('/employee_accounts',{
      headers: { 
        Authorization: `Bearer ${token}` 
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Get employee accounts error:', error.response.data);
    throw error;
  }
};

// 添加员工账号函数
export const addEmployeeAccount = async (username, password) => {
  try {
    const response = await axios.post('/employee_accounts', { username, password });
    return response.data;
  } catch (error) {
    console.error('Add employee account error:', error.response.data);
    throw error;
  }
};

// 更新员工密码函数
export const updateEmployeePassword = async (username, password) => {
  try {
    const response = await axios.put(`/employee_accounts/${username}`, { password });
    return response.data;
  } catch (error) {
    console.error('Update employee account password error:', error.response.data);
    throw error;
  }
};

// 员工账号升职函数
export const deleteEmployeeUp = async (username) => {
  try {
    const response = await axios.delete(`/employee_accounts/${username}`);
    return response.data;
  } catch (error) {
    console.error('Delete employee account error:', error.response.data);
    throw error;
  }
};

// 获取经理账号信息函数
export const getManagerAccounts = async () => {
  try {
    const token = localStorage.getItem('token');    
    const response = await axios.get('/manager_accounts',{
      headers: { 
        Authorization: `Bearer ${token}` 
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Get manager accounts error:', error.response.data);
    throw error;
  }
};

// 添加经理账号函数
export const addManagerAccount = async (username, password) => {
  try {
    const response = await axios.post('/manager_accounts', { username, password });
    return response.data;
  } catch (error) {
    console.error('Add manager account error:', error.response.data);
    throw error;
  }
};

// 更新经理密码函数
export const updateManagerPassword = async (username, password) => {
  try {
    const response = await axios.put(`/manager_accounts/${username}`, { password });
    return response.data;
  } catch (error) {
    console.error('Update manager account password error:', error.response.data);
    throw error;
  }
};

// 经理账号降职函数
export const deleteManagerDown = async (username) => {
  try {
    const response = await axios.delete(`/manager_accounts/${username}`);
    return response.data;
  } catch (error) {
    console.error('Delete manager account error:', error.response.data);
    throw error;
  }
};

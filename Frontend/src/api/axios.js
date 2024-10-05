import axios from 'axios';
import store from '@/store';

// 设置axios的基本URL，这应该是你的后端服务地址
axios.defaults.baseURL = 'http://localhost:3000/api';

// 用于保存JWT令牌的变量
// let token = null;

// 登陆验证函数
export const loginPermission = async (username, password) => {
  try {
    const response = await axios.post('/login', { username, password });
    const token = response.data.data.token; // 保存服务器返回的JWT令牌
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // 设置后续请求的认证头
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw error;
  }
};

// 获取员工列表函数
export const getEmployees = async (searchValue, page, pageSize) => {
  try {
    // const token = localStorage.getItem('token');
    const token = store.state.user.token;
    const url = searchValue ? `employees/?search=${searchValue}` : 'employees';
    const response = await axios.get(url, { 
      headers: { 
        Authorization: `Bearer ${token}` 
      } ,
      params: {
        page,
        pageSize
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    console.error('Get employees error:', error.response.data);
    throw error;
  }
};

// 添加员工函数
export const addEmployee = async (id, name, gender, age, dept, type) => {
  try {
    const response = await axios.post('/employees', { id, name, gender, age, dept, type });
    return response.data;
  } catch (error) {
    console.error('Add employee error:', error.response.data);
    throw error;
  }
};

// 更新员工信息函数
export const updateEmployee = async (id, name, gender, age, dept, type) => {
  try {
    const response = await axios.put(`/employees/${id}`, { name, gender, age, dept, type });
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

// 获取所有账号信息（员工和经理）函数
export const getAccounts = async (searchValue, page, pageSize) => {
  try {
    // const token = localStorage.getItem('token');
    const token = store.state.user.token;
    const url = searchValue ? `accounts/?search=${searchValue}` : 'accounts';
    const response = await axios.get(url, { 
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      params: {
        page,
        pageSize
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get accounts error:', error.response.data);
    throw error;
  }
};

// 添加账号信息函数
export const addAccount = async (username, password, type) => {
  try {
    const response = await axios.post('/accounts', { username, password, type });
    return response.data;
  } catch (error) {
    console.error('Add account error:', error.response.data);
    throw error;
  }
};

// // 更新账号密码函数
// export const updateEmployeePassword = async (username, password, type) => {
//   try {
//     const response = await axios.put(`/accounts/${username}`, { password, type });
//     return response.data;
//   } catch (error) {
//     console.error('Update employee account password error:', error.response.data);
//     throw error;
//   }
// };

// 更新员工密码函数
export const updateEmployeePassword = async (username, password, type) => {
  try {
    const response = await axios.put(`/accounts/${username}`, { password, type });
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

// 更新经理密码函数
export const updateManagerPassword = async (username, password, type) => {
  try {
    const response = await axios.put(`/accounts/${username}`, { password, type });
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




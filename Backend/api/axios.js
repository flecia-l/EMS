import axios from 'axios';

// 设置基础URL，这样你就不需要每次调用API都写完整的URL
axios.defaults.baseURL = 'http://localhost:3000';

// 封装获取用户列表的函数
export const getUserList = (params) => {
  return axios.get('/api/userList', { params });
}

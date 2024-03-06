const axios = require('axios');

// 替换以下URL为您要测试的后端API的实际URL
const testApiUrl = 'http://localhost:3000/api/employees';

// 使用axios发送GET请求
axios.get(testApiUrl)
  .then(response => {
    // 请求成功，输出响应数据
    console.log('API测试成功，响应数据：', response.data);
  })
  .catch(error => {
    // 请求失败，输出错误信息
    console.error('API测试失败，错误信息：', error.message);
  });

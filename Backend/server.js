require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

app.use(cors());

// 引入路由处理模块（比如 auth.js，其中包含登录验证逻辑）
const authRoutes = require('./api/routes/auth.js'); 
const infoManagementRoutes = require('./api/routes/infoManagement');
const accountManagementRoutes = require('./api/routes/accountManagement');
const positionManagementRoutes = require('./api/routes/positionManagement');

// 使用 JSON 中间件解析请求体
app.use(express.json());

// 使用路由
app.use('/api', authRoutes);
app.use('/api', infoManagementRoutes);
app.use('/api', accountManagementRoutes);
app.use('/api', positionManagementRoutes);

// 静态文件服务（可选，如果你的后端还需要提供静态文件服务的话）
// app.use(express.static('public'));

// 默认路由，当访问根路径时
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// 启动服务器 (测试时需要注释)
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;  // 导出 app 以供测试使用
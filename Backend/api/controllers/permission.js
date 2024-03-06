const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db'); // 导入连接池

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`服务器运行在http://localhost:${port}`);
});

app.post('/api/getMenu', (req, res) => {
    const { username, password } = req.body;
    // 使用连接池查询数据库中的用户信息
    pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
      if (err) {
        return res.status(500).json({ error: '数据库查询错误' });
      }
  
      if (results.length > 0) {
        // 如果用户验证成功，根据用户类型（如admin或其他用户类型）返回不同的菜单数据
        const userType = results[0].type; // 假设数据库中有一个字段指定用户类型
        let sql = '';
        if (userType === 'admin') {
          sql = 'SELECT * FROM menu WHERE userType = "admin"';
        } else {
          sql = 'SELECT * FROM menu WHERE userType = "user"';
        }
        
        pool.query(sql, (err, menuResults) => {
          if (err) {
            return res.status(500).json({ error: '菜单查询错误' });
          }
          res.json({
            code: 20000,
            data: {
              menu: menuResults,
              token: '模拟生成的token',
              message: '获取成功'
            }
          });
        });
      } else {
        // 用户名或密码错误
        res.json({
          code: -999,
          data: {
            message: '密码错误'
          }
        });
      }
    });
});

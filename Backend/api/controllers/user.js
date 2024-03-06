const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 获取用户列表
app.get('/api/userList', (req, res) => {
  const { name, page = 1, limit = 10 } = req.query;
  let sql = `SELECT * FROM users WHERE name LIKE ? LIMIT ?, ?`;
  let replacements = [`%${name}%`, (page - 1) * limit, parseInt(limit)];

  pool.query(sql, replacements, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      code: 20000,
      count: results.length,
      list: results
    });
  });
});

// 创建用户
app.post('/api/createUser', (req, res) => {
  const { name, address, age, birthday, sex } = req.body;
  let sql = `INSERT INTO users (name, address, age, birthday, sex) VALUES (?, ?, ?, ?, ?)`;
  let replacements = [name, address, age, birthday, sex];

  pool.query(sql, replacements, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ code: 20000, data: { message: '添加成功' }});
  });
});

// 删除用户
app.delete('/api/deleteUser', (req, res) => {
  const { id } = req.query;
  let sql = `DELETE FROM users WHERE id = ?`;

  pool.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ code: 20000, message: '删除成功' });
  });
});

// 批量删除用户（假设你有批量删除的逻辑）
// 更新用户信息
app.put('/api/updateUser', (req, res) => {
  const { id, name, address, age, birthday, sex } = req.body;
  let sql = `UPDATE users SET name = ?, address = ?, age = ?, birthday = ?, sex = ? WHERE id = ?`;
  let replacements = [name, address, age, birthday, sex, id];

  pool.query(sql, replacements, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ code: 20000, data: { message: '编辑成功' } });
  });
});

app.listen(port, () => {
  console.log(`服务器运行在http://localhost:${port}`);
});

// TODO 请注意，您需要根据您的数据库架构和数据表调整SQL查询和参数。上述代码中的users表和相应的字段需要您根据实际情况进行调整。
const express = require('express');
const pool = require('../../config/db');
const router = express.Router();

// 获取员工列表
router.get('/employees', async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM employee');
        res.json({ code: 200, data: results.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 添加员工
router.post('/employees', async (req, res) => {
    const { name, gender, age, dept } = req.body;
    try {
        await pool.query('INSERT INTO employee (Name, Gender, Age, Dept) VALUES ($1, $2, $3, $4)', [name, gender, age, dept]);
        res.json({ code: 200, message: '员工添加成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 修改员工信息
router.put('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { name, gender, age, dept } = req.body;
    try {
        await pool.query('UPDATE employee SET Name = $1, Gender = $2, Age = $3, Dept = $4 WHERE Id = $5', [name, gender, age, dept, id]);
        res.json({ code: 200, message: '员工信息更新成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 删除员工
router.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM employee WHERE Id = $1', [id]);
        res.json({ code: 200, message: '员工删除成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

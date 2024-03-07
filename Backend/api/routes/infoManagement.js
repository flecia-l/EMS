const express = require('express');
const pool = require('../../config/db');
const authenticate = require('../../middlewares/authenticate');
const router = express.Router();

// 获取员工列表
router.get('/employees', authenticate, async (req, res) => {
    try {
        const { username, userType } = req.user
        console.log('userType', userType);
        if (userType === 0) {
            const results = await pool.query('SELECT * FROM employee UNION SELECT * FROM manager');
            res.json({ code: 200, data: results[0] });
        }
        else {
            const results = await pool.query('SELECT * FROM employee WHERE Dept = (SELECT Dept FROM manager WHERE Id = ?)', [username]);
            res.json({ code: 200, data: results[0] });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 添加员工
router.post('/employees', async (req, res) => {
    const { id, name, gender, age, dept } = req.body;
    try {
        await pool.query('INSERT INTO employee (Id, Name, Gender, Age, Dept) VALUES (?, ?, ?, ?, ?)', [id, name, gender, age, dept]);
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
        const [results] = await pool.query('UPDATE employee SET Name = ?, Gender = ?, Age = ?, Dept = ? WHERE Id = ?', [name, gender, age, dept, id]);
        if (results.affectedRows === 0) {
            return res.json({ code: 404, message: '员工不存在' });
        }
        res.json({ code: 200, message: '员工信息更新成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 删除员工
router.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM employee WHERE Id = ?', [id]);
        res.json({ code: 200, message: '员工删除成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

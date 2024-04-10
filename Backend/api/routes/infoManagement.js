const express = require('express');
const {pool} = require('../../config/db');
const authenticate = require('../../middlewares/authenticate');
const router = express.Router();
const logger = require('../../logger/Logger');


// 获取员工列表
router.get('/employees', authenticate, async (req, res) => {
    logger.log('Starting to process /employees request.');
    try {
        const { username, userType } = req.user
        console.log('userType', userType);
        if (userType === 0) {
            const results = await pool.query('SELECT * FROM employee');
            res.json({ code: 200, data: results[0] });
        }
        else if(userType === 1) {
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

// 获取经理列表
router.get('/managers', authenticate, async (req, res) => {
    logger.log('Starting to process /managers request.');
    try {
        const { userType } = req.user
        console.log('userType', userType);
        if (userType === 0) {
            const results = await pool.query('SELECT * FROM manager');
            res.json({ code: 200, data: results[0] });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 添加经理
router.post('/managers', async (req, res) => {
    const { id, name, gender, age, dept } = req.body;
    try {
        await pool.query('INSERT INTO manager (Id, Name, Gender, Age, Dept) VALUES (?, ?, ?, ?, ?)', [id, name, gender, age, dept]);
        res.json({ code: 200, message: '经理添加成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 修改经理信息
router.put('/managers/:id', async (req, res) => {
    const { id } = req.params;
    const { name, gender, age, dept } = req.body;
    try {
        const [results] = await pool.query('UPDATE manager SET Name = ?, Gender = ?, Age = ?, Dept = ? WHERE Id = ?', [name, gender, age, dept, id]);
        if (results.affectedRows === 0) {
            return res.json({ code: 404, message: '经理不存在' });
        }
        res.json({ code: 200, message: '经理信息更新成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 删除经理
router.delete('/managers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM manager WHERE Id = ?', [id]);
        res.json({ code: 200, message: '经理删除成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

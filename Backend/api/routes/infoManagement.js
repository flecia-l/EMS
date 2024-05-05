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
    const { id, name, gender, age, dept, type } = req.body;
    try {
        if(type==='Manager'){
            await pool.query('INSERT INTO manager (Id, Name, Gender, Age, Dept) VALUES (?, ?, ?, ?, ?)', [id, name, gender, age, dept, type]);
            res.json({ code: 200, message: 'Manager information added successfully!' });
        }
        else if(type === 'Employee'){
            await pool.query('INSERT INTO employee (Id, Name, Gender, Age, Dept) VALUES (?, ?, ?, ?, ?)', [id, name, gender, age, dept, type]);
            res.json({ code: 200, message: 'Employee information added successfully!' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 修改信息
router.put('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { name, gender, age, dept, type } = req.body;
    // 首先尝试在 employee 表中查找
    let tableName;
    try {
        let [result] = await pool.query('SELECT Id FROM employee WHERE Id = ?', [id]);
        if (result.length > 0) {
            tableName = 'employee';
        } else {
            // 如果 employee 表中没有找到，再在 manager 表中查找
            [result] = await pool.query('SELECT Id FROM manager WHERE Id = ?', [id]);
            if (result.length > 0) {
                tableName = 'manager';
            }
        }
        // 如果找到了对应的表名，则执行更新
        if (tableName) {
            const [updateResults] = await pool.query(`UPDATE ${tableName} SET Name = ?, Gender = ?, Age = ?, Dept = ? WHERE Id = ?`, [name, gender, age, dept, id, type]);
            if (updateResults.affectedRows === 0) {
                res.status(404).json({ code: 404, message: '未找到指定的员工' });
            } else {
                res.json({ code: 200, message: '员工信息更新成功' });
            }
        } else {
            // 如果两个表都没有找到 ID
            res.status(404).json({ code: 404, message: '未找到指定的员工' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 删除信息
router.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // 首先尝试在 employee 表中查找
        let result = await pool.query('SELECT Id FROM employee WHERE Id = ?', [id]);
        let tableName;
        if (result.length > 0) {
            tableName = 'employee';
        } else {
            // 如果 employee 表中没有找到，再在 manager 表中查找
            result = await pool.query('SELECT Id FROM manager WHERE Id = ?', [id]);
            if (result.length > 0) {
                tableName = 'manager';
            }
        }
        // 如果找到了对应的表名，则执行删除操作
        if (tableName) {
            await pool.query(`DELETE FROM ${tableName} WHERE Id = ?`, [id]);
            res.json({ code: 200, message: '删除成功' });
        } else {
            // 如果两个表都没有找到 ID，则返回错误信息
            res.status(404).json({ message: '未找到指定的员工' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

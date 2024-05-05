const express = require('express');
const {pool} = require('../../config/db');
const authenticate = require('../../middlewares/authenticate');
const router = express.Router();
const logger = require('../../logger/Logger');


// 获取信息列表
router.get('/employee', authenticate, async (req, res) => {
    logger.log('Starting to process /employee request.');
    try {
        const { username, userType } = req.user
        console.log('userType', userType);
        if (userType === 0) {
            const results = await pool.query(`
            SELECT *, 'Employee' as type FROM employee
            UNION
            SELECT *, 'Manager' as type FROM manager`);
            res.json({ code: 200, data: results[0] });
        }
        else if(userType === 1) {
            const results = await pool.query(`SELECT *, 'Employee' as type FROM employee WHERE Dept = (SELECT Dept FROM manager WHERE Id = ?)`, [username]);
            res.json({ code: 200, data: results[0] });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 添加信息
router.post('/employee', async (req, res) => {
    const { id, name, gender, age, dept,type } = req.body;
    try {
        if(type==='Manager'){
            await pool.query('INSERT INTO manager (Id, Name, Gender, Age, Dept) VALUES (?, ?, ?, ?, ?)', [id, name, gender, age, dept]);
            res.json({ code: 200, message: 'Manager information added successfully!' });
        }
        else if(type === 'Employee'){
            await pool.query('INSERT INTO employee (Id, Name, Gender, Age, Dept) VALUES (?, ?, ?, ?, ?)', [id, name, gender, age, dept]);
            res.json({ code: 200, message: 'Employee information added successfully!' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 删除信息
router.delete('/employees/:id', authenticate, async (req, res) => {
    const { userType } = req.user
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        if (userType === 0) {
            await connection.query(`DELETE FROM employee WHERE Id = ?`, [id]);
            await connection.query(`DELETE FROM manager WHERE Id = ?`, [id]);
            await connection.commit();
            res.json({code: 200, message: 'Delete successfully!'});
        }
        else if (userType === 1){
            await connection.query(`DELETE FROM employee WHERE Id = ?`, [id]);
            res.json({code: 200, message: 'Delete successfully!功'});
        }
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    }finally{
        connection.release();
    }
});

// 修改信息
router.put('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { name, gender, age, dept, type } = req.body;
    try {
        if(type === 'Manager'){
            const [results] = await pool.query('UPDATE manager SET Name = ?, Gender = ?, Age = ?, Dept = ? WHERE Id = ?', [name, gender, age, dept, id]);
            if (results.affectedRows === 0) {
                return res.json({ code: 404, message: 'The manager does not exist!' });
            }
            res.json({ code: 200, message: 'Manager information updated successfully!' });
        }
        else if(type === 'Employee'){
            const [results] = await pool.query('UPDATE employee SET Name = ?, Gender = ?, Age = ?, Dept = ? WHERE Id = ?', [name, gender, age, dept, id]);
            if (results.affectedRows === 0) {
                return res.json({ code: 404, message: 'The employee does not exist!' });
            }
            res.json({ code: 200, message: 'Employee information updated successfully!' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;

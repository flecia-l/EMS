const express = require('express');
const {pool} = require('../../config/db'); 
const authenticate = require('../../middlewares/authenticate');
const router = express.Router();
const bcrypt = require('bcrypt');
const logger = require('../../logger/Logger');

// 获取账号
router.get('/accounts', authenticate, async (req, res) => {
    logger.log('Starting to process /employee_accounts request.');
    try {
        const { username, userType } = req.user
        console.log('userType', userType);
        if (userType === 1) {
            const results = await pool.query(`SELECT User_name, 'Manager' as type FROM manager_login WHERE User_name = ?`, [username]);
            res.json({ code: 200, data: results[0] });
        }
        else if(userType === 2) {
            const results = await pool.query(`SELECT User_name, 'Employee' as type FROM employee_login WHERE User_name = ?`, [username]);
            res.json({ code: 200, data: results[0] });
        }
        else if(userType === 0){
            const results = await pool.query(`
            SELECT User_name, 'Employee' as type FROM employee_login 
            UNION
            SELECT User_name, 'Manager' as type FROM manager_login
            `);
            res.json({ code: 200, data: results[0] });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 添加账号
router.post('/accounts', async (req, res) => {
    const { username, password, type} = req.body;
    try {
        if(type === 'Manager'){
            await pool.query("INSERT INTO manager_login (User_name, Password, User_type) VALUES (?, ?, 1)", [username, password]);
            res.json({ code: 200, message: "Manager account added successfully!" });
        }
        else if(type === 'Employee'){
            await pool.query("INSERT INTO employee_login (User_name, Password, User_type) VALUES (?, ?, 2)", [username, password]);
            res.json({ code: 200, message: "Employee account added successfully!" });
        }
        }catch (err) {
        res.status(500).json({ code:500, message: "The account added failed!", error: err });
    }
});

// 更新密码
router.put('/accounts/:username', async (req, res) => {
    const { username } = req.params;
    const { password, type } = req.body;
    try {
        if(type === 'Manager'){
            const [results] = await pool.query('UPDATE manager_login SET Password = ? WHERE User_name = ?', [password, username]);
            if (results.affectedRows === 0) {
                return res.json({ code: 404, message: 'The manager does not exist!' });
            }
            res.json({ code: 200, message: 'Manager password updated successfully!' });
        }
        else if(type === 'Employee'){
            const [results] = await pool.query('UPDATE employee_login SET Password = ? WHERE User_name = ?', [password, username]);
            if (results.affectedRows === 0) {
                return res.json({ code: 404, message: 'The employee does not exist!' });
            }
            res.json({ code: 200, message: 'Employee password updated successfully!' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require('express');
const {pool} = require('../../config/db'); 
const authenticate = require('../../middlewares/authenticate');
const router = express.Router();
const bcrypt = require('bcrypt');
const logger = require('../../logger/Logger');

// 获取员工账号信息
router.get('/employee_accounts', authenticate, async (req, res) => {
    logger.log('Starting to process /employee_accounts request.');
    try {
        const { username, userType } = req.user
        console.log('userType', userType);
        if (userType === 0) {
            const results = await pool.query('SELECT User_name, Password FROM employee_login');
            res.json({ code: 200, data: results[0] });
        }
        else if(userType === 1) {
            const results = await pool.query('SELECT User_name, Password FROM manager_login WHERE User_name = ?', [username]);
            res.json({ code: 200, data: results[0] });
        }
        else{
            const results = await pool.query('SELECT User_name, Password FROM employee_login WHERE User_name = ?', [username]);
            res.json({ code: 200, data: results[0] });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 添加员工账号
router.post('/employee_accounts', async (req, res) => {
    const { username, password } = req.body;
    try {
        await pool.query("INSERT INTO employee_login (User_name, Password, User_type) VALUES (?, ?, 2)", [username, password]);
        res.json({ code: 200, message: "员工账号添加成功" });
        } catch (err) {
        res.status(500).json({ code:404, message: "添加账号失败", error: err });
    }
});

// 更新员工密码
router.put('/employee_accounts/:username', async (req, res) => {
    const { username } = req.params;
    const { password } = req.body;
    try {
        const [results] = await pool.query('UPDATE employee_login SET Password = ? WHERE User_name = ?', [password, username]);
        if (results.affectedRows === 0) {
            return res.json({ code: 404, message: '员工不存在' });
        }
        res.json({ code: 200, message: '员工密码更新成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 员工升职
router.delete('/employee_accounts/:username', async (req, res) => {
    const { username } = req.params;  
    try {
        await pool.query("BEGIN");  // 开始事务
        const insertManager = `
            INSERT INTO manager (Id, Name, Gender, Age, Dept)
            SELECT Id, Name, Gender, Age, Dept FROM employee WHERE Id = ?;
        `;
        await pool.query(insertManager, [username]);
        const insertManagerLogin = `
            INSERT INTO manager_login (User_name, Password, User_type)
            SELECT User_name, Password, 1 FROM employee_login WHERE User_name = ?;
        `;
        await pool.query(insertManagerLogin, [username]);
        const deleteEmployee = "DELETE FROM employee WHERE Id = ?";
        await pool.query(deleteEmployee, [username]);
        const deleteEmployeeLogin = "DELETE FROM employee_login WHERE User_name = ?";
        await pool.query(deleteEmployeeLogin, [username]);
        await pool.query("COMMIT");  // 提交事务
        res.json({ code:200, message: "员工升职成功" });
    } catch (err) {
        await pool.query("ROLLBACK");  // 回滚事务
        res.status(500).json({ code:404, message: "员工升职失败", error: err });
    }
});

// 获取经理账号信息
router.get('/manager_accounts', authenticate, async (req, res) => {
    logger.log('Starting to process /accounts request.');
    try {
        const { username, userType } = req.user
        console.log('userType', userType);
        if (userType === 0) {
            const results = await pool.query('SELECT User_name, Password FROM manager_login');
            res.json({ code: 200, data: results[0] });
        }
        else if(userType === 1) {
            const results = await pool.query('SELECT User_name, Password FROM manager_login WHERE User_name = ?', [username]);
            res.json({ code: 200, data: results[0] });
        }
        else{
            const results = await pool.query('SELECT User_name, Password FROM employee_login WHERE User_name = ?', [username]);
            res.json({ code: 200, data: results[0] });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 添加经理账号
router.post('/manager_accounts', async (req, res) => {
    const { username, password } = req.body;
    try {
        await pool.query("INSERT INTO manager_login (User_name, Password, User_type) VALUES (?, ?, 1)", [username, password]);
        res.json({ code: 200, message: "经理账号添加成功" });
        } catch (err) {
        res.status(500).json({ code:404, message: "添加账号失败", error: err });
    }
});

// 更新经理密码
router.put('/manager_accounts/:username', async (req, res) => {
    const { username } = req.params;
    const { password } = req.body;
    try {
        const [results] = await pool.query('UPDATE manager_login SET Password = ? WHERE User_name = ?', [password, username]);
        if (results.affectedRows === 0) {
            return res.json({ code: 404, message: '经理不存在' });
        }
        res.json({ code: 200, message: '经理密码更新成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 经理降职
router.delete('/manager_accounts/:username', async (req, res) => {
    const { username } = req.params;  
    try {
        await pool.query("BEGIN");  // 开始事务
        const insertEmployee = `
            INSERT INTO employee (Id, Name, Gender, Age, Dept)
            SELECT Id, Name, Gender, Age, Dept FROM manager WHERE Id = ?;
        `;
        await pool.query(insertEmployee, [username]);
        const insertEmployeeLogin = `
            INSERT INTO employee_login (User_name, Password, User_type)
            SELECT User_name, Password, 2 FROM manager_login WHERE User_name = ?;
        `;
        await pool.query(insertEmployeeLogin, [username]);
        const deleteManager = "DELETE FROM manager WHERE Id = ?";
        await pool.query(deleteManager, [username]);
        const deleteManagerLogin = "DELETE FROM manager_login WHERE User_name = ?";
        await pool.query(deleteManagerLogin, [username]);
        await pool.query("COMMIT");  // 提交事务
        res.json({ code:200, message: "经理降职成功" });
    } catch (err) {
        await pool.query("ROLLBACK");  // 回滚事务
        res.status(500).json({ code:404, message: "经理降职失败", error: err });
    }
});

module.exports = router;

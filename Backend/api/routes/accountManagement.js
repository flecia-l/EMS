const express = require('express');
const bcrypt = require('bcrypt');
const authenticate = require('../../middlewares/authenticate');
const router = express.Router();
const pool = require('../../config/db'); // 假设你已经在db.js中配置了MySQL连接池

// 获取所有账号信息（员工和经理）
router.get('/accounts', async (req, res) => {
    try {
        const allAccounts = await pool.query(`
            SELECT User_name, Password, 'employee' AS Type FROM employee_login
            UNION
            SELECT User_name, Password, 'manager' AS Type FROM manager_login`);
        res.json(allAccounts);
    } catch (err) {
        res.status(500).json({ message: "数据库查询失败", error: err });
    }
});

// 添加账号信息
router.post('/account', async (req, res) => {
    const { username, password, type } = req.body;
    try {
        if (type === 'employee') {
            await pool.query("INSERT INTO employee_login (User_name, Password) VALUES (?, ?)", [username, password]);
        } else if (type === 'manager') {
            await pool.query("INSERT INTO manager_login (User_name, Password) VALUES (?, ?)", [username, password]);
        }
        res.json({ message: "账号添加成功" });
    } catch (err) {
        res.status(500).json({ message: "添加账号失败", error: err });
    }
});

// 更新账号密码
router.put('/account', authenticate, async (req, res) => {
    const { username, newPassword } = req.body;
    const userType = req.user.userType; // 从JWT令牌解析的用户类型
    const userUsername = req.user.username; // 从JWT令牌解析的用户名

    try {
        // 如果是管理员，或者是非管理员但尝试更新自己的密码
        if (userType === 'admin' || (userType !== 'admin' && userUsername === username)) {
            // 使用bcrypt对新密码进行加密
            const hashedPassword = await bcrypt.hash(newPassword, 8);

            // 更新数据库中的密码
            const sql = `UPDATE ${userType === 'admin' ? 'admin' : userType === 'manager' ? 'manager_login' : 'employee_login'}
                         SET Password = $1 WHERE User_name = $2`;
            await pool.query(sql, [hashedPassword, username]);

            res.json({ code: 20000, message: '密码更新成功' });
        } else {
            // 如果非管理员尝试更新其他用户的密码
            res.status(403).json({ message: '无权限更新其他用户的密码' });
        }
    } catch (err) {
        res.status(500).json({ message: '服务器错误', error: err.message });
    }
});

// 删除账号
router.delete('/account', async (req, res) => {
    const { username, type } = req.query;
    try {
        if (type === 'employee') {
            await pool.query("DELETE FROM employee_login WHERE User_name = ?", [username]);
        } else if (type === 'manager') {
            await pool.query("DELETE FROM manager_login WHERE User_name = ?", [username]);
        }
        res.json({ message: "账号删除成功" });
    } catch (err) {
        res.status(500).json({ message: "账号删除失败", error: err });
    }
});

module.exports = router;

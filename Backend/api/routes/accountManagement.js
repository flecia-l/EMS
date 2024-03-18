const express = require('express');
const bcrypt = require('bcrypt');
const authenticate = require('../../middlewares/authenticate');
const router = express.Router();
const {pool} = require('../../config/db'); 


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
    let userType;

    try {
        // 从employee表获取请求更新密码的用户的类型
        const userTypeResult = await pool.query(`
            SELECT User_type FROM employee
            WHERE Id = (SELECT Id FROM employee_login WHERE User_name = ?)
            UNION
            SELECT User_type FROM employee
            WHERE Id = (SELECT Id FROM manager_login WHERE User_name = ?)
            UNION
            SELECT 0 AS User_type FROM admin WHERE User_name = ?`, 
            [username, username, username]
        );

        if (userTypeResult.length > 0) {
            userType = userTypeResult[0].User_type;
        } else {
            return res.status(404).json({ message: "用户不存在" });
        }

        const requesterUsername = req.user.username; // 从身份验证中间件解析出的用户名
        const requesterUserType = req.user.userType; // 从身份验证中间件解析出的用户类型

        let table;
        switch (userType) {
            case 0:
                table = 'admin';
                break;
            case 1:
                table = 'manager_login';
                break;
            case 2:
                table = 'employee_login';
                break;
            default:
                return res.status(400).json({ message: '未知的用户类型' });
        }

        // 如果是管理员或者是用户尝试更新自己的密码
        if (requesterUserType === 0 || (requesterUsername === username)) {
            const hashedPassword = await bcrypt.hash(newPassword, 8);
            await pool.query(`UPDATE ${table} SET Password = ? WHERE User_name = ?`, [hashedPassword, username]);
            res.json({ code: 200, message: '密码更新成功' });
        } else {
            return res.status(403).json({ message: '无权限更新其他用户的密码' });
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

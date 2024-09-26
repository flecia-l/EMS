const express = require('express');
const {pool} = require('../../config/db'); 
const authenticate = require('../../middlewares/authenticate');
const router = express.Router();
const bcrypt = require('bcrypt');
const logger = require('../../logger/Logger');

// 获取账号
// router.get('/accounts', authenticate, async (req, res) => {
//     logger.log('开始处理 /employee_accounts 请求。');
//     const { search } = req.query;  // 从查询参数中获取搜索值
//     try {
//         const { username, userType } = req.user;
//         console.log('userType', userType);

//         let query = '';
//         let conditions = [];
//         let queryParams = [];

//         // 处理搜索查询
//         if (search) {
//             conditions.push('(User_name LIKE ?)');
//             queryParams.push(`%${search}%`);
//             queryParams.push(`%${search}%`);
//         }

//         // 根据用户类型构建查询
//         if (userType === 1) {
//             query = `SELECT User_name, 'Manager' as type FROM manager_login WHERE User_name = ?`;
//             queryParams.push(username);  // 经理只能查看自己的账户
//         } else if (userType === 2) {
//             query = `SELECT User_name, 'Employee' as type FROM employee_login WHERE User_name = ?`;
//             queryParams.push(username);  // 员工只能查看自己的账户
//         } else if (userType === 0) {  // 管理员可以搜索所有账户
//             query = `
//                 SELECT User_name, 'Employee' as type FROM employee_login
//                 UNION
//                 SELECT User_name, 'Manager' as type FROM manager_login
//             `;
//             if (conditions.length > 0) {
//                 query = `
//                     SELECT User_name, 'Employee' as type FROM employee_login WHERE ${conditions.join(' AND ')}
//                     UNION
//                     SELECT User_name, 'Manager' as type FROM manager_login WHERE ${conditions.join(' AND ')}
//                 `;
//             }
//         }

//         const results = await pool.query(query, queryParams);
//         res.json({ code: 200, data: results[0] });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

router.get('/accounts', authenticate, async (req, res) => {
    logger.log('开始处理 /employee_accounts 请求。');
    const { search, page = 1, pageSize = 10 } = req.query;  // 从查询参数中获取分页参数

    try {
        const { username, userType } = req.user;
        console.log('userType', userType);

        let query = '';
        let countQuery = '';  // 用于获取总条目数的查询
        let conditions = [];
        let queryParams = [];

        // 处理搜索查询
        if (search) {
            conditions.push('(User_name LIKE ?)');
            queryParams.push(`%${search}%`);
            queryParams.push(`%${search}%`);
        }

        // 根据用户类型构建查询
        if (userType === 1) {
            query = `SELECT User_name, 'Manager' as type FROM manager_login WHERE User_name = ?`;
            countQuery = `SELECT COUNT(*) AS total FROM manager_login WHERE User_name = ?`;
            queryParams.push(username);  // 经理只能查看自己的账户
        } else if (userType === 2) {
            query = `SELECT User_name, 'Employee' as type FROM employee_login WHERE User_name = ?`;
            countQuery = `SELECT COUNT(*) AS total FROM employee_login WHERE User_name = ?`;
            queryParams.push(username);  // 员工只能查看自己的账户
        } else if (userType === 0) {  // 管理员可以搜索所有账户
            query = `
                SELECT User_name, 'Employee' as type FROM employee_login
                UNION
                SELECT User_name, 'Manager' as type FROM manager_login
            `;
            countQuery = `
                SELECT COUNT(*) AS total FROM (
                    SELECT User_name FROM employee_login
                    UNION
                    SELECT User_name FROM manager_login
                ) AS combined
            `;

            if (conditions.length > 0) {
                query = `
                    SELECT User_name, 'Employee' as type FROM employee_login WHERE ${conditions.join(' AND ')}
                    UNION
                    SELECT User_name, 'Manager' as type FROM manager_login WHERE ${conditions.join(' AND ')}
                `;
                countQuery = `
                    SELECT COUNT(*) AS total FROM (
                        SELECT User_name FROM employee_login WHERE ${conditions.join(' AND ')}
                        UNION
                        SELECT User_name FROM manager_login WHERE ${conditions.join(' AND ')}
                    ) AS combined
                `;
            }
        }

        // 计算分页的偏移量
        const offset = (page - 1) * pageSize;
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(pageSize), offset);

        // 执行分页查询
        const results = await pool.query(query, queryParams);

        // 获取总条目数
        const totalResult = await pool.query(countQuery, queryParams.slice(0, -2));  // 不包含分页参数的查询

        res.json({
            code: 200,
            data: results[0],
            total: totalResult[0][0].total,  // 总条目数
        });
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
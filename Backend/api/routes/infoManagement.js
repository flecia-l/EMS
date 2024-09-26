const express = require('express');
const {pool} = require('../../config/db');
const authenticate = require('../../middlewares/authenticate');
const router = express.Router();
const logger = require('../../logger/Logger');


// 获取员工信息列表
// router.get('/employees', authenticate, async (req, res) => {
//     logger.log('Starting to process /employees request.');
//     const { search } = req.query;  // 从查询参数中获取用户输入的search值
//     try {
//         const { username, userType } = req.user;
//         console.log('userType', userType);

//         let query = 'SELECT * FROM employee ';
//         // 存储查询条件
//         let conditions = [];
//         // 存储查询条件的参数值
//         let queryParams = [];

//         // 动态判断输入的值是哪个字段
//         if (search) {
//             if (/^\d+$/.test(search)) {  // 如果是纯数字，可能是 id 或 age
//                 conditions.push('(Id = ? OR Age = ?)');
//                 queryParams.push(search, search);
//                 queryParams.push(search, search);

//             } else if (typeof search === 'string') {  // 如果是字符串，可能是 name 或 dept
//                 conditions.push('(Name LIKE ? OR Dept LIKE ?)');
//                 queryParams.push(`%${search}%`, `%${search}%`);
//                 queryParams.push(`%${search}%`, `%${search}%`);
//             }
//         }

//         // 权限控制：根据用户类型动态修改查询条件
//         if (userType === 0) {
//             // 管理员: 看到所有员工和经理
//             query = `
//                 SELECT * FROM employee
//                 UNION
//                 SELECT * FROM manager
//             `;
//             if (conditions.length > 0) {
//                 query = `
//                 SELECT * FROM employee
//                 ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
//                 UNION
//                 SELECT * FROM manager
//                 ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
//             `;
//                 // query += ' WHERE ' + conditions.join(' AND ');
//             }
//         } else if (userType === 1) {
//             // 经理: 只能看到自己部门的员工
//             conditions.push('Dept = (SELECT Dept FROM manager WHERE Id = ?)');
//             queryParams.push(username);
//             if (conditions.length > 0) {
//                 query += ' WHERE ' + conditions.join(' AND ');
//             }
//         } else if (userType === 2) {
//             // 员工: 只能看到自己的信息
//             conditions.push('Id = (SELECT Id FROM employee_login WHERE User_name = ?)');
//             queryParams.push(username);
//             if (conditions.length > 0) {
//                 query += ' WHERE ' + conditions.join(' AND ');
//             }
//         }

//         const results = await pool.query(query, queryParams);  // 执行动态查询
//         res.json({ code: 200, data: results[0] });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
router.get('/employees', authenticate, async (req, res) => {
    logger.log('Starting to process /employees request.');
    const { search, page = 1, pageSize = 10 } = req.query;  // 从查询参数中获取search、page 和 pageSize
    try {
        const { username, userType } = req.user;
        console.log('userType', userType);

        let query = 'SELECT * FROM employee ';
        let countQuery = 'SELECT COUNT(*) AS total FROM employee '; // 用于获取总条目数的查询
        let conditions = [];
        let queryParams = [];

        // 动态判断输入的值是哪个字段
        if (search) {
            if (/^\d+$/.test(search)) {  // 如果是纯数字，可能是 id 或 age
                conditions.push('(Id = ? OR Age = ?)');
                queryParams.push(search, search);
                queryParams.push(search, search);
            } else if (typeof search === 'string') {  // 如果是字符串，可能是 name 或 dept
                conditions.push('(Name LIKE ? OR Dept LIKE ?)');
                queryParams.push(`%${search}%`, `%${search}%`);
                queryParams.push(`%${search}%`, `%${search}%`);
            }
        }

        // 权限控制：根据用户类型动态修改查询条件
        if (userType === 0) {
            // 管理员: 看到所有员工和经理
            query = `
                SELECT * FROM employee
                ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
                UNION
                SELECT * FROM manager
                ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
            `;
            countQuery = `
                SELECT COUNT(*) AS total FROM (
                    SELECT * FROM employee
                    ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
                    UNION
                    SELECT * FROM manager
                    ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
                ) AS combined
            `;
        } else if (userType === 1) {
            // 经理: 只能看到自己部门的员工
            conditions.push('Dept = (SELECT Dept FROM manager WHERE Id = ?)');
            queryParams.push(username);
            query += ' WHERE ' + conditions.join(' AND ');
            countQuery += ' WHERE ' + conditions.join(' AND ');
        } else if (userType === 2) {
            // 员工: 只能看到自己的信息
            conditions.push('Id = (SELECT Id FROM employee_login WHERE User_name = ?)');
            queryParams.push(username);
            query += ' WHERE ' + conditions.join(' AND ');
            countQuery += ' WHERE ' + conditions.join(' AND ');
        }

        // 计算分页的偏移量
        const offset = (page - 1) * pageSize;
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(pageSize), offset);

        // 执行分页查询
        const results = await pool.query(query, queryParams);  // 执行动态查询

        // 获取总条目数
        const totalResult = await pool.query(countQuery, queryParams.slice(0, -2));  // 执行查询总条目数，不包含分页参数

        res.json({
            code: 200,
            data: results[0],
            total: totalResult[0][0].total, // 总条目数
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// 添加员工信息
router.post('/employees', async (req, res) => {
    const { id, name, gender, age, dept, type } = req.body;
    try {
        if(type==='Manager'){
            await pool.query('INSERT INTO manager (Id, Name, Gender, Age, Dept) VALUES (?, ?, ?, ?, ?)', [id, name, gender, age, dept, type]);
            res.json({ code: 200, message: '员工添加成功' });
        }
        else if(type === 'Employee'){
            await pool.query('INSERT INTO employee (Id, Name, Gender, Age, Dept) VALUES (?, ?, ?, ?, ?)', [id, name, gender, age, dept, type]);
            res.json({ code: 200, message: '员工添加成功' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 修改员工信息
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

// 删除员工信息
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
            res.json({ code: 200, message: '员工删除成功' });
        } else {
            // 如果两个表都没有找到 ID，则返回错误信息
            res.status(404).json({ message: '未找到指定的员工' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

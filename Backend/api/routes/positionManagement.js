const express = require('express');
const {pool} = require('../../config/db'); 
const authenticate = require('../../middlewares/authenticate');
const router = express.Router();

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
        res.json({ code:200, message: "Employee is promoted successfully!" });
    } catch (err) {
        await pool.query("ROLLBACK");  // 回滚事务
        res.status(500).json({ code:404, message: "Promotion failure!", error: err });
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
        res.json({ code:200, message: "Manager is demoted successfully!" });
    } catch (err) {
        await pool.query("ROLLBACK");  // 回滚事务
        res.status(500).json({ code:404, message: "Demotion failure!", error: err });
    }
});

module.exports = router;
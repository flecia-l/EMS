const express = require('express');
const {pool} = require('../../config/db');
const jwt = require('jsonwebtoken');
const router = express.Router();

const secretKey = process.env.JWT_SECRET; // 应该放在环境变量中
// 登陆验证API
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // 检查用户是否存在
        const userRes = await pool.query('SELECT * FROM admin WHERE User_name = ? UNION SELECT * FROM employee_login WHERE User_name = ? UNION SELECT * FROM manager_login WHERE User_name = ?', [username, username, username]);
        if (userRes.rowCount === 0) {
            return res.status(404).json({ message: "账号不存在" });
        }
        // 验证密码是否正确
        const passRes = await pool.query('SELECT * FROM admin WHERE User_name = ? AND Password = ? UNION SELECT * FROM employee_login WHERE User_name = ? AND Password = ? UNION SELECT * FROM manager_login WHERE User_name = ? AND Password = ?', [username, password, username, password, username, password]);
        if (passRes.rowCount === 0) {
            return res.status(401).json({ message: "密码错误" });
        }
        // 根据不同的登陆身份返回不同的响应
        const userType = passRes[0][0].User_type; // 假设有一个usertype字段标明用户类型
        // 创建JWT令牌
        const token = jwt.sign({
            username: username,
            userType: userType
        }, secretKey, { expiresIn: '1h' });
        // if (typeof window !== "undefined" && window.localStorage) {
        //     // 安全地在这里使用 localStorage
        //     localStorage.setItem('token', 'yourToken');
        // }
        let response = { code: 200, data: { token: token, userType: userType }};
        console.log('response', response);
        switch(userType) {
            case 0: // 管理员
                response.data.message = "管理员登陆成功";
                response.data.menu = [ 
                        { path: '/home', name: 'home', label: '首页', icon: 's-home', url: 'Home/index' },
                        { path: '/mall', name: 'mall', label: '账户管理', icon: 's-order', url: 'Mall/index' },
                        { path: '/user', name: 'user', label: '信息管理', icon: 's-check', url: 'User/index' },
                        { label: '其他', icon: 's-opportunity', children: 
                          [
                            { path: '/page1', name: 'page1', label: '页面1', icon: 'setting', url: 'Others/PageOne' },
                            { path: '/page2', name: 'page2', label: '页面2', icon: 'setting', url: 'Others/PageTwo' }
                          ]
                        }
                ];
            break;
            case 1: // 经理
                response.data.message = "经理登陆成功";
                response.data.menu = [ 
                    { path: '/home', name: 'home', label: '首页', icon: 's-home', url: 'Home/index' },
                    { path: '/mall', name: 'mall', label: '账户管理', icon: 's-order', url: 'Mall/index' },
                    { path: '/user', name: 'user', label: '信息管理', icon: 's-check', url: 'User/index' },
                    { label: '其他', icon: 's-opportunity', children: 
                      [
                        { path: '/page1', name: 'page1', label: '页面1', icon: 'setting', url: 'Others/PageOne' },
                        { path: '/page2', name: 'page2', label: '页面2', icon: 'setting', url: 'Others/PageTwo' }
                      ]
                    }
                ];
            break;
            case 2: // 员工
                response.data.message = "员工登陆成功";
                response.data.menu = [ 
                    { path: '/home', name: 'home', label: '首页', icon: 's-home', url: 'Home/index' },
                    { path: '/mall', name: 'mall', label: '账户管理', icon: 's-order', url: 'Mall/index' },
                    { label: '其他', icon: 's-opportunity', children: 
                      [
                        { path: '/page1', name: 'page1', label: '页面1', icon: 'setting', url: 'Others/PageOne' },
                        { path: '/page2', name: 'page2', label: '页面2', icon: 'setting', url: 'Others/PageTwo' }
                      ]
                    }
                ]; 
            break;
        }
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

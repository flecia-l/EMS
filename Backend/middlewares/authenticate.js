const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // 确保根据实际的文件路径修改
const secretKey = process.env.JWT_SECRET; // 用于JWT令牌验证的密钥，应与生成令牌时的密钥相同

// 身份验证中间件
const authenticate = async (req, res, next) => {
    const tokesecretn = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: "未提供认证令牌" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;

        // 进一步检查用户是否有权更新密码
        // 例如，您可能需要从数据库查询用户的类型和用户名，然后与令牌中的信息比较
        // 这里的示例代码只是一个基本的框架
        const { userType, username } = req.user; // 假设这些信息包含在JWT的payload中
        if (userType === 'admin') {
            // 管理员拥有更新任何用户密码的权限
            next();
        } else {
            // 非管理员只能更新自己的密码
            const { username: requestedUsername } = req.body; // 从请求体中获取请求更新密码的用户名
            if (username === requestedUsername) {
                next();
            } else {
                return res.status(403).json({ message: "您无权更新其他用户的密码" });
            }
        }
    } catch (error) {
        return res.status(401).json({ message: "无效的令牌", error: error.message });
    }
};

module.exports = authenticate;

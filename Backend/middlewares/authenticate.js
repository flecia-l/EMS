const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // 用于JWT令牌验证的密钥，应与生成令牌时的密钥相同

// 身份验证中间件
const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('authHeader', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "未提供认证令牌" });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // 假设decoded对象已经包含了username和userType
        console.log('decoded', decoded);
        next();
    } catch (error) {
        return res.status(401).json({ message: "无效的令牌", error: error.message });
    }
};


module.exports = authenticate;

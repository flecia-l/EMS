// const mysql = require('mysql2/promise');
// const pool = mysql.createPool({
//   host     : '127.0.0.1',
//   user     : 'flecia',
//   password : 'Ss.123456',
//   database : 'employee_system',
//   connectTimeout: 20000,
// });

// // 使用连接池获取连接
// pool.getConnection((err, connection) => {
//   if (err) throw err; // 如果连接有错误，抛出错误
//   console.log('数据库连接成功！');
//   connection.release(); // 释放连接回池子
// });

// module.exports = pool;

const mysql = require('mysql2/promise');
const configManager = require('./ConfigManager');
const dbConfig = configManager.getConfig('database');

class Database {
    constructor() {
        this.pool = mysql.createPool(dbConfig);
    }

    async getConnection() {
        try {
            const connection = await this.pool.getConnection();
            console.log('数据库连接成功！');
            connection.release();
        } catch (err) {
            throw err;
        }
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const databaseInstance = Database.getInstance();
module.exports = databaseInstance;

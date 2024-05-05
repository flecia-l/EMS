// // 引入必要的模块
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../Backend/.env') });
const request = require('supertest');
const app = require('../Backend/server');
// const adminToken = Bearer ${process.env.ADMIN_TOKEN};
// console.log(adminToken);

// 在所有测试之前，使用管理员凭证登录并获取管理员令牌
beforeAll(async () => {
    const response = await request(app)
    .post('/api/login')
    .send({
    username: 'admin',
    password: 'admin'
    });
    adminToken = `Bearer ${response.body.data.token}`;
    console.log(adminToken);
});

// 开始对员工API进行测试
describe('Employee API Tests', () => {
// 测试获取所有员工信息的接口
    it('GET /employees - should return all employees for admin', async () => {
    const response = await request(app)
    .get('/api/employees')
    .set('Authorization', adminToken);
    console.log('Response status:', response.status);
    console.log('Response body:', response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
    });
    // 测试使用无效令牌获取员工信息的接口
    it('GET /employees - should return unauthorized with invalid token', async () => {
        const invalidToken = 'Bearer invalidToken';
        const response = await request(app)
            .get('/api/employees')
            .set('Authorization', invalidToken);  // 使用无效的令牌
        expect(response.status).toBe(401);  // 401表示未授权
        expect(response.body).toHaveProperty('error');
    });

    // 测试添加新员工的接口
    it('POST /employees - should add a new employee', async () => {
        const newEmployee = {
            id: '10',
            name: 'John Doe',
            gender: 'Male',
            age: 30,
            dept: 'IT'
        };
        const response = await request(app)
            .post('/api/employees')
            .send(newEmployee)
            .set('Authorization', adminToken);  // 设置为有效的令牌
        console.log('Request body:', newEmployee);
        console.log('Request headers:', response.request._header);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('员工添加成功');
    });

    // 测试更新员工信息的接口
    it('PUT /employees/:id - should update an existing employee', async () => {
        const updateData = {
            name: 'Jane Doe',
            gender: 'Female',
            age: 31,
            dept: 'HR'
        };
        const response = await request(app)
            .put('/api/employees/10')
            .send(updateData)
            .set('Authorization', adminToken);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('员工信息更新成功');
    });

    // 测试删除员工的接口
    it('DELETE /employees/:id - should delete an employee', async () => {
        const response = await request(app)
            .delete('/api/employees/10')
            .set('Authorization', adminToken);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('员工删除成功');
    });
});

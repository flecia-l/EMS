# 针对get请求的测试
❯ curl http://localhost:3000/api/employees
# 针对post请求的测试
❯ curl -X POST -H "Content-Type: application/json" -d '{"id":"2333", "name":"Jelly", "gender":"female", "age":"23", "dept":"IT"}' http://localhost:3000/api/employees


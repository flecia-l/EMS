import mysql.connector
from mysql.connector import errorcode

# 填写您的数据库连接信息
db_config = {
    'host': 'localhost',  # 或者是您的MySQL服务器的IP地址
    'user': 'berhandgao',  # 您的MySQL用户名
    'password': 'gaozigeng',  # 您的MySQL密码
    'database': 'employee_system'
}

# 尝试连接到数据库并执行命令
try:
    # 连接到MySQL数据库
    cnx = mysql.connector.connect(**db_config)
    cursor = cnx.cursor()

    # 插入经理账号数据
    manager_data = ('manager', 'Manager Name', 'Other', 40, 'Management')
    manager_login_data = ('manager', 'manager')
    cursor.execute("INSERT INTO manager (Id, Name, Gender, Age, Dept) VALUES (%s, %s, %s, %s, %s)", manager_data)
    cursor.execute("INSERT INTO manager_login (User_name, Password, User_type) VALUES (%s, %s, 1)", manager_login_data)

    # 插入员工账号数据
    employee_data = ('employee', 'Employee Name', 'Other', 30, 'Engineering')
    employee_login_data = ('employee', 'employee')
    cursor.execute("INSERT INTO employee (Id, Name, Gender, Age, Dept) VALUES (%s, %s, %s, %s, %s)", employee_data)
    cursor.execute("INSERT INTO employee_login (User_name, Password, User_type) VALUES (%s, %s, 2)", employee_login_data)

    # 提交更改
    cnx.commit()
    print("示例账号已成功添加到数据库。")

except mysql.connector.Error as err:
    print("发生错误:", err)
    # 如果发生错误，回滚所有更改
    cnx.rollback()
finally:
    if cnx.is_connected():
        # 关闭游标和连接
        cursor.close()
        cnx.close()
        print("MySQL连接已关闭。")
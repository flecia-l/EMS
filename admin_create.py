import mysql.connector
from mysql.connector import errorcode

# 填写数据库连接信息
db_config = {
    'host': 'localhost',
    'user': 'berhandgao',
    'password': 'gaozigeng',
    'database': 'employee_system'
}

# 管理员数据
admin_data = ('admin', 'admin')

try:
    # 连接到MySQL数据库
    cnx = mysql.connector.connect(**db_config)
    cursor = cnx.cursor()

    # 插入管理员数据
    cursor.execute("INSERT INTO admin (User_name, Password) VALUES (%s, %s)", admin_data)

    # 提交更改
    cnx.commit()
    print("管理员数据已成功添加到数据库。")

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

import mysql.connector
from mysql.connector import errorcode

# 数据库连接信息（未指定数据库）
db_config_without_db = {
    'host': 'localhost',
    'user': 'berhandgao',
    'password': 'gaozigeng',
}

# 创建数据库的SQL命令
create_database_command = "CREATE DATABASE IF NOT EXISTS employee_system"

# 创建表的SQL命令
create_table_commands = {
    'admin': """
        CREATE TABLE IF NOT EXISTS admin (
            User_name CHAR(30) PRIMARY KEY,
            Password CHAR(30),
            User_type INT DEFAULT 0
        )
    """,
    'employee': """
        CREATE TABLE IF NOT EXISTS employee (
            Id CHAR(30) PRIMARY KEY,
            Name CHAR(40),
            Gender CHAR(10),
            Age INT,
            Dept CHAR(40)
        )
    """,
    'manager': """
        CREATE TABLE IF NOT EXISTS manager (
            Id CHAR(30) PRIMARY KEY,
            Name CHAR(40),
            Gender CHAR(10),
            Age INT,
            Dept CHAR(40)
        )
    """,
    'employee_login': """
        CREATE TABLE IF NOT EXISTS employee_login (
            User_name CHAR(30),
            Password CHAR(30),
            User_type INT DEFAULT 2,
            PRIMARY KEY (User_name),
            FOREIGN KEY (User_name) REFERENCES employee (Id)
        )
    """,
    'manager_login': """
        CREATE TABLE IF NOT EXISTS manager_login (
            User_name CHAR(30),
            Password CHAR(30),
            User_type INT DEFAULT 1,
            PRIMARY KEY (User_name),
            FOREIGN KEY (User_name) REFERENCES manager (Id)
        )
    """
}

try:
    # 连接到MySQL服务器（不指定特定数据库）
    cnx = mysql.connector.connect(**db_config_without_db)
    cursor = cnx.cursor()

    # 创建数据库
    cursor.execute(create_database_command)
    print("数据库 employee_system 创建成功或已存在。")

    # 关闭初始连接
    cursor.close()
    cnx.close()

    # 更新数据库配置，包括数据库名
    db_config_with_db = db_config_without_db.copy()
    db_config_with_db['database'] = 'employee_system'

    # 重新连接到新创建的数据库
    cnx = mysql.connector.connect(**db_config_with_db)
    cursor = cnx.cursor()

    # 循环执行创建表的SQL命令
    for table_name, command in create_table_commands.items():
        cursor.execute(command)
        print(f"表 {table_name} 创建成功或已存在。")
    
    # 提交更改
    cnx.commit()

except mysql.connector.Error as err:
    print("发生错误:", err)
finally:
    if cnx.is_connected():
        cursor.close()
        cnx.close()
        print("MySQL连接已关闭。")

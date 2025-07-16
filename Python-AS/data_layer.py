import configparser
import mysql.connector

consts = configparser.RawConfigParser()
consts.read("constants.ini")

def make_connection():
    """
    Establishes and returns a connection to the MySQL database.
    """
    my_db = mysql.connector.connect(
    host = consts['MYSQL']['mysql_host'],
    user = consts['MYSQL']['mysql_user'],
    password = consts['MYSQL']['mysql_pwd'],
    database = consts['MYSQL']['database']
    )
    return my_db

def create_database():
    """
    Creates a new MySQL database using the provided connection credentials.
    """
    my_database = mysql.connector.connect(
        host = consts['MYSQL']['mysql_host'],
        user = consts['MYSQL']['mysql_user'],
        password = consts['MYSQL']['mysql_pwd']
    )

    cursor = my_database.cursor()
    cursor.execute(consts['QUERIES']['create_AS_db'])
    cursor.close()
    my_database.close()

def create_tables():
    """
    Creates all tables required in the DB
    """
    db = make_connection()
    cursor = db.cursor()
    cursor.execute(consts['QUERIES']['create_AM_table'])
    cursor.execute(consts['QUERIES']['create_T_table'])
    cursor.close()
    db.close() 

def retrieve_record(tableName, params):
    """
    Retrieves a record from the specified table.
    """
    db = make_connection()
    cursor = db.cursor()
    if tableName == consts['MYSQL']['AM_table']:
        cursor.execute(consts['QUERIES']['retrieve_from_AM'], params)
        result = cursor.fetchone()
    else:
        cursor.execute(consts['QUERIES']['retrieve_from_T'], params)
        result = cursor.fetchall()
        # print("Execution done fetch..... Issue most likely in fetchmany")
    cursor.close()
    db.close()
    return result

def create_record(tableName, params):
    """
    Inserts a new user record into specified table.
    """
    db = make_connection()
    cursor = db.cursor()
    if tableName == consts['MYSQL']['AM_table']:
        cursor.execute(consts['QUERIES']['insert_into_AM'], params)
    else:
        cursor.execute(consts['QUERIES']['insert_into_T'], params)
    db.commit()
    cursor.close()
    db.close()

def update_record(tableName, params):
    """
    Updates an existing record from the specified table
    """
    db = make_connection()
    cursor = db.cursor()
    if tableName == consts['MYSQL']['AM_table']:
        cursor.execute(consts['QUERIES']['update_AM'], params)
    else:
        cursor.execute(consts['QUERIES']['update_T'], params)
    db.commit()
    cursor.close()
    db.close()

def delete_record(tableName, params):
    """
    Deletes a record from the specified table.
    """
    db = make_connection()
    cursor = db.cursor()
    if tableName == consts['MYSQL']['AM_table']:
        cursor.execute(consts['QUERIES']['delete_from_AM'], params)
    else:
        cursor.execute(consts['QUERIES']['delete_from_T'], params)
    db.commit()
    cursor.close()
    db.close()

def get_accountsList():
    """
    Gets a list of all accounts from the accounts table
    """
    db = make_connection()
    cursor = db.cursor()
    cursor.execute(consts['QUERIES']['get_accounts'])
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return result

def get_transactionList(params):
    db = make_connection()
    cursor = db.cursor()
    cursor.execute(consts['QUERIES']['get_transList'], params)
    result = cursor.fetchone()[0]
    cursor.close()
    db.close()
    return result

create_tables()
<?php
    include 'db_auth.php';

    function db_install(){
        global $db_database;

        try {
            if(!db_exist()){
                $con = db_mysql_connect();

                $sql = 'CREATE DATABASE '.$db_database.' CHARACTER SET utf8 COLLATE utf8_bin';
                if (!mysql_query($sql, $con)) {
                    return 'Ошибка при создании базы данных: ' . mysql_error() . "\n";
                }

                mysql_close($con);
            }

            if(!db_table_exist('users')){
                $con = db_connect();
                // Create table
                $sql_create="CREATE TABLE users(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, login CHAR(30), password CHAR(30), email CHAR(30), name CHAR(50), enabled TINYINT(1) DEFAULT 0, created TIMESTAMP DEFAULT NOW())";
                $sql_create.="DEFAULT CHARSET=utf8 AUTO_INCREMENT=1";

                // Execute query
                if(!$con->query($sql_create)) {
                    return "Error creating table: " . mysqli_error($con);
                }
                $con->close();
            }

            if(db_table_empty('users')){
                $con = db_connect();

                $sql_insert="INSERT INTO users (id,login,password,email,enabled) VALUES ";
                $sql_insert.="  (1,'admin','nimda','despotix@gmail.com',1)";
                $sql_insert.=", (2, 'ybandura','ybandura1','y.bandura@gmail.com',1)";
                $sql_insert.=", (3, 'burbeza','djdfcbr','realhouse97@gmail.com',1)";
                if(!$con->query($sql_insert)) {
                    return "Error creating users: " . mysqli_error($con);
                }
                $con->close();
            }

            if(!db_table_exist('items')){
                $con = db_connect();
                // Create table
                $sql_create="CREATE TABLE items(";
                $sql_create.="id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,";
                $sql_create.="logo VARCHAR(200),"; // "img/index-cat.jpg"
                $sql_create.="name VARCHAR(100) NOT NULL,"; // Diamond-Pro Katalina
                $sql_create.="breed VARCHAR(100) NOT NULL,"; // Британская к/ш, BRI
                $sql_create.="color VARCHAR(100) NOT NULL,"; // Чёрный затушёванный пойнт
                $sql_create.="color_code VARCHAR(100),"; // ns 12 34
                $sql_create.="birth DATE NOT NULL,"; // 13.07.2009
                $sql_create.="father INT,"; // id отца
                $sql_create.="mother INT,"; // id матери
                $sql_create.="litter VARCHAR(100),"; // помет
                $sql_create.="sex VARCHAR(10) NOT NULL,"; // Female/Male
                $sql_create.="type VARCHAR(50) NOT NULL,"; // cat/hat
                $sql_create.="category VARCHAR(50) NOT NULL,"; // акции,котята,коты,кошки
                $sql_create.="state VARCHAR(100),"; // Цена 500грн/Продано
                $sql_create.="user INT NOT NULL,"; // id пользователя к-й добавил запись
                $sql_create.="confirmed TINYINT(1) DEFAULT 0,"; // отображать ли запись
                $sql_create.="created TIMESTAMP DEFAULT NOW())"; // дата создания записи
                $sql_create.="DEFAULT CHARSET=utf8 AUTO_INCREMENT=1";

                // Execute query
                if(!$con->query($sql_create)) {
                    return "Error creating table: " . mysqli_error($con);
                }
                $con->close();
            }


            if(db_table_empty('items')){
                $con = db_connect();

                $sql_insert="INSERT INTO items ";
                $sql_insert.="  (id, logo            ,            name, breed           ,                         color, color_code,        birth, father, mother,       litter,      sex, type,    category,     user, confirmed) VALUES ";
                $sql_insert.="  ( 1, 'img/father1.jpg', 'Father Cat#1', 'Британская к/ш',   'Черный затушеванный пойнт', 'ny 10 11', '13.07.2009',   null,   null,         null,   'male', 'cat',     'коты',        1,         1)";
                $sql_insert.=", ( 2, 'img/mother1.jpg', 'Mother Cat#1', 'Британская к/ш',   'Черный затушеванный пойнт', 'ny 10 12', '13.07.2009',   null,   null,         null, 'female', 'cat',    'кошки',        1,         1)";
                $sql_insert.=", ( 3, 'img/child1.jpg',   'Child Cat#1', 'Британская к/ш',   'Черный затушеванный пойнт', 'ny 10 13', '13.07.2013',      1,      2,   'litter#1', 'female', 'cat',   'котята',        1,         1)";
                $sql_insert.=", ( 4, 'img/child2.jpg',   'Child Cat#2', 'Британская к/ш',   'Черный затушеванный пойнт', 'ny 10 14', '13.07.2013',      1,      2,   'litter#1', 'female', 'cat',   'котята',        1,         1)";

                $sql_insert.=", ( 5, 'img/father2.jpg', 'Father Cat#2', 'Шотландский к/ш', 'Cеребристая шиншилла пойнт', 'ny 10 21', '13.07.2010',   null,   null,         null,   'male', 'cat',     'коты',        1,         1)";
                $sql_insert.=", ( 6, 'img/mother2.jpg', 'Mother Cat#2', 'Шотландский к/ш', 'Cеребристая шиншилла пойнт', 'ny 10 22', '13.07.2010',   null,   null,         null, 'female', 'cat',    'кошки',        1,         1)";
                $sql_insert.=", ( 7, 'img/child1.jpg',   'Child Cat#3', 'Шотландский к/ш', 'Cеребристая шиншилла пойнт', 'ny 10 23', '13.07.2012',      5,      6,   'litter#2',   'male', 'cat',   'котята',        1,         1)";
                $sql_insert.=", ( 8, 'img/child2.jpg',   'Child Cat#4', 'Шотландский к/ш', 'Cеребристая шиншилла пойнт', 'ny 10 24', '13.07.2012',      5,      6,   'litter#2', 'female', 'cat',   'котята',        1,         1)";
                if(!$con->query($sql_insert)) {
                    return "Error creating items: " . mysqli_error($con);
                }
                $con->close();
            }
        } catch(Exception $e) {
            return "Error: ".$e->getMessage();
        }

        return 'Installed ok!';
    }
?>
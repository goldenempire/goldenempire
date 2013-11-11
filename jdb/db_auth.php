<?php
/*
    $db_host = 'mysql.hostinger.com.ua';
    $db_user = 'u861993091_dsp';
    $db_pwd = 'u861993091_pwd';
    $db_database = 'u861993091_cats';
    $db_upload_dir = '/home/u861993091/public_html/img/';
*/
    $db_host = 'localhost:3307';
    $db_user = 'root';
    $db_pwd = 'usbw';
    $db_database = 'cats';
    //$db_upload_dir = 'D:\\work\\usb_server\\root\\goldenempire\\img\\';
    $db_upload_dir = 'D:\\USBWebserver v8.6\\root\\goldenempire\\img\\';

    function db_mysql_connect(){
        global $db_host,$db_user,$db_pwd,$db_database;

        $link = mysql_connect($db_host,$db_user,$db_pwd);
        mysql_query("set names 'utf8'");
        if (!$link) {
            return false;
            //die('Not connected : ' . mysql_error());
        }
        return $link;
    }

    function db_exist(){
        global $db_host,$db_user,$db_pwd,$db_database;

        $link = mysql_connect($db_host,$db_user,$db_pwd);
        if (!$link) {
            return false;
            //die('Not connected : ' . mysql_error());
        }

        // make foo the current db
        $db_selected = mysql_select_db($db_database, $link);
        if (!$db_selected) {
            //die ('Cannot use database: ' . mysql_error());
            return false;
        }

        return true;
    }

    function db_connect(){
        global $db_host,$db_user,$db_pwd,$db_database;

        $con=mysqli_connect($db_host,$db_user,$db_pwd,$db_database);
        // very TODO TODO TODO TODO TODO
        $con->query("set names 'utf8'");
        // Check connection
        if (mysqli_connect_errno()) {
            return false;
            //throw new Exception("Failed to connect to MySQL: " . mysqli_connect_error());
        }
        return $con;
    }

    function db_table_exist($table_name){
        $con = db_connect();

        if($rows=$con->query("SHOW TABLES LIKE '".$table_name."'")){
            if(0==$rows->num_rows){
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    function db_table_empty($table_name){
        $con = db_connect();

        if($rows=$con->query("select * from ".$table_name)){
            if(0==$rows->num_rows){
                return true;
            } else {
                return false;
            }
        }
        return true;
    }
?>
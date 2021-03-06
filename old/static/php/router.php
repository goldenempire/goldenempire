﻿<?php

include './../jdb/db.php';

function JSON_parse($s){
    $r=json_decode($s,TRUE);
    if(JSON_ERROR_NONE==json_last_error()){
        return $r;
    }

    throw new Exception('Не удалось распарсить JSON: '.json_last_error());
}

function JSON_stringify($j){
    $r=json_encode($j);
    if(JSON_ERROR_NONE==json_last_error()){
        return $r;
    }

    throw new Exception('Не удалось преобразовать строку в JSON: '.json_last_error());
}

//var_dump($_POST);
//echo JSON_stringify($_POST);

try {
    if('get_one'==$_POST['action']){
        echo JSON_stringify( db_get_one($_POST['item_id']) );
    } else if('get_list'==$_POST['action']) {
        echo JSON_stringify( db_get_list($_POST['category']) );
    } else if('get_list'==$_POST['action']) {
        echo JSON_stringify( db_get_category($_POST['list_name']) );
    } else if('update'==$_POST['action']) {
        echo JSON_stringify( update($_POST) );
    } else if('login'==$_POST['action']) {
        echo JSON_stringify( login($_POST['user_name'], $_POST['user_pass']) );
    } else if('logout'==$_POST['action']) {
        echo JSON_stringify( logout() );
    } else if('set_logo'==$_POST['action']) {
        echo JSON_stringify( db_set_logo($_POST['id'], $_POST['file_name']) );
    } else if('insert'==$_POST['action']) {
        $next_id = db_get_max_id();
        echo JSON_stringify( db_insert(
            $next_id,
            $_POST['logo'],
            $_POST['name'],
            $_POST['breed'],
            $_POST['color'],
            $_POST['color_code'],
            $_POST['birth'],
            $_POST['father'],
            $_POST['mother'],
            $_POST['litter'],
            $_POST['sex'],
            $_POST['type'],
            $_POST['category'],
            1,
            1,
            $_POST['state']
        ) );
        //echo var_dump($_POST);
    } else {
        throw new Exception("Не известная операция".$_POST['action']);
    }
} catch(Exception $e) {
    //json_encode(array('error'=>$e));
    json_encode(array('error'=>$e->getMessage()));
}

?>

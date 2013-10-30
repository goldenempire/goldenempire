<?php

include 'db_auth.php';

session_start();

if(!isset($_SESSION['id'])){
    $_SESSION['id'] = 0;
}

function db_get_one($item_id){
    $con = db_connect();
    $sql = 'select * from items where id='.$item_id;
    $result = $con->query($sql);
    $r = $result->fetch_assoc();

    if($r['father']){
        $r['father'] = $con->query('select * from items where id='.$r['father'])->fetch_assoc();
    }

    if($r['mother']){
        $r['mother'] = $con->query('select * from items where id='.$r['mother'])->fetch_assoc();
    }

    $con->close();
    return $r;
}

function db_get_list($item_category){
    $con = db_connect();
    $sql = "select * from items where category='".$item_category."'";
    $result = $con->query($sql);
    $r = array();
    while ($row = $result->fetch_assoc()) {
        $r[] = $row;
    }

    $con->close();
    return $r;
}

function db_get_owner(){
    if(!is_logged()){
        throw new Exception('Эта операция требует авторизации');
    }

    $con = db_connect();
    $sql = "select * from items where owner='".$_SESSION['id']."'";
    $result = $con->query($sql);
    $r = $result->fetch_assoc();
    $con->close();
    return $r;
}

function db_insert(
    $logo, $name, $breed, $color,
    $color_code, $birth, $father, $mother,
    $litter, $sex, $type, $category, $user,
    $confirmed, $state
) {
    if(!is_logged()){
        throw new Exception('Эта операция требует авторизации');
    }

    $con = db_connect();

    $sql_insert="INSERT INTO items ";
    $sql_insert.=" (logo , name, breed , color, color_code, birth, father, mother, litter, sex, type, category, user, confirmed, state) VALUES ";
    //sample ('img/father1.jpg', 'Father Cat#1', 'Британская к/ш', 'Черный затушеванный пойнт', 'ny 10 11', '13.07.2009', null, null, null, 'male', 'cat', 'коты', 1, 1)";
    $sql_insert.="  ( $logo, $name, $breed, $color, $color_code, $birth, $father, $mother, $litter, $sex, $type, $category, $user, $confirmed, $state)";

    $result = $con->query($sql_insert);

    $con->close();
    return $result;
}

function login($user_name, $user_pass){
    if(is_logged()){
        return $_SESSION['name'];
    }

    $con = db_connect();
    $sql = "select * from users where name='$user_name' and password='$user_pass'";
    $result = $con->query($sql);
    $user_data = $result->fetch_assoc()[0];
    $con->close();

    if(1==$user_data['enabled']){
        $_SESSION['id'] = $user_data['id'];
        $_SESSION['name'] = $user_data['name'];
    }

    return $user_data['name'];
}

function logout(){
    if(is_logged()){
        $_SESSION['id'] = 0;
        $_SESSION['name'] = '';
        return true;
    }
    return false;
}

function is_logged(){
    $r = false;
    if(!isset($_SESSION['id'])){
        $r = false;
    } else {
        if($_SESSION['id'] != 0){
            $r = true;
        }
    }

    return $r;
}

?>
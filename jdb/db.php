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
        $r1 = $con->query('select * from items where id='.$r['father'].' and confirmed=1');
        $r['father'] = $r1->fetch_assoc();
    }

    if($r['mother']){
        $r2 = $con->query('select * from items where id='.$r['mother'].' and confirmed=1');
        $r['mother'] = $r2->fetch_assoc();
    }

    $con->close();
    return $r;
}

function db_get_list($item_category){
    $con = db_connect();
    $sql = "select * from items where category='".$item_category."'".' and confirmed=1';
    $result = $con->query($sql);
    $r = array();
    while ($row = $result->fetch_assoc()) {
        $r1 = $row;

        if($r1['father']){
            $r2 = $con->query('select * from items where id='.$r1['father'].' and confirmed=1');
            $r1['father'] = $r2->fetch_assoc();
        }

        if($r1['mother']){
            $r3 = $con->query('select * from items where id='.$r1['mother'].' and confirmed=1');
            $r1['mother'] = $r3->fetch_assoc();
        }

        $r[] = $r1;
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

function db_get_max_id(){
    if(!is_logged()){
        throw new Exception('Эта операция требует авторизации');
    }

    $con = db_connect();

    $rs = $con->query('select max(id) from items');
    $id = 1+$rs->fetch_row()[0];

    $con->close();

    return $id;
}

function db_set_logo($id, $logo){
    if(!is_logged()){
        throw new Exception('Эта операция требует авторизации');
    }

    $con = db_connect();

    $sql="update items set logo='".$logo."' where id=".$id;

    $con->query($sql);

    $con->close();
    return $id;
}

function db_insert(
    $id, $logo, $name, $breed, $color,
    $color_code, $birth, $father, $mother,
    $litter, $sex, $type, $category, $user,
    $confirmed, $state
) {
    //return 'test123456';
    if(!is_logged()){
        throw new Exception('Эта операция требует авторизации');
    }

    $con = db_connect();

    $sql_insert="INSERT INTO items ";
    $sql_insert.=" (id, logo, name, breed , color, color_code, birth, father, mother, litter, sex, type, category, user, confirmed, state) VALUES ";
    ////sample ('img/father1.jpg', 'Father Cat#1', 'Британская к/ш', 'Черный затушеванный пойнт', 'ny 10 11', '13.07.2009', null, null, null, 'male', 'cat', 'коты', 1, 1)";
    $sql_insert.="  ($id, '$logo', '$name', '$breed', '$color', '$color_code', '$birth', $father, $mother, '$litter', '$sex', '$type', '$category', $user, $confirmed, '$state')";

    //return $sql_insert;

    $result = $con->query($sql_insert);

    $con->close();
    return $id;
}

function login($user_name, $user_pass){
    if(is_logged()){
        return $_SESSION['name'];
    }

    $con = db_connect();
    $sql = "select * from users where login='$user_name' and password='$user_pass'";
    $result = $con->query($sql);

    if(null==$result->num_rows){
        //return $result;
        return array('error'=>'Зарегистрируйтесь');
        //throw new Exception('Пользователь не найден');
    }
    $user_data = $result->fetch_assoc();

    if(1==$user_data['enabled']){
        $_SESSION['id'] = $user_data['id'];
        $_SESSION['name'] = $user_data['name'];
    }

    $con->close();

    return $user_data['name'];
    //return $result;
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
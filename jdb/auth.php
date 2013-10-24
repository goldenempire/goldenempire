<?php

session_start();

if(!isset($_SESSION['logged'])){
    $_SESSION['logged'] = 0;
}

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

function update($post){


    if(1!=$_SESSION['logged']){
        return JSON_stringify('Авторизируйтесь');
    }

    $r = false;
    try {
        $s = JSON_stringify($post['data']);
        if(false == $s){
            return false;
        }

        $dump_s = file_get_contents("jdb/cats.json");
        $fp = fopen('jdb/cats_dump.json', 'w');
        fwrite($fp, $dump_s);
        fclose($fp);

        $fp = fopen('jdb/cats.json', 'w');
        fwrite($fp, $s);
        fclose($fp);
        $r = true;
    } catch(Exception $e) {

    }

    return JSON_stringify($r);
}

function login($user_name, $user_pass){

    $users = array(
        array(
            'user_name' => 'admin',
            'user_pass' => 'nimda',
            'full_name' => 'Администратор'
        ),
        array(
            'user_name' => 'burbeza',
            'user_pass' => 'djdfcbr',
            'full_name' => 'Бурбеза Татьяна'
        ),
        array(
            'user_name' => 'ybandura',
            'user_pass' => 'ybandura1',
            'full_name' => 'Бандура Ярослав'
        )
    );

    $response = array ();

    foreach ($users as $key => $value){
        if($value['user_name']===$user_name){
            if($value['user_pass']===$user_pass){
                $_SESSION['logged']=1;
                $response['result'] = $value['full_name'];
                break;
            } else {
                $response['error'] = 'Не верный пароль дляпользователя '.$user_name;
                break;
            }
        }
    }

    if(!isset($response['result'])){
        if(!isset($response['error'])){
            $response['error'] = 'Пользователь '.$user_name.' не найден';
        }
    }

    return JSON_stringify($response);
}

function logout(){
    $_SESSION['logged']=0;

    return JSON_stringify(array('result'=>'default'));
}

?>
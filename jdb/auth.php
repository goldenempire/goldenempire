<?php

include 'db_auth.php';

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

function dir_list($dir)
{
    $dir = '/home/u861993091/public_html/'.$dir;
    if ($dir[strlen($dir)-1] != '/') $dir .= '/';
    if ($handle = opendir($dir)) {
       $dir_array = array();
        while (false !== ($object = readdir($handle))) {
        //while (false !== ($file = readdir($handle))) {
            /*if($file!="." && $file!=".."){
                $dir_array[] = $file;
            }*/
            if (!in_array($object, array('.','..')))
            {
                $filename    = $dir . $object;
                $file_object = array(
                                        'name' => $object,
                                        'size' => filesize($filename)//,
                                        //'perm' => permission($filename),
                                        //'type' => filetype($filename),
                                        //'time' => date("d F Y H:i:s", filemtime($filename))
                                    );
                $dir_array[] = $file_object;
            }
        }
        //echo $dir_array[rand(0,count($dir_array)-1)];
        closedir($handle);
    }

    return JSON_stringify(array('result'=>$dir_array));

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
                $_SESSION['user_name']=user_name;
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
    $_SESSION['user_name']='';

    return JSON_stringify(array('result'=>'default'));
}

function check_logged(){
    if(1!=$_SESSION['logged']){
        throw new Exception("Авторизируйтесь");
    }
}



function getAll(){
    $r = array();
    try {
        check_logged();

        $con=mysqli_connect("mysql.hostinger.com.ua","u861993091_dsp","u861993091_pwd","u861993091_cats");
        // Check connection
        if (mysqli_connect_errno())
        {
            throw new Exception("Failed to connect to MySQL: " . mysqli_connect_error());
        }

        //$result = mysqli_query($con,"SELECT * FROM cats where user='"+$_SESSION['user_name']+"'");//todo check for error
        //$r['result'] = $result->fetch_array(MYSQLI_ASSOC);

        //if(count($r['result'])==0){
            //$result = mysqli_query($con,"SELECT * FROM cats where user='test'");//todo check for error
            $result = mysqli_query($con,"SELECT * FROM cats");//todo check for error
            $r['result'] = $result->fetch_array(MYSQLI_ASSOC);
        //}

        mysqli_close($con);
    } catch(Exception $e) {
        $r['error'] = $e;
    }

    return JSON_stringify($r);
}

function getTest(){
    $r = array();
    try {
        $con=mysqli_connect("mysql.hostinger.com.ua","u861993091_dsp","u861993091_pwd","u861993091_cats");
        // Check connection
        if (mysqli_connect_errno())
        {
            throw new Exception("Failed to connect to MySQL: " . mysqli_connect_error());
        }

        $result = mysqli_query($con,"SELECT * FROM cats");//todo check for error
        $r['result'] = $result->fetch_array(MYSQLI_ASSOC);

        mysqli_close($con);
    } catch(Exception $e) {
        $r['error'] = $e;
    }

    return JSON_stringify($r);
}

?>
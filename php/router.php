<?php

include 'jdb/auth.php';

function test(){

    $r = false;
    try {
        $arr = array (
            array (
                "foo" => "bar",
                42    => 24,
                "multi" => array(
                    "dimensional" => array(
                        "array" => "foo"
                    )
                )
            )
        );

        $s = JSON_stringify($arr);
        if(false == $s){
            return false;
        }

        $fp = fopen('jdb/test.json', 'w');
        fwrite($fp, $s);
        fclose($fp);
    } catch(Exception $e) {

    }

    return $r;
    //return JSON_stringify( auth('admin','admin') );
}

function get(){

    $r = array();
    try {

        $s = file_get_contents("jdb/cats.json");
        $j = JSON_parse($s);
        if(false==$j){
            return false;
        }

        $r['result'] = $j;
    } catch(Exception $e) {
        $r['error'] = $e;
    }

    return JSON_stringify($r);
}

//var_dump($_POST);
//echo JSON_stringify($_POST);
if('get'==$_POST['action']){
    echo get();
    //echo JSON_stringify({ a: 'b' });
} else if('update'==$_POST['action']) {
    echo update($_POST);
} else if('test'==$_POST['action']) {
    echo test();
} else if('login'==$_POST['action']) {
    echo login($_POST['user_name'], $_POST['user_pass']);
} else if('logout'==$_POST['action']) {
    echo logout();
} else {
    echo false;
}

?>

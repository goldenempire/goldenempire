<?php

include './../jdb/db.php';
//include './../jdb/db_auth.php';

function JSON_stringify($j){
    $r=json_encode($j);
    if(JSON_ERROR_NONE==json_last_error()){
        return $r;
    }

    throw new Exception('Не удалось преобразовать строку в JSON: '.json_last_error());
}

if(!is_logged()){
    echo JSON_stringify(array('error'=>'Выгрузка на возможна для не авторизированных пользователей'));
    exit;
}

//echo '111'.JSON_stringify($_POST);
//echo '!!!'.JSON_stringify($_FILES);
//echo var_dump($_FILES);
//echo var_dump($_POST);
//echo 'test!!!123';
//echo $db_upload_dir;
//exit;

//ok cide
   if($_FILES["uploadedfile"]["size"] > 1024*3*1024)
   {
     echo ("Файл слишком большой");
     exit;
   }

   $b = 0;
   if(!is_uploaded_file($_FILES["uploadedfile"]["name"]))
   {
     // �᫨ 䠩� ����㦥� �ᯥ譮, ��६�頥� ���
     // �� �६����� ��४�ਨ � �������

     //define('ROOT_DIR', dirname(__FILE__));
     //$upfile = ROOT_DIR . $db_upload_dir .$_FILES['uploadedfile']['name'];
     //echo $upfile;
     //exit;

     $b = move_uploaded_file($_FILES["uploadedfile"]["tmp_name"], $db_upload_dir.$_FILES['uploadedfile']['name']);
     echo $b;
   } else {
      echo("!is_uploaded_file".JSON_stringify($_FILES["uploadedfile"]));
   }
   //throw new Exception('bla-bla');

/*
   $uploads_dir = '/uploads';
   foreach ($_FILES["uploadedfile"]["error"] as $key => $error) {
       if ($error == UPLOAD_ERR_OK) {
           $tmp_name = $_FILES["uploadedfile"]["tmp_name"][$key];
           $name = $_FILES["uploadedfile"]["name"][$key];
           move_uploaded_file($tmp_name, "$uploads_dir/$name");
       }
   }
*/

/*
   // Каталог, в который мы будем принимать файл:
   $uploaddir = './uploads/';
   $uploadfile = $uploaddir.basename($_FILES['uploadedfile']['name']);

   // Копируем файл из каталога для временного хранения файлов:
   if (copy($_FILES['uploadedfile']['tmp_name'], $uploadfile))
   {
   echo "<h3>Файл успешно загружен на сервер</h3>";
   }
   else { echo "<h3>Ошибка! Не удалось загрузить файл на сервер!</h3>"; exit; }
*/
   // Выводим информацию о загруженном файле:
   //echo "<h3>Информация о загруженном на сервер файле: </h3>";
   //echo "<p><b>Оригинальное имя загруженного файла: ".$_FILES['uploadedfile']['name']."</b></p>";
   //echo "<p><b>Mime-тип загруженного файла: ".$_FILES['uploadedfile']['type']."</b></p>";
   //echo "<p><b>Размер загруженного файла в байтах: ".$_FILES['uploadedfile']['size']."</b></p>";
   //echo "<p><b>Временное имя файла: ".$_FILES['uploadedfile']['tmp_name']."</b></p>";

   //echo move_uploaded_file($_FILES['uploadedfile']['tmp_name'], "/home/uploads/"+$_FILES['uploadedfile']['name']);


?>
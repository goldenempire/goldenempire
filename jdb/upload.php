<?php

function JSON_stringify($j){
    $r=json_encode($j);
    if(JSON_ERROR_NONE==json_last_error()){
        return $r;
    }

    throw new Exception('Не удалось преобразовать строку в JSON: '.json_last_error());
}

   if($_FILES["userfile"]["size"] > 1024*3*1024)
   {
     echo ("������ 䠩�� �ॢ�蠥� �� ��������");
     exit;
   }

   $b = 0;
   // �஢��塞 ����㦥� �� 䠩�
   if(!is_uploaded_file($_FILES["userfile"]["name"]))
   {
     // �᫨ 䠩� ����㦥� �ᯥ譮, ��६�頥� ���
     // �� �६����� ��४�ਨ � �������
     $b = move_uploaded_file($_FILES["userfile"]["tmp_name"], "/home/u861993091/public_html/uploads/".$_FILES["userfile"]["name"]);
     echo $b;
   } else {
      echo("!is_uploaded_file".JSON_stringify($_FILES["userfile"]));
   }
   //throw new Exception('bla-bla');

/*
   $uploads_dir = '/uploads';
   foreach ($_FILES["userfile"]["error"] as $key => $error) {
       if ($error == UPLOAD_ERR_OK) {
           $tmp_name = $_FILES["userfile"]["tmp_name"][$key];
           $name = $_FILES["userfile"]["name"][$key];
           move_uploaded_file($tmp_name, "$uploads_dir/$name");
       }
   }
*/

/*
   // Каталог, в который мы будем принимать файл:
   $uploaddir = './uploads/';
   $uploadfile = $uploaddir.basename($_FILES['userfile']['name']);

   // Копируем файл из каталога для временного хранения файлов:
   if (copy($_FILES['userfile']['tmp_name'], $uploadfile))
   {
   echo "<h3>Файл успешно загружен на сервер</h3>";
   }
   else { echo "<h3>Ошибка! Не удалось загрузить файл на сервер!</h3>"; exit; }
*/
   // Выводим информацию о загруженном файле:
   //echo "<h3>Информация о загруженном на сервер файле: </h3>";
   //echo "<p><b>Оригинальное имя загруженного файла: ".$_FILES['userfile']['name']."</b></p>";
   //echo "<p><b>Mime-тип загруженного файла: ".$_FILES['userfile']['type']."</b></p>";
   //echo "<p><b>Размер загруженного файла в байтах: ".$_FILES['userfile']['size']."</b></p>";
   //echo "<p><b>Временное имя файла: ".$_FILES['userfile']['tmp_name']."</b></p>";

   //echo move_uploaded_file($_FILES['userfile']['tmp_name'], "/home/uploads/"+$_FILES['userfile']['name']);


?>
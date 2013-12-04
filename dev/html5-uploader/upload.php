<?php
// Создаем подключение к серверу
$db = mysql_connect ("servername","user","password"); 
// Выбираем БД
mysql_select_db ("dbname",$db);

// Все загруженные файлы помещаются в эту папку
$uploaddir = 'images/';

// Вытаскиваем необходимые данные
$file = $_POST['value'];
$name = $_POST['name'];

// Получаем расширение файла
$getMime = explode('.', $name);
$mime = end($getMime);

// Выделим данные
$data = explode(',', $file);

// Декодируем данные, закодированные алгоритмом MIME base64
$encodedData = str_replace(' ','+',$data[1]);
$decodedData = base64_decode($encodedData);

// Вы можете использовать данное имя файла, или создать произвольное имя.
// Мы будем создавать произвольное имя!
$randomName = substr_replace(sha1(microtime(true)), '', 12).'.'.$mime;

// Создаем изображение на сервере
if(file_put_contents($uploaddir.$randomName, $decodedData)) {
	// Записываем данные изображения в БД
	mysql_query ("INSERT INTO images (date,catalog,filename) VALUES (NOW(),'$uploaddir','$randomName')");
	echo $randomName.":загружен успешно";
}
else {
	// Показать сообщение об ошибке, если что-то пойдет не так.
	echo "Что-то пошло не так. Убедитесь, что файл не поврежден!";
}
?>
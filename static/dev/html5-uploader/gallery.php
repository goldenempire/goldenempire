<?
// Создаем подключение к серверу
$db = mysql_connect ("servername","user","password"); 
// Выбираем БД
mysql_select_db ("dbname",$db);
// Запрос на выборку всех данных
$result = mysql_query ("SELECT * FROM images",$db);
if(!$result) { echo "Произошла ошибка подключения к серверу и БД, проверьте параметры полключения"; }
?>
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Галерея</title>
<link rel="stylesheet" type="text/css" href="style.css" />
<link rel="stylesheet" type="text/css" href="header.css">
</head>
<body>
<header>
	<p>Загрузка изображения на сервер <a href="http://xozblog.ru/2012/10/html5-uploader/" class="stuts">Перейти к статье на<span>XoZblog.ru</span></a></p>
</header>
<div class="main">
<center><a href="index.html" class="nav">Вернуться к загрузчику</a></center>
<?
// Если количество записей больше нуля
if (mysql_num_rows($result) > 0)
{
	// Записываем полученные данные в массив
	$myrow = mysql_fetch_array ($result);
	// В цикле выводи изображения на страницу
	do {
  		echo "<img src='".$myrow['catalog'].$myrow['filename']."' />";
	} 
	while ($myrow = mysql_fetch_array($result));
}
else
{
	// Собщение о пустой таблице
	echo "<p>Информация по запросу не может быть извлечена, в таблице нет записей.</p>";
	exit();
}
?>
</div>
</body>
</html>
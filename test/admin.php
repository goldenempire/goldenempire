<?php
if ($_POST) {
    echo '<pre>';
    echo htmlspecialchars(print_r($_POST, true));
    echo '</pre>';

    $dbhost = 'http://mysql.hostinger.com.ua';
    $dbuser = 'u861993091_dsp';
    $dbpass = 'u861993091_pwd';
    $conn = mysql_connect($dbhost, $dbuser, $dbpass);
    if(! $conn )
    {
        die('Could not connect: ' . mysql_error());
        //echo mysql_error();
    }
    echo 'Connected successfully<br />';
    $sql = "CREATE TABLE tutorials_tbl( ".
        "tutorial_id INT NOT NULL AUTO_INCREMENT, ".
        "tutorial_title VARCHAR(100) NOT NULL, ".
        "tutorial_author VARCHAR(40) NOT NULL, ".
        "submission_date DATE, ".
        "PRIMARY KEY ( tutorial_id )); ";
    mysql_select_db( 'TUTORIALS' );
    $retval = mysql_query( $sql, $conn );
    if(! $retval )
    {
        die('Could not create table: ' . mysql_error());
    }
    echo "Table created successfully\n";
    mysql_close($conn);
}
/*
   $literalObjectDeclared = (object) array(
     'foo' => (object) array(
          'bar' => 'baz',
          'pax' => 'vax'
      ),
      'moo' => 'ui'
   );
   print $literalObjectDeclared->foo->bar; // outputs "baz"!
*/


?>
<form action="" method="post">
    Имя:  <input type="text" name="personal[name]" /><br />
    Email: <input type="text" name="personal[email]" /><br />
    Пиво: <br />
    <select multiple name="beer[]">
        <option value="warthog">Warthog</option>
        <option value="guinness">Guinness</option>
        <option value="stuttgarter">Stuttgarter Schwabenbrau</option>
    </select><br />
    <input type="submit" value="Отправь меня!" />
</form>


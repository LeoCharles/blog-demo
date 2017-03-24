<?php
	require 'config.php';

	$_pass = sha1($_POST['pass']);

	$query = mysql_query("SELECT user FROM blog_user WHERE user = '{$_POST['user']}' AND pass='{$_pass}'") or die('SQL错误！');

	if(mysql_fetch_array($query,MYSQL_ASSOC)) {
		echo 0; //用户名和密码正确
	} else {
		echo 1; //用户名或密码不正确
	}

	mysql_close();

?>
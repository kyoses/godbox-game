<?php
require_once("func_common.php");

if (!isset($_COOKIE['UserId']) or $_COOKIE['UserId']==""){
	setcookie("UserId","",time()-$cookie_times,"/");
	setcookie("UserName","",time()-$cookie_times,"/");
	setcookie("NickName","",time()-$cookie_times,"/");
	setcookie("CityName","",time()-$cookie_times,"/");
	setcookie("CityId","",time()-$cookie_times,"/");
	$_COOKIE["UserId"]="";
	$_COOKIE["UserName"]="";
	$_COOKIE["NickName"]="";
	$_COOKIE["CityName"]="";
	$_COOKIE["CityId"]="";
	error_document("用户登录","您还没有登录，或登录已失效","/","","../error_document.php");
}
?>
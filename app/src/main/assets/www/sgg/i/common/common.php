<?php
/*
 * author:marco
 * date:2013-08-07
 * 修改新手接口推图进度 严防用户在新手战斗中刷新页面
 */
include_once dirname(__FILE__) . '/../../config.php';
$userObj = new User();
if($battleCount == 1){
	$dataArray = array("battle_id"=>'1');
}else if($battleCount == 2){
	$dataArray = array("battle_id"=>'2');
}else{
	$dataArray = array("battle_id"=>'3');
}
$userObj->updateDirector($uid,$dataArray);
$data['st']=1;
echo json_encode($data);?>
<?php
//刷新用户数据 by veryszhang
include_once dirname(__FILE__) . '/../../config.php';
$userObj = new User();
Mc::singleton();
$mc->delete('c_user' . $uid);
$data['user'] = $userObj->selectUser($uid);
if($data['user']){
	$data['user']['vipLevel'] = $userObj->getUserVipLevel((int)$data['user']['yb_total']);
}
echo json_encode($data);
exit();
?>
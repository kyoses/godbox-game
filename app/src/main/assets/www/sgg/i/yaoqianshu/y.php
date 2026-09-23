<?php
 
include_once dirname(__FILE__) . '/../../config.php';
$userObj = new User();
$user = $userObj->selectUser($uid);
$userVip = $userObj->getUserVipLevel($user['yb_total']);
 
$max_limit = array(0=>8,1=>15,2=>17,3=>20,4=>25,5=>30,6=>50,7=>100,8=>200,9=>500,10=>1000);
$data['user']['yb_sys'] = $user['yb_sys'];
$data['user']['yb'] = $user['yb'];
$data['user']['gold'] = $user['gold'];
$data['user']['vipLevel'] = $userVip;
 
$userYQS = $userObj->getUserYaoqianshu($uid);
$db = new DB();
if(!$userYQS){ 
	$userYQS = array('user_id' =>$uid,'used_num'=>0,'last_time'=>$TODAY);
	$db->insert("c_yaoqianshu", $userYQS);
}
 
if($userYQS['last_time']!=$TODAY){
	$db = new DB();  
	$userYQS['last_time'] = $TODAY;
	$userYQS['used_num'] = 0;
	$db->update("c_yaoqianshu", array('used_num'=>0,'last_time'=>$TODAY),"user_id=$uid");
}
$data['re'] = 1;
 
$common = new Common();
$data['yq']['needYB'] = $common->getSpentByNum($userYQS['used_num']+1);
 
$data['yq']['getGold'] = $common->getGoldByLevel($userYQS['used_num']+1);

 $data['yq']['num'] = (int)$userYQS['used_num'];   
$data['yq']['c_num'] = $max_limit[$userVip]-$userYQS['used_num'];  

$data['yq']['NVip'] = $userVip+1;
$data['yq']['NVipNum'] = $max_limit[$userVip+1];
if($userVip>=4){
	$data['openLots'] = 1;
}
echo json_encode($data);
exit();
?>
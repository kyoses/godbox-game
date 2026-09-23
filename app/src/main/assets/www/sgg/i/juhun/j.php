<?php

include_once dirname(__FILE__).'/../../config.php';
$soul = new Soul();
$user = new User();
$userInfo = $user->selectUser($uid);
if($type == 1){ 
	if($userInfo['gold']>=5000){
		$user->addGold($userInfo, -5000);
		//Logger::writeGoldConsumeLog($userInfo['id'], $userInfo['account_id'], $userInfo['account_type'], -5000, "i/juhun/j.php");
		$result = $soul->gatherGreenSoul();
		$data['re'] = 1;
	}else{
		$data['re'] = 0;
	}
	
}else if($type == 2){ 
	if($userInfo['gold']>=30000){
		$user->addGold($userInfo, -30000);
		//Logger::writeGoldConsumeLog($userInfo['id'], $userInfo['account_id'], $userInfo['account_type'], -30000, "i/juhun/j.php");
		$result = $soul->gatherBlueSoul();
		$data['re'] = 1;
	}else{
		$data['re'] = 0;
	}
}else if($type == 3){ 
	if($userInfo['yb']>=100){
		$user->addYB($userInfo, -100);
		$result = $soul->gatherPurpleSoul();
               // Logger::writeConsumeLog($uid, $userInfo['account_id'], 0, -100, "juhun/j.php");
		$data['re'] = 1;
	}else{
		$data['re'] = 0;
	}
}
if($data['re']){
	$data['user'] = $userInfo;
	$data['left_soul'] = $result;
	$soul->updateUserSoul($uid,array('left_soul'=>json_encode($result)));
}
echo json_encode($data);
?>

<?php
/*
 * date:20130415
 
 * describe:补充体力&&购买体力
 */
include_once dirname(__FILE__) . '/../../config.php';
$userObj = new User();
$user = $userObj->selectUser($uid);
$vip = $userObj->getUserVipLevel($user['yb_total']);
$userInfoVip=$userObj->selectUserInfoRelatedVip($uid);
$strength=$userInfoVip['strength'];
$strenArray=  explode(',', $strength);
$common = new Common();
$tili= (int)$strenArray[0];   //当前体力
$tili_max = $common->getMaxTiLi($vip);  //vip上限
$num = (int)$strenArray[2];   //添加过的次数
$num_max = $common->getAddTiliMaxNum($vip);  //可添加次数上�?


//如果不是当天则清�?

if($TODAY!=(int)$strenArray[3]){
	$strenArray[3] = $TODAY;
	$num = 0;
	$strenArray[2] = 0;
}

if($tili>=$tili_max){
	$data['re'] = '3'; //体力已达最�?
	
	echo json_encode($data);
	exit;
}

if($num>=$num_max){
	$data['re'] = '4'; //今日次数已达上限
	echo json_encode($data);
	exit;
}
//本次消耗元�?

$data['needYB'] = $common->getNeedYbWithNum($strenArray[2]+1);
if($num!=0){
	if($user['yb']<$data['needYB']){
		$data['re'] = 5;
		echo json_encode($data);
		exit;
	}
}
if($upadte){
	//不能超过上限
	if($strenArray[0]+50>$tili_max){
		$strenArray[0] = $tili_max;
	}else{
		$strenArray[0] = $strenArray[0]+50;
	}
	$strenArray[2] = $strenArray[2]+1;  //增加充值一日数�?
	
	$data['nowTL'] = $strenArray[0].'/'.$tili_max;  //当前体力值得
	$data['nl'] = $strenArray[0];
	$data['stl'] = $tili_max;
	$gold = $common->getNeedYbWithNum($strenArray[2]);
	$dataArray=array('strength'=>(implode(",", $strenArray)));
	$userInfo = $userObj->selectUser($uid);
	$userObj->updateUserInfoRelatedVip($uid, $dataArray);
	$userObj->addYB($userInfo, -$gold);
       // Logger::writeConsumeLog($uid, $userInfo['account_id'], 0, -$gold, "tili/b.php");
	$data['info']=$userObj->selectUser($uid);
	$data['re'] = '1'; //增加体力成功
	echo json_encode($data);
	exit();
}

$data['user'] = $user;
$data['user']['nowTL'] = $strenArray[0];
$data['user']['maxTL'] = $tili_max;
$data['x'] = $num+1;
$data['re'] = '1';
//$data['rihuo'] = $userObj->addActiveDaily($uid, 10);
$data['nowNum'] =(int)$strenArray[2];

//$data['needDQ'] = $data['needYB']/2;
//$data['needDQA'] = $data['needYBA']/2;
echo json_encode($data);
exit();
<?php

 
include_once dirname(__FILE__) . '/../../config.php';
//uid,isBatch
$userObj = new User();
$db = new DB(); //使用数据�?
$user = $userObj->selectUser($uid);
$userVip = $userObj->getUserVipLevel($user['yb_total']);
$max_limit = array(0=>8,1=>15,2=>17,3=>20,4=>25,5=>30,6=>50,7=>100,8=>200,9=>500,10=>1000);
$userYQS = $userObj->getUserYaoqianshu($uid);
$common = new Common();
 
if($userYQS['last_time']==$TODAY){
	if($userYQS['used_num']>=$max_limit[$userVip]){   
		if($user['vipLevel'] >=10){  
			$data['re'] = 10;
		}else{ 
			$data['re'] = 0;
		}
		echo json_encode($data);
		exit();
	}
}else{   
	$userYQS['used_num'] = 0;
	$userYQS = array('user_id' =>$uid,'used_num'=>0,'last_time'=>$TODAY);
	$db->update("c_yaoqianshu", $userYQS,"user_id=$uid");
}
$data['yq']['num'] = 0;   
if ($isBatch) {
    $totalGold = 0;  
    for ($i = 0; $i < 10; $i++) {  
    	$left_num = $max_limit[$userVip]-$userYQS['used_num'];
		if($left_num>0){
			$userYQS['used_num']++;
			$YB = $common->getSpentByNum($userYQS['used_num']);
			if($user['yb']>=$YB){
				$totalGold += $common->getGoldByLevel($userYQS['used_num']);
				$data['yq']['y_num']++;   
				$data['rihuo'] = $userObj->addActiveDaily($uid, 10);
				$userObj->addYB($user, -$YB);
                                //Logger::writeConsumeLog($uid, $user['account_id'], 0, -$YB, "yaoqianshu/y1.php");
			}else{
				$data['re'] = 2;
				$userYQS['used_num']--;
				break;  
			}
		}else{
			break;   
		}	
    }		
	if($totalGold){   
		$userYQS = array('user_id' =>$uid,'used_num'=>$userYQS['used_num']);
		$db->update("c_yaoqianshu", $userYQS,"user_id=$uid");
		//Logger::writeGoldConsumeLog($user['id'], $user['account_id'], $user['account_type'], $totalGold, "i/yaoqianshu/y1.php");
		$userObj->addGold($user, $totalGold);
		$data['re'] = 1;
		$data['yq']['getGold'] = $totalGold;
	}
} else {   
    $num = $userYQS['used_num'] + 1;
    
    $YB = $common->getSpentByNum($num);   
    $totalGold = $common->getGoldByLevel($num);   
	    if($user['yb']>=$YB){
	    	$data['re'] = 1;
		    $data['yq']['y_num'] = 1;  
		    $data['yq']['getGold'] = $totalGold;
			$userYQS['used_num']++;		
			$userObj->addGold($user, $totalGold);
			//Logger::writeGoldConsumeLog($user['id'], $user['account_id'], $user['account_type'], $totalGold, "i/yaoqianshu/y1.php");
			$db->update("c_yaoqianshu", array('used_num' =>$num),"user_id=$uid");
			$data['rihuo'] = $userObj->addActiveDaily($uid, 10);
			$userObj->addYB($user, -$YB);
                        //Logger::writeConsumeLog($uid, $user['account_id'], 0, -$YB, "yaoqianshu/y1.php");
		}else{
			$data['re'] = 2;   
		}
}
$data['user']['yb_sys'] = $user['yb_sys'];
$data['user']['yb'] = $user['yb'];
$data['user']['gold'] = $user['gold'];
$data['yq']['num'] = $userYQS['used_num'];
$data['yq']['c_num'] = $max_limit[$userVip]-$userYQS['used_num'];  
$data['yq']['needYB'] = $common->getSpentByNum($userYQS['used_num']+1);
$data['yq']['NVip'] = $userVip+1;
echo json_encode($data);
exit();
?>
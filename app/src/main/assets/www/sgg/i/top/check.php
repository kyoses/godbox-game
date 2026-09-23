<?php

include_once dirname(__FILE__) . '/../../config.php';

$userObj = new User();
$data = $userObj->checkUser($type,$id);

if($data){
	
	$data['st']=1;
		
    $uid = $data['id'];

    $data['vipLevel'] = $userObj->getUserVipLevel($data['yb_total']);
	
    $data['energyMax'] = $userObj->getUserMaxEnergy($data['vip_level']);
    $exp_up = $userObj->getUserUpExp($data['level']);
    $data['expUp'] = $exp_up;
		
    $data['expPer'] = floor($data['exp'] * 1000 / $exp_up) / 10;
   
    $battleObj=new Battle();
	
   $u_battle = $battleObj->selectUserBattle($uid);

    $battleAll=$battleObj->selectBattle();
	 
    $data['cbattle']=$battleAll[$u_battle['battle_id']]['battle_order'];
    $userStren = $userObj->selectUserInfoRelatedVip($uid);
    $strenArray = explode(',', $userStren['strength']);
    $strenMax = Common::getMaxTiLi($data['vipLevel']);
    $data['maxTL'] = $strenMax; 
    $data['nowTL'] = $strenArray[0]; 
 
    if ($TODAY > $strenArray[1]) {
        $dataArray = array('strength' => $strenMax . ',' . time().','.$strenArray[2].','.$strenArray[3]);
        $userObj->updateUserInfoRelatedVip($uid, $dataArray);
        $data['nowTL'] = $strenMax; 
        $data['nt'] = 0;
    } else {
        if ($strenArray[0] >= $strenMax) {
            $data['nt'] = 0; 
        } else {
            $now = time();
            $timeGap = $now - $strenArray[1];
            $addTiLiNum = floor(floor($timeGap / 60) / 30);
            if ($addTiLiNum > 0) {
                $lastTime = $strenArray[1] + $addTiLiNum * 60 * 30;
                $dataArray = array('strength' => ($strenArray[0] + $addTiLiNum) . ',' . $lastTime.','.$strenArray[2].','.$strenArray[3]);
                $userObj->updateUserInfoRelatedVip($uid, $dataArray);
				$data['nowTL'] = ($data['nowTL']>$strenMax)?$strenMax:$data['nowTL'];
                $data['nt'] = 60 * 30 - ($timeGap - $addTiLiNum * 60 * 30);
            } else {
                $data['nt'] = 60 * 30 - $timeGap;
            }
        }
    }
	
 
	//Logger::writeLoginLog($uid, $acc_id,0);
	//include_once dirname(__FILE__) . '/../form/f.php'; 
}else{
	$data['st'] = 2;
}

echo json_encode($data);
exit();
?>

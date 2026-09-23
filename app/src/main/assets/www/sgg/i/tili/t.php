<?php
 
include_once dirname(__FILE__).'/../../config.php';
$userObj = new User();
$user=$userObj->selectUser($uid);
$userVip = $userObj->getUserVipLevel($user['yb_total']);
$userInfoVip=$userObj->selectUserInfoRelatedVip($uid);
$strength=$userInfoVip['strength'];
$strenArray=  explode(',', $strength);
$strenMax= Common::getMaxTiLi($userVip);
$data['maxTL']=$strenMax;
$data['nowTL']=$strenArray[0];
$now=time();
if($strenArray[0]>=$strenMax){ 
    $data['nt']=0; 
}
else{
    $timeGap=$now-$strenArray[1];
    $addTiLiNum=floor(floor($timeGap/60)/30);
    if($addTiLiNum>0){ 
        $lastTime=$strenArray[1]+$addTiLiNum*60*30;
	    $newTili = $strenArray[0]+$addTiLiNum;
		$newTili = ($newTili>$strenMax)?$strenMax:$newTili;
		//Logger::writeTestLog("tili1:".$strenArray[0]."   tili2:".$newTili."   tiliMax:".$strenMax);
        $dataArray=array('strength'=>($newTili).','.$lastTime.','.$strenArray[2].','.$strenArray[3]);
        $userObj->updateUserInfoRelatedVip($uid, $dataArray);
        $data['nowTL']=$newTili;
        
        $data['nt']=60*30-($timeGap-$addTiLiNum*60*30);
    }
    else{ 
        $data['nt']=60*30-$timeGap;
    }
}
//Utils::dump($data);
echo json_encode($data);
exit();
?>

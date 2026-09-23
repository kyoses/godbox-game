<?php

include_once dirname(__FILE__).'/../../config.php';
$userObj=new User();
$key=1;
$area=1;
$pingbiuser=$userObj->searchBypingbiName($name);
$plateUser=$userObj->selectPlatUser($name);
 

if($plateUser){
    $data['st']=2;
}
elseif($pingbiuser){
    $data['st']=3;
}
else{
    $uid=$userObj->createUser($name,$key,$area,$sex,$uimg,$acc_id,$acc_type,$plat_info);
  
    $taskObj=new Task();
    $taskCondition=$taskObj->selectTaskCondition();
    $taskObj->insertTask($uid, 1, $taskCondition);
    
    //user vip
    $strenMax=  Common::getMaxTiLi(0);
	//strength
    $userObj->inserUserInfoRelatedVip($uid, array("user_id"=>$uid,"strength"=>$strenMax.",".time().",,"));
    $data = $userObj->selectUser($uid);
    $data['st']=1;
    $data['vipLevel'] = 0;
	//$userObj->getUserVipLevel($data['yb_total']);
    $data['energyMax'] = $userObj->getUserMaxEnergy(0);
    $exp_up = $userObj->getUserUpExp(0);
    $data['expUp']=$exp_up;
    $data['expPer'] = 0;
	//floor($data['exp']*1000/$exp_up)/10;
    
    $data['maxTL']=$strenMax;
    $data['nowTL']=$strenMax;  
	//$strenMax;
    $data['nt']=60*30;
    
    
   // Logger::writeRegistLog($uid, $acc_id, 0);
	//Logger::writeLoginLog($uid, $acc_id,0);
}
echo json_encode($data);
exit();
?>

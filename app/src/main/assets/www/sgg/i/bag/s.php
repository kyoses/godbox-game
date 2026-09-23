<?php

include_once dirname(__FILE__).'/../../config.php';
$userObj = new User();
$user=$userObj->selectUser($uid);
if($t=='zb'){
    $equipObj=new Equip();
    $equipTargetObj=$equipObj->getEquipObjInfo($sellid);         
    if($equipTargetObj){
        $equipAll=$equipObj->selectEquip();
        $equip=$equipAll[$equipTargetObj["equip_id"]];        
        $equipObj->sellEquip($uid,$sellid);
        //$qianghuaObj=new QiangHua();
        //$allUpLCost=$qianghuaObj->calculateEquipUpLAllCost($equipTargetObj["up_level"], $equip["type"],$equip["class"]);  

        //$price=$equip["price"]+floor($allUpLCost/2);                                 
        $price=$equipTargetObj["up_level"]*100;
        $userObj->addGold($user, $price);
		//Logger::writeGoldConsumeLog($user['id'], $user['account_id'], $user['account_type'], $price , "i/bag/s.php");
        $data['user']["gold"]=$user["gold"];
        $data['user']['getGold']=$price;
    }
}
else if($t=='dj'){
    $propObj=new Prop();
    $propAll=$propObj->selectProp();
    $propTargetObj=$propObj->getPropObjInfo($sellid);                 
    if($propTargetObj){
        $prop=$propAll[$propTargetObj["prop_id"]];
        //echo "uid:".$uid."prop:".$prop."sellnum:".$sellNum;            
        $propObj->deleteProp($uid, $prop, $sellNum);
        $price=$prop["price"]*$sellNum;
        $userObj->addGold($user, $price);
		//Logger::writeGoldConsumeLog($user['id'], $user['account_id'], $user['account_type'], $price , "i/bag/s.php");
        $data['user']["gold"]=$user["gold"];
        $data['user']['getGold']=$price;
    }
}
$data['st']=1;
//print_r($data);
echo json_encode($data);
exit();
?>

<?php
 
include_once dirname(__FILE__).'/../../config.php';
if($equip){
    $equipClass=new Equip();
    $equipObj=$equipClass->getEquipObjInfo($equip);
    $nowUpLevel=$equipObj["up_level"];
    if($equipObj["up_level"]>=100){             
        $data["st"]=0;
        echo json_encode($data);
        exit();
    }

    $qianghua=new Qianghua();
    $qianghuaCost=$qianghua->calculateEquipUpLCostById($equip);
    $user=new User();
    $userInfo=$user->selectUser($uid);
    $userGold=$userInfo["gold"];
    $userLevel=$userInfo["level"];
    if($userGold<$qianghuaCost){       
        $data["st"]=1;
        echo json_encode($data);
        exit();
    }
    if($nowUpLevel+1>$userLevel){  
        $data["st"]=2;
        echo json_encode($data);
        exit();
    }
    
    $user->addGold($userInfo, -$qianghuaCost);
	//Logger::writeGoldConsumeLog($userInfo['id'], $userInfo['account_id'], $userInfo['account_type'], -$qianghuaCost, "i/qianghua/s.php");
    $nowUpLevel=$nowUpLevel+1;
    $qianghua->strenthenEquip($uid,$nowUpLevel, $equip);
    $equipObj['level']=$nowUpLevel;
    $data["st"]=3;                    
    $data["user"]["gold"]=$userInfo["gold"];              
    $data['equip']['level']=$nowUpLevel;
    
    
    $equipAll=$equipClass->selectEquip();
    $eobj = $equipObj; 
    $eq = $equipAll[$eobj['equip_id']]; 
    $data['equip']['name'] = $eq['name'];
   
 
    Common::setAttributeValue($data['equip'], $eq, array('level'=>$eobj['up_level']));
    
 
    $nextUpLevel=$nowUpLevel+1; 
    $data['equip']['nup_level']=$nextUpLevel;
    Common::setAttributeValue($data['equip']['nattr'], $eq, array('level'=>$nextUpLevel));

    $upLevelType=$eq['type'];
    if($upLevelType>=6){                   
        $equipClass=$eq["class"];
        if($equipClass==1)                
            $upLevelType=5;
        else if($equipClass==2)            
            $upLevelType=6;
        else if($equipClass==3)             
            $upLevelType=7;
        else if($equipClass==4)            
            $upLevelType=8;
        else                                
            $upLevelType=5;
    }
    $data["equip"]["uplevelcost"]=$qianghua->calculateEquipUpLCost($nextUpLevel, $upLevelType);  
    
 
    $npcObj=new Npc();
    $npc=$npcObj->getNpcObj($nid);
    $selfData=$npcObj->getNpcSelfData($npc);
    $equipData=$npcObj->getNpcEquipData($npc);
    if ($equipData) {
        foreach ($selfData as $k2 => $v2) {
            if ($equipData[$k2]) {
                $selfData[$k2] += $equipData[$k2];
            }
        }
    }
    $data['npc']['hp'] = $selfData['hp'];//Utils::formulaValue($npc['hp'], array('level'=>$v['level']));
    $data['npc']['str'] = $selfData['strength'];//Utils::formulaValue($npc['strength'], array('level'=>$v['level']));
    $data['npc']['inte'] = $selfData['intelligence'];//Utils::formulaValue($npc['intelligence'], array('level'=>$v['level']));
    //$data['npc']['power'] = $npcObj->getNpcPower($npc,$selfData);
    $task = new Task();
	$task->refreshTaskAfterQianghua($uid); 
}
//Utils::dump($data);
echo json_encode($data);
exit();
?>

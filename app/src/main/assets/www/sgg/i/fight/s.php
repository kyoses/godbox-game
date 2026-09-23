<?php
include_once dirname(__FILE__).'/../../config.php';
$battleObj=new Battle();
$userObj=new User();
$user=$userObj->selectUser($uid);
$strenMax=Common::getMaxTiLi($userObj->getUserVipLevel($user['yb_total']));
$userStren=$userObj->selectUserInfoRelatedVip($uid);
$strenArray=  explode(',', $userStren['strength']);
if(strtolower($num)=="max"){
    $num=$strenArray[0]; }
if($strenArray[0]<$num){
    $data['st']=3;
    echo json_encode($data);
    exit();
}

if($strenArray[0]==$strenMax){
    $strenArray[1]=time();
}
if($user['level']>20){
	$data['user']['nowTL']=$userObj->addUserTili($uid, -$num); 
}else{
	$data['user']['nowTL']=$strenArray[0];
}
$data['user']['maxTL']=$strenMax;

$battleAll=$battleObj->selectBattle();
$u_battle = $battleObj->selectUserBattle($uid);
$u_battleTarget=$battleAll[$u_battle['battle_id']];
$nowBattleTarget=$battleAll[$bid];
if($u_battleTarget['battle_order']<=$nowBattleTarget['battle_order']){
    $data['st']=2;
    echo json_encode($data);
    exit();
}
$status=2;
$battleDrop=$battleObj->randomDropByNum($bid, $status, $num);

//for($i=1;$i<=$num;$i++){
    //$battleDrop=$battleObj->randomDrop($bid, $status);
foreach($battleDrop as $key => $value){
    $data['drop'][$key]=array();
    foreach($value as $k => $v){
        switch ($k){
            case 1:             
			foreach ($v as $k2=>$v2){               	
				$v2['num'] = (int)(pow($v2['level'], 3)/600+$v2['level'])*80;
                    $data['drop'][$key]['exp']+=$v2['num'];
                    $expAllNum+=$v2['num'];
                }
                      
				$newULevel=$userObj->addExp($user, $data['drop'][$key]['exp'],FALSE);
                if($newULevel){
                    $data['drop'][$key]['newUL']=$newULevel;
                }

                    
				if(!$npcObj){
                    $npcObj=new Npc();
                    $userNpc=$npcObj->getUserNpcList($uid);
                }
                if(!$f){
                    $f=$battleObj->formationStringToArray($u_battle['formation']);
                }
                foreach($f as $k3=>$v3){
					foreach($v3 as $k4=>$v4){
                        if($v4>0){
                            $newNLevel=$npcObj->addNpcExp($userNpc, $data['drop'][$key]['exp'], $v4,FALSE);
                        }
                    }
                }
                if($newNLevel){
                    $data['drop'][$key]['newNL']=$newNLevel;
                }
                break;
            case 2:          
			foreach ($v as $k2=>$v2){                 
				$data['drop'][$key]['gold']+=$v2['num'];
                    $goldAllNum+=$v2['num'];
                }
                break;
            case 3:
				foreach ($v as $k2=>$v2){				
					$data['drop'][$key]['yb']+=$v2['num'];
					$ybAllNum+=$v2['num'];
                }
                break;
            case 4:              
			if(!$equipObj){
                    $equipObj=new Equip();
                }
                if(!$equipAll){
                    $equipAll=$equipObj->selectEquip();
                }
                foreach ($v as $k2 => $v2){
                    $data['drop'][$key]['equip'][$v2['value']]['num']+=$v2['num'];
                    if(!$data['drop'][$key]['equip'][$v2['value']]['name']){
                        $data['drop'][$key]['equip'][$v2['value']]['name']=$equipAll[$v2['value']]['name'];
                    }
                    $equipAllNum[$v2['value']]['num']+=$v2['num'];
                }
                break;
            case 5:              
			if(!$propObj){
                    $propObj=new Prop();
                }
                if(!$propAll){
                    $propAll=$propObj->selectProp();
                }
                 foreach ($v as $k2 => $v2){
                    $data['drop'][$key]['prop'][$v2['value']]['num']+=$v2['num'];
                    if(!$data['drop'][$key]['prop'][$v2['value']]['name']){
                        $data['drop'][$key]['prop'][$v2['value']]['name']=$propAll[$v2['value']]['name'];
                    }
                    $propAllNum[$v2['value']]['num']+=$v2['num'];
                }
                break;
        }
    }
}

if($expAllNum){
  
	$userObj->updateUser($uid, array('level'=>$user['level'],'exp'=>$user['exp']));
 
	foreach($f as $k3=>$v3){
           
		foreach($v3 as $k4=>$v4){
            if($v4>0){
                $npcObj->updateNpcObj($uid, $v4, array('exp'=>$userNpc[$v4]['exp'],'level'=>$userNpc[$v4]['level']), $userNpc);
            }
        }
    }

    $exp_up = $userObj->getUserUpExp($user['level']);
    $data['user']['expUp'] = $exp_up;
    $data['user']['exp']=$user['exp'];
    $data['user']['level']=$user['level'];
}


if($goldAllNum){

    $userObj->addGold($user, $goldAllNum);
    $data['user']['gold']=$user['gold'];
   // Logger::writeGoldConsumeLog($uid, $user['account_id'], 0, $goldAllNum, 'fight/s.php');
}

if($ybAllNum){

    $userObj->addYB($user, $ybAllNum);
    //Logger::writeConsumeLog($uid, $user['account_id'], 0, $ybAllNum, "fight/s.php");
    $data['user']['yb']=$user['yb'];
}

if($equipAllNum){
    foreach ($equipAllNum as $key =>$value){
        $equipObj->addUserEquip($uid, array('equip_id'=>$key,'user_id'=>$uid));
    }
}

if($propAllNum){
    foreach($propAllNum as $key => $value){
        $propObj->addProp($uid, $propAll[$key], $value['num']);
    }
}

$task = new Task();

$task->refreshTaskAfterBattle($uid, $bid,$num);

if ($type == 2) {
    $curr_time = time();
    $userBattle = $battleObj->selectUserJYBattle($uid);
    if ($TODAY == strtotime(date('Ymd',$userBattle['last_time']))) {
        $bsArray = json_decode($userBattle['battle_ids'], true);
        $bsArray[$bid]++;
    }
    else {
        $bsArray[$bid] = 1;
    }
    $battleObj->updateUserJBattle($uid, array('last_time'=> $curr_time,'battle_ids'=>  json_encode($bsArray)));
}
$data['st']=1;
echo json_encode($data);
exit();
?>

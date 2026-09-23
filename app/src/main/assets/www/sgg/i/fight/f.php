<?php


include_once dirname(__FILE__) . '/../../config.php';
$userObj = new User();
$user = $userObj->selectUser($uid);
$battleObj = new Battle();
$mapObj = new Map();
$curr_time = time();
if ($tid > 0) {

    $competitiveObj = new Competitive();
    $competitive = $competitiveObj->getUserCompetitiveByUserID($uid);
    if ($competitive) {
        $checkData = $competitiveObj->checkLeftNum($competitive);
        if (!$checkData) {
            $data['st'] = 1; 
            echo json_encode($data);
            exit();
        }
        $checkData = $competitiveObj->checkCGCool($uid);
        if (!$checkData) {
            $data['st'] = 2; 
            echo json_encode($data);
            exit();
        }
    }
    $checkData = $competitiveObj->checkIsInReach($competitive['ranking'], $tid); 
    if ($checkData) {
        $data['cominfo'] = $checkData;
        $data['st'] = 3; 
        echo json_encode($data);
        exit();
    }
} else if ($battle_id > 0) {

    $battleAll = $mapObj->selectBattle();
    $type = $battleAll[$battle_id]['type'];
    if ($type == 1) {
        $userbattleByType = $battleObj->selectUserBattle($uid);
    } else if ($type == 2) {
        $userbattleByType = $battleObj->selectUserJYBattle($uid);
        if ($TODAY == strtotime(date('Ymd',$userbattleByType['last_time']))) {
            $bsArray = json_decode($userbattleByType['battle_ids'],true);
            if ($bsArray[$battle_id]) {
                $data['st'] = 2; 
                echo json_encode($data);
                exit();
            }
        }
    } else {
        $userbattleByType = $battleObj->selectUserFBBattle($uid);
        if($TODAY==$userbattleByType['last_time']){
            $userVipInfo = $userObj->selectUserInfoRelatedVip($uid);
            $strenArray = explode(',', $userVipInfo['strength']);
            $bsArray = json_decode($userbattleByType['battle_ids'],true);
            if ($bsArray[$battle_id]) {
                $needTiLiNum = Common::getFBNeedTiLi($bsArray[$battle_id] + 1);
            } else {
                $needTiLiNum = Common::getFBNeedTiLi(1);
            }
            if ($strenArray[0] < $needTiLiNum) {
                $data['st'] = 1; 
                echo json_encode($data);
                exit();
            }
        }
    }
    
   
    if($userbattleByType['battle_id'] == $battle_id){
        $dialogueObj = new Dialogue();
        $dialogue = $dialogueObj->selectDialogue(); 
        if($dialogue){
            if($dialogue[$battle_id][0] && $dialogue[$battle_id][0]['st'] >0){
                    //$dialogue = $dialogue[$battle_id][0];
                    $dialogueContent = $dialogueObj->selectDialogueContent();
                    $data['dialogueA'] = $dialogueContent[$dialogue[$battle_id][0]['id']];
            }
        }
    }
}
$fightObj = new Fight();
$skillObj = new Skill();
$skill = $skillObj->selectSkill(); 
$skillEffect = $skillObj->selectSkillEffect(); 

//$f_def = '0,2,1|0,2,0|1,0,0';

$u_battle = $battleObj->selectUserBattle($uid);
$f_att = $u_battle['formation'];
// if($f_att == "0,0,0|0,0,0|0,0,0"){
// $data['st']=4;
// echo json_encode($data);exit();
// }
$data_att = $fightObj->init($f_att); 
//Utils::dump($data_att);exit();
if ($tid > 0) {
    $t_battle = $battleObj->selectUserBattle($tid);
    $f_def = $t_battle['formation'];
    $data_def = $fightObj->init($f_def); 
} elseif ($battle_id > 0) {
    //$battleAll = $mapObj->selectBattle();
    $f_def = $battleAll[$battle_id]['formation'];
    $data_def = $fightObj->init($f_def, 1); 
  
    //if($u_battle['battle_id'] != $battle_id){
        $data_helper = $battleObj->getBattleHelper($battle_id);
	 	//var_dump ($data_helper);
        if($data_helper){
             $battleObj->setHelperFormation($data_att, $data_helper);
         }
		
    //}
}
 

  //var_dump ($data_att);
//Utils::dump($data_def);exit();
$data['start'] = $fightObj->getFightStart($data_att, $data_def); 

$data['start']['lname']=$user['name'];
$data['start']['limg']=$user['img'];
if($battle_id){
    $data['start']['rname']=$battleAll[$battle_id]['name'];
    $data['start']['rimg']=$battleAll[$battle_id]['img'];
}
else if($tid){
    $userRight=$userObj->selectUser($tid);
    $data['start']['rname']=$userRight['name'];
    $data['start']['rimg']=$userRight['img'];
}
//Utils::dump($data['start']); exit();   


$turn = $fightObj->fightTurn($data_att, $data_def);
//Utils::dump($turn);exit();
if ($turn) {
for ($r = 0; $r < 100; $r++) {
    $death = 0;
    foreach ($turn as $k => $v) {
        if ($turn[$k]['hp'] > 0) {
            $att = $v['n'];
            $str['att']['pos'] = $turn[$att]['dir'] . $turn[$att]['i'] . $turn[$att]['j']; 
            if ($turn[$att]['buff2'] > 0) {
                $turn[$att]['buff2']--; 
            }
            if ($turn[$att]['buff1'] > 0) {
                $turn[$att]['buff1']--; 
                
                $str['att']['hp'] = 0; 
                //$str['att']['fury'] += 20;
                unset($str['att']['skill']); 
            } else {
                $str['att']['hp'] = 0; 
                $str['att']['nt'] = $turn[$att]['type']; 
                // if($turn[$att]['dir'] == 'left'){
                // $turn[$att]['fury'] = 100;
                // }
                if ($turn[$att]['fury'] >= 100 && $turn[$att]['skill_id'] > 0) {
                    $skill_id = $turn[$att]['skill_id'];
                    //Utils::dump($skill[$skill_id]['name']);
                    //Utils::dump($str);exit();
                    $str['att']['skill'] = array();
					$str['att']['skill']['id'] = $skill[$skill_id]['id']; 
                    $str['att']['skill']['name'] = $skill[$skill_id]['name']; 
                    $turn[$att]['fury']-=100;
                    $str['att']['fury'] = $turn[$att]['fury'];
                  
                    foreach ($skillEffect[$skill_id] as $k2 => $v2) {
                    	$str['att']['effect'][]=$v2['type'];
                        switch ($v2['type']) {
                            case 1:
                                $aim = $fightObj->getSkillAim($skill[$skill_id]['range'], $v2['target'], $att, $turn);
                                if (count($aim) > 0) {
                                    foreach ($aim as $k1 => $v1) {
                                        $def = $v1['n'];
                                        $pos_str = $turn[$def]['t'] . $turn[$def]['i'] . $turn[$def]['j'];
                                        $str['def'][$pos_str]['pos'] = $turn[$def]['dir'] . $pos_str; 
                                        $fightObj->skillAddHP($v2['value'], $turn[$def], $str['def']);
                                        $str['def'][$pos_str]['effect'][] = $v2['type']; 
                                    }
                                }
                                break;
                            case 2:
                                $aim = $fightObj->getSkillAim($skill[$skill_id]['range'], $v2['target'], $att, $turn);
                                if (count($aim) > 0) {
                                    foreach ($aim as $k1 => $v1) {
                                        $def = $v1['n'];
                                        $pos_str = $turn[$def]['t'] . $turn[$def]['i'] . $turn[$def]['j'];
                                        $str['def'][$pos_str]['pos'] = $turn[$def]['dir'] . $pos_str; 
                                        $fightObj->skillMinusHP($turn[$att], $turn[$def], $str['att'], $str['def'], $v2['value']); 
                                        $str['def'][$pos_str]['effect'][] = $v2['type']; 
                                    }
                                }
                                break;
                            case 3:
                                $aim = $fightObj->getSkillAim($skill[$skill_id]['range'], $v2['target'], $att, $turn);
                                if (count($aim) > 0) {
                                    foreach ($aim as $k1 => $v1) {
                                        $def = $v1['n'];
                                        $pos_str = $turn[$def]['t'] . $turn[$def]['i'] . $turn[$def]['j'];
                                        $str['def'][$pos_str]['pos'] = $turn[$def]['dir'] . $pos_str; 
                                        for ($i = 1; $i <= $v2['value']; $i++) {
                                         
                                            if($turn[$def]['hp'] > 0){
                                                $hit = $fightObj->formulaHit($turn[$att]['hit'], $turn[$def]['miss'], $turn[$att]['level'], $turn[$def]['level']);
                                                if ($hit == 1) {
                                                    $fightObj->attNormal($turn[$att], $turn[$def], $str['att'], $str['def'], $pos_str); 
                                                    $str['def'][$pos_str]['lianji'][$i]['hp'] = $str['def'][$pos_str]['hp'];
                                                    if($str['def'][$pos_str]['crit']){
                                                        $str['def'][$pos_str]['lianji'][$i]['crit']=$str['def'][$pos_str]['crit'];
                                                    }
                                                    unset($str['def'][$pos_str]['hp']);
                                                } else {
                                                    $str['def'][$pos_str]['lianji'][$i]['miss'] = 1;
                                                }
                                            }
                                        }
                                        //$str['def'][$pos_str]['effect'][]=$v2['type'];
                                    }
                                }
                                break;
                            case 4:
                                $aim = $fightObj->getSkillAim($skill[$skill_id]['range'], $v2['target'], $att, $turn);
                                if (count($aim) > 0) {
                                    $a_pos = $turn[$att]['t'] . $turn[$att]['i'] . $turn[$att]['j'];
                                    $str['def'][$a_pos]['pos'] = $turn[$att]['dir'] . $a_pos;
                                    $str['def'][$a_pos]['hp'] = -round($turn[$att]['hp'] * 0.1);
                                    foreach ($aim as $k1 => $v1) {
                                        $def = $v1['n'];
                                        $pos_str = $turn[$def]['t'] . $turn[$def]['i'] . $turn[$def]['j'];
                                        $str['def'][$pos_str]['pos'] = $turn[$def]['dir'] . $pos_str; 
                                        $fightObj->skillExchangeHP($turn[$att], $turn[$def], $str['att'], $str['def'][$pos_str], $v2['value']); 
                                        $str['def'][$pos_str]['effect'][] = $v2['type']; 
                                    }
                                }
                                break;
                            case 5://鍑忔€?
                                $aim = $fightObj->getSkillAim($skill[$skill_id]['range'], $v2['target'], $att, $turn);
                                if (count($aim) > 0) {
                                    foreach ($aim as $k1 => $v1) {
                                        $def = $v1['n'];
                                        $pos_str = $turn[$def]['t'] . $turn[$def]['i'] . $turn[$def]['j'];
                                        $str['def'][$pos_str]['pos'] = $turn[$def]['dir'] . $pos_str;
                                        $fightObj->skillMinusFury($turn[$def], $str['def'][$pos_str], $v2['value']); 
                                        $str['def'][$pos_str]['effect'][] = $v2['type']; 
                                    }
                                }
                                break;
                            case 6:
                                $aim = $fightObj->getSkillAim($skill[$skill_id]['range'], $v2['target'], $att, $turn);
                                if (count($aim) > 0) {
                                    foreach ($aim as $k1 => $v1) {
                                        $def = $v1['n'];
                                        $pos_str = $turn[$def]['t'] . $turn[$def]['i'] . $turn[$def]['j'];
                                        $str['def'][$pos_str]['pos'] = $turn[$def]['dir'] . $pos_str; 
                                        $fightObj->skillAddFury($turn[$def], $str['def'][$pos_str], $v2['value']); 
                                        $str['def'][$pos_str]['effect'][] = $v2['type']; 
                                    }
                                }
                                break;
                            case 7:
                                $aim = $fightObj->getSkillAim($skill[$skill_id]['range'], $v2['target'], $att, $turn);
                                //$aim = $fightObj->randomFromFormation($turn, $att, $v2['value']); 
								$fightObj->getSkillAim($skill[$skill_id]['range'], $v2['target'], $att,$turn);
                                if (count($aim) > 0) {
                                    $rand_result = array_rand($aim, $v2['value']>count($aim)?count($aim):$v2['value']); 
                                    if (is_array($rand_result)) {
                                        $aim_rand_keys = $rand_result;
                                    } else {
                                        $aim_rand_keys = array($rand_result);
                                    }
                                    foreach ($aim_rand_keys as $k1 => $v1) {
                                        $def = $aim[$v1]['n'];
                                        $pos_str = $turn[$def]['t'] . $turn[$def]['i'] . $turn[$def]['j'];
                                        $str['def'][$pos_str]['pos'] = $turn[$def]['dir'] . $pos_str;  
                                        $fightObj->skillAddDizzyBuffer($turn[$def], $str['def'][$pos_str]);  
                                        $str['def'][$pos_str]['effect'][] = $v2['type'];  
                                    }
                                }
                                break;
                            case 8: 
                                $aim = $fightObj->getSkillAim($skill[$skill_id]['range'], $v2['target'], $att, $turn);
                                if (count($aim) > 0) {
                                    foreach ($aim as $k1 => $v1) {
                                        $def = $v1['n'];
                                        $pos_str = $turn[$def]['t'] . $turn[$def]['i'] . $turn[$def]['j'];
                                        $str['def'][$pos_str]['pos'] = $turn[$def]['dir'] . $pos_str;  
                                        $fightObj->skillAddReverseBuffer($turn[$def], $str['def'][$pos_str], $v2['value']); 
                                        $str['def'][$pos_str]['effect'][] = $v2['type'];  
                                    }
                                }
                                break;
                        }
                    }
                } else { 
                    $str['att']['skill'] = 0;  
                    $v_d = $fightObj->aim($turn[$att]['j'], $turn[$att]['t'], $turn);  
                    $def = $v_d['n'];
                    if ($v_d > 0) {
                        $pos_str = $turn[$def]['t'] . $turn[$def]['i'] . $turn[$def]['j'];
                        $str['def'][$pos_str]['pos'] = $turn[$def]['dir'] . $pos_str; 
                        $hit = $fightObj->formulaHit($turn[$att]['hit'], $turn[$def]['miss'], $turn[$att]['level'], $turn[$def]['level']);
                        if ($hit == 1) {
                            $fightObj->attNormal($turn[$att], $turn[$def], $str['att'], $str['def'], $pos_str);  
                        } else {
                            $str['def'][$pos_str]['miss'] = 1;
                        }
                        $turn[$att]['fury']+=25;
                        $turn[$def]['fury']+=25;
                        $str['def'][$pos_str]['fury'] = $turn[$def]['fury'];
                        $str['def'][$pos_str]['effect'][] = 0;  
                        $pos = $turn[$att]['t'] . $turn[$att]['i'] . $turn[$att]['j'];
                        $str['att']['fury'] = $turn[$att]['fury'];
                    }
                }
                
                $data['string'][] = $str;
                unset($str);
                if ($turn[$def]['hp'] <= 0) {
                    $death = 1;
                    $check = $fightObj->aim($turn[$att]['j'], $turn[$att]['t'], $turn);  
                    if ($check == -1) {
                        $data['result'] = $turn[$att]['dir'];  
                        break 2;
                    }
                }
            }
        }
    }
    if ($death) { 
        foreach ($turn as $k => $v) {
            if ($v['hp'] <= 0) { 
                if ($v['t'] == 0) { 
                    if ($n_att > 0) { 
                        continue;
                    } else {
                        $n_att = $v['n'];  
                        continue;
                    }
                } elseif ($v['t'] == 1) {
                    if ($n_def > 0) {
                        continue;
                    } else {
                        $n_def = $v['n'];
                        continue;
                    }
                }
            } else { 
                if ($v['t'] == 0) { 
                    if ($n_att > 0) { 
                        $n_temp = $n_att;  
                        $n_att = $v['n'];  
                        $turn[$n_temp] = $v;  			
                        $turn[$n_temp]['n'] = $n_temp;
                        unset($turn[$n_att]);
                    }
                } elseif ($v['t'] == 1) {
                    if ($n_def > 0) {
                        $n_temp = $n_def;
                        $n_def = $v['n'];
                        $turn[$n_temp] = $v;
                        $turn[$n_temp]['n'] = $n_temp;
                        unset($turn[$n_def]);
                    }
                }
            }
        }
    }
}
}
if(!$data['result']){ 
   $data['result']='right';
}

if ($battle_id > 0 && $data['result'] == 'left') {
	 
	$level15=($user['level']>=21)?1:0;
    
    if($userbattleByType['battle_id'] == $battle_id){ 
        if($dialogue){
            if($dialogue[$battle_id][1] && $dialogue[$battle_id][1]['st'] >0){
                    $dialogue = $dialogue[$battle_id][1];
                    $dialogueContent = $dialogueObj->selectDialogueContent();
                    $data['dialogueB'] = $dialogueContent[$dialogue['id']];
            }
        }
    }
  
    if($type==1){ 
    	if($level15){
    		$data['user']['nowTL']=$userObj->addUserTili($uid, -1);
    	}  
    }
    else if($type==2){ 
    	if($level15){
        	$data['user']['nowTL']=$userObj->addUserTili($uid, -1);
		}
        if($TODAY==strtotime(date('Ymd',$userbattleByType['last_time']))){ 
            $bsArray[$battle_id]++; 
        }
        else{ 
            $bsArray=array($battle_id=>1);
        }
        $battleObj->updateUserJBattle($uid, array('last_time'=> $curr_time,'battle_ids'=>  json_encode($bsArray)));
    }
    else if($type==3){ 
        if($TODAY==$userbattleByType['last_time']){ 
            $bsArray[$battle_id]++; 
        }
        else{
            $bsArray=array($battle_id=>1);
        }
        $battleObj->updateUserFBattle($uid, array('last_time'=>$curr_time,'battle_ids'=>  json_encode($bsArray)));
        
        if($level15){
        	$data['user']['nowTL']=$userObj->addUserTili($uid, -$needTiLiNum); 
		}
    }
    $strenMax = Common::getMaxTiLi($userObj->getUserVipLevel($user['yb_total']));
    $data['user']['maxTL']=$strenMax;
    
 
    if ($userbattleByType['battle_id'] == $battle_id) { 
        $battle_order = $battleAll[$battle_id]['battle_order'] + 1;
        $nextBattle = $battleObj->selectNextBattle($battleAll[$battle_id]['type'], $battle_order);  
        if ($nextBattle) {
            $array_battle['battle_id'] = $nextBattle['id'];
            if ($type == 1) { 
                $battleObj->updateUserBattle($uid, $array_battle);
            } else if ($type == 2) { 
                $battleObj->updateUserJBattle($uid, $array_battle);
            } else if ($type == 3) { 
                $battleObj->updateUserFBattle($uid, $array_battle);
            }
        }
        $data['next']['nborder'] = $battle_order;
        $data['next']['type'] = $type;
        if ($battleAll[$battle_id]['map_id'] != $battleAll[$nextBattle['id']]['map_id']) { 
        	 
        	$data['map_award'] = $userObj->getMapAward($user, $battleAll[$battle_id]['map_id']);
			
            $data['next']['nmap'] = $battleAll[$nextBattle['id']]['map_id'];
            $oldMap = $mapObj->selectMapById($battleAll[$battle_id]['map_id']);
            $newMap = $mapObj->selectMapById($battleAll[$nextBattle['id']]['map_id']);
            if ($oldMap['page'] != $newMap['page']) {
                $data['next']['npage'] = $newMap['page'];
            }
             
            if ($type == 2) {
                 
                if ($oldMap['early_uid'] == 0) {
                    $tmp_arr = array('early_uid' => $uid);
                    $mapObj->updateMap($battleAll[$battle_id]['map_id'], $tmp_arr);
                }
            }
        }
    }
    
    if ($battle_id >= $userbattleByType["battle_id"]) {
        $status = 1;  
    } else {
        $status = 2;  
    }
    if ($type == 2) {
        if ($battleAll[$battle_id]['first_user'] == 0) {
            $battleAll[$battle_id]['first_user'] = $uid;
            $battleObj->updateFirstUser($battle_id, $uid, $battleAll);
        }
    }
    $battleDrop = $battleObj->randomDrop($battle_id, $status);
    if ($battleDrop) {
        foreach ($battleDrop as $key => $value) {
            switch ($key) {
                case 1: 
                    //$userObj=new User();
                    //$user=$userObj->selectUser($uid);
                    foreach ($value as $k => $v) { 
                    	$v['num'] = (int)(pow($v['level'], 3)/600+$v['level'])*80;
                        $expNum+=$v['num'];
                    }
                    $newULevel = $userObj->addExp($user, $expNum);
                   
                    if (!$npcObj) {
                        $npcObj = new Npc();
                    }
                    $userNpc = $npcObj->getUserNpcList($uid);
                    $f = $battleObj->formationStringToArray($u_battle['formation']);
                    foreach ($f as $k => $v) {
                      
                        foreach ($v as $k2 => $v2) {
                            if ($v2 > 0) {
                                $newNLevel = $npcObj->addNpcExp($userNpc, $expNum, $v2);
                            }
                        }
                    }
                    $data['drop']['exp']['v'] = $expNum;
                    if ($newULevel) {
                        $data['drop']['exp']['newUL'] = $newULevel;
                    }
                    if ($newNLevel) {
                        $data['drop']['exp']['newNL'] = $newNLevel;
                    }
                    break;
                case 2: 
                    //$userObj=new User();
                    /*
                      if(!$user){
                      $user=$userObj->selectUser($uid);
                      } */
                    foreach ($value as $k => $v) { 
                        $goldNum+=$v['num'];
                    }
                    $userObj->addGold($user, $goldNum);
					//Logger::writeGoldConsumeLog($user['id'], $user['account_id'], $user['account_type'], $goldNum, "i/fight/f.php");
                    $data['drop']['gold']['v']+=$goldNum;
                    break;
                case 3: 
                    foreach ($value as $k => $v) { 
                        $ybNum+=$v['num'];
                    }
                    $userObj->addYB($user, $ybNum);
                  //  Logger::writeConsumeLog($uid, $user['account_id'], 0, $ybNum, "fight/f.php");
                    $data['drop']['yb']['v']+=$ybNum;
                    break;
                case 4: 
                    if (!$equipObj) {
                        $equipObj = new Equip();
                    }
                    if (!$equipAll) {
                        $equipAll = $equipObj->selectEquip();
                    }
                    foreach ($value as $k => $v) {
                        $equipObj->addUserEquip($uid, array('equip_id' => $v['value'], 'user_id' => $uid));
                        $data['drop']['equip'][] = array('name' => $equipAll[$v['value']]['name'], 'img' => $equipAll[$v['value']]['img'], 'num' => $v['num']);
                    }
                    break;
                case 5: 
                    if (!$propObj) {
                        $propObj = new Prop();
                    }
                    if (!$propAll) {
                        $propAll = $propObj->selectProp();
                    }
                    foreach ($value as $k => $v) {
                        $propObj->addProp($uid, $propAll[$v['value']], $v['num']);
                        $data['drop']['prop'][] = array('name' => $propAll[$v['value']]['name'], 'img' => $propAll[$v['value']]['img_large'], 'num' => $v['num']);
                    }
                    break;
            }
        }
    }
     
    $task = new Task();
    $task->refreshTaskAfterBattle($uid, $battle_id);
    /*
      if(!$user){
      $userObj=new User();
      $user=$userObj->selectUser($uid);
      } */
    $data['user']['gold'] = $user['gold'];
	$data['user']['reputation'] = $user['reputation'];
    $data['user']['level'] = $user['level'];
    $exp_up = $userObj->getUserUpExp($user['level']);
    $data['user']['expUp'] = $exp_up;
    $data['user']['exp'] = $user['exp'];
    //$data['user']['expPer'] = floor($user['exp']*1000/$exp_up)/10;
} else if ($tid > 0) { 
    //$user=$userObj->selectUser($uid);
    if (!$competitive) {
        $competitiveObj->insertCompetitive($uid);  
    }
    if ($data['result'] == 'left') { 
        $data['drop']['branking'] = $competitive['ranking'];  
        $competitiveObj->updateBothCompetitive($uid, $tid, $uid);
        $reward = $competitiveObj->calculateSuccessReward($user['level']);

        $competitive = $competitiveObj->getUserCompetitiveByUserID($uid);
        $data['drop']['ranking'] = $competitive['ranking'];  
        $data['drop']['gold'] = $reward['gold'];
        $data['drop']['reputation'] = $reward['reputation'];
        $data['drop']['name'] = $user['name'];
    } else { 
        $competitiveObj->updateBothCompetitive($uid, $tid, $tid);
        $reward = $competitiveObj->calculateFailedReward($user['level']);
        	    
    }
    $userObj->addGold($user, $reward['gold']);  
   // Logger::writeGoldConsumeLog($user['id'], $user['account_id'], $user['account_type'], $reward['gold'], "i/fight/f.php");
    $userObj->addReputation($user, $reward['reputation']);  
    $data['cominfo'] = $competitiveObj->refreshCompetitiveInfo($uid);
	 
	$data['rihuo'] = $userObj->addActiveDaily($uid, 10);
	$award = $userObj->getUserAwardInfo($uid);
	$com_array = explode(":", $award['competitive_num']);
	$com_day = (int)$com_array[0];
	$com_num = (int)$com_array[1];
	if($com_day!=$TODAY){
		$com_day = $TODAY;
		$com_num = 1;
	}else{
		$com_num+=1;
	}
	$db = new DB();
	$db->update("c_award", array('competitive_num' =>$com_day.":".$com_num),"user_id=$uid");
}
//Utils::dump($data);exit();
echo json_encode($data);
exit();
?>

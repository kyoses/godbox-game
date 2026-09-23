<?php


include_once dirname(__FILE__).'/../../config.php';


$curr_time = time();

$npcObj = new Npc();
$userObj = new User();
$user = $userObj->selectUser($uid);
$user_soul_num = 0;
$user_soul = $npcObj->getUserSoul($uid);
$userNpc = $npcObj->getUserNpcList($uid);

$obj_info = $npcObj->getNpcObj($obj_id);

$npc_info = $npcObj->getTargetNpc($obj_info['npc_id']);
//print_r($npc_info);

$raising_temp = json_decode($npc_info['bring_up'], true);
//echo "raising:".$npc_info['bring_up'];print_r($raising_temp);
if ($raising_temp['soul']['type'] == 1) {
    $user_soul_num = $user_soul['green_soul']?$user_soul['green_soul']:0;
}
elseif ($raising_temp['soul']['type'] == 2) {
    $user_soul_num = $user_soul['blue_soul']?$user_soul['blue_soul']:0;
}
elseif ($raising_temp['soul']['type'] == 3) {
    $user_soul_num = $user_soul['purple_soul']?$user_soul['purple_soul']:0;
}
elseif ($raising_temp['soul']['type'] == 4) {
    $user_soul_num = $user_soul['orange_soul']?$user_soul['orange_soul']:0;
}
else {
    $user_soul_num = $user_soul['orange_soul']?$user_soul['orange_soul']:0;
}
//print_r($raising_temp);

$arr_raising = json_decode($obj_info['bringup_attr'], true);
$raising_lv = ($arr_raising['level'])?$arr_raising['level']:1;
$raising_time = ($arr_raising['time'])?$arr_raising['time']:0;
$raising_num = ($arr_raising['num'])?$arr_raising['num']:1;

if (date('Ymd', $curr_time) != date('Ymd', $raising_time)) $raising_num = 1;
$raising_exp = ($arr_raising['exp'])?$arr_raising['exp']:0;

if ($raisingPage) {

    $arr_npc = $npcObj->selectNpcByCan($npc_info['can']);
    if ($arr_npc) {
        $flag = 0;
        foreach ($arr_npc as $value) {
            if ($flag == 1) {
                $next_general = $value;
                break;
            }
            if ($value['id'] == $obj_info['npc_id']) $flag = 1;
        }
 
        if ($next_general) {
            $skillObj = new Skill();
            $arr_this_gen = array("id" => $npc_info['id'], "name" => $npc_info['name'], "type" => $npc_info['type'], "can" => $npc_info['can'], "star" => $npc_info['star'], "class" => $npc_info['class'], "img" => $npc_info["img_large"],
                                  "hp" => Utils::formulaValue($npc_info['hp'], array('level' => $obj_info['level'])), "strength" => $npc_info['strength'], "intelligence" => $npc_info["intelligence"], 
                                  "phy_att" => Utils::formulaValue($npc_info['phy_att'], array('level' => $obj_info['level'])), "phy_def" => Utils::formulaValue($npc_info['phy_def'], array('level' => $obj_info['level'])), 
                                  "mag_att" => Utils::formulaValue($npc_info['mag_att'], array('level' => $obj_info['level'])),  "mag_def" => Utils::formulaValue($npc_info['mag_def'], array('level' => $obj_info['level'])),
                                  "skill" => $skillObj->getTargetSkill($npc_info['skill_id']));
            $arr_next_gen = array("id" => $next_general['id'], "name" => $next_general['name'], "type" => $next_general['type'], "can" => $next_general['can'], "star" => $next_general['star'], "class" => $next_general['class'],  "img" => $next_general["img_large"],
                                  "hp" => Utils::formulaValue($next_general['hp'], array('level' => $obj_info['level'])), "strength" => $next_general['strength'], "intelligence" => $next_general["intelligence"], 
                                  "phy_att" => Utils::formulaValue($next_general['phy_att'], array('level' => $obj_info['level'])), "phy_def" => Utils::formulaValue($next_general['phy_def'], array('level' => $obj_info['level'])), 
                                  "mag_att" => Utils::formulaValue($next_general['mag_att'], array('level' => $obj_info['level'])), "mag_def" => Utils::formulaValue($next_general['mag_def'], array('level' => $obj_info['level'])),
                                  "skill" => $skillObj->getTargetSkill($next_general['skill_id']));
            
            echo json_encode(array("st" => 1, "level" => $obj_info['level'], "this_gen" => $arr_this_gen, "next_gen" => $arr_next_gen, "soul_type" =>$raising_temp['soul']['type'], "soul_num" => $raising_temp['soul']['num'], "user_soul_num" => $user_soul_num));
        }
        else {
            echo json_encode(array("st" => 9));
            exit();
        }
    }
    else {
        echo json_encode(array("st" => -5));
        exit();
    }
}
elseif ($raisingUp == 1) {
    if ($raising_lv >= 7) {
        if ($raising_exp >= $raising_temp['attr'][7]['exp']) {
            if ($raising_temp['soul']['type'] == 1) {
                if ($user_soul['green_soul'] >= $raising_temp['soul']['num']) {
                    $left_soul = $user_soul['green_soul'] - $raising_temp['soul']['num'];
                    $arr_soul = array("green_soul" => $left_soul);
                }
                else { 
                    echo json_encode(array("st" => -5));
                    exit();
                }
            }
            elseif ($raising_temp['soul']['type'] == 2) {
                if ($user_soul['blue_soul'] >= $raising_temp['soul']['num']) {
                    $left_soul = $user_soul['blue_soul'] - $raising_temp['soul']['num'];
                    $arr_soul = array("blue_soul" => $left_soul);
                }
                else {
                    echo json_encode(array("st" => -5));
                    exit();
                }
            }
            elseif ($raising_temp['soul']['type'] == 3) {
                if ($user_soul['purple_soul'] >= $raising_temp['soul']['num']) {
                    $left_soul = $user_soul['purple_soul'] - $raising_temp['soul']['num'];
                    $arr_soul = array("purple_soul" => $left_soul);
                }
                else { 
                    echo json_encode(array("st" => -5));
                    exit();
                }
            }
            elseif ($raising_temp['soul']['type'] == 4) {
                if ($user_soul['orange_soul'] >= $raising_temp['soul']['num']) {
                    $left_soul = $user_soul['orange_soul'] - $raising_temp['soul']['num'];
                    $arr_soul = array("orange_soul" => $left_soul);
                }
                else { 
                    echo json_encode(array("st" => -5));
                    exit();
                }
            }
            else {
                echo json_encode(array("st" => -4));
                exit();
            }
            
          
            $arr_npc = $npcObj->selectNpcByCan($npc_info['can']);
            if ($arr_npc) {
                $flag = 0;
                foreach ($arr_npc as $value) {
                    if ($flag == 1) {
                        $next_general = $value;
                        break;
                    }
                    if ($value['id'] == $obj_info['npc_id']) $flag = 1;
                }
             
                if ($next_general) {
                
                    $npcObj->updateUserSoul($uid, $arr_soul);
                    $arr_raising["level"] = 1;
                    $arr_raising["exp"] = $arr_raising["exp"] - $raising_temp['attr'][7]['exp'];
                    if ($arr_raising["exp"] < 0) $arr_raising["exp"] = 0;
          
                    $npcObj->updateNpcId($obj_info['id'], $next_general['id']);
                    $obj_info['bringup_attr'] = json_encode($arr_raising);
                    $userNpc[$obj_id]['bringup_attr'] = json_encode($arr_raising);
                    $userNpc[$obj_id]['npc_id'] = $next_general['id'];
                    $array_chg = array('bringup_attr'=>$obj_info['bringup_attr'], "npc_id" => $next_general['id']);
                    $npcObj->updateNpcObj($uid, $obj_id, $array_chg, $userNpc);
                    echo json_encode(array("st" => 1));
                }
                else {  
                    echo json_encode(array("st" => 9));
                    exit();
                }
            }
            else {  
                echo json_encode(array("st" => -6));
                exit();
            }
        }
        else {  
            echo json_encode(array("st" => -3));
        }
    }
    else {  
        echo json_encode(array("st" => -3));
    }
}
elseif ($repUp == 1) {  
  
    $COST_REP = 100;
    
    if ($user['reputation'] < $COST_REP) { 
        echo json_decode(array('st' => -1));
    }
    else {
    
        $rand = rand(1,100);
        if ($rand <= 90) {
            $GET_EXP = 50;
        }
        else {
            $GET_EXP = 100;
        }
    
        $left_rep = $user['reputation'] - $COST_REP;
 
        $left_exp = $raising_exp + $GET_EXP;
  
        if ($left_exp >= $raising_temp['attr'][$raising_lv]['exp']) {  
            if ($raising_lv >= 7) {
                $arr_raising['exp'] = $left_exp;
                $up_flag = 2;
            }
            else {
                $left_exp -= $raising_temp['attr'][$raising_lv]['exp'];
                $raising_lv++;
                $arr_raising['exp'] = $left_exp;
                $arr_raising['level'] = $raising_lv;
                $up_flag = 1;
            }
        }
        else { 
            $arr_raising['exp'] = $left_exp;
            $arr_raising['level'] = $raising_lv;
            $up_flag = 0;
        }
        
        $obj_info['bringup_attr'] = json_encode($arr_raising);
        $array_chg = array('bringup_attr'=>$obj_info['bringup_attr']);
     
        $userObj->updateUser($uid, array('reputation'=>$left_rep));
        $userNpc[$obj_id]['bringup_attr'] = json_encode($arr_raising);
        $npcObj->updateNpcObj($uid, $obj_id, $array_chg, $userNpc);
        echo json_encode(array("st" => 1, "class" => $npc_info['class'], "cost" => $COST_REP, "get_exp" => $GET_EXP, "left_exp" => $left_exp, "level" => $raising_lv, 'expUp' => $raising_temp['attr'][$raising_lv]['exp'], "left_rep" => $left_rep, "raising_num" => $raising_num, "up_flag" => $up_flag));
    }
}
elseif ($ybUp == 1) {  
    
    if (date('Ymd', $curr_time) == date('Ymd', $raising_time)) { 
        $COST_YB = (($raising_num * 5+5)>0)?($raising_num * 5+5):10;
        $raising_num++;
        $arr_raising['num'] = $raising_num;
    }
    else { 
        $COST_YB = 10;
        $raising_num = 2;
        $arr_raising['num'] = $raising_num;
    }
 
    if ($user['yb'] < $COST_YB) {
        echo json_encode(array('st' => -2));
    }
    else {
    
        $rand = rand(1,100);
        if ($rand <= 50) {
            $GET_EXP = 50;
        }
        elseif ($rand > 51 && $rand <= 85) {
            $GET_EXP = 100;
        }
        else {
            $GET_EXP = 150;
        }
 
        $left_yb = $user['yb'] - $COST_YB;
     
        $left_exp = $raising_exp + $GET_EXP;
   
        if ($left_exp >= $raising_temp['attr'][$raising_lv]['exp']) {  
            if ($raising_lv >= 7) {
                $arr_raising['exp'] = $left_exp;
                $up_flag = 2;
            }
            else {
                $left_exp -= $raising_temp['attr'][$raising_lv]['exp'];
                $raising_lv++;
                $arr_raising['exp'] = $left_exp;
                $arr_raising['level'] = $raising_lv;
                $up_flag = 1;
            }
        }
        else {  
            $arr_raising['exp'] = $left_exp;
            $up_flag = 0;
        }
        $arr_raising['time'] = $curr_time;
        $obj_info['bringup_attr'] = json_encode($arr_raising);
        $array_chg = array('bringup_attr'=>$obj_info['bringup_attr']);
    
        $userObj->updateUser($uid, array('yb'=>$left_yb));
        $userNpc[$obj_id]['bringup_attr'] = json_encode($arr_raising);
        $npcObj->updateNpcObj($uid, $obj_id, $array_chg, $userNpc);
        //Logger::writeConsumeLog($uid, $user['account_id'], 0, -$COST_YB, "raising/raising.php");
        echo json_encode(array("st" => 1, 'class' => $npc_info['class'], "cost" => $COST_YB, "get_exp" => $GET_EXP, "left_exp" => $left_exp, "level" => $raising_lv, 'expUp' => $raising_temp['attr'][$raising_lv]['exp'], "left_yb" => $left_yb, "raising_num" => $raising_num, "up_flag" => $up_flag));
    }
}
else {
    $data['st'] = 1;
    $data['user'] = array('yb' => $user['yb'], 'reputation' => $user['reputation'], 'cost' => ($raising_num * 5+5));
 
    $data['general'] = array('name' => $npc_info['name'], 'class' => $npc_info['class'], 'star' => $npc_info['star'], 'can' => $npc_info['can'], 'level' => $raising_lv, 'exp' => $raising_exp, 'soulType' => $raising_temp['soul']['type'], 'expUp' => $raising_temp['attr'][$raising_lv]['exp'], "raising_num" => $raising_num, 'info' => $raising_temp);
    echo json_encode($data);
}
exit();
?>

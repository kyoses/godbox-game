<?php

/*
 * reset elite 精英塔刷�?
 * 20130502 by lv
 */
include_once dirname(__FILE__).'/../../config.php';
$battleObj=new Battle();
$mapObj=new Map();
$userObj=new User();

$curr_time = time();
$user=$userObj->selectUser($uid);
$userVip = $userObj->getUserVipLevel($user['yb_total']);
if ($userVip<2) {
    echo json_encode(array('st' => -1)); // vip2以上才能重置
    exit();
}
$userBattle = $battleObj->selectUserJYBattle($uid);
$reset_data = json_decode($userBattle['reset_data'], true);
$max_reset = $battleObj->vipResetNum($userVip);
if ($TODAY == strtotime(date('Ymd',$reset_data[$map_id]['reset_time']))){
    $reset_num = $reset_data[$map_id]['reset_num'] + 1;
}
else {
    $reset_num = 1;
}
$cost_yb = 80*$reset_num;
if ($user['yb'] < $cost_yb) {
    echo json_encode(array('st' => -2)); // 元宝不够重置
    exit();
}
// 当天重置
$rest_yb = $user['yb'] - $cost_yb;
if ($TODAY == strtotime(date('Ymd',$reset_data[$map_id]['reset_time']))) {
    if ($reset_data[$map_id]['reset_num'] < $max_reset) {
        $userObj->updateUser($uid, array('yb' => $rest_yb)); // 减元�?
       
		//Logger::writeConsumeLog($uid, $user['account_id'], 0, -$cost_yb, "fight/elite_reset.php");
        // 去除重置战斗信息
        $arr_map = $mapObj->selectBattleByMapID($map_id);
        $arr_fighted = json_decode($userBattle['battle_ids'], true); // 取得战斗场次id
        if (is_array($arr_map)) {
            $nn = 0;
            foreach ($arr_map as $val) {
                $arr_tmp[$nn] = $val['id'];
                $nn++;
            }
        }
        if (is_array($arr_fighted)) {
            foreach ($arr_fighted as $key=>$val) {
                if (!in_array($key, $arr_tmp)) {
                    $arr_ids[$key] = $val;
                }
            }
        }
        if ($arr_ids) {
            $str_ids = json_encode($arr_ids);
        }
        else {
            $str_ids = '';
        }
        $reset_data[$map_id]['reset_num'] = $reset_num;
        $reset_data[$map_id]['reset_time'] = $curr_time;
        $battleObj->updateUserJBattle($uid, array('battle_ids' => $str_ids,'reset_data' => json_encode($reset_data))); // 重置�?
        
		$mc = Mc::singleton();
        $mc->delete('c_battle_j'.$uid);
        echo json_encode(array('st' => 1));
    }
    else {
        $next_reset_num = $battleObj->vipResetNum(($userVip+1));
        echo json_encode(array('st' => -3, 'next' => $next_reset_num)); // 重置数用�?
    
		}
}
else {
    $userObj->updateUser($uid, array('yb' => $rest_yb)); // 减元�?
    
	//Logger::writeConsumeLog($uid, $user['account_id'], 0, -$cost_yb, "fight/elite_reset.php");
    // 去除重置战斗信息
    $arr_map = $mapObj->selectBattleByMapID($map_id);
    $arr_fighted = json_decode($userBattle['battle_ids'], true); // 取得战斗场次id
    if (is_array($arr_map)) {
        $nn = 0;
        foreach ($arr_map as $val) {
            $arr_tmp[$nn] = $val['id'];
            $nn++;
        }
    }
    if (is_array($arr_fighted)) {
        foreach ($arr_fighted as $key=>$val) {
            if (!in_array($key, $arr_tmp)) {
                $arr_ids[$key] = $val;
            }
        }
    }
    if ($arr_ids) {
        $str_ids = json_encode($arr_ids);
    }
    else {
        $str_ids = '';
    }
    $reset_data[$map_id]['reset_num'] = 1;
    $reset_data[$map_id]['reset_time'] = $curr_time;
    $battleObj->updateUserJBattle($uid, array('battle_ids' => $str_ids,'reset_data' => json_encode($reset_data))); // 重置�?
    
	echo json_encode(array('st' => 1, 'yb' => $rest_yb));
}

exit();
?>

<?php
// 20130419 by lv
// 绮捐嫳濉旀寜妤煎眰鎵崱
include_once dirname(__FILE__).'/../../config.php';
$battleObj=new Battle();
$userObj=new User();
$mapObj = new Map();

$user=$userObj->selectUser($uid);
$userVip = $userObj->getUserVipLevel($user['yb_total']);
// 绮捐嫳鍓湰鎯呭喌
$userBattle = $battleObj->selectUserJYBattle($uid);
$reset_data = json_decode($userBattle['reset_data'], true);

if ($TODAY == strtotime(date('Ymd',$userBattle['last_time']))) { // 褰撳ぉ宸叉垬鏂?  
  if ($userBattle['battle_ids']) {
        $arr_fighted = json_decode($userBattle['battle_ids'], true); // 鍙栧緱鎴樻枟鍦烘id
    //    echo 'fighted:';print_r($arr_fighted);
        if (is_array($arr_fighted)) {
            $nn = 0;
            foreach ($arr_fighted as $key=>$val) {
                $arr_fighted_ids[$nn] = $key;
                $nn++;
            }
    //        echo "ids:";
    //        print_r($arr_fighted_ids);
        }
    }
}
else {
    if ($TODAY == strtotime(date('Ymd',$reset_data[$map_id]['reset_time']))) {
        if ($userBattle['battle_ids']) {
            $arr_fighted = json_decode($userBattle['battle_ids'], true); // 鍙栧緱鎴樻枟鍦烘id
            if ($arr_fighted) {
                $nn = 0;
                foreach ($arr_fighted as $key=>$val) {
                    $arr_fighted_ids[$nn] = $key;
                    $nn++;
                }
            }
        }
    }
}
$strenMax=Common::getMaxTiLi($userObj->getUserVipLevel($user['yb_total']));
$userStren=$userObj->selectUserInfoRelatedVip($uid);
$strenArray=  explode(',', $userStren['strength']);
// 褰撳墠浣撳姏
$currStren = $strenArray[0];
$arr_map = $mapObj->selectBattleByMapID($map_id);

if($currStren==0){
    //浣撳姏涓嶅
    echo json_encode(array('st' => 3));
    exit();
}
if ($arr_map) {
    $n = 1;
    foreach ($arr_map as $val_m) {
        // 鏌ョ湅鍙墦鍏冲崱锛屼笉鑳芥墦閫€鍑?   
		if ($val_m['id'] == $userBattle['battle_id']) break;
        if (is_array($arr_fighted_ids) && in_array($val_m['id'], $arr_fighted_ids)) continue;// 浠婂ぉ鎴樻枟杩囨壂鑽℃椂璺宠繃
        $req_str = "http://".$_SERVER['HTTP_HOST']."/sgg/i/fight/s.php?bid=".$val_m['id']."&num=1&type=2&INNER_KEY=n9&uid=".$uid;
        $res = file_get_contents($req_str);
//        if ($uid==37) {
//            echo "req:".$req_str;
//            echo "\n<br />res";print_r($res);
//        }
        $arr_re = json_decode($res,true);
        $arr_res[$n] = $arr_re;
//        if ($uid==37) {
//            echo "s:";print_r($arr_re);
//        }
        // 鎵崱娆℃暟澶т簬浣撳姏鍊煎垯閫€鍑?        if ($n > $currStren) break;
        $n++;
        if ($arr_re['st'] == 3 || $arr_re['st'] == -1 || $arr_re['st'] == -2 || $arr_re['st'] == -3) {
            echo json_encode(array('st' => $arr_re['st']));
            exit();
        }
    }
    $data['st'] = 1;
    $data['dia'] = $arr_res;
    echo json_encode($data);
}
else {
    echo json_encode(array('st' => 4)); // 鏃犲彲鎵崱鍦板浘
}
exit();
?>

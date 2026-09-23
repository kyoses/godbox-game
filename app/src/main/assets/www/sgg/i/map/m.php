<?php

include_once dirname(__FILE__).'/../../config.php';
$mapObj = new Map();
$battleObj = new Battle();
$userObj = new User();
$user = $userObj->selectUser($uid);
$userVip = $userObj->getUserVipLevel($user['yb_total']);

if($type){
    if($type==1){
        $ubattle = $battleObj->selectUserBattle($uid);
    }
    else if($type==2){      
	$ubattle = $battleObj->selectUserJYBattle($uid);
    }
    else if($type==3){       
	$ubattle = $battleObj->selectUserFBBattle($uid);
    }
}
else{
    $ubattle = $battleObj->selectUserBattle($uid);
}
if($ubattle){
    $ubid = $ubattle['battle_id'];
}
if(!$bid){
    $bid = $ubid;
}
$battleAll = $mapObj->selectBattle();
$mid = $battleAll[$bid]['map_id'];
$map = $mapObj->selectMapById($mid);
$page = $map['page'];
if($bid != $ubid){
    $umid = $battleAll[$ubid]['map_id'];
    $umap = $mapObj->selectMapById($umid); 
	$upage = $umap['page'];
}
$mapAll = $mapObj->selectMap();
$mapPage = $mapAll[$page];
$userBattle = $battleObj->selectUserJYBattle($uid);
$reset_num = $battleObj->vipResetNum($userVip);
if ($userBattle['reset_data']) $reset_data = json_decode($userBattle['reset_data'], true);
foreach($mapPage as $k=>$v){
    if($k<$mid){
        $mapPage[$k]['st'] = 2; 
		}
    elseif($k == $mid){
        $mapPage[$k]['st'] = 1;
    }
    if ($type == 2) {
       
        $mapPage[$k]['first_name'] = $battleObj->selectLastFloor($k);
        if (!$mapPage[$k]['st']) {
            $mapPage[$k]['sd'] = -1;
            continue;
        }
        if ($userVip<1) { 
            $mapPage[$k]['sd'] = -2;
        }
        else {
            if ($TODAY == strtotime(date('Ymd',$userBattle['last_time']))) {                
			$arr_fighted = json_decode($userBattle['battle_ids'], true); 
                if ($arr_fighted) {
                    $nn = 0;
                    foreach ($arr_fighted as $key=>$val) {
                        $arr_fighted_ids[$nn] = $key;
                        $nn++;
                    }
                }
                unset($arr_map);
                $arr_tmp = $mapObj->selectBattleByMapID($v['id']);
                if (is_array($arr_tmp)){
      
//                    print_r($arr_tmp);
                    foreach ($arr_tmp as $tmp_k => $tmp_v) {
                        if ($tmp_k == $userBattle['battle_id']) break;
                        $arr_map[$tmp_k] = $tmp_v;
                    }
                    $num_fighted = 0;                
					if ($arr_fighted_ids) {
                        if ($arr_map) {
                            foreach ($arr_map as $val_m) {
    //                            echo "id:".$val_m['id']."<br />\n";
                                if (in_array($val_m['id'], $arr_fighted_ids)) {
                                    $num_fighted++;
    //                                echo "id:".$val_m['id']."|fighted:".$num_fighted."<br />\n";
                                }
                            }
                        }
                    }
                    
                    if ($mapPage[$k]['st']) {
//                        echo date('Ymd', $reset_data[$k]['reset_time']).'|'.$TODAY."<br />\n";
                        if (strtotime(date('Ymd', $reset_data[$k]['reset_time']))==$TODAY) {
                            $mapPage[$k]['sd_left'] = $reset_num - $reset_data[$k]['reset_num'];
//                            echo $mapPage[$k]['sd_left'].'|'.$reset_num;
                        }
                        else {
                            $mapPage[$k]['sd_left'] = $reset_num;
                        }
                    }
//                    print_r($arr_map);
//                    echo $num_fighted."|".count($arr_map);
                    if ($num_fighted == count($arr_map)) { 
                        if ($TODAY == strtotime(date('Ymd',$reset_data[$k]['reset_time']))) { 
                            if ($reset_data[$k]['reset_num']<$reset_num) {
                                $mapPage[$k]['sd'] = 2;
                                $mapPage[$k]['sd_cost'] = 80*($reset_data[$k]['reset_num']+1);
                            }
                            else { 
                                $mapPage[$k]['sd'] = -3;
                            }
                        }
                        else {
                            $mapPage[$k]['sd_cost'] = 80;
                            $mapPage[$k]['sd'] = 2;
                        }
                    }
                    else {
                        $mapPage[$k]['sd'] = 1;
                    }
                }
            }
            else {             
				$mapPage[$k]['sd'] = 1;
                if ($mapPage[$k]['st']) {
                    $mapPage[$k]['sd_left'] = $reset_num;
                }
            }
        }
    }
}
$data['map'] = $mapPage;
if($type==2){   
$page-=13;
}
else if($type==3){
    $page-=14;
}
$data['p']=$page;
if($page > 1){
    $data['lp'] = $page - 1;
}
if($page < $upage){
    $data['np'] = $page + 1;
}
//Utils::dump($data);
echo json_encode($data);
exit();
?>

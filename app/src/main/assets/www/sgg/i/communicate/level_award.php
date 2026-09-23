<?php



include_once dirname(__FILE__).'/../../config.php';
$userObj = new User();
$user = $userObj->selectUser($uid);
$award_info = $userObj->getUserAwardInfo($uid);
$commObj = new Communicate();
$acti_info = $commObj->selectActivityById($acti_id);
$arr_award = json_decode($acti_info['content'], true);

if ($award) {
    if (is_array($arr_award)) {
        if ($award_info['level_award'] >= $award) {
            echo json_encode(array('st' => -1)); 
        }
        else { 
            $dbObj = new DB();
            $dbObj->update("c_award", array('level_award' => $award), "user_id=$uid");
            if ($arr_award[$award]['yb']) { 
                $array_user['yb'] = $user['yb'] + $arr_award[$award]['yb'];
                //Logger::writeConsumeLog($uid, $user['account_id'], 0, $arr_award[$award]['yb'], "communicate/level_award.php");
            }
            if ($arr_award[$award]['gold']) { 
                $array_user['gold'] = $user['gold'] + $arr_award[$award]['gold'];
            }
            if ($arr_award[$award]['reputation']) { 
                $array_user['reputation'] = $user['reputation'] + $arr_award[$award]['reputation'];
            }
            $userObj->updateUser($uid, $array_user);
           
            if ($arr_award[$award]['prop']) {
                $propObj = new Prop();
                foreach ($arr_award[$award]['prop'] as $k => $v) {
                    $prop_info = $propObj->getTargetProp($v['id']);
                    $propObj->addProp($uid, $prop_info, $v['num']);
                }
            }
          
            if ($arr_award[$award]['equip']) {
                $equipObj = new Equip();
                foreach ($arr_award[$award]['equip'] as $k => $v) {
                    for ($i = 1;$i <= $v['num'];$i++) {
                        $equipObj->addUserEquip($uid, array('equip_id' => $v['id'], 'user_id' => $uid));
                    }
                }
            }
            echo json_encode(array('st' => 1, 'array' => $array_user));
        }
    }
    else {
        echo json_encode(array('st' => -9));
    }
}
else {
    if (is_array($arr_award)) {
        $award_flag = 0;
        foreach ($arr_award as $key => $value) {
            unset($row);
            if ($user['level'] < $key) { 
                $row['st'] = -1;
            }
            else {
                if ($award_info['level_award'] >= $key) {
                    $row['st'] = 3; 
                }
                else {
                    $row['st'] = 1; 
                    if ($award_flag == 1 && $row['st'] == 1) {
                        $row['st'] = 2;
                    }
                    else {
                        $award_flag = 1;
                    }
                }
            }
            $row['level'] = $value['level'];
            if ($value['yb']) $row['yb'] = $value['yb'];
            if ($value['gold']) $row['gold'] = $value['gold'];
            if ($value['reputation']) $row['reputation'] = $value['reputation'];
           
            if ($value['prop']) {
                $propObj = new Prop();
                foreach ($value['prop'] as $k=>$v) {
                    $row['prop'][$k]['id'] = $v['id'];
                    $prop_info = $propObj->getTargetProp($v['id']);
                    $row['prop'][$k]['name'] = $prop_info['name'];
                    $row['prop'][$k]['img'] = $prop_info['img_large'];
                    $row['prop'][$k]['num'] = $v['num'];
                }
            }
           
            if ($value['equip']) {
                $equipObj = new Equip();
                foreach ($value['equip'] as $k=>$v) {
                    $row['equip'][$k]['id'] = $v['id'];
                    $equip_info = $equipObj->getTargetEquip($v['id']);
                    $row['equip'][$k]['name'] = $equip_info['name'];
                    $row['equip'][$k]['img'] = $equip_info['img'];
                    $row['equip'][$k]['num'] = $v['num'];
                }
            }
            $array[$key] = $row;
        }
        echo json_encode($array);
    }
    else {
        echo json_encode(array('st' => -9));
    }
}

exit();
?>

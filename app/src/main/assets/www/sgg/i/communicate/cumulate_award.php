<?php


include_once dirname(__FILE__).'/../../config.php';
$userObj = new User();



$award_info = $userObj->getUserAwardInfo($uid);
$user = $userObj->selectUser($uid);
$commObj = new Communicate();
$acti_info = $commObj->selectActivityById($acti_id);
$award_json = json_decode($acti_info['content'], true);
$array['con'] = $award_json['con'];

if ($award_info['cumulate_award'] >= 3) {
    $array['st'] = 2; 
}
elseif ($award_info['cumulate_award'] == 2) {
    if ($user['login_days'] >= 3) {
        $array['st'] = 1; 
        $array['award_type'] = 3; 
    }
    else {
        $array['st'] = -1;
        $array['award_type'] = 2; 
    }
}
elseif ($award_info['cumulate_award'] == 1) {
    if ($user['login_days'] >= 2) {
        $array['st'] = 1;
        $array['award_type'] = 2; 
    }
    else {
        $array['st'] = -1;
        $array['award_type'] = 1; 
    }
}
else {
    if ($user['login_days'] >= 1) {
        $array['st'] = 1;
    }
    else {
        $array['st'] = -2;
    }
    $array['award_type'] = 1;
}

if ($award == 1 && $array['st'] == 1) {
    $award_type = $array['award_type'];
    $yb = $user['yb'] + $award_json[$award_type]['yb'];
//    $gold = $user['gold'] + $award['gold'];
    $rep = $user['reputation'] + $award_json[$award_type]['rep'];
    $dbObj = new DB();
    $dbObj->update("c_award", array('cumulate_award' => $award_type), "user_id=$uid");
    $userObj->updateUser($uid, array('yb' => $yb, 'reputation' => $rep));
    //Logger::writeConsumeLog($uid, $user['account_id'], 0, $award_json[$award_type]['yb'], "communicate/cumulate_award.php");
    if ($award_json[$award_type]['equip']) {
        $equipObj = new Equip();
        $equip_info = $equipObj->getTargetEquip($award_json[$award_type]['equip']);
        $equipObj->addUserEquip($uid, array('equip_id' => $award_json[$award_type]['equip'], 'user_id' => $uid));
        echo json_encode(array('yb' => $award_json[$award_type]['yb'], "left_yb" => $yb, 'e_name' => $equip_info['name'], 'st' => 1));
    }
    else {
        echo json_encode(array('yb' => $award_json[$award_type]['yb'], "left_yb" => $yb, 'rep' => $award_json[$award_type]['rep'], 'left_rep' => $rep, 'st' => 1));
    }
}
else {
    echo json_encode($array);
}

exit();
?>

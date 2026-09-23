<?php



include_once dirname(__FILE__).'/../../config.php';
$userObj = new User();


if ($type == 2) {
    $award_info = $userObj->getUserAwardInfo($uid);
    $commObj = new Communicate();
    $acti_info = $commObj->selectActivityById($acti_id);
    $arr_award = json_decode($acti_info['content'], true);
    if ($award == 1) {
        if ($TODAY == strtotime(date('Ymd', $award_info['login_award']))) {
            echo json_encode(array('st' => -1, 'con' => $arr_award['con'])); 
        }
        else { 
           
            $user = $userObj->selectUser($uid);
            $yb = $user['yb'] + $arr_award['yb'];
//            $gold = $user['gold'] + $arr_award['gold'];
            $rep = $user['reputation'] + $arr_award['rep'];
            $dbObj = new DB();
            $dbObj->update("c_award", array('login_award' => time()), "user_id=$uid");
            $userObj->updateUser($uid, array('yb' => $yb, 'reputation' => $rep));
            //Logger::writeConsumeLog($uid, $user['account_id'], 0, $arr_award['yb'], "communicate/acti_award.php");
            echo json_encode(array('yb' => $yb, 'rep' => $rep, 'st' => 2));
        }
    }
    else {
        if ($TODAY == strtotime(date('Ymd', $award_info['login_award']))) {
            echo json_encode(array('st' => -1, 'con' => $arr_award['con'])); 
        }
        else {
            echo json_encode(array('st' => 1, 'con' => $arr_award['con']));
        }
    }
}
exit();
?>

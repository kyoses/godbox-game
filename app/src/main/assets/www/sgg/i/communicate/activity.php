<?php

/*
 * 20130509 by lv
 * 活动列表接口
 */

include_once dirname(__FILE__).'/../../config.php';
$commObj = new Communicate();

$arr_acti = $commObj->selectActivityList();

echo json_encode($arr_acti);
exit();
?>

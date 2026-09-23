<?php

/*
 * 20130508 by lv
 * 公告列表接口
 */
include_once dirname(__FILE__).'/../../config.php';

$commObj = new Communicate();

$arr_ann = $commObj->selectAnnounceList();

echo json_encode($arr_ann);
exit();
?>

<?php

/*
 
 * 求助接口.
 */
include_once dirname(__FILE__).'/../../config.php';
$commObj = new Communicate();

if ($submit == 1) {
    if ($content) {
        $commObj->insertHelp($uid, 0, $content);
        echo json_encode(array('st' => 1));
    }
    else { // 内容不能为空
        echo json_encode(array('st' => -1));
    }
}
else {
    $arr_help = $commObj->selectHelpList($uid);
    if ($arr_help == -1) {
        echo json_encode(array('st' => 1, 'list' => -1));
    }
    else {
        echo json_encode(array('st' => 1, 'list' => $arr_help));
    }
}
exit();
?>

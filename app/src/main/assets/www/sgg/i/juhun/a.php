<?php
include_once dirname(__FILE__).'/../../config.php';
$soul = new Soul();
$data = $soul->getUserJuhunInfo($uid);
$data['left_soul'] = json_decode($data['left_soul']);
// Utils::dump($data);
// exit();
echo json_encode($data);
?>

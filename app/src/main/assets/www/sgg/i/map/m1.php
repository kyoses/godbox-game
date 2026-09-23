<?php

include_once dirname(__FILE__).'/../../config.php';
$mapObj = new Map();
$battleObj = new Battle();

$ubattle = $battleObj->selectUserBattle($uid);
$ubid = $ubattle['battle_id'];
$battleAll = $mapObj->selectBattle();
$mapAll = $mapObj->selectMap();
ksort($mapAll);
$mid = $battleAll[$ubid]['map_id'];
$map = $mapObj->selectMapById($mid);
$page = $map['page'];  
foreach ($mapAll as $key => $value) {
	if($key>$page){
		break;
	}
	ksort($value);
	foreach($value as $k => $v){
		if((int)$k<(int)$mid){
			$value[$k]['st'] = 2;
		}else if((int)$k==(int)$mid){
			$value[$k]['st'] = 1;
		}else{
			unset($value[$k]);  
		}
	}
	$data["map"][$key] = $value;
}
echo json_encode($data);
exit();
?>

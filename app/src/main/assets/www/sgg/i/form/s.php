<?php
include_once dirname(__FILE__).'/../../config.php';
$battleObj = new Battle();
$task = new Task();
if($f){
	$num = 0;
	$l = explode("|",$f);
	foreach ($l as $key => $value) {
		$r = explode(",",$value);
		foreach ($r as $k => $v) {
			if($v!=0){
				$num++;
			}
		}
	}
	$user = new User();
	$toplimit = $user->getToplimitInZX($uid);
	if($num>$toplimit){ 	
		exit();
	}
    $dataArray = array('user_id'=>$uid,'formation'=>$f);
    $battleObj->updateUserBattle($uid, $dataArray);
	$formationArray = $battleObj->formationStringToArray($f);
	$npcObj = new Npc();
	$npcAll = $npcObj->selectNpc();
	$npcList = $npcObj->getUserNpcList($uid);
	foreach($formationArray as $k1=>$v1){
	    foreach($v1 as $k2=>$v2){
	        $data['formation'][$k1][$k2]['id'] = $v2;
	        if($v2 > 0){
	            $data['formation'][$k1][$k2]['level'] = $npcList[$v2]['level'];
				$data['formation'][$k1][$k2]['name'] = $npcAll[$npcList[$v2]['npc_id']]['name'];
				$data['formation'][$k1][$k2]['can'] = $npcAll[$npcList[$v2]['npc_id']]['can'];
				$data['formation'][$k1][$k2]['class1'] = $npcAll[$npcList[$v2]['npc_id']]['class'];
	            $data['formation'][$k1][$k2]['img'] = $npcAll[$npcList[$v2]['npc_id']]['img_large'];
	            $data['formation'][$k1][$k2]['star'] = $npcAll[$npcList[$v2]['npc_id']]['star'];
	        }
	    }
	}
	$task->refreshTaskAfterBuzhen($uid);
	echo json_encode($data);
}
?>

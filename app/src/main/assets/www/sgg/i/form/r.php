<?php
include_once dirname(__FILE__).'/../../config.php';
$battleObj = new Battle();
$userBattle = $battleObj->selectUserBattle($uid);
$formationArray = $battleObj->formationStringToArray($userBattle['formation']);

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
			$data['formation'][$k1][$k2]['star'] = $npcAll[$npcList[$v2]['npc_id']]['star'];
            $data['formation'][$k1][$k2]['img'] = $npcAll[$npcList[$v2]['npc_id']]['img_large'];
        }
    }
}
echo json_encode($data);
?>

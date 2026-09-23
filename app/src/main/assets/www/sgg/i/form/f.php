<?php
include_once dirname(__FILE__).'/../../config.php';
$battleObj = new Battle();
$ubattle = $battleObj->selectUserBattle($uid);
if($ubattle){
    $formationArray = $battleObj->formationStringToArray($ubattle['formation']);
}
else{
    $formation = '0,0,0|0,0,0|0,0,0';
    $dataArray = array('user_id'=>$uid,'formation'=>$formation);
    $battleObj->insertUserBattle($dataArray);
    $formationArray = $battleObj->formationStringToArray($formation);
}
//Utils::dump($formationArray);
$npcObj = new Npc();
$npcAll = $npcObj->selectNpc();
$npcList = $npcObj->getUserNpcList($uid);
$list_temp = $npcList;
foreach($formationArray as $k1=>$v1){
    foreach($v1 as $k2=>$v2){
        $data['formation'][$k1][$k2]['id'] = $v2;
        if($v2 > 0){
            $data['formation'][$k1][$k2]['level'] = $npcList[$v2]['level'];
			$data['formation'][$k1][$k2]['name'] = $npcAll[$npcList[$v2]['npc_id']]['name'];
			$data['formation'][$k1][$k2]['can'] = $npcAll[$npcList[$v2]['npc_id']]['can'];
			$data['formation'][$k1][$k2]['class1'] = $npcAll[$npcList[$v2]['npc_id']]['class'];
            $data['formation'][$k1][$k2]['img'] = $npcAll[$npcList[$v2]['npc_id']]['img_large'];
			$data['formation'][$k1][$k2]['s_img'] = $npcAll[$npcList[$v2]['npc_id']]['img_small'];
			$data['formation'][$k1][$k2]['star'] = $npcAll[$npcList[$v2]['npc_id']]['star'];
            unset($list_temp[$v2]);
        }
    }
}
if(count($list_temp) > 0){
    foreach($list_temp as $k=>$v){
        $data['list'][$k]['id'] = $v['id'];
        $data['list'][$k]['level'] = $v['level'];
		$data['list'][$k]['name'] = $npcAll[$v['npc_id']]['name'];
		$data['list'][$k]['class1'] = $npcAll[$v['npc_id']]['class'];
        $data['list'][$k]['img'] = $npcAll[$v['npc_id']]['img_large'];
		$data['list'][$k]['s_img'] = $npcAll[$v['npc_id']]['img_small'];
    }
}

if($data['list']){
    krsort($data['list']);
}

$user = new User();
$data['limit'] = $user->getToplimitInZX($uid);
//Utils::dump($data);
echo json_encode($data);
exit();
?>

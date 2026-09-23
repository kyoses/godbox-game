<?php

include_once dirname(__FILE__) . '/../../config.php';

$npc = new Npc();
$battle = new Battle();
$user = new User();
$battleAll= $battle->selectBattle();
$userObj = $user->selectUser($uid);

$userVip = (int)$user->getUserVipLevel($userObj['yb_total']);
$c_battle = $battle->selectUserBattle($uid);
$c_battle_order = $battleAll[$c_battle['battle_id']]['battle_order'];
$pub = $npc->selectSpub();
$npcAll = $npc->selectNpc();

$userNpc = $npc->getUserNpcList($uid);
 
foreach ($userNpc as $k => $v) {
    $userNpcId[] = array('id' =>$v['npc_id'],'level'=>$v['level']);
}
 
foreach ($pub as $k3 => $v3) {
	$battle_order = $battleAll[$v3['battle_id']]['battle_order'];
	if(($battle_order >= $c_battle_order || (!$v3['battle_id']&&$v3['battle_id']!=0))){
		unset($pub[$k3]); 
		continue;
	}
	if($userVip<1&&($v3['vip']==5||$v3['vip']==7||$v3['vip']==9)){
		unset($pub[$k3]); 
		continue;
	}
	if($userVip>=1&&$userVip<5&&($v3['vip']==7||$v3['vip']==9)){
		unset($pub[$k3]); 
		continue;
	}
	if($userVip==5&&$v3['vip']==9){
		unset($pub[$k3]); 
		continue;
	}
	$can = $npcAll[$v3['npc_id']]['can'];   
	$class = $npcAll[$v3['npc_id']]['class']; 
	$v3['class'] = $class;
	$pub2[$can][] = $v3; 
}
 
foreach($userNpc as $k=>$v){
	$can = $npcAll[$v['npc_id']]['can'];   
	if($pub2[$can]){
		unset($pub2[$can]);
	}
}
// 
// foreach($pub2 as $k=>$v){
	// if(count($v) <= 0){
		// unset($pub2[$k]);
		// continue;
	// }                                                                                                   
	// $pub2[$k] = $v;
// }
if (count($pub2) == 0) {
    $data['re'] = 0;
}else{
	$data['re'] = 1;
}
ksort($pub2);  
// $shengjie = array();
$zhaomu = array();
 
foreach ($pub2 as $k1 => $v1) {
	foreach ($v1 as $k=> $v) {
		$pre_npc = explode(",", $v['last_nid']);  
		$InUserNpc = false;
		$level = "1";
	 
		$npcObj = $npc->getTargetNpc($v['npc_id']);
	    
		$d[$v['id']]['id'] = $v['id'];
		$d[$v['id']]['level'] = 0;//$level;
		$d[$v['id']]['n_vip'] = $v['vip'];
		$d[$v['id']]['n_repu'] = $v['reputation'];
		$d[$v['id']]['n_gold'] = $v['gold'];
	    $d[$v['id']]['name'] = $npcObj['name'];
	    $d[$v['id']]['img'] = $npcObj['img_large'];
		$d[$v['id']]['info'] = $npcObj['info'];
	    //$data['list'][$v['npc_id']]['power'] = $npc->getNpcPower($v1);
	    $d[$v['id']]['str'] = $npcObj['strength'];
	    $d[$v['id']]['inte'] = $npcObj['intelligence'];
	    $d[$v['id']]['hp'] = Utils::formulaValue($npcObj['hp'],array('level'=>$level));
		$d[$v['id']]['can'] = $npcObj['can'];
		$d[$v['id']]['star'] = $npcObj['star'];
	    $d[$v['id']]['class'] = $npcObj['class'];
	    $skill = $npc->getNpcSkill($npcObj['skill_id']);
	    $d[$v['id']]['skillName'] = $skill['name'];
		$d[$v['id']]['skillInfo'] = $skill['info'];
	    $d[$v['id']]['type'] = 1;
			array_push($zhaomu, $d[$v['id']]);
		
		break;   
	}
}
// if(count($zhaomu)>0){
	// Utils::orderArray($zhaomu, 'class');
// }
$data['list'] = $zhaomu;//array_merge($zhaomu,$shengjie);
echo json_encode($data);
exit();
?>
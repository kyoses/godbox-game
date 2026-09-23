<?php
/*uid:userId,equipId:equip_id*/
include_once dirname(__FILE__) . '/../../config.php';
$equip = new Equip();
$prop = new Prop();
$npc = new Npc();

$battleObj = new Battle();
$ubattle = $battleObj->selectUserBattle($uid);
$s_battle = $battleObj->selectBattleTargetObj($ubattle['battle_id']);
$ubid_order = $s_battle['battle_order']; 

$u_jy = $battleObj->selectUserJYBattle($uid);
$u_jy_battle = $battleObj->selectBattleTargetObj($u_jy['battle_id']);
$ubid_jy_order = $u_jy_battle['battle_order'];

$allDrop = $battleObj->selectBattleDropB();
$allHecheng = $equip->selectEquipSynthesis();
$equipMode = $equip->getEquipObjInfo($equipId); 
$s_info = $equip->getTargetEquip($equipMode['equip_id']);  
$owner = $equip->findOwnerOfEquip($uid, $equipId);
$data['s_equip']['owner'] = $owner;
$data['s_equip']['npcName'] = "--";
if($data['s_equip']['owner']){ 
	$c_npc = $npc->getNpcBaseData($data['s_equip']['owner']);
	$data['s_equip']['npcName'] = $c_npc['name'];
	//$data['s_equip']['npcClass'] = $c_npc['class'];
}

$data['s_equip']['name']= $s_info['name'];
$data['s_equip']['img']= $s_info['img'];
$data['s_equip']['class']= $s_info['class'];
$data['s_equip']['up_level'] = $equipMode['up_level'];
$data['s_equip']['attr'] = $equip->getEquipAttr($s_info,$equipMode['up_level']);

$hecheng= $allHecheng[$equipMode['equip_id']]; 
$target = null; 
foreach ($hecheng as $key=>$v){  
    if(!$target!=null){
        $equipInfo = $equip->getTargetEquip($v['target_id']);  
        $target['id'] = $v['target_id'];
        $target['img'] = $equipInfo['img'];
		$target['name'] = $equipInfo['name'];
		$target['class'] = $equipInfo['class'];
	
		$target['attr'] = $equip->getEquipAttr($equipInfo, $equipMode['up_level']); 
    }
	
    $mate[$v['id']]['id'] = $v['propid'];
    $p = $prop->getTargetProp($v['propid']);
    $mate[$v['id']]['img'] = $p['img_large'];
    $mate[$v['id']]['max'] = $v['propnum'];
	$mate[$v['id']]['name'] = $p['name'];
	$mate[$v['id']]['info'] = $p['info'];
    $n = $prop->getNumBagProp($uid, $v['propid']);
    if($n==null){$n=0;}
    $mate[$v['id']]['num'] = $n>$v['propnum']?$v['propnum']:$n;  
    $mate[$v['id']]['u_bid_order'] = $ubid_order;
	$mate[$v['id']]['u_jybid_order'] = $ubid_jy_order;
	$mete_battle_drop = $allDrop['5'][$v['propid']];  
	Utils::orderArray($mete_battle_drop, 'battle_order');
	$d = array_shift($mete_battle_drop);
	$mate[$v['id']]['map_id'] = $d['map_id'];
	$mate[$v['id']]['map_bid_id'] = $d['battle_id'];
	$mate[$v['id']]['mate_bid_order'] = $d['battle_order'];
	$mate[$v['id']]['mate_bid_type'] = $d['battle_type'];
}
unset($hecheng);
$data['target'] = $target;
$data['met'] = $mate;
echo json_encode($data);
exit();
?>

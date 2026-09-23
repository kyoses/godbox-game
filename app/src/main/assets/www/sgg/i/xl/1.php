<?php
include_once dirname(__FILE__) . '/../../config.php';
$user = new User();
$npc = new Npc();
$userInfo = $user->selectUser($uid);
$vip = $user->getUserVipLevel($userInfo['yb_total']);
$data['limit'] = Common::getNumOfTrainByVip($vip); 
$userNpc = $npc->getUserNpcList($uid);
$now = time();
$CD = 180*60;  //CD时间
//NPC
foreach ($userNpc as $key => $value) {
	if($value['train_time']==0){
		$data['list'][$value['id']]['status'] = 1;  //表示可训�?
	}else{
		if($now-$value['train_time']>=$CD){
			$data['list'][$value['id']]['status'] = 1;
			$npc->updateNpcTrain($uid, $value['id'], 0);   //将已过冷却时间的武将冷却状态改�?
		}else{
			$data['list'][$value['id']]['status'] = 0;  //表示正在冷却�?
			$data['list'][$value['id']]['wait'] = $CD-($now-$value['train_time']);  //剩余冷却时间
		}
	}
	
	$data['list'][$value['id']]['level'] = $value['level'];
	$s_npc = $npc->getTargetNpc($value['npc_id']);
	$data['list'][$value['id']]['name'] = $s_npc['name'];
	$data['list'][$value['id']]['class'] = $s_npc['class'];
	$data['list'][$value['id']]['star'] = $s_npc['star'];
	$data['list'][$value['id']]['img_large'] = $s_npc['img_large'];
}
echo json_encode($data);
?>
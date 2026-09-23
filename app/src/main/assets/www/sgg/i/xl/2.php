<?php
/* 训练*/
include_once dirname(__FILE__) . '/../../config.php';
$user = new User();
$npc = new Npc();
$userInfo = $user->selectUser($uid);
$vip = $user->getUserVipLevel($userInfo['yb_total']);
$limit= Common::getNumOfTrainByVip($vip);  //当前开放的训练�?
$userNpc = $npc->getUserNpcList($uid);
$now = time();
$CD = 180*60;  //CD时间
$userLevel = (int)$userInfo['level'];
$npcLevel = (int)$userNpc[$nid]['level'];
if($npcLevel>=$userLevel){
	$data['re'] = 0;
	echo json_encode($data);
	exit();
}
//遍历NPC
$c_num = 0;  //当前正在冷却的武将的个数
foreach ($userNpc as $key => $value) {
	//如果该武将本身正在冷却中
	if($value['id']==$nid&&$value['train_time']!=0&&($now-$value['train_time']>=$CD)){
		$data['re'] = 0;
		echo json_encode($data);
		exit();
	}
	if($value['train_time']!=0){
		if($now-$value['train_time']>=$CD){
			$npc->updateNpcTrain($uid, $value['id'], 0);   //将已过冷却时间的武将冷却状态改�?
		}else{
			$c_num++;
		}
	}
}
//如果当前的冷却人数已�?
if($c_num>=$limit){
	$data['re'] = 0;
	echo json_encode($data);
	exit();
}

/*武将本身没有在训练冷却，而且当前人数也没超上�?
 *则训练添加经验，并进入冷�?
 */
$data['re'] = 1;
$add_exp = (int)(pow($userNpc[$nid]['level'],3.5)/2.5+500000);
$c_npc[$nid] = $userNpc[$nid];
$npc->addNpcExp($c_npc, $add_exp, $nid);
$npc->updateNpcTrain($uid, $nid, $now);   //将已过冷却时间的武将冷却状态改�?
$data['exp'] = $add_exp;
$data["npc"] = $c_npc[$nid];
echo json_encode($data);
?>
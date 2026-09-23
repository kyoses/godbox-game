<?php

include_once dirname(__FILE__) . '/../../config.php';
$user = new User();
$npc = new Npc();
$userInfo = $user->selectUser($uid);
$userNpc = $npc->getUserNpcList($uid);
$now = time();
$CD = 180*60;  //CD时间
//遍历NPC
foreach ($userNpc as $key => $value) {
	//如果该武将本身正在冷却中
	if($value['id']==$nid&&$value['train_time']!=0){
		$time = $now - $value['train_time'];
		if($time<$CD){
			$l_time = floor(($CD-$time)/60);
			$needYB = (int)($l_time/3)+1;
			if($userInfo['yb']>=$needYB){
				$data['re']=1;
				$npc->updateNpcTrain($uid, $value['id'], 0);   //将已过冷却时间的武将冷却状态改�?
				$user->addYB($userInfo, -$needYB);
				$data['user'] = $userInfo;
			}else{
				$data['re'] = 0;
			}
		}else{
			$data['re']=1;
			$npc->updateNpcTrain($uid, $value['id'], 0);   //将已过冷却时间的武将冷却状态改�?
		}
		break;
	}
}
echo json_encode($data);
?>
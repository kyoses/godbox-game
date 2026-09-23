<?php
/* 招募或者转生uid,nid(招募馆id)*/
include_once dirname(__FILE__) . '/../../config.php';

$user = new User();
$npc = new Npc();
$task = new Task();
$userObj = $user->selectUser($uid);
$userVip = $user->getUserVipLevel($userObj['yb_total']);
$pub = $npc->selectSpub();
$c_pub = $pub[$nid];  //当前招募(转升)对象
//条件不够
if($c_pub['vip']>$userVip||$c_pub['reputation']>$userObj['reputation']||$c_pub['gold']>$userObj['gold']){
	exit;
}
//用户npc
// $userNpc = $npc->getUserNpcList($uid);
// foreach ($userNpc as $k => $v) {
	// $userNpcId[$v['id']] = $v['npc_id'];  
// }
// 
// //转生
// $pre_npc = explode(",", $c_pub['last_nid']);  //前置npc数组
// $isZhaomu = true;
// foreach ($pre_npc as $k => $v) {
	// if ($userNpcId&&in_array($v, $userNpcId)) {
		// //找到用户拥有的前置npc
		// foreach ($userNpcId as $k1 => $v1) {
			// if($v1==$v){
				// $userNpc_id = $k1;  //cnpc列表id
				// break;
			// }
		// }
		// $isZhaomu = false;
		// $npc->updateNpcId($userNpc_id, $c_pub['npc_id']);  //转升，直接替换c_npc列表的npc_id
		// $data['re'] = "2";
		// $mc = Mc::singleton();
    	// $mc->delete('c_npc' . $uid);
		// $task->refreshTaskAfterZhaomu($uid);
		// break;
	// }
// }
// //招募
// if($isZhaomu){
	$data['re'] = "1";
	//为用户添加该npc
	$temp = array("npc_id"=>$c_pub['npc_id'],"user_id"=>$uid,"create_date"=>time());
	$npc->addUserNpc($uid,$temp);//给用户添加npc
	$mc = Mc::singleton();
    $mc->delete('c_npc' . $uid);
	$task->refreshTaskAfterZhaomu($uid);
// }
$user->addReputation($userObj, -$c_pub['reputation']);
$user->addGold($userObj, -$c_pub['gold']);
//Logger::writeGoldConsumeLog($userObj['id'], $userObj['account_id'], $userObj['account_type'], -$c_pub['gold'], "i/npc/z1.php");
$data['user']['gold'] = $userObj['gold'];
$data['user']['reputation'] = $userObj['reputation'];
echo json_encode($data);
exit();
?>
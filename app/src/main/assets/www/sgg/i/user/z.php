<?php
 
include_once dirname(__FILE__) . '/../../config.php';
$userObj = new User();
$npcObj = new Npc();
$userInfo = $userObj->selectUser($uid);
 
$battle = new Battle();
$battle_title = $battle->getUserBattleTitle($userInfo['reputation']);
$data['b_title'] = $battle_title['name'];
 
$npcs = $npcObj->getUserNpcList($uid);
$data['npcNum'] = count($npcs);
 
$data['b_sum'] = $battle->getSumNpcPower($uid);  
$award = $userObj->getUserAwardInfo($uid);
 
//$data['repu'] = $userInfo['reputation'];
 
$data['uinfo'] = $userInfo;
 
$compet = new Competitive();
$userCom = $compet->getUserCompetitiveByUserID($uid);
if($userCom){
	$data['ranking'] = $userCom['ranking'];
}else{
	$data['ranking'] = "没有数据";
}

$data['limit'] = $userObj->getToplimitInZX($uid);
$data['expUp'] = $npcObj->getNpcExpUp($userInfo['level']);
$data['uinfo']['vip'] = $userObj->getUserVipLevel($userInfo['yb_total']);
$strenMax = Common::getMaxTiLi($data['uinfo']['vip']);
$data['uinfo']['maxTL'] = $strenMax; 
$userStren = $userObj->selectUserInfoRelatedVip($uid);
$strenArray = explode(',', $userStren['strength']);
$data['uinfo']['nowTL'] = $strenArray[0];  
 
//$patten = '/(?<=\d)(?=(?:\d\d\d)+(?!\d))/';
//$data['gold'] = preg_replace($patten,',',$userInfo["gold"]);
echo json_encode($data);
exit();
?>

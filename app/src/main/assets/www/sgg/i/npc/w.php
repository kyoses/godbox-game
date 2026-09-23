<?php
 
include_once dirname(__FILE__).'/../../config.php';
$userObj=new User();
$npcObj=new Npc();
$userNpc=$npcObj->getUserNpcList($uid);

$userInfo = $userObj->selectUser($uid);
$vip = $userObj->getUserVipLevel($userInfo['yb_total']);
$data['limit'] = Common::getNumOfTrainByVip($vip);  
$now = time();
$CD = 180*60;  

$battleObj=new Battle();
$ubattle=$battleObj->selectUserBattle($uid);
$wjFormation=explode('|',$ubattle['formation']);
 foreach($wjFormation as $v){
    $arr = explode(',', $v);
    foreach($arr as $key => $value){
        $wjSZ[$value]=$value;
    }
}
foreach($userNpc as $key => $value){
    $npc = $npcObj->getTargetNpc($value['npc_id']);
    $isInFor=0; 
    if($wjSZ[$value['id']]){
        $isInFor=1;
    }
	$npc_info = array('id'=>$value['id'],'lv'=>(int)$value['level'],'name'=>$npc['name'],'can'=>$npc['can'],'img'=>$npc['img_large'],'star'=>$npc['star'],'cl'=>$npc['class'],'f'=>$isInFor);
    
    if($value['train_time']==0){
		$npc_info['status'] = 1;  
	}else{
		if($now-$value['train_time']>=$CD){
			$npc_info['status'] = 1;
			$npcObj->updateNpcTrain($uid, $value['id'], 0);   
		}else{
			$npc_info['status'] = 0;   
			$npc_info['wait'] = $CD-($now-$value['train_time']);   
		}
	}
    
    
    $data['list'][] = $npc_info;
    $npcLevel[]=$value['level'];
    $npcInFormation[]=$isInFor;
}
if($npcInFormation){
	array_multisort($npcInFormation,SORT_DESC,$npcLevel,SORT_DESC,$data['list']); 
}
echo json_encode($data);
exit();
?>

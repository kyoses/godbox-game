<?php
 
include_once dirname(__FILE__).'/../../config.php';
$soul = new Soul();
$userSoul = $soul->getUserJuhunInfo($uid);
if($type==1){  //聚蓝�?
	
	if($userSoul['green_soul']>=100){
		$userSoul['green_soul']-=100;
		$userSoul['blue_soul']+=1;
		$data['re'] = 1;
	}else{
		$data['re'] = 0;
	}
}else if($type==2){  //聚紫�?
	
	if($userSoul['blue_soul']>=100){
		$userSoul['blue_soul']-=100;
		$userSoul['purple_soul']+=1;
		$data['re'] = 1;
	}else{
		$data['re'] = 0;
	}
}
if($data['re']){
	$soul->updateUserSoul($uid, array('green_soul'=>$userSoul['green_soul'],'blue_soul'=>$userSoul['blue_soul'],'purple_soul'=>$userSoul['purple_soul']));
    $data = $userSoul;
	$data['re'] = 1;
	$data['left_soul'] = json_decode($data['left_soul']);
}
echo json_encode($data);
?>

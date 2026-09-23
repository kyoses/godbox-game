<?php
//收魂by veryszhang
include_once dirname(__FILE__).'/../../config.php';
$soul = new Soul();
$userSoul = $soul->getUserJuhunInfo($uid);
if($userSoul['left_soul']){
	$left_soul = json_decode($userSoul['left_soul'],true);
	$green_soul = $userSoul['green_soul'];      //当前绿魂
	$blue_soul = $userSoul['blue_soul'];        //当前蓝魂
	$purple_soul = $userSoul['purple_soul'];    //当前紫魂
	$orange_soul = $userSoul['orange_soul'];    //当前橙魂
	foreach ($left_soul as $key => $value) {
		if($value['type']==1){
			$green_soul += $value['num'];
		}
		if($value['type']==2){
			$blue_soul += $value['num'];
		}
		if($value['type']==3){
			$purple_soul += $value['num'];
		}
		if($value['type']==4){
			$orange_soul += $value['num'];
		}
	}
	$data = array('green_soul' => $green_soul,'blue_soul'=>$blue_soul,
	              'purple_soul'=>$purple_soul,'orange_soul'=>$orange_soul,'left_soul'=>'');
	$soul->updateUserSoul($uid, $data);
	$data['re'] = 1;
}else{
	$data['re'] = 0;
}
echo json_encode($data);
?>

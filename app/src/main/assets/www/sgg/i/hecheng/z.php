<?php


include_once dirname(__FILE__) . '/../../config.php';
$equip = new Equip();
$propObj = new Prop();
$bagEquip = $equip->getUserAllEquip($uid);  
/*
$equipHecheng = $equip->selectEquipSynthesis();  
$bagPeifang = $propObj->getBagPeifang($uid); 
if ($bagPeifang != null && $bagEquip != null) {
    foreach ($bagEquip as $key => $value) {
        if ($value['type'] < 5) {  
            if ($equipHecheng[$value['equip_id']]) {  
                foreach ($equipHecheng[$value['equip_id']] as $k => $v) {
                    if (in_array($v['propid'], $bagPeifang)) {  
                        //$data[$key]['equip_id'] = $value['equip_id']; 
                        $data[$key]['img'] = $value['img'];
						$data[$key]['up_level'] = $value['up_level'];
                    }
                }
            }
        }
    }
}else{
    $data = null;
}
*/
if(count($bagEquip)>0){
	foreach ($bagEquip as $key => $value) {
		if($value['status']==1&&$value['type']<5&&$value['take_level']<100){
			$data[$key]['img'] = $value['img'];
			$data[$key]['up_level'] = $value['up_level'];
		}
	}
}
//Utils::dump($data);
echo json_encode($data);
exit();
?>

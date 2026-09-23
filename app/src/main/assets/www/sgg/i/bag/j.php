<?php
 
include_once dirname(__FILE__).'/../../config.php';
if($right){
    $equipObj = new Equip();
    $qianghuaObj = new Qianghua();
    $userEquip = $equipObj->getUserBagEquip($uid);
    if ($userEquip) {
        foreach ($userEquip as $key => $value) {
            if ($value['type'] == 6) { 
                $oneJiaoQie = array('eid' => $value['id'], 'name' => $value['name'], 'img' => $value['img'], 'takeL' => $value['take_level'], 'level' => $value['up_level'], 't' => 'jq','type'=>$value['type']);
                $oneJiaoQie['price'] = $value["up_level"]*100;
				//$qianghuaObj->calculateEquipUpLAllCost($value["up_level"], $value["type"], $value["class"]); 
                Common::setAttributeValue($oneJiaoQie, $value, array('level' => $value['up_level']));  
                $data['jlist'][] = $oneJiaoQie;
            }
        }
    }
}
if($left){
    include_once dirname(__FILE__) . '/../npc/w2.php';
}
//print_r($data);
echo json_encode($data);
exit();
?>

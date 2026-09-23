<?php


include_once dirname(__FILE__) . '/../../config.php';
if ($right) {
    $equipObj = new Equip();
    $propObj = new Prop();
    $userObj = new User();
    $userProp = $propObj->getUserBagProp($uid);
   
    $userEquip = $equipObj->getUserBagEquip($uid);
    $qianghuaObj = new Qianghua();
    if ($userEquip) {
        foreach ($userEquip as $key => $value) {
            if ($value['type'] != 5 && $value['type'] != 6) {              
			$oneEquip = array('eid' => $value['id'], 'name' => $value['name'], 'img' => $value['img'], 'type' => $value['type'], 'takeL' => $value['take_level'], 'level' => $value['up_level'], 't' => 'zb');
                $allUpLCost = $qianghuaObj->calculateEquipUpLAllCost($value["up_level"], $value["type"], $value["class"]);              //$oneEquip['price']=$value["price"]+floor($allUpLCost/2);
                $oneEquip['price'] = $value["up_level"]*100;
                Common::setAttributeValue($oneEquip, $value, array('level' => $value['up_level']));             
				
                if ($value["hole_1"] || $value["hole_2"] || $value["hole_3"]) {
                    if (!$propAll) {
                        $propAll = $propObj->selectProp();
                    }
                    if ($value["hole_1"]) {                     
					$prop = $propObj->getPropObjInfo($value["hole_1"]);
                        $attr = $propAll[$prop["prop_id"]]['attribute'];
                        if ($attr) {
                            $zfAttr.=$attr . ',';
                        }
                    }
                    if ($value["hole_2"]) {                     
					$prop = $propObj->getPropObjInfo($value["hole_2"]);
                        $attr = $propAll[$prop["prop_id"]]['attribute'];
                        if ($attr) {
                            $zfAttr.=$attr . ',';
                        }
                    }
                    if ($value["hole_3"]) {                        
					$prop = $propObj->getPropObjInfo($value["hole_3"]);
                        $attr = $propAll[$prop["prop_id"]]['attribute'];
                        if ($attr) {
                            $zfAttr.=$attr;
                        }
                    }
                                       
					if ($zfAttr) {
                        $attrArray = explode(',', $zfAttr);
                        foreach ($attrArray as $k => $v) {
                            if ($v) {
                                $oneAttr = explode(':', $v);
                                $oneProp['zfattr'][$oneAttr[0]]+=$oneAttr[1];
                            }
                        }
                    }
                }

                $data['bag']['c'][] = $oneEquip;
            }
        }
    }
}
if ($left) { 
include_once dirname(__FILE__) . '/../npc/w2.php';  
}
echo json_encode($data);
exit();
?>

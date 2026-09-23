<?php

 
include_once dirname(__FILE__) . '/../../config.php';
$userObj = new User();
$npcObj = new Npc();
$skillObj = new Skill();
$equipObj = new Equip();
$propObj=new Prop();
$fabaoObj=new Fabao();
$userNpc = $npcObj->getUserNpcList($uid);
if ($userNpc) {
 
    $battleObj = new Battle();
    $ubattle = $battleObj->selectUserBattle($uid);
    $wjFormation = explode('|', $ubattle['formation']);
    foreach ($wjFormation as $v) {
        $arr = explode(',', $v);
        foreach ($arr as $key => $value) {
            $wjSZ[$value] = $value;
        }
    }
    foreach ($userNpc as $key => $value) {
        $npc = $npcObj->getTargetNpc($value['npc_id']);
        $isInFor = 0;  
        if ($wjSZ[$value['id']]) {
            $isInFor = 1;
        }
        //var_dump($value);
      
        $type = $npcObj->getWJType($value['npc_id']);
        $npclist[] = array('lv' => $value['level'], 'id' => $value['id'],'ty'=>$type);
        $npcLevel[] = $value['level'];
        $npcInFormation[] = $isInFor;
    }
    array_multisort($npcInFormation, SORT_DESC, $npcLevel, SORT_DESC, $npclist);  
    $data['nlist'] = $npclist;
    ///////////

    if (!$nid) {
        $nid = $npclist[0]['id'];
        $index = 1;
    } else {
        $index = 1;
        foreach ($npclist as $key => $value) {
            if ($value['id'] == $nid) {
                break;
            }
            $index++;
        }
    }
    $data['npc']['index'] = $index;
    $npc = $npcObj->getNpcObj($nid);
    $targetNpc = $npcObj->getTargetNpc($npc['npc_id']);
    $skill = $skillObj->getTargetSkill($targetNpc['skill_id']);
    $data['npc']['nid'] = $nid;
    $data['npc']['name'] = $targetNpc['name'];
    $data['npc']['level'] = $npc['level'];
    $data['npc']['exp'] = $npc['exp'];
    $data['npc']['img'] = $targetNpc['img_large'];
	$data['npc']['star'] = $targetNpc['star'];
    $data['npc']['class'] = $targetNpc['class'];
    $data['npc']['can'] = $targetNpc['can'];
    $data['npc']['expUp'] = $npcObj->getNpcExpUp($npc['level']);
    $Info = $npcObj->getNpcBattleValue($nid); 
    $data['npc']['classStar'] = $targetNpc['class'];
    $data['npc']['mag_att'] = $Info['mag_att'];
    $data['npc']['mag_def'] =  $Info['mag_def'];
    $data['npc']['phy_att'] =  $Info['phy_att'];
    $data['npc']['phy_def'] = $Info['phy_def'];
    $data['npc']['speed'] =  $Info['speed'];
    $selfData = $npcObj->getNpcSelfData($npc,$targetNpc);  
    if(!$equipAll){
        $equipAll=$equipObj->selectEquip(); 
    }
    if(!$userAllEquip){
        $userAllEquip=$equipObj->getUserAllEquipNoAttr($uid); 
    }
    if(!$propAll){
        $propAll=$propObj->selectProp(); 
    }
    if(!$userAllProp){
        $userAllProp=$propObj->getUserAllPropNoAttr($uid); 
    }
    if(!$userAllFabao){
        $userAllFabao=$fabaoObj->getUserFabao($uid); 
    }
    $equipData = $npcObj->getNpcEquipData2($npc,$equipAll,$userAllEquip,$propAll,$userAllProp,$userAllFabao);  
    if ($equipData) { 
        foreach ($selfData as $k2 => $v2) {
            if ($equipData[$k2]) {
                $selfData[$k2] += $equipData[$k2];
            }
        }
    }
    $data['npc']['hp'] = $selfData['hp']; 
	//Utils::formulaValue($npc['hp'], array('level'=>$v['level']));
    $data['npc']['str'] = $selfData['strength'];
	//Utils::formulaValue($npc['strength'], array('level'=>$v['level']));
    $data['npc']['inte'] = $selfData['intelligence']; 
	//Utils::formulaValue($npc['intelligence'], array('level'=>$v['level']));
    $data['npc']['skname'] = $skill['name'];
    //$data['npc']['power'] = $npcObj->getNpcPower($npc,$selfData);
    $equipObj = new Equip();
    $qianghuaObj=new Qianghua();
    $faboObj=new Fabao();
   // print_r($npc);
    $equipAll = $equipObj->selectEquip();
    for ($i = 1; $i <= 8; $i++) {
        $str = 'part_' . $i;
        if ($npc[$str] > 0) {
            if ($i <= 4) {
                $eobj = $equipObj->getEquipObjInfo($npc[$str]); 
                $eq = $equipAll[$eobj['equip_id']]; 
                $data['equip'][$str] = array('eid' => $npc[$str], 'name' => $eq['name'], 'level' => $eobj['up_level'], 'img' => $eq['img'], 'type' => $eq['type'],'t'=>'zb','takeL' => $eq['take_level']);
                $data['equip'][$str]['onid'] = $nid; 
                $data['equip'][$str]['price']= $eobj['up_level']*100;       
				//$qianghuaObj->calculateEquipUpLCostById($npc[$str], $equipAll, $eobj);
                //灞炴€?
                Common::setAttributeValue($data['equip'][$str], $eq, array('level' => $eobj['up_level']));
      
                if ($eobj["hole_1"] || $eobj["hole_2"] || $eobj["hole_3"]) {
                    if (!$propAll) {
                        $propObj = new Prop();
                        $propAll = $propObj->selectProp();
                    }
                    if ($eobj["hole_1"]) {
                        $prop = $propObj->getPropObjInfo($eobj["hole_1"]);
                        $attr = $propAll[$prop["prop_id"]]['attribute'];
                        if ($attr) {
                            $zfAttr.=$attr . ',';
                        }
                    }
                    if ($eobj["hole_2"]) {
                        $prop = $propObj->getPropObjInfo($eobj["hole_2"]);
                        $attr = $propAll[$prop["prop_id"]]['attribute'];
                        if ($attr) {
                            $zfAttr.=$attr . ',';
                        }
                    }
                    if ($eobj["hole_3"]) {
                        $prop = $propObj->getPropObjInfo($eobj["hole_3"]);
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
                                $data['equip'][$str]['zfattr'][$oneAttr[0]]+=$oneAttr[1];
                            }
                        }
                    }
                }
            }
            else if($i==5){
                $fabao=$faboObj->getFaboObj($npc[$str]);//array('id'=>4,'user_id'=>3,'equip_id'=>110,'hp'=>5,'phy_attr'=>6,'mag_att'=>3,'mag_def'=>4);
                $eq=$equipAll[$fabao['equip_id']];
                $fabaoLevel=$faboObj->getFabaoLevel($fabao,$eq);
                $oneFabo = array('eid' => $npc[$str], 'name' => $eq['name'], 'level' => $fabaoLevel, 'img' => $eq['img'],'t'=>'fb','type'=>$eq['type'],'takeL'=>$eq['take_level']);
                $oneFabo['onid'] = $nid; 
                $faboObj->setFabaoAttribute($fabao, $eq, $oneFabo);
                $data['fb'][$str]=$oneFabo;
            }
            else if($i>=6){
                $eobj=$eobj = $equipObj->getEquipObjInfo($npc[$str]); //array('up_level'=>80);//
                $eq = $equipAll[$eobj['equip_id']]; 
                $data['jq'][$str] = array('eid' => $npc[$str], 'name' => $eq['name'], 'level' => $eobj['up_level'], 'img' => $eq['img'], 't' => 'jq', 'takeL' => $eq['take_level'],'type'=>$eq['type']);
                $data['jq'][$str]['onid'] = $nid; 
             
                Common::setAttributeValue($data['jq'][$str], $eq, array('level' => $eobj['up_level']));
            }
        }
    }
}
?>

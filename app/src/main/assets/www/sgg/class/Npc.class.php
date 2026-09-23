<?php


include_once dirname(__FILE__) . '/../Lib.php';

class Npc {
    const C_USER_SOUL = 'c_user_soul';
    const S_NPC = 's_npc';

  
    function selectNpc() {
        $mc = Mc::singleton();
        $data = $mc->get("s_npc");
        if (!$data) {
            $db = new DB();         
			$sql = "select * from s_npc";
            $data = $db->get_all($sql);
            $mc->mset('s_npc', $data);      
			}
        return $data;
    }


    function getTargetNpc($npc_id) {
        $npcAll = $this->selectNpc();
        return $npcAll[$npc_id];
    }

    function getUserNpcList($uid) {
        $mc = Mc::singleton();
        $data = $mc->get('c_npc' . $uid);
        if (!$data) {
            $db = new DB();  
			$sql = "select * from c_npc where user_id='$uid'";//order by level desc
            $data = $db->get_all($sql);
            $mc->mset('c_npc' . $uid, $data);
        }
        return $data;
    }


    function selectSysNpcObj() {
        $mc = Mc::singleton();
        $data = $mc->get('s_npc_sys');
        if (!$data) {
            $db = new DB();        
			$sql = "select * from s_npc_sys where user_id=0"; 
            $data = $db->get_all($sql);
            $mc->mset('s_npc_sys', $data);
        }
        return $data;
    }


    function getNpcObj($obj_id, $sys = '') {
        if ($sys) {
            $table = 's_npc_sys';
        } else {
            $table = 'c_npc';
        }
        $db = new DB();    
		$sql = "select * from $table where id='$obj_id'";
        $data = $db->get_one($sql);
        return $data;
    }


	function getNpcBaseData($obj_id, $sys = '') {
		//echo "-----".$obj_id;
        $obj = $this->getNpcObj($obj_id, $sys);
        $npc = $this->getTargetNpc($obj['npc_id']);
		
        $data['name'] = $npc['name'];
		$data['class'] = $npc['class'];
        $data['type'] = $npc['type'];
        $data['level'] = $obj['level'];
        $data['exp'] = $obj['exp'];
        $data['expUp'] = $this->getNpcExpUp($obj['level']);
        $data['skill_id'] = $npc['skill_id'];
        $data['img'] = $npc['img_large'];
        $data['img_small'] = $npc['img_small'];
        //$data['power'] = $this->getNpcPower(); 
		//var_dump ($data);
        return $data;
    }

 
	function getNpcSelfData($obj,$npc=NULL) {
        $level = $obj['level'];
        if(!$npc){
            $npc = $this->getTargetNpc($obj['npc_id']);
        }
        $array = array('level' => $obj['level'], 'class' => $npc['class']);
            
		$data['strength'] = Utils::formulaValue($npc['strength'], $array);         
		$data['intelligence'] = Utils::formulaValue($npc['intelligence'], $array);     
     
		// if($obj['str_inte']){
            // $addValue=explode(',', $obj['str_inte']);
            // if($addValue[0]>0){
                // $data['strength']+=$addValue[0];
            // }
            // if(count($addValue)>1&&$addValue[1]>0){
                // $data['intelligence']+=$addValue[1];
            // }
        // }
         
		$data['hp'] = Utils::formulaValue($npc['hp'], $array); 
        $data['hp_max'] = $data['hp'];
        $data['phy_att'] = Utils::formulaValue($npc['phy_att'], $array); 
        $data['phy_def'] = Utils::formulaValue($npc['phy_def'], $array); 
        $data['mag_att'] = Utils::formulaValue($npc['mag_att'], $array); 
        $data['mag_def'] = Utils::formulaValue($npc['mag_def'], $array); 
       
		$data['speed'] = Utils::formulaValue($npc['speed'], $array); 
        $data['crit'] = Utils::formulaValue($npc['crit'], $array); 
        $data['crit_def'] = Utils::formulaValue($npc['crit_def'], $array); 
        $data['hit'] = Utils::formulaValue($npc['hit'], $array); 
        $data['miss'] = Utils::formulaValue($npc['miss'], $array); 
        $data['fury'] = Utils::formulaValue($npc['fury'], $array); 
           
		$c_attr = json_decode($obj['bringup_attr'],true);
		$user = new User();
		$userInfo = $user->selectUser($obj['user_id']);
		if($c_attr['level']){
			$c_class = $npc['class'];  		
			$c_can = $npc['can'];
			$all_npc = $this->selectNpcByCan($c_can);
			foreach ($all_npc as $key => $value) {
				if($value['class']==$c_class){
					$s_attr = json_decode($npc['bring_up'],true);
					if($s_attr['attr']){
						if($c_attr['level']<7){
							foreach ($s_attr['attr'] as $key => $value) {
								if((int)$key<$c_attr['level']){
									$data[$value['eff']]+=$value['val'];
								}
							}
						}else{
							if($s_attr['attr']['7']&&$s_attr['attr']['7']>$userInfo['exp']){
								foreach ($s_attr['attr'] as $key => $value) {
									$data[$value['eff']]+=$value['val'];
								}
							}else{
								foreach ($s_attr['attr'] as $key => $value) {
									if((int)$key<$c_attr['level']){
										$data[$value['eff']]+=$value['val'];
									}
								}
							}
						}
					}
				}else if($value['class']<$c_class){
					$s_attr = json_decode($value['bring_up'],true);
					foreach ($s_attr['attr'] as $key => $value) {
						$data[$value['eff']]+=$value['val'];
					}
				}
			}
		}
        return $data;
    }

	function getNpcEquipData($obj, $sys = '') {
        $equipObj = new Equip();
        $fabaoObj = new Fabao();
        $propObj = new Prop();
		if($obj){
	        foreach ($obj as $k => $v) {
	            if (strstr($k, 'part')) {               
				if ($v > 0) {                    
				if ($k == 'part_5') {
	                        $eqobj = $fabaoObj->getFaboObj($v);
	                                             
							$data['strength'] += Utils::formulaValue($eq['strength'], array("level"=>$eqobj['strength'])); 	    
							$data['intelligence'] += Utils::formulaValue($eq['intelligence'], array("level"=> $eqobj['intelligence'])); 	                        
							$data['hp'] += Utils::formulaValue($eq['hp'], array("level"=> $eqobj['hp'])); 
	                        $data['phy_att'] += Utils::formulaValue($eq['phy_att'], array("level"=> $eqobj['phy_att'])); 
	                        $data['phy_def'] += Utils::formulaValue($eq['phy_def'], array("level"=> $eqobj['phy_def'])); 
	                        $data['mag_att'] += Utils::formulaValue($eq['mag_att'], array("level"=> $eqobj['mag_att'])); 
	                        $data['mag_def'] += Utils::formulaValue($eq['mag_def'], array("level"=> $eqobj['mag_def'])); 
	                                     
							$data['speed'] += Utils::formulaValue($eq['speed'], array("level"=> $eqobj['speed'])); 
	                        $data['crit'] += Utils::formulaValue($eq['crit'], array("level"=> $eqobj['crit'])); 
	                        $data['crit_def'] += Utils::formulaValue($eq['crit_def'], array("level"=> $eqobj['crit_def'])); 
	                        $data['hit'] += Utils::formulaValue($eq['hit'], array("level"=> $eqobj['hit'])); 
	                        $data['miss'] += Utils::formulaValue($eq['miss'], array("level"=> $eqobj['miss'])); 
	                        $data['fury'] += Utils::formulaValue($eq['fury'], array("level"=> $eqobj['fury'])); 
	                    } else {
	                        $eqobj = $equipObj->getEquipObjInfo($v, $sys);
	                        $eq = $equipObj->getTargetEquip($eqobj['equip_id']);
	                                           
							$data['strength'] += Utils::formulaValue($eq['strength'], array("level"=> $eqobj['up_level'])); 
							$data['intelligence'] += Utils::formulaValue($eq['intelligence'], array("level"=> $eqobj['up_level'])); 	                        
							$data['hp'] += Utils::formulaValue($eq['hp'], array("level"=> $eqobj['up_level'])); 
	                        $data['phy_att'] += Utils::formulaValue($eq['phy_att'], array("level"=> $eqobj['up_level'])); 
	                        $data['phy_def'] += Utils::formulaValue($eq['phy_def'], array("level"=> $eqobj['up_level']));
	                        $data['mag_att'] += Utils::formulaValue($eq['mag_att'], array("level"=> $eqobj['up_level'])); 
	                        $data['mag_def'] += Utils::formulaValue($eq['mag_def'], array("level"=> $eqobj['up_level'])); 
	                                              
							$data['speed'] += Utils::formulaValue($eq['speed'], array("level"=> $eqobj['up_level']));
	                        $data['crit'] += Utils::formulaValue($eq['crit'], array("level"=> $eqobj['up_level'])); 
	                        $data['crit_def'] += Utils::formulaValue($eq['crit_def'], array("level"=> $eqobj['up_level'])); 
	                        $data['hit'] += Utils::formulaValue($eq['hit'], array("level"=> $eqobj['up_level'])); 
	                        $data['miss'] += Utils::formulaValue($eq['miss'], array("level"=> $eqobj['up_level'])); 
	                        $data['fury'] += Utils::formulaValue($eq['fury'], array("level"=> $eqobj['up_level'])); 
	                                          
							if ($sys == '') {
	                            if ($eqobj["hole_1"] > 0) {                               
								$pobj = $propObj->getPropObjInfo($eqobj['hole_1']);
	                                $prop = $propObj->getTargetProp($pobj['prop_id']);
	                                if ($prop["attribute"]) {
	                                    $atrribute = explode(':', $prop["attribute"]);
	                                    $data[$atrribute[0]]+=$atrribute[1];
	                                }
	                            }
	                            if ($eqobj["hole_2"] > 0) {                                
								$pobj = $propObj->getPropObjInfo($eqobj['hole_2']);
	                                $prop = $propObj->getTargetProp($pobj['prop_id']);
	                                if ($prop["attribute"]) {
	                                    $atrribute = explode(':', $prop["attribute"]);
	                                    $data[$atrribute[0]]+=$atrribute[1];
	                                }
	                            }
	                            if ($eqobj["hole_3"] > 0) {	                                
								$pobj = $propObj->getPropObjInfo($eqobj['hole_3']);
	                                $prop = $propObj->getTargetProp($pobj['prop_id']);
	                                if ($prop["attribute"]) {
	                                    $atrribute = explode(':', $prop["attribute"]);
	                                    $data[$atrribute[0]]+=$atrribute[1];
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	        }
        }
        return $data;
    }

	function getNpcEquipData2($npc,$equipAll,$userAllEquip,$propAll,$userAllProp,$userAllFabao,$sys=''){
        foreach ($npc as $k => $v) {
            if (strstr($k, 'part')) {         
			if ($v > 0) {                  
			if ($k == 'part_5') {
                        $eqobj = $userAllFabao[$v];   
						$eq=$equipAll[$eqobj['equip_id']];
                                           
						$data['strength'] += Utils::formulaValue($eq['strength'], array("level"=>$eqobj['strength'])); 
						$data['intelligence'] += Utils::formulaValue($eq['intelligence'], array("level"=> $eqobj['intelligence']));                       
						$data['hp'] += Utils::formulaValue($eq['hp'], array("level"=> $eqobj['hp']));
                        $data['phy_att'] += Utils::formulaValue($eq['phy_att'], array("level"=> $eqobj['phy_att'])); 
                        $data['phy_def'] += Utils::formulaValue($eq['phy_def'], array("level"=> $eqobj['phy_def'])); 
                        $data['mag_att'] += Utils::formulaValue($eq['mag_att'], array("level"=> $eqobj['mag_att']));
                        $data['mag_def'] += Utils::formulaValue($eq['mag_def'], array("level"=> $eqobj['mag_def']));
                                          
						$data['speed'] += Utils::formulaValue($eq['speed'], array("level"=> $eqobj['speed'])); 
                        $data['crit'] += Utils::formulaValue($eq['crit'], array("level"=> $eqobj['crit'])); 
                        $data['crit_def'] += Utils::formulaValue($eq['crit_def'], array("level"=> $eqobj['crit_def'])); 
                        $data['hit'] += Utils::formulaValue($eq['hit'], array("level"=> $eqobj['hit'])); 
                        $data['miss'] += Utils::formulaValue($eq['miss'], array("level"=> $eqobj['miss'])); 
                        $data['fury'] += Utils::formulaValue($eq['fury'], array("level"=> $eqobj['fury'])); 
                    } else {
                        if($sys){                           
						$eqobj = $equipObj->getEquipObjInfo($v, $sys);
                        }
                        else{
                            $eqobj = $userAllEquip[$v];
                        }
                        $eq = $equipAll[$eqobj['equip_id']];
                                           
						$data['strength'] += Utils::formulaValue($eq['strength'], array("level"=> $eqobj['up_level']));         
						$data['intelligence'] += Utils::formulaValue($eq['intelligence'], array("level"=> $eqobj['up_level']));                         
						$data['hp'] += Utils::formulaValue($eq['hp'], array("level"=> $eqobj['up_level']));  
                        $data['phy_att'] += Utils::formulaValue($eq['phy_att'], array("level"=> $eqobj['up_level']));  
                        $data['phy_def'] += Utils::formulaValue($eq['phy_def'], array("level"=> $eqobj['up_level']));  
                        $data['mag_att'] += Utils::formulaValue($eq['mag_att'], array("level"=> $eqobj['up_level']));  
                        $data['mag_def'] += Utils::formulaValue($eq['mag_def'], array("level"=> $eqobj['up_level']));  
                                         
						$data['speed'] += Utils::formulaValue($eq['speed'], array("level"=> $eqobj['up_level']));  
                        $data['crit'] += Utils::formulaValue($eq['crit'], array("level"=> $eqobj['up_level']));  
                        $data['crit_def'] += Utils::formulaValue($eq['crit_def'], array("level"=> $eqobj['up_level'])); 
                        $data['hit'] += Utils::formulaValue($eq['hit'], array("level"=> $eqobj['up_level']));  
                        $data['miss'] += Utils::formulaValue($eq['miss'], array("level"=> $eqobj['up_level']));  
                        $data['fury'] += Utils::formulaValue($eq['fury'], array("level"=> $eqobj['up_level'])); 
                         //if ($sys == '') {
                            if ($eqobj["hole_1"] > 0) {                               
							if($sys){
                                    $prop=$propAll[$eqobj['hole_1']];
                                }
                                else{
                                    $pobj = $userAllProp[$eqobj['hole_1']];
                                    $prop=$propAll[$pobj['prop_id']];
                                }
                                if ($prop["attribute"]) {
                                    $atrribute = explode(':', $prop["attribute"]);
                                    $data[$atrribute[0]]+=$atrribute[1];
                                }
                            }
                            if ($eqobj["hole_2"] > 0) {                           
							if($sys){
                                    $prop=$propAll[$eqobj['hole_2']];
                                }
                                else{
                                    $pobj = $userAllProp[$eqobj['hole_2']];
                                    $prop=$propAll[$pobj['prop_id']];
                                }
                                if ($prop["attribute"]) {
                                    $atrribute = explode(':', $prop["attribute"]);
                                    $data[$atrribute[0]]+=$atrribute[1];
                                }
                            }
                            if ($eqobj["hole_3"] > 0) {                             
							if($sys){
                                    $prop=$propAll[$eqobj['hole_3']];
                                }
                                else{
                                    $pobj = $userAllProp[$eqobj['hole_3']];
                                    $prop=$propAll[$pobj['prop_id']];
                                }
                                if ($prop["attribute"]) {
                                    $atrribute = explode(':', $prop["attribute"]);
                                    $data[$atrribute[0]]+=$atrribute[1];
                                }
                            }
                        //}
                    }
                }
            }
        }
        return $data;
    }


	function getNpcBattleValue($obj_id, $sys = '') {
      
        $obj = $this->getNpcObj($obj_id, $sys);
        $data = $this->getNpcSelfData($obj);
     
		$data2 = $this->getNpcEquipData($obj,$sys);   
		if ($data2) {
            foreach ($data as $key => $value) {
                if ($data2[$key]) {
                    $data[$key] += $data2[$key];
                }
            }
        }
        $data['power'] = $this->getNpcPower($obj,$data2); 
        $data['hp_max'] = $data['hp'];
        return $data;
    }


    function getNpcExpUp($level) {
        if ($level < 90) {
            return round((pow($level, 4.3) / 1000 + $level) * 240); 
        } else {
            return round((pow($level, 4.45) / 1000 + $level) * 240); 
        }
    }


    function getNpcPower($npc,$data=NULL) {
        if(!$data){
            $data=$this->getNpcSelfData($npc);
            $equipData=$this->getNpcEquipData($npc);
            if ($equipData) {
                foreach ($data as $key => $value) {
                    if ($equipData[$key]) {
                        $data[$key] += $equipData[$key];
                    }
                }
            }
        }
        $npcTart=$this->getTargetNpc($npc['npc_id']);
        if($npcTart['type']==1){

            return floor((($data['phy_att'] + $data['phy_def']/2)*(1000+$data['strenth']) + $data['mag_def']/2*(1000+$data['intelligence']))/10000 + $data['hp']/100+($data['hit']+$data['miss']+$data['crit']+$data['crit_def'])/10);
        }
        else if($npcTart['type']==2){
            return floor((($data['mag_att'] + $data['mag_def']/2)*(1000+$data['strenth']) + $data['phy_def']/2*(1000+$data['intelligence']))/10000 + $data['hp']/100+($data['hit']+$data['miss']+$data['crit']+$data['crit_def'])/10);
        }
    }


    function replaceNpcEquip($uid, $npcObj, $equip_obj_id, $part) {
        $db = new DB();
        //$npcObj=$this->getNpcObj($npc_obj_id);
        $source_equip_obj_id = $npcObj[$part]; 
        $db->update("c_npc", array($part => $equip_obj_id), "id=" . $npcObj["id"]);
        $npcObj[$part] = $equip_obj_id;
        $db->update("c_equip", array("status" => 1), "id=$equip_obj_id");      
		if ($source_equip_obj_id)
            $db->update("c_equip", array("status" => 0), "id=$source_equip_obj_id"); 
            

        $mc = Mc::singleton();
        $userNpc = $mc->get("c_npc" . $uid);
        if ($userNpc) {
            $userNpc[$npcObj["id"]][$part] = $equip_obj_id;
            $mc->set("c_npc" . $uid, $userNpc);
        }

        $userEquip = $mc->get("c_equip" . $uid);
        if ($userEquip) {
            $userEquip[$equip_obj_id]["status"] = 1;
            if ($source_equip_obj_id) {
                $userEquip[$source_equip_obj_id]["status"] = 0;
            }
            $mc->set("c_equip" . $uid, $userEquip);
        }

        $equipObj = new Equip();
        $equipObj->deleteSortEquipFromMC($uid);
        $equipObj->deleteSortJQFromMC($uid);
    }


    function untakeNpcEquip($uid, $npc, $part) {
        $db = new DB();
        //$npcObj=$this->getNpcObj($nid);
        $source_equip_obj_id = $npc[$part]; 

        if ($source_equip_obj_id > 0) {
            $db->update("c_npc", array($part => 0), "id=" . $npc["id"]);
            $npc[$part] = 0;
            $db->update("c_equip", array("status" => 0), "id=$source_equip_obj_id"); 
         
            $mc = Mc::singleton();
            $userNpc = $mc->get("c_npc" . $uid);
            if ($userNpc) {
                $userNpc[$npc["id"]][$part] = 0;
                $mc->set("c_npc" . $uid, $userNpc);
            }
          
            $userEquip = $mc->get("c_equip" . $uid);
            if ($userEquip) {
                $userEquip[$source_equip_obj_id]["status"] = 0;
                $mc->set("c_equip" . $uid, $userEquip);
            }

          
            $equipObj = new Equip();
            $equipObj->deleteSortEquipFromMC($uid);
            $equipObj->deleteSortJQFromMC($uid);
        }
    }


	function updateNpcTrain($uid,$nid, $content) {
        $db = new DB();
        $data['train_time'] = $content;
        $db->update("c_npc", $data, "id=$nid");
		$mc = Mc::singleton();
		$mc->delete('c_npc' . $uid);
    }


    function updateNpcId($nid, $npcId) {
        $db = new DB();
        $data['npc_id'] = $npcId;
        $db->update("c_npc", $data, "id=$nid");
    }


    function setTemp($uid, $nid, $context) {
        $db = new DB();
        if ($context == null) {         
		$data['temp'] = 0;
            $db->update("c_npc", array("temp" => 0), "id=$nid");
        } else { 
        	$data['temp'] = $context;
            $db->update("c_npc", array("temp" => $context), "id=$nid"); 
        }
        $usernpc = $this->getUserNpcList($uid);
        $usernpc[$nid]['temp'] = $data['temp'];
        $mc = Mc::singleton();
        $mc->set('c_npc' . $uid, $usernpc);
    }


    function addNpcExp($userNpc, $exp, $npcObjId,$updateDatabase=TRUE) {
        $newExp = $exp;
       
        $levelExp = $this->getNpcExpUp($userNpc[$npcObjId]['level']); 
        while($newExp>=$levelExp-$userNpc[$npcObjId]["exp"]){        
		$newExp -= ($levelExp-$userNpc[$npcObjId]["exp"]);           
		$userNpc[$npcObjId]['level']+=1;
            $userNpc[$npcObjId]['exp']=0;
            $newLevel=$userNpc[$npcObjId]['level'];
            $levelExp = $this->getNpcExpUp($userNpc[$npcObjId]['level']); 
        }
        if($newExp>0){
            $userNpc[$npcObjId]['exp']+=$newExp;
        }
        if($updateDatabase){
            $db = new DB();           
			$table = 'c_npc';
            $condition = " id=" . $npcObjId;
            $db->update($table, array('exp'=>$userNpc[$npcObjId]['exp'],'level'=>$userNpc[$npcObjId]['level']), $condition);

           
            $mc = Mc::singleton();
            $mc->mset('c_npc' . $userNpc[$npcObjId]["user_id"], $userNpc);
        }

        if ($newLevel) {
            return $newLevel;
        }
    }

    function updateNpcObj($uid,$npc_obj_id,$dataArray,$userNpc){
        $db=new DB();
        $db->update('c_npc',$dataArray,'id='.$npc_obj_id);


        $mc = Mc::singleton();
        $mc->mset('c_npc' . $uid, $userNpc);
    }


    function addUserNpc($uid, $npc) {
        $db = new DB(); 
		$db->insert("c_npc", $npc);
        $newID = $db->insert_id();
        $npc["id"] = $newID;


        $mc = Mc::singleton();
        $userNpc = $mc->get("c_npc" . $uid);
        if ($userNpc) {
            $userNpc[$newID] = $npc;
            $mc->set("c_npc" . $uid, $userNpc);
        }
        return $newID;
    }


	function selectSpub() {
        $mc = Mc::singleton();
        $data = $mc->get("s_pub");
        if (!$data) {
            $db = new DB();         
			$sql = "select * from s_pub";
            $data = $db->get_all($sql);
            $mc->mset('s_pub', $data);     
			}
        return $data;
    }


	function getNpcSkill($skillId) {
        $mc = Mc::singleton();
        $data = $mc->get("s_skill");
        if (!$data) {
            $db = new DB();      
			$sql = "select * from s_skill";
            $data = $db->get_all($sql);
            $mc->mset('s_skill', $data);    
			}
        return $data[$skillId];
    }
    


	function getWujiangDemoArray() {
        $a = array('1' => array('name' => "刘禅", 'img' => "liuchan.gif", 'img_small' => "liuchanh.jpg"),
            '2' => array('name' => "夏侯惇", 'img' => "xiahoudun.gif", 'img_small' => "xiahoudunh.jpg"),
            '3' => array('name' => "刘备", 'img' => "liubei.gif", 'img_small' => "liubeih.jpg"),
            '4' => array('name' => "华佗", 'img' => "huatuo.gif", 'img_small' => "huatuoh.jpg"),
            '5' => array('name' => "黄盖", 'img' => "huanggai.gif", 'img_small' => "huanggaih.jpg"),
            '6' => array('name' => "诸葛亮?", 'img' => "zhugeliang.gif", 'img_small' => "zhugeliangh.jpg"),
            '7' => array('name' => "曹操", 'img' => "caocao.gif", 'img_small' => "caocaoh.jpg"),
            '8' => array('name' => "司马懿?", 'img' => "simayi.gif", 'img_small' => "simayih.jpg"),
            '9' => array('name' => "关羽", 'img' => "guanyu.gif", 'img_small' => "guanyuh.jpg"),
            '10' => array('name' => "马超", 'img' => "machao.gif", 'img_small' => "machaoh.jpg"),
            '11' => array('name' => "周瑜", 'img' => "zhouyu.gif", 'img_small' => "zhouyuh.jpg"),
            '12' => array('name' => "赵云", 'img' => "zhaoyun.gif", 'img_small' => "zhaoyunh.jpg"),
            '13' => array('name' => "孙权", 'img' => "sunquan.gif", 'img_small' => "sunquanh.jpg"),
            '14' => array('name' => "吕布", 'img' => "lvbu.gif", 'img_small' => "lvbuh.jpg"),
            '15' => array('name' => "许褚", 'img' => "xuchu.gif", 'img_small' => "xuchuh.jpg"),
            '16' => array('name' => "张飞", 'img' => "zhangfei.gif", 'img_small' => "zhangfeih.jpg"),
            '17' => array('name' => "黄忠", 'img' => "huangzhong.gif", 'img_small' => "huangzhongh.jpg"),
            '18' => array('name' => "郭嘉", 'img' => "guojia.gif", 'img_small' => "guojiah.jpg"),
        );
        return $a;
    }

	public function getWJType($npc_id){
		$db = new DB();
		$sql = "select * from s_npc where id=$npc_id";
		$data = $db->get_all($sql);
		//var_dump($data);
		return $data[$npc_id]['type'];
	}

    public function getUserSoul ($user_id) {
        $db = new DB();       
		$sql = "select * from ".self::C_USER_SOUL." where user_id='$user_id'";
        $data = $db->get_one($sql);
        return $data;
    }
  
    public function updateUserSoul ($user_id, $array) {
        $db = new DB();   
		$db->update(self::C_USER_SOUL, $array, 'user_id=' . $user_id);
    }
    
   
    public function selectNpcByCan ($can_id) {
        $db = new DB();   
		$sql = "select * from ".self::S_NPC." where can='$can_id' order by class";
        $data = $db->get_all($sql);
        return $data;
    }
}

?>

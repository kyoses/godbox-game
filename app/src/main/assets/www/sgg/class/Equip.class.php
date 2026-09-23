<?php

include_once dirname(__FILE__).'/../Lib.php';
class Equip{
    function selectEquip(){
        $mc = Mc::singleton();
        $data = $mc->get("s_equip");
        if(!$data){
            $db = new DB();     
			$sql = "select * from s_equip";
            $data = $db->get_all($sql);
            $mc->mset('s_equip',$data);   
			}
        return $data;
    }
    function getTargetEquip($equip_id){
        $equipAll = $this->selectEquip();
        return $equipAll[$equip_id];
    }
    function getEquipObjInfo($obj_id,$sys=''){
        if($sys){
            $table = 's_equip_sys';
        }
        else{
            $table = 'c_equip';
        }
        $db = new DB();     
		$sql = "select * from $table where id=$obj_id";
        $equip_obj = $db->get_one($sql);
        if($equip_obj){
            return $equip_obj;
        }
    }
	function hechengEquip($uid,$equip_obj_id,$hc_equip_id){
		$db = new DB();      
		$db->update("c_equip", array('equip_id'=>$hc_equip_id), "id=".$equip_obj_id);
		$equip = $this->getUserAllEquip($uid);
        foreach($equip as $k=>$v){
            if($k == $equip_obj_id){
                $equip[$k]['equip_id'] = $hc_equip_id;
                break;
            }
        }
        $mc = Mc::singleton();
        $mc->mset('c_equip'.$uid,$equip);
        $this->deleteSortEquipFromMC($uid);
        $this->deleteSortJQFromMC($uid);
    }

    function getEquipReplace($uid,$npc_obj_id){
        $npc=new Npc();
        $userNpcObj=$npc->getNpcObj($npc_obj_id);      
		$npcLevel=$userNpcObj["level"];
        $templateNpcObj=$npc->getTargetNpc($userNpcObj["npc_id"]);  
		$npc_physic_magic=$templateNpcObj["type"];

     
        $mc = Mc::singleton();
        $uEquip=$mc->get("c_equip".$uid);
        if(!$uEquip){
            $db = new DB();            
			$sql = "select * from c_equip where user_id=".$uid;
            $uEquip = $db->get_all($sql);
            $mc->mset('c_equip'.$uid,$uEquip);
        }
        ////
        $equipAll = $this->selectEquip();
        foreach($uEquip as $k => $v){
            $targetEquip=$equipAll[$v['equip_id']];
            $type=$targetEquip['type'];
            if($type>4||$npcLevel<$targetEquip["take_level"] || $v['status']==1){
                unset($uEquip[$k]);
            }
            else if($type==1){             
			if($targetEquip['physic_magic']!=0)                  
			{
                        if($npc_physic_magic!=$targetEquip['physic_magic'])
                            unset($uEquip[$k]);
                    }
            }
        }
            
        if(count($uEquip) > 0){
            return $uEquip;
        }
    }

    
	function getUserBagEquip($user_id){
        $mc = Mc::singleton();
        $query = $mc->get('c_equip'.$user_id);
        if(!$query){
            $db = new DB();           
			$sql = "select * from c_equip where user_id=".$user_id;
            $query = $db->get_all($sql);
            $mc->mset('c_equip'.$user_id,$query);
        }
        $equipAll = $this->selectEquip();
        foreach($query as $row) {
            if($row['status'] != 1){
                $equip = $equipAll[$row['equip_id']];
               if(!empty($equip)){
	                foreach($equip as $key=>$value){
	                    if($key != 'id'){
	                        $row[$key] = $value;
	                    }
	                }
               }
                $data[$row['id']]=$row;
            }
        }
        if(count($data) > 0){
            return $data;
        }
    }
    
    function getUserAllEquip($user_id){
        $mc = Mc::singleton();
        $query = $mc->get('c_equip'.$user_id);
        if(!$query){
            $db = new DB();       
			$sql = "select * from c_equip where user_id=".$user_id;
            $query = $db->get_all($sql);
            $mc->mset('c_equip'.$user_id,$query);
        }
        $equipAll = $this->selectEquip();

        foreach($query as $row) {
            $equip = $equipAll[$row['equip_id']];
            foreach($equip as $key=>$value){
                if($key != 'id'){
                    $row[$key] = $value;
                }
            }
            $data[$row['id']]=$row;
        }
        if(count($data) > 0){
            return $data;
        }
    }
 
	function getUserAllEquipNoAttr($user_id){
        $mc = Mc::singleton();
        $query = $mc->get('c_equip'.$user_id);
        if(!$query){
            $db = new DB();          
			$sql = "select * from c_equip where user_id=".$user_id;
            $query = $db->get_all($sql);
            $mc->mset('c_equip'.$user_id,$query);
        }
        return $query;
    }

    function sellEquip($user_id,$equip_obj_id)
    {
      
        $db = new DB();
        $db->delete("c_equip", "id=".$equip_obj_id);

        $mc = Mc::singleton();
        $data=$mc->get("c_equip".$user_id);
        if($data){
            unset($data[$equip_obj_id]);
            $mc->mset("c_equip".$user_id,$data);
        }

        $this->deleteSortEquipFromMC($user_id);
        $this->deleteSortJQFromMC($user_id);
    }
	function selectEquipSynthesis(){
        $mc = Mc::singleton();
        $data = $mc->get("s_equip_synthesis");
        if(!$data){
            $db = new DB();
            $sql = "select * from s_equip_synthesis";
            $query = $db->query($sql);
            while($row = $db->fetch_array($query)) {
                $data[$row['source_id']][$row['id']] = $row;
            }
            $mc->mset('s_equip_synthesis',$data);     
			}
        return $data;
    }

    function selectEquipSynthesisPF(){
        $mc = Mc::singleton();
        $data = $mc->get("s_equip_synthesisPF");
        if(!$data){
            $db = new DB();
            $sql = "select * from s_equip_synthesis";
            $query = $db->query($sql);
            while($row = $db->fetch_array($query)) {
                $data[$row['propid']][$row['id']] = $row;
            }
            $mc->mset('s_equip_synthesisPF',$data);      
			}
        return $data;
    }

    function addUserEquip($uid,$equip){
        $equip["id"]=NULL;
        $db=new DB();    
		$equip["user_id"]=$uid;
        $db->insert("c_equip", $equip);
        $newID=$db->insert_id();
 
        $mc = Mc::singleton();
        $userEquip=$mc->get("c_equip".$uid);
        if($userEquip){
            $equipTarget=$this->getEquipObjInfo($newID);
            $userEquip[$newID]=$equipTarget;
            $mc->set("c_equip".$uid,$userEquip);
        }
        
   
        $this->deleteSortEquipFromMC($uid);
        $this->deleteSortJQFromMC($uid);
        
        return $newID;
    }

	function takeFuzhou($uid,$eobj,$hole){
        $db=new DB();     
		$db->update("c_equip", array($hole=>$eobj[$hole]),"id=".$eobj["id"]);
    
        $mc=Mc::singleton();
        $userEquip=$mc->get("c_equip".$uid);
        if($userEquip){
            $userEquip[$eobj["id"]][$hole]=$eobj[$hole];
            $mc->set("c_equip".$uid,$userEquip);
        }

 
        $this->deleteSortEquipFromMC($uid);
        $this->deleteSortJQFromMC($uid);
    }

    function getUserBagSortEquip($uid){
        $mc=Mc::singleton();
        $data=$mc->get("c_equipSort".$uid);
        if(count($data)>0)
            return $data;
    }

    function setUserBagSortEquip($uid,$data){
        $mc=Mc::singleton();
        $mc->set("c_equipSort".$uid,$data);
    }

    function deleteSortEquipFromMC($uid){
        $mc=Mc::singleton();
        $mc->delete("c_equipSort".$uid);
    }

    function getUserBagSortJQ($uid){
        $mc=Mc::singleton();
        $data=$mc->get("c_equipJQSort".$uid);
        if(count($data)>0)
            return $data;
    }

    function setUserBagSortJQ($uid,$data){
        $mc=Mc::singleton();
        $mc->set("c_equipJQSort".$uid,$data);
    }

    function deleteSortJQFromMC($uid){
        $mc=Mc::singleton();
        $mc->delete("c_equipJQSort".$uid);
    }

	function findOwnerOfEquip($uid,$equipId){
		$npcObj = new Npc();
		$userNpc = $npcObj->getUserNpcList($uid);
		$npcId = 0; 	
		foreach ($userNpc as $key => $value) {
			if($value['part_1']==$equipId||$value['part_2']==$equipId||$value['part_3']==$equipId||$value['part_4']==$equipId){
				$npcId = $key;
				break;
			}
		}
		return $npcId;
	}

	function getEquipAttr($info,$level){
		if($info['hp']){
			$att['hp'] = round(Utils::formulaValue($info['hp'], array('level'=>$level)));
		}
		if($info['phy_att']){
			$att['phy_att'] = round(Utils::formulaValue($info['phy_att'], array('level'=>$level)));
		}
		if($info['phy_def']){
			$att['phy_def'] = round(Utils::formulaValue($info['phy_def'], array('level'=>$level)));
		}
		if($info['mag_att']){
			$att['mag_att'] = round(Utils::formulaValue($info['mag_att'], array('level'=>$level)));
		}
		if($info['mag_def']){
			$att['mag_def'] = round(Utils::formulaValue($info['mag_def'], array('level'=>$level)));
		}
		if($info['hit']){
			$att['hit'] = round(Utils::formulaValue($info['hit'], array('level'=>$level)));
		}
		if($info['miss']){
			$att['miss'] = round(Utils::formulaValue($info['miss'], array('level'=>$level)));
		}
		if($info['crit']){
			$att['crit'] = round(Utils::formulaValue($info['crit'], array('level'=>$level)));
		}
		if($info['crit_def']){
			$att['crit_def'] = round(Utils::formulaValue($info['crit_def'], array('level'=>$level)));
		}
		if($info['strength']){
			$att['strength'] = round(Utils::formulaValue($info['strength'], array('level'=>$level)));
		}
		if($info['intelligence']){
			$att['intelligence'] = round(Utils::formulaValue($info['intelligence'], array('level'=>$level)));
		}
		if($info['speed']){
			$att['speed'] = round(Utils::formulaValue($info['speed'], array('level'=>$level)));
		}
		return $att;
	}
}
?>

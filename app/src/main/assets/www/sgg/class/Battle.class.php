<?php

include_once dirname(__FILE__).'/../Lib.php';
class Battle{
    const S_BATTLE = 's_battle';
  
    function formationArrayToString($arr){
        foreach($arr as $v){
            $arr_temp[] = implode(',', $v); 
        }
        $str = implode('|', $arr_temp);
        return $str;
    }
    function formationStringToArray($str){
        $arr_temp = explode('|',$str);
        foreach($arr_temp as $v){
            $arr[] = explode(',', $v);
        }
        return $arr;
    }

    function insertUserBattle($array){
        $db = new DB();     
		$db->insert('c_battle', $array);
        return $db->insert_id();
    }

    function updateUserBattle($uid,$array){
        $db = new DB();
        $db->update('c_battle', $array, 'user_id='.$uid);
        $mc = Mc::singleton();
        $mc->delete('c_battle'.$uid);
    }
    
	function updateUserJBattle($uid,$array){
        $db=new DB();
        $db->update('c_battle_j', $array, 'user_id='.$uid);
        $mc = Mc::singleton();
        $data=$mc->get('c_battle_j'.$uid);
        if($data){
            foreach($array as $key => $value){
                $data[$key]=$value;
            }
            $mc->mset('c_battle_j'.$uid,$data);
        }
    }
    
	 function updateUserFBattle($uid,$array){
        $db=new DB();
        $db->update('c_battle_f', $array, 'user_id='.$uid);
        $mc = Mc::singleton();
        $data=$mc->get('c_battle_f'.$uid);
        if($data){
            foreach($array as $key => $value){
                $data[$key]=$value;
            }
            $mc->mset('c_battle_f'.$uid,$data);
        }
    }

    function selectBattle(){
        $mc = Mc::singleton();
        $data = $mc->get('s_battle');
        if(!$data){
            $db = new DB();      
			$sql = "select * from s_battle";
            $data = $db->get_all($sql);
            $mc->mset('s_battle',$data);     
			}
        return $data;
    }
   
    function selectNextBattle($type,$battle_order){
        $db=new DB();
        $sql="select * from s_battle where type=$type and battle_order=$battle_order";
        $data=$db->get_one($sql);
        return $data;
    }
 
	function selectUserBattle($uid){
		
        $mc = Mc::singleton();
		 
        $data = $mc->get('c_battle'.$uid);
		
        if(!$data){
            $db = new DB();       
			$sql = "select * from c_battle where user_id=$uid";
            $data = $db->get_one($sql);
		
            if($data){
                $mc->mset('c_battle'.$uid,$data);             
				return $data;
            }else{
            	$data = array('user_id'=>$uid,'formation'=>'0,0,0|0,0,0|0,0,0','battle_id'=>1);
				$db->insert("c_battle", $data);
				$mc->mset('c_battle'.$uid,$data);             
				return $data;
            }
        }
        else{
            return $data;
        }
    }
    
    function selectUserJYBattle($uid){
        $mc = Mc::singleton();
        $data = $mc->get('c_battle_j'.$uid);
        if(!$data){
            $db = new DB();          
			$sql = "select * from c_battle_j where user_id=$uid";
            $data = $db->get_one($sql);
            if($data){
                $mc->mset('c_battle_j'.$uid,$data);          
				}
            else{             
				$data=array('user_id'=>$uid,'last_time'=>0,'battle_id'=>701,'battle_ids'=>'');
                $db->insert('c_battle_j', $data);
                $newID=$db->insert_id();
                $data['id']=$newID;
            }
        }
        return $data;
    }
  
    function selectUserFBBattle($uid){
        $mc = Mc::singleton();
        $data = $mc->get('c_battle_f'.$uid);
        if(!$data){
            $db = new DB();          
			$sql = "select * from c_battle_f where user_id=$uid";
            $data = $db->get_one($sql);
            if($data){
                $mc->mset('c_battle_f'.$uid,$data);          
				}
            else{          
				$data=array('user_id'=>$uid,'last_time'=>0,'battle_id'=>755,'battle_ids'=>'');
                $db->insert('c_battle_f', $data);
                $newID=$db->insert_id();
                $data['id']=$newID;
            }
        }
        return $data;
    }
  
    function selectBattleTargetObj($id){
        $db = new DB();      
		$sql = "select * from s_battle where id=$id";
        $data = $db->get_one($sql);
        return $data;
    }
     
	function selectBattleDropA(){
        $mc = Mc::singleton();
        $data = $mc->get('s_dropA');
		$c_battle = $this->selectBattle();
        if(!$data){
            $db = new DB();          
			$sql = "select * from s_drop";
            $query = $db->query($sql);
            while($row = $db->fetch_array($query)) {
            	$row['level'] = $c_battle[$row['battle_id']]['level'];
                $data[$row['battle_id']][$row['status']][$row['id']]=$row;
            }
            $mc->mset('s_dropA',$data);      
			}
        return $data;
    }
  
	function selectBattleDropB(){
        $mc = Mc::singleton();
        $data = $mc->get('s_dropB');
        if(!$data){
            $db = new DB();          
			$sql = "select * from s_drop";
            $query = $db->query($sql);
			$allBattle = $this->selectBattle();
            while($row = $db->fetch_array($query)) {
            	$row['map_id'] = $allBattle[$row['battle_id']]['map_id'];
            	$row['battle_order'] = $allBattle[$row['battle_id']]['battle_order'];
				$row['battle_type'] = $allBattle[$row['battle_id']]['type'];
                $data[$row['type']][$row['value']][$row['id']]=$row;
            }
            $mc->mset('s_dropB',$data);      
			}
        return $data;
    }
	
	function selectMapDrop(){
        $mc = Mc::singleton();
        $data = $mc->get('map_drop');
        if(!$data){
            $db = new DB();          
			$sql = "select * from s_drop";
            $query = $db->query($sql);
            while($row = $db->fetch_array($query)) {
                $data[$row['map_id']][$row['id']]=$row;
            }
            $mc->mset('map_drop',$data);       
			}
        return $data;
    }

    function randomDrop($battle_id,$status,$dropAll=NULL){
        if($dropAll==NULL){
            $dropAll = $this->selectBattleDropA();
        }
        if($dropAll[$battle_id] && $dropAll[$battle_id][$status]){
            foreach ($dropAll[$battle_id][$status] as $key=>$value){
                $per = $value['per']; //* 1000;
                $rand = rand(1, 100);
                if($rand <= $per){
                    if($data[$value['type']][$value['value']]){
                        $data[$value['type']][$value['value']]['num'] += $value['num'];
                    }
                    else{
                        $data[$value['type']][$value['value']] = $value;
                    }
                }
            }
        }
        if(count($data) > 0){
            return $data;
        }
    }
   
	function randomDropFromDrop($drop){
        foreach ($drop as $key=>$value){
            $per = $value['per']; //* 1000;
            $rand = rand(1, 100);
            if($rand <= $per){
                if($data[$value['type']][$value['value']]){
                    $data[$value['type']][$value['value']]['num'] += $value['num'];
                }
                else{
                    $data[$value['type']][$value['value']] = $value;
                }
            }
        }
        if(count($data) > 0){
            return $data;
        }
    }

    function randomDropByNum($battle_id,$status,$num){
        $dropAll=$this->selectBattleDropA();
        for($i=1;$i<=$num;$i++){
            foreach ($dropAll[$battle_id][$status] as $key=>$value){
                $per = $value['per']; //* 1000;
                $rand = rand(1, 100);
                if($rand <= $per){
                    if($data[$i][$value['type']][$value['value']]){
                        $data[$i][$value['type']][$value['value']]['num'] += $value['num'];
                    }
                    else{
                        $data[$i][$value['type']][$value['value']] = $value;
                    }
                }
            }
        }
        if(count($data) > 0){
            return $data;
        }
    }
   
    function getSumNpcPower($uid){
        $uBattle=$this->selectUserBattle($uid);
        $npcArray=$this->formationStringToArray($uBattle['formation']);
        $npcObj=new Npc();
        $sumPower=0;
        foreach($npcArray as $value){
            foreach ($value as $v) {
                if($v){
                    $npc=$npcObj->getNpcObj($v);
                    $sumPower+=$npcObj->getNpcPower($npc);
                }
            }
        }
        return $sumPower;
    }

    function getBattleTitle(){
        $mc = Mc::singleton();
        $data = $mc->get('s_battleTitle');
        if(!$data){
            $db = new DB();        
			$sql = "select * from s_battletitle";
            $data = $db->get_all($sql);
            $mc->mset('s_battleTitle',$data);      
			}
        return $data;
    }

    function getUserBattleTitle($repu){
        $allAward = $this->getBattleTitle();
        foreach ($allAward as $k => $v) {
            if($repu>=$allAward[$k]['reputation']&&$repu<$allAward[$k+1]['reputation']){
                    return $v;
            }
        }
    }

    function selectBattleHelper(){
        $mc = Mc::singleton();
        $data = $mc->get("s_battle_helper");
        if (!$data) {
            $db = new DB();         
			$sql = "select * from s_battle_helper";
			 
            $query = $db->query($sql);
            while ($row = $db->fetch_array($query)) {
                $data[$row['battle_id']][$row['npc_sys_id']] = $row;
            }
            $mc->mset('s_battle_helper', $data);
			}
        return $data;
    }
 
	function getBattleHelper($battle_id){
        $helper = $this->selectBattleHelper();
        if($helper[$battle_id]){
            $npcObj = new Npc();
            $data = $helper[$battle_id];
            foreach($data as $k=>$v){
                $data[$k] = array_merge($npcObj->getNpcBaseData($k,1),$npcObj->getNpcBattleValue($k,1));          
				}
            return $data;
        }
    }

     function setHelperFormation(&$data_att,$data_helper){
        $data = array(0=>array(0=>'',1=>'',2=>''),1=>array(0=>'',1=>'',2=>''),2=>array(0=>'',1=>'',2=>''));
        foreach($data as $key=>$value){
            foreach($value as $k=>$v){
                if(!$data_att[$key][$k]){
                    $data_att[$key][$k] = array_shift($data_helper);             
				}
            }
        }
    }
   
	function vipResetNum ($vip_level) {
        return round(pow($vip_level, 2)/4);
    }
	

	function getNpcNumOfFormation($uid){
		$userBattle = $this->selectUserBattle($uid);
		$userFormation = $userBattle['formation'];
		$rows_array= explode("|", $userFormation);
		$num = 0;
		foreach ($rows_array as $key => $value) {
			$npcs = explode(",", $value);
			foreach ($npcs as $k => $v) {
				if($v!="0"){
					$num++;
				}
			}
		}
		return $num;
	}
    
 
	function updateFirstUser ($battle_id, $user_id, $arr_battles) {
        $sql = "update ".self::S_BATTLE." set first_user='$user_id' where id='$battle_id'";
        $db = new DB();        
		$query_id = $db->query($sql);
        $mc = Mc::singleton();
        $mc->mset('s_battle',$arr_battles);
    }
  
	function selectLastFloor ($battle_id) {
        $sql = "select * from ".self::S_BATTLE." where map_id='$battle_id' and type=2 order by disp_order desc limit 1";
        $db = new DB();     
		$data = $db->get_one($sql);
        if ($data['first_user']) {
            $userObj = new User();
            $user = $userObj->selectUser($data['first_user']);
            return $user['name'];
        }
        else {
            return '无数据';
        }
    }
}
?>
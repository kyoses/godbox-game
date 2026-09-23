<?php


include_once dirname(__FILE__).'/../Lib.php';
class Fabao{

    function getUserFabao($uid){
        $mc = Mc::singleton();
        $data = $mc->get('c_fabao'.$uid);
        if(!$data){
            $db = new DB();          
			$sql = "select * from c_fabao where user_id=".$uid;
            $data = $db->get_all($sql);
            $mc->mset('c_fabao'.$uid,$data);
        }
        if(count($data)>0)
            return $data;
    }
    function getUserBagFabao($uid){
        $equipObj=new Equip();
        $equipAll = $equipObj->selectEquip();
        $query=$this->getUserFabao($uid);
        if(!$query){
            return;
        }
        foreach($query as $row) {
            if($row['status'] != 1){
                $equip = $equipAll[$row['equip_id']];
                //$fabaoCost=$this->getFabaoAllCost($row,$equip["order"]);              
				$fabaoLevel=9;
                foreach($equip as $key=>$value){
                    if($key != 'id'){
                        if($row[$key]){
                            $fabaoLevel=$row[$key]<$fabaoLevel?$row[$key]:$fabaoLevel;
                            $row[$key]=Utils::formulaValue($equip[$key], array('level'=>$row[$key]));
                        }
                        else{
                            $row[$key] = $value;
                        }
                    }
                }
                //$row["price"]+=floor($fabaoCost/2);                              
				$row["flevel"]=$fabaoLevel;
                $data[$row['id']]=$row;
            }
        }
        if(count($data) > 0){
            return $data;
        }
    }

    function getFaboObj($fID){
        $db = new DB();     
		$sql = "select * from c_fabao where id=".$fID;
        $data = $db->get_one($sql);
        return $data;
    }





    function setFabaoAttribute($fabao,$fabaoTemp,&$data){
        if($fabao['hp']) {
            $data['hp'] = Utils::formulaValue($fabaoTemp['hp'], array('level'=>$fabao['hp']));
        }
        if($fabao['phy_att']) {
            $data['phy_att'] = Utils::formulaValue($fabaoTemp['phy_att'], array('level'=>$fabao['phy_att']));
        }
        if($fabao['phy_def']) {
            $data['phy_def'] = Utils::formulaValue($fabaoTemp['phy_def'], array('level'=>$fabao['phy_def']));
        }
        if($fabao['mag_att']) {
            $data['mag_att'] = Utils::formulaValue($fabaoTemp['mag_att'], array('level'=>$fabao['mag_att']));
        }
        if($fabao['mag_def']) {
            $data['mag_def'] = Utils::formulaValue($fabaoTemp['mag_def'], array('level'=>$fabao['mag_def']));
        }
        if($fabao['hit']) {
            $data['hit'] = Utils::formulaValue($fabaoTemp['hit'], array('level'=>$fabao['hit']));
        }
        if($fabao['miss']) {
            $data['miss'] = Utils::formulaValue($fabaoTemp['miss'], array('level'=>$fabao['miss']));
        }
        if($fabao['crit']) {
            $data['crit'] = Utils::formulaValue($fabaoTemp['crit'], array('level'=>$fabao['crit']));
        }
        if($fabao['crit_def']) {
            $data['crit_def'] = Utils::formulaValue($fabaoTemp['crit_def'], array('level'=>$fabao['crit_def']));
        }
        if($fabao['strength']) {
            $data['strength'] = Utils::formulaValue($fabaoTemp['strength'], array('level'=>$fabao['strength']));
        }
        if($fabao['intelligence']) {
            $data['intelligence'] = Utils::formulaValue($fabaoTemp['intelligence'], array('level'=>$fabao['intelligence']));
        }
        if($fabao['speed']) {
            $data['speed'] = Utils::formulaValue($fabaoTemp['speed'], array('level'=>$fabao['speed']));
        }
    }
   
	function getFabaoLevel($fabao,$fabaoTemp){
        if($fabaoTemp['hp']) {
            $fabaoLevel=$fabao['hp'];
        }
        if($fabaoTemp['phy_att']&&(($fabaoLevel&&$fabao['phy_att']<$fabaoLevel)||!$fabaoLevel)) {
            $fabaoLevel=$fabao['phy_att'];
        }
        if($fabaoTemp['phy_def']&&($fabaoLevel&&$fabao['phy_def']<$fabaoLevel||!$fabaoLevel)) {
            $fabaoLevel=$fabao['phy_def'];
        }
        if($fabaoTemp['mag_att']&&($fabaoLevel&&$fabao['mag_att']<$fabaoLevel||!$fabaoLevel)) {
            $fabaoLevel=$fabao['mag_att'];
        }
        if($fabaoTemp['mag_def']&&($fabaoLevel&&$fabao['mag_def']<$fabaoLevel||!$fabaoLevel)) {
            $fabaoLevel=$fabao['mag_def'];
        }
        if($fabaoTemp['hit']&&($fabaoLevel&&$fabao['hit']<$fabaoLevel||!$fabaoLevel)) {
            $fabaoLevel=$fabao['hit'];
        }
        if($fabaoTemp['miss']&&($fabaoLevel&&$fabao['miss']<$fabaoLevel||!$fabaoLevel)) {
            $fabaoLevel=$data['miss'];
        }
        if($fabaoTemp['crit']&&($fabaoLevel&&$fabao['crit']<$fabaoLevel||!$fabaoLevel)) {
            $fabaoLevel=$fabao['crit'];
        }
        if($fabaoTemp['crit_def']&&($fabaoLevel&&$fabao['crit_def']<$fabaoLevel||!$fabaoLevel)) {
            $fabaoLevel=$fabao['crit_def'];
        }
        if($fabaoTemp['strength']&&($fabaoLevel&&$fabao['strength']<$fabaoLevel||!$fabaoLevel)) {
            $fabaoLevel=$fabao['strength'];
        }
        if($fabaoTemp['intelligence']&&($fabaoLevel&&$fabao['intelligence']<$fabaoLevel||!$fabaoLevel)) {
            $fabaoLevel=$fabao['intelligence'];
        }
        if($fabaoTemp['speed']&&($fabaoLevel&&$fabao['speed']<$fabaoLevel||!$fabaoLevel)) {
            $fabaoLevel=$fabao['speed'];
        }
        return $fabaoLevel;
    }
  
    function updateFabao($fId,$update,$uid){
        $db = new DB();   
		$db->update('c_fabao', $update, 'id='.$fId);
  
        $mc = Mc::singleton();
        $data=$mc->get("c_fabao".$uid);
        if(count($data)>0){
            foreach ($update as $key => $value){
                $data[$fId][$key]=$value;
            }
            $mc->mset("c_fabao".$uid,$data);
        }
    
        $equipObj=new Equip();
        $equipObj->deleteSortEquipFromMC($uid);
        $equipObj->deleteSortJQFromMC($uid);
    }
    function getFabaoAllCost($fabao,$order){
        $orderArray=explode(",",$order);
        $onceUpNeedGold=$this->getFabaoNeedGold($fabao["id"], 0);
        $allCost=0;
        foreach($orderArray as $value){
            $allCost+=$onceUpNeedGold*$fabao[$value];
        }
        return $allCost;
    }

    function getFabaoOfferExp($fabaoid,$fabaolevel){
        return 50;
    }

    function getUserToplimit($uid){
        return 15;
    }

    function getFabaoPrice($fabao){
        $minLevel=9;
        
    }

    function upgradeFabao(&$fabao,$attr,$equipAll,$num){
        $initNum=$num;
        $equip_id=$fabao["equip_id"];
        $fOrder=$equipAll[$equip_id]["order"];
        $fOrderArray=explode(",", $fOrder);
        $progressArray=explode(",", $fabao["progress"]);
        
        $index=array_keys($fOrderArray,$attr);
        $attrIndex=$index[0];
        for($num;$num>0;$num--){
            $attr=$fOrderArray[$attrIndex];        
			if(count($progressArray)<=$attrIndex){             
			$progressArray[]=0;
            }
            $currentExp=$progressArray[$attrIndex];
            $upLevelNeedExp= Common::getFabaoNeedExp($fabao[$attr]);
            $offerExp=  Common::getFabaoOfferExp();
            if($currentExp+$offerExp>=$upLevelNeedExp){
                $fabao[$attr]=$fabao[$attr]+1;
                $progressArray[$attrIndex]=0;
                if($attrIndex>=count($fOrderArray)-1){       
				if($fabao[$attr]==10){
                        break;
                    }
                    $attrIndex=0;
                }
                else{
                    $attrIndex++;
                }
            }
            else
            {
                $progressArray[$attrIndex]=$currentExp+$offerExp;
            }
        }
        $fabao["progress"]=implode(",", $progressArray);
        //$userObj=new User();
        foreach($fOrderArray as $key => $value){
            $dataArray[$value]=$fabao[$value];
        }
        $dataArray['progress']=$fabao['progress'];
        $this->updateFabao($fabao["id"], $dataArray, $fabaol["user_id"]);
        
        return $initNum-$num;
    }
    /*
    //鍑哄敭娉曞疂
    function sellFabao($user_id,$fabao_obj_id)
    {
        //浠庣敤鎴蜂腑鍒犻櫎瑁呭
        $db = new DB();
        $db->delete("c_fabao", "id=".$fabao_obj_id);

        //鏇存柊缂撳瓨
        $mc = Mc::singleton();
        $data=$mc->get("c_fabao".$user_id);
        if($data){
            unset($data[$fabao_obj_id]);
            $mc->mset("c_fabao".$user_id,$data);
        }
    }*/
    function addUserFabao($uid,$fabao){
        $db=new DB();  
		$db->insert("c_fabao", $fabao);
        $newID=$db->insert_id();
        $fabao["id"]=$newID;

        $mc = Mc::singleton();
        $userFabao=$mc->get("c_fabao".$uid);
        if($userFabao){
            $userFabao[$newID]=$fabao;
            $mc->set("c_equip".$uid,$userFabao);
        }

        $equipObj=new Equip();
        $equipObj->deleteSortEquipFromMC($uid);
        $equipObj->deleteSortJQFromMC($uid);
        return $newID;
    }
   
	function replaceFabao(&$npc,$uid,$part,$newFabaoid=0)
    {
        $db = new DB();
        $source_fabao_obj_id=$npc[$part];
        $db->update("c_npc",array($part=>$newFabaoid),"id=".$npc["id"]);   
		if($source_fabao_obj_id>0){
            $db->update("c_fabao",array("status"=>0),"id=$source_fabao_obj_id");
        }
        if($newFabaoid>0){
            $db->update("c_fabao",array("status"=>1),"id=$newFabaoid");
        }
        $npc[$part]=$newFabaoid;


        $mc = Mc::singleton();
        $userNpc=$mc->get("c_npc".$uid);
        if($userNpc){
            $userNpc[$npc["id"]][$part]=$newFabaoid;
            $mc->set("c_npc".$uid,$userNpc);
        }

        $userFabao=$mc->get("c_fabao".$uid);
        if($userFabao){
            if($source_fabao_obj_id>0){
                $userFabao[$source_fabao_obj_id]["status"]=0; 
            }
            if($newFabaoid>0){
                $userFabao[$newFabaoid]["status"]=1; 
            }
            $mc->set("c_fabao".$uid,$userFabao);
        }
    
        $equipObj=new Equip();
        $equipObj->deleteSortEquipFromMC($uid);
        $equipObj->deleteSortJQFromMC($uid);
    }
}
?>

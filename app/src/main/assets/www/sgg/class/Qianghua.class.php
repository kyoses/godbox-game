<?php
 
include_once dirname(__FILE__).'/../Lib.php';
class Qianghua{
 
    function calculateEquipUpLCost($level,$type){
        switch($type){
            case 1:
            return round((pow($level,3.25)/30+$level*5)*40)+100;       
			case 2:
            return round((pow($level,3.25)/30+$level*5)*20)+50;       
			case 3:
            return round((pow($level,3.25)/30+$level*5)*20)+50;       
			case 4:
            return round((pow($level,3.25)/30+$level*5)*40)+100;      
			case 5:
            return round((pow($level,3.25)/30+$level*5)*40)+100;         
			case 6:
            return round((pow($level,3.25)/30+$level*5)*60)+150;   
			case 7:
            return round((pow($level,3.25)/30+$level*5)*80)+200;   
			case 8:
            return round((pow($level,3.25)/30+$level*5)*100)+300;   
			}
    }
    function calculateEquipUpLCostById($cequipid,$allEquip=NULL,$equipObj=NULL){
        $equip=new Equip();
        if(!$allEquip)
            $allEquip=$equip->selectEquip();
        if(!$equipObj)
            $equipObj=$equip->getEquipObjInfo($cequipid);
        $equipTemplate=$allEquip[$equipObj["equip_id"]];

        $nowUpLevel=$equipObj["up_level"];
        $nextUpLevel=intval($nowUpLevel)+1;
        $type=$equipTemplate["type"];
        if($type==6){                     
            $class=$equipTemplate["class"];
            if($class==1)                               
			$type=5;                    
            else if($class==2)                            
			$type=6;
            else if($class==3)                         
			$type=7;
            else if($class==4)                     
			$type=8;
            else                                     
			$type=5;
        }

        return $this->calculateEquipUpLCost($nextUpLevel, $type);
    }



	function calculateEquipUpLAllCost($uplevel,$type,$class){
        if($type==6){                      
            if($class==1)                              
			$type=5;
            else if($class==2)                           
			$type=6;
            else if($class==3)                          
			$type=7;
            else if($class==4)                      
			$type=8;
            else                                         
			$type=5;
        }
        $price=0;
 
        for($level=2;$level<=$uplevel;$level++){
            $price+=$this->calculateEquipUpLCost($level, $type);
        }
        return $price;
    }

    function strenthenEquip($uid,$newLevel,$cequipid){
        $db=new DB();
        $db->update("c_equip", array("up_level"=>$newLevel),"id=$cequipid");           
        $equipObj=new Equip();
    
        $mc=Mc::singleton();
        $data=$mc->get("c_equip".$uid);
        if(count($data)>0){
            $data[$cequipid]["up_level"]=$newLevel;
			$mc->mset("c_equip".$uid,$data);
        }

        $equipObj=new Equip();
        $equipObj->deleteSortEquipFromMC($uid);
        $equipObj->deleteSortJQFromMC($uid);
    }
}
?>

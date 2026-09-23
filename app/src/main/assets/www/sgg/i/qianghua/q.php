<?php
 
include_once dirname(__FILE__).'/../../config.php';
include_once dirname(__FILE__) . '/../npc/w2.php'; 

$user=$userObj->selectUser($uid);
 
$data["user"]["gold"]=intval($user["gold"]); 
$selectedNpc=$userNpc[$nid];
$qianghua=new Qianghua();
for($i=1;$i<=8;$i++){
    if($i==5)                                             
        continue;
    $str='part_'.$i;
    if($selectedNpc[$str] > 0){
        $eobj = $equipObj->getEquipObjInfo($selectedNpc[$str]); 
        $eq = $equipAll[$eobj['equip_id']]; 
        $nowUpLevel=$eobj["up_level"];
        $nextUpLevel=$nowUpLevel+1; 
        $data['equip'][$str]['level']=intval($nowUpLevel);
        $data['equip'][$str]['nup_level']=$nextUpLevel;
     
        Common::setAttributeValue($data['equip'][$str], $eq, array('level'=>$nowUpLevel));
        Common::setAttributeValue($data['equip'][$str]['nattr'], $eq, array('level'=>$nextUpLevel));
        ///
        //if($eobj["up_level"]<100){                      
            $upLevelType=$i;
			if($upLevelType>=6){
					$equipClass=$eq["class"];
					if($equipClass==1)                    
						$upLevelType=5;
					else if($equipClass==2)      
						$upLevelType=6;
					else if($equipClass==3)            
						$upLevelType=7;
					else if($equipClass==4)
						$upLevelType=8;
					else                                
						$upLevelType=5;
            }
            $data["equip"][$str]["uplevelcost"]=$qianghua->calculateEquipUpLCost($nextUpLevel, $upLevelType);    
        //}
    
        if ($data['jq'][$str]) {
            $data['jq'][$str]['level']=intval($nowUpLevel);
            $data['jq'][$str]['nup_level']=$nextUpLevel;
            Common::setAttributeValue($data['jq'][$str], $eq, array('level'=>$nowUpLevel));
            Common::setAttributeValue($data['jq'][$str]['nattr'], $eq, array('level'=>$nextUpLevel));
            $data["jq"][$str]["uplevelcost"]=$qianghua->calculateEquipUpLCost($nextUpLevel, $upLevelType);
        }
    }
}
//Utils::dump($data);

echo json_encode($data);
exit();
?>

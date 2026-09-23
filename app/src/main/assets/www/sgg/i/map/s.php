<?php
include_once dirname(__FILE__).'/../../config.php';
$mapObj = new Map();
$battleObj = new Battle();

if($type){
    if($type==1){
        $ubattle = $battleObj->selectUserBattle($uid);
    }
    else if($type==2){
        $ubattle = $battleObj->selectUserJYBattle($uid);
    }
    else if($type==3){
        $ubattle = $battleObj->selectUserFBBattle($uid);
    }
}
else{
    $ubattle = $battleObj->selectUserBattle($uid);
}
$ubattleTarget=$battleObj->selectBattleTargetObj($ubattle['battle_id']);
if($ubattle){
    $ubid = $ubattle['battle_id'];
}else{
    $ubid=0;
}


$map=$mapObj->selectMapById($map_id);
$data["omap"]["name"]=$map["name"];
$data["omap"]["page"]=$map["page"];
$battleInMap = $mapObj->selectBattleByMapID($map_id);
$ubattleIsInMap=$battleInMap[$ubid]?TRUE:FALSE;
$data['bs']=array();
foreach($battleInMap as $key=>$row) {
    if($row['battle_order']<=$ubattleTarget['battle_order']) {
        $end=array('id'=>$row['id'],'name'=>$row['name']);
        $end["img"]=$row["img"];
        $end["disp_order"]=$row["disp_order"];
        $end["level"]=$row["level"];
        $end["info"]=$row["info"];
        
        if ($type == 2) {
            if ($TODAY == strtotime(date('Ymd',$ubattle['last_time']))) {
                $b_info = json_decode($ubattle['battle_ids'], true);
                if ($b_info[$row['id']]>0) {
                    $end['fighted'] = -1;
                }
                else {
                    $end['fighted'] = 1;
                }
            }
            else {
                $end['fighted'] = 1;
            }
        }

        if($ubattleIsInMap) {
            $orderGap=$row["battle_order"]-$ubattleTarget['battle_order'];
            if($orderGap<0) {
                $end["st"]=2;
            }
            else if($orderGap==0) {
                $end["st"]=1;
            }
        }
        else {
            $end["st"]=2;
        }

     
        if(!$battleDrop) {
            $battleObj=new Battle();
            $battleDrop=$battleObj->selectBattleDropA();
        }
        $status=$end['st']==1?1:2;
        if($battleDrop && $battleDrop[$key] && $battleDrop[$key][$status]){
            foreach($battleDrop[$key][$status] as $k => $v) {
                switch ($v["type"]) {
                    /*
                    case 1:
                        $end["drop"][]=array("t"=>$v["type"],"v"=>$v["num"]);
                        break;
                    case 2:
                        $end["drop"][]=array("t"=>$v["type"],"v"=>$v["num"]);
                        break;
                    case 3:
                        $end["drop"][]=array("t"=>$v["type"],"v"=>$v["num"]);
                        break;*/
                    case 4:
                        if(!$equipObj) {
                            $equipObj=new Equip();
                            $equipAll=$equipObj->selectEquip();
                        }
                        $end["drop"][]=array("t"=>$v["type"],"v"=>$equipAll[$v["value"]]["name"],"tt"=>$equipAll[$v["value"]]["type"],'r'=>$v['per']);
                        break;
                    case 5:
                        if(!$propObj) {
                            $propObj=new Prop();
                            $propAll=$propObj->selectProp();
                        }
                        $end["drop"][]=array("t"=>$v["type"],"v"=>$propAll[$v["value"]]["name"], "i"=>$propAll[$v["value"]]["img_large"],'r'=>$v['per']);
                        break;
                }
            }
        }
        $data['bs'][]=$end;
    }
    else{
        $end=array('id'=>$row['id'],'st'=>0);
        $data['bs'][]=$end;
    }
}

echo json_encode($data);
exit();
?>

<?php
include_once dirname(__FILE__).'/../../config.php';
$npcObj = new Npc();
$npc=$npcObj->getNpcObj($nid);
//print_r($npc);
if($part<=4){
    $str = 'part_'.$part;
    if($eid){
        $npcObj->replaceNpcEquip($uid,$npc, $eid, $str);
    }
    if($untake){
        $npcObj->untakeNpcEquip($uid,$npc,$str);
    }
}
else if($part==5){ 
    $str = 'part_'.$part;
    $fabaoObj=new Fabao();
    if($eid){ 
        $fabaoObj->replaceFabao($npc, $uid, $str,$eid);
    }
    if($untake){ 
        $fabaoObj->replaceFabao($npc, $uid, $str);
    }
}
else if($part>=6){ 
    if($eid && !$untake){ 
        $userObj=new User();
        $user=$userObj->selectUser($uid); 
        $userVipLevel=$userObj->getUserVipLevel($user['yb_total']); 
        $openCondition = array(6 => array('vipLevel'=>0,'level'=>25),7=>array('vipLevel'=>3,'level'=>25),8=>array('vipLevel'=>5,'level'=>25)); 
        foreach ($openCondition as $key => $value){
            if($user['level']>=$value['level']&&$userVipLevel>=$value['vipLevel']){
                if(!$npc['part_'.$key]){ 
                    $str='part_'.$key;
                    break;
                }
                else if(!$str){
                	$str='part_'.$key;
                }
            }
        }
        //echo $str;
        if($str){
        	//echo $uid.'npc'.$npc.'eid:'.$eid.'str:'.$str;
            $npcObj->replaceNpcEquip($uid,$npc, $eid, $str);
        }
        else{
            $data['st']=2; 
        }
    }
    if($untake){ 
        if($npc['part_6']==$eid){ 
            $str='part_6';
        }
        else if($npc['part_7']==$eid){ 
            $str='part_7';
        }
        else if($npc['part_8']==$eid){ 
            $str='part_8';
        }
        $npcObj->untakeNpcEquip($uid,$npc,$str);
    }
}
$data['opart']=$str; 
$data['st']=1; 
if($part<6){ 
    include_once dirname(__FILE__) . '/w2.php'; 
}
else{ 
    $right=$left=TRUE;
    include_once dirname(__FILE__) . '/../bag/j.php';
}

echo json_encode($data);
exit();
?>

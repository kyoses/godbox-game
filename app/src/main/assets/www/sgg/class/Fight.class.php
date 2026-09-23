<?php
 
include_once dirname(__FILE__).'/../Lib.php';
class Fight{
 
	function init($f,$sys=''){
        $battleObj = new Battle();
        $npcObj = new Npc();
        $f = $battleObj->formationStringToArray($f);
        foreach($f as $key=>$value){
                
			foreach($value as $k=>$v){
                if($v > 0){
                    $data[$key][$k] = array_merge($npcObj->getNpcBaseData($v,$sys),$npcObj->getNpcBattleValue($v,$sys));
                }
                else{
                    $data[$key][$k] = 0;
                }
            }
        }
        return $data;
    }
 
	function formationSpeed($data){
        foreach($data as $key=>$value){
            foreach($value as $k=>$v){
                $speed += $v['speed'];
            }
        }
        return $speed;
    }    
 
    function fightTurn($data_left,$data_right){
        $speed_left = $this->formationSpeed($data_left); 
        $speed_right = $this->formationSpeed($data_right); 
       
		if($speed_left >= $speed_right){
            $data_first = $data_left;
            $data_after = $data_right;
        }
        else{
            $data_first = $data_right;
            $data_after = $data_left;
        }
        $n = 1; 
        foreach($data_first as $i=>$iv){
            foreach($iv as $j=>$jv){
                if($jv['hp'] > 0){
                    $jv['i'] = $i;
                    $jv['j'] = $j;
                    $jv['t'] = 0; 
                    $jv['n'] = $n;                   
					if($speed_left >= $speed_right){
                        $jv['dir'] = 'left';
                    }
                    else{
                        $jv['dir'] = 'right';
                    }
                    $data[$n] = $jv;
                    $n += 2;
                }
            }
        }
        $n = 2;
        foreach($data_after as $i=>$iv){
            foreach($iv as $j=>$jv){
                if($jv['hp'] > 0){
                    $jv['i'] = $i;
                    $jv['j'] = $j;
                    $jv['t'] = 1; 
                    $jv['n'] = $n;                 
					if($speed_left >= $speed_right){
                        $jv['dir'] = 'right';
                    }
                    else{
                        $jv['dir'] = 'left';
                    }
                    $data[$n] = $jv;
                    $n += 2;
                }
            }
        }
        if(is_array($data) && count($data) > 0){
            ksort($data);
            return $data;
        }
    }
 
	function att($npc_att,$npc_def){
        if($npc_att['type'] == 1){          
        }
        elseif($npc_att['type'] == 2){         
        }
        $data['npc_att'] = $npc_att;    
		$data['npc_def'] = $npc_def;      
		$data['act_log'] = $act_log; 
        return $data;
    }
  
    function aim($j,$t,$turn){
    	foreach($turn as $k=>$v){
    		if($v['hp'] >0 && $v['t'] != $t){
            	if($v['j']==$j){
            		return $v;
            	}
			}
		}
        foreach($turn as $k=>$v){
            if($v['hp'] >0 && $v['t'] != $t){				
                if($v['i'] > $re_i && $re){ 
                    return $re;
                }
                 if($j == $v['j']){//
                    $re = $v;
                    $re_i = $v['i'];
                }
 				elseif($j-$v['j'] == 1){
                    $re = $v;
                    $re_i = $v['i'];
                }
                 elseif(!$re){//
                    $re = $v;
                    $re_i = $v['i'];
                }               
            }
        }
        if($re){
            return $re;
        }
        else{
            return -1;      
			}
    }
     function attRow(){
        
    }
     function attCol(){
        
    }
    //
    function attAll(){
        
    }
 	function attNormal(&$f_a,&$f_d,&$str_att,&$str_def,$pos_str){
         if($f_a['type'] == 1){          
		$damage = intval(($f_a['phy_att']-$f_d['phy_def']*0.75)*(1+($f_a['strength']-$f_d['strength'])/($f_a['strength']+$f_d['strength'])));
        }
        elseif($f_a['type'] == 2){         
		$damage = intval(($f_a['mag_att']-$f_d['mag_def']*0.75)*(1+($f_a['intelligence']-$f_d['intelligence'])/($f_a['intelligence']+$f_d['intelligence'])));
        }
        if($damage<0){
            $damage=0;
        }
        $damage+=intval($f_a['level']/10)+1;
        $levelDamage=round((40-($f_a['level']-$f_d['level']))/40*$f_a['level']*rand(0,5));
        if($levelDamage>0){
            $damage+=$levelDamage;
        }
        $str_def[$pos_str]['hp']=-$damage;
  
        
        $crit = $this->formulaCrit($f_a['crit'], $f_d['crit_def'], $f_a['level'], $f_d['level']);
        if($crit > 0){
            $str_def[$pos_str]['crit'] = 1;
            $str_def[$pos_str]['hp'] = $str_def[$pos_str]['hp'] * 2;
        }
      
        if($str_def[$pos_str]['hp'] > 0){
            $str_def[$pos_str]['hp'] = 0;
        }
        $f_d['hp'] += $str_def[$pos_str]['hp'];
        // if($f_d['hp'] < 0){
            // $f_d['hp'] = 0;
        // }
        if($f_d['buff2'] > 0){ 
            $pos = $f_a['t'].$f_a['i'].$f_a['j'];
            $str_def[$pos]['pos'] = $f_a['dir'].$pos;
            $str_def[$pos]['hp'] = round(Utils::formulaValue($f_d["buff2_k"], array('damage'=>$str_def[$pos_str]['hp'])));
            $f_a['hp'] += $str_def[$pos]['hp'];
            // if($f_a['hp']<0){ 
                // $str_def[$pos]['hp']=$str_def[$pos]['hp']+(0-$f_a['hp']);
                // $f_a['hp']=0;
            // }
        }
    }
     
	function skillAddHP($value,&$f_d,&$str_def){
        $pos = $f_d['t'].$f_d['i'].$f_d['j'];
        $str_def[$pos]['hp'] = round(Utils::formulaValue($value, array('hp_max'=>$f_d['hp_max'])));
        //$str_def[$pos]['hp'] = (int)($f_d['hp_max']/$value);  	
		$temp = $f_d['hp'];         
		$f_d['hp'] += $str_def[$pos]['hp'];   
        if($f_d['hp']>=$f_d['hp_max']){
            $str_def[$pos]['hp'] = $f_d['hp_max'] - $temp;
            $f_d['hp'] = $f_d['hp_max'];
        }
    }
   
    function skillMinusHP(&$f_a,&$f_d,&$str_att,&$str_def,$skillValue){
    	$pos = $f_d['t'].$f_d['i'].$f_d['j'];
        /*
        if($f_a['type'] == 1){ 
            $damage = intval(($f_a['phy_att']-$f_d['phy_def']*0.75)*(1+($f_a['strength']-$f_d['strength'])/($f_a['strength']+$f_d['strength'])));
        }
        elseif($f_a['type'] == 2){ 
            $damage = intval(($f_a['mag_att']-$f_d['mag_def']*0.75)*(1+($f_a['intelligence']-$f_d['intelligence'])/($f_a['intelligence']+$f_d['intelligence'])));
        }*/
        if($f_a['type'] == 1){           
			$damage = intval(($f_a['phy_att']-$f_d['phy_def']*0.75)*(1+($f_a['strength']-$f_d['strength'])/($f_a['strength']+$f_d['strength'])));
        }
        elseif($f_a['type'] == 2){         
		$damage = intval(($f_a['mag_att']-$f_d['mag_def']*0.75)*(1+($f_a['intelligence']-$f_d['intelligence'])/($f_a['intelligence']+$f_d['intelligence'])));
        }
        if($damage<0){
            $damage=0;
        }
        $damage+=intval($f_a['level']/10)+1;
        $levelDamage=round((40-($f_a['level']-$f_d['level']))/40*$f_a['level']*rand(0,5));
        if($levelDamage>0){
            $damage+=$levelDamage;
        }
        
        if($damage<0)
            $damage=0;
        $minusValue=Utils::formulaValue($skillValue, array('damage'=>$damage));
      
        // if($minusValue>$f_d['hp']){
            // $minusValue=$f_d['hp'];
        // }
        $str_def[$pos]['hp']=-round($minusValue);
        $f_d['hp']-=round($minusValue);
        if($f_d['buff2']>0){ 
            $pos = $f_a['t'].$f_a['i'].$f_a['j'];
            $str_def[$pos]['pos'] = $f_a['dir'].$pos;
            $minusValue = round(Utils::formulaValue($f_d["buff2_k"], array('damage'=>$minusValue)));
            // if($minusValue>$f_a['hp']){
                // $minusValue=$f_a['hp'];
            // }
            $str_def[$pos]['pos']=$f_a['dir'].$pos;
            $str_def[$pos]['hp']=-($minusValue);
            $f_a['hp']-=($minusValue);
        }
    }
 
	function skillExchangeHP(&$f_a,&$f_d,&$str_att,&$str_def,$skillValue){
        $exchangeValue1=round($f_a['hp']*0.1);
        $exchangeValue2=round($f_a['hp']*0.1*$skillValue);
        $f_a['hp']-=$exchangeValue1;
        $str_att['hp']=-$exchangeValue1;
        // if($exchangeValue2>$f_d['hp']){
            // $exchangeValue2=$f_d['hp'];
        // }
        $f_d['hp']-=$exchangeValue2;
        $str_def['hp']=-$exchangeValue2;
		$pos = $f_a['t'].$f_a['i'].$f_a['j'];        
		if($f_d['buff2']>0){ 
            $str_def[$pos]['pos'] = $f_a['dir'].$pos;
            $exchangeValue2=round(Utils::formulaValue($f_d["buff2_k"], array('damage'=>$exchangeValue2))); 
            // if($exchangeValue2>$f_a['hp']){
                // $exchangeValue2=$f_a['hp'];
            // }
            $str_def[$pos]['pos']=$f_a['dir'].$pos;
            $str_def[$pos]['hp']=-($exchangeValue2);
            $f_a['hp']-=($exchangeValue2);
        }
    }

	function skillMinusFury(&$f_d,&$str_def,$skillValue){
        if($skillValue>$f_d['fury']){          
		$skillValue=$f_d['fury'];
        }
        $f_d['fury']-=$skillValue;
        $str_def['fury']=$f_d['fury'];
    }

	function skillAddFury(&$f_d,&$str_def,$skillValue){
        $f_d['fury']+=$skillValue;
        $str_def['fury']=$skillValue;
    }

	function skillAddDizzyBuffer(&$f_d,&$str_def){
        $f_d['buff1'] = 1;
        $str_def['buff1'] = 1;
    }

  
	function skillAddReverseBuffer(&$f_d,&$str_def,$skillValue){
        $f_d['buff2']++;
        $f_d['buff2_k']=$skillValue;
        $str_def['buff2']=1;
    }

    function getFightStart($data_att,$data_def){
        foreach ($data_att as $k1=>$v1){
            foreach ($v1 as $k2=>$v2){
                if($v2 == 0){
                    $data['left'][$k1][$k2] = 0;
                }
                else{
                    $data['left'][$k1][$k2]['hp'] = $v2['hp'];
					$data['left'][$k1][$k2]['fury'] = $v2['fury'];
                    $data['left'][$k1][$k2]['img'] = $v2['img'];
					$data['left'][$k1][$k2]['class'] = $v2['class'];
                    $data['left'][$k1][$k2]['img_small'] = $v2['img_small'];
                    $data['left'][$k1][$k2]['type']=$v2['type'];
                }
            }
        }
        foreach ($data_def as $k1=>$v1){
            foreach ($v1 as $k2=>$v2){
                if($v2 == 0){
                    $data['right'][$k1][$k2] = 0;
                }
                else{
                    $data['right'][$k1][$k2]['hp'] = $v2['hp'];
					$data['right'][$k1][$k2]['fury'] = $v2['fury'];
                    $data['right'][$k1][$k2]['img'] = $v2['img'];
					$data['right'][$k1][$k2]['class'] = $v2['class'];
                    $data['right'][$k1][$k2]['img_small'] = $v2['img_small'];
                    $data['right'][$k1][$k2]['type']=$v2['type'];
                }
            }
        }        
        return $data;
    }

	function getSkillAim($range,$target,$att,$turn){
        switch ($range){
            case 1:                
			if($target == 1){
                    $data[] = $turn[$att];
                }
                elseif($target == 2){
                    $data[] = $this->aim($turn[$att]['j'], $turn[$att]['t'], $turn);
                }
                break;
            case 2;                
			if($target == 1){
                    foreach ($turn as $k=>$v){
                        if($v['hp'] > 0 && $v['t'] == $turn[$att]['t'] && $v['i'] == $turn[$att]['i']){
                            $data[] = $v;
                        }
                    }
                }
                elseif($target == 2){
                    $pos_i = -1;               
					foreach($turn as $k=>$v){
                        if($v['hp'] > 0 && $v['t'] != $turn[$att]['t'] && $pos_i == -1){
                            $pos_i = $v['i'];
                        }
                        if($v['i'] == $pos_i && $v['hp'] > 0&& $v['t'] != $turn[$att]['t']){
                            $data[] = $v;
                        }
                    }
                }
                break;
            case 3:             
			if($target == 1){
                    foreach ($turn as $k=>$v){
                        if($v['hp'] > 0 && $v['t'] == $turn[$att]['t'] && $v['j'] == $turn[$att]['j']){
                            $data[] = $v;
                        }
                    }
                }
                elseif($target == 2){
                    foreach($turn as $k=>$v){
                        if($v['hp'] > 0 && $v['t'] != $turn[$att]['t'] && $v['j'] == 0){
                            $data_0[] = $v;
                        }
                        if($v['hp'] > 0 && $v['t'] != $turn[$att]['t'] && $v['j'] == 1){
                            $data_1[] = $v;
                        }
                        if($v['hp'] > 0 && $v['t'] != $turn[$att]['t'] && $v['j'] == 2){
                            $data_2[] = $v;
                        }
                    }
                    switch($turn[$att]['j']){
                        case 0:
                            if($data_0){
                                $data = $data_0;
                            }
                            elseif($data_1){
                                $data = $data_1;
                            }
                            elseif($data_2){
                                $data = $data_2;
                            }
                            break;
                        case 1:
                            if($data_1){
                                $data = $data_1;
                            }
                            elseif($data_0){
                                $data = $data_0;
                            }
                            elseif($data_2){
                                $data = $data_2;
                            }                            
                            break;
                        case 2;
                            if($data_2){
                                $data = $data_2;
                            }
                            elseif($data_0){
                                $data = $data_0;
                            }
                            elseif($data_1){
                                $data = $data_1;
                            }                            
                            break;
                    }
                }
                break;
            case 4:              
			if($target == 1){
                    foreach($turn as $k=>$v){
                        if($v['hp'] > 0 && $turn[$att]['t'] == $v['t']){
                            $data[] = $v;
                        }
                    }
                }
                elseif($target == 2){
                    foreach($turn as $k=>$v){
                        if($v['hp'] > 0 && $turn[$att]['t'] != $v['t']){
                            $data[] = $v;
                        }
                    }
                }
                break;
        }
        return $data;
    }

    function randomFromFormation($turn,$att,$n){
        foreach($turn as $key => $value){
            if($value['hp']>0&&$value['t']!=$turn[$att]['t']){
                $data[]=$value;
            }
        }
        if($n>=count($data)){
            return $data;
        }
        else{
        	if($n>1){
        		$randKeys=array_rand($data,$n);
        	}else{
        		$randKeys = $data[array_rand($data,$n)];
        	}
            foreach ($randKeys as $value){
                $data2[]=$data[$value];
            }
            return $data2;
        }
    }

//========================a=====================鍏紡================================================

    function formulaHit($att_hit,$def_miss,$att_level,$def_level){
       $data = $att_hit - $def_miss + $att_level - $def_level;
	   if($data>0){
	       $rand = rand(1, 1000);
	       if($rand <= $data){
	           return 1;
	       }
	   }else{
	   		return 0;
	   }
    }

    function formulaCrit($att_crit,$def_crit_def,$att_level,$def_level){
        $per = $att_crit - $def_crit_def + ($att_level-$def_level)*10;
        $data = rand(1,1000);
		if($per>0){
			if($data <= $per){
            	return 1;
	        }else{
	        	return 0;
	        }
		}else{
			return 0;
		}
        
    }
	
}
?>

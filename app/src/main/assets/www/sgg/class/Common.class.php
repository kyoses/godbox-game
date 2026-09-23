<?php

include_once dirname(__FILE__) . '/../Lib.php';

class Common {


    function getSpentByNum($num) {
		// $array = array(9=>(5*($num-1)),16=>(10*($num-5)),51=>100,201=>150,1000=>200);
		// foreach ($array as $key => $value) {
			// if($num<$key){
 				// return $array[$key];
 			// }
		// }
		return 6*($num-1);
    }

    function getGoldByLevel($num) {
        $gold = 10000*$num+40000;
        return $gold;
    }


    function getVipLevelInfo($level) {
        $a = array(
            1 => array(1 => "1.招募馆中可变异为蓝将", 2 => "2.可通过摇钱树发财3次", 3 => "3.参与竞技场5次", 4 => "4.帮派成员可以参与“八卦祭”", 5 => "5.体力上限为35点，可补充3次", 6 => "6.法宝每天培养次数上限为50", 7 => "7.vip2大礼包"),
            2 => array(1 => "1.精英,法宝副本可以扫荡", 2 => "2.摇钱树次数提升为5次", 3 => "3.参与竞技场次数提升为10", 4 => "4.帮派成员可以参与“七星祭", 5 => "5.体力上限为40点，可补充5次", 6 => "6.僵尸农场功能新开4块可挂机地", 7 => "7.vip3大礼包（招募馆开放诸葛亮）"),
            3 => array(1 => "1.请符开启力、智、阵法兑换", 2 => "2.请符开启“一键请符”", 3 => "3.武将洗练增加百年洗练", 4 => "4.摇钱树次数提升为7次", 5 => "5.参与竞技场次数提升为15", 6 => "6.体力上限为45点，可补充7次", 7 => "7.法宝每天培养次数上限为100", 8 => "8.vip4大礼包"),
            4 => array(1 => "1.招募馆中可变异为紫将", 2 => "2.竞技场取消挑战冷却时间", 3 => "3.精英副本可重置1次", 4 => "4.摇钱树次数提升为9次", 5 => "5.参与竞技场次数提升为20", 6 =>"6.体力上限为50点，可补充10次", 7 => "7.vip5大礼包（送小乔妹纸）"),
            5 => array(1 => "1.开启娇妾第二个格子", 2 => "2.摇钱树次数提升为30次", 3 => "3.参与竞技场次数提升为25", 4 => "4.体力上限为60点，可补充16次", 5 => "5.法宝每天培养次数上限为1000", 6 => "6.vip6大礼包（招募馆开放黄盖）"),
            6 => array(1 => "1.精英副本可重置2次", 2 => "2.摇钱树次数提升为50次", 3 => "3.参与竞技场次数提升为30", 4 => "4.体力上限为100点，可补充22次", 6 => "6.僵尸农场功能新开6块可挂机地", 7 => "7.vip7大礼包"),
            7 => array(1 => "1.招募馆中变异为橙将", 2 => "2.摇钱树次数提升为100次", 3 => "3.参与竞技场次数提升为35", 4 => "4.体力上限为160点，可补充30次", 5 => "5.法宝每天培养次数上限为2000", 6 => "6.vip8大礼包（送貂蝉妹纸）"),
            8 => array(1 => "1.开启娇妾第三个格子", 2 => "2.摇钱树次数提升为200次", 3 => "3.参与竞技场次数提升为40", 4 => "4.体力上限为240点，可补充40次", 5 => "5.vip9大礼包（招募馆开放刘禅）"),
            9 => array(1 => "1.摇钱树次数提升为300次", 2 => "2.参与竞技场次数提升为100", 3 => "3.体力上限为340点，可补充60次", 4 => "4.法宝每天培养次数上限为2000", 5 => "5.vip10大礼包"),
            10 => array(1 => "1.招募馆中变异为红将", 2 => "2.摇钱树次数提升为400次", 3 => "3.参与竞技场次数提升为250", 4 => "4.体力上限为500点，可补充80次", 5 => "5.vip11大礼包")
        );
        return $a[$level];
    }
    
 
    public static function getMaxTiLi($vipLevel) {
        $array = array(0 => 50, 1 => 50, 2 => 50, 3 => 70, 4 => 70, 5 => 100, 6 => 100, 7 => 100, 8 => 100, 9 => 100, 10 => 100, 11 => 100, 12 => 100);
        return $array[$vipLevel];
    }
  
    public static function getAddTiliMaxNum($vipLevel){
        $array=array(3,5,7,10,15,20,35,50,70,90,120);
        return $array[$vipLevel];
    }
   
    public static function getNeedYbWithNum($num){
    	// $spend = $num<=2 ? 5 : ($num*5)-5;
    	// return $spend;
    	
        // $array = array(2=>20,3=>30,4=>50,5=>80,6=>100,7=>130,8=>160,61=>200,100=>300);
		// foreach ($array as $key => $value) {
			// if($num<$key){
 				// return $array[$key];
 			// }
		// }
		return 50*($num-1);
    }
    //
    
 
    public static function getAddCgNum($vipLevel) {
        $array = array(1 => 1, 2 => 2, 3 => 3, 4 => 4, 5 => 5, 6 => 6, 7 => 7, 8 => 8, 9 => 20, 10 => 50);
        return $array[$vipLevel];
    }

 
    public static function getNeedYb($num) {
        $array = array(
            1 => 10,
            2 => 20,
            3 => 40,
            4 => 80,
            5 => 160,
            6 => 320,
            7 => 640,
            8 => 1280,
            9 => 2560,
            21 => 5120
        );
        if ($array[$num]){
            return $array[$num];
        } else if ($num > 9 && $num < 21) {
            return $array[9];
        } else if ($num > 21) {
            return $array[21];
        }
    }


    public static function getMultipleByVip($vip) {
        $max_bv = 0;
        if ($vip < 2) {
            $max_bv = 0.15;
        } else if ($vip >= 2 && $vip < 6) {
            $max_bv = 0.5;
        } else if ($vip >= 6 && $vip < 10) {
            $max_bv = 1;
        } else {
            $max_bv = 2;
        }
        return $max_bv;
    }


    public static function getFabaoNeedExp($fabaolevel) {
        $array = array(200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400);
        return $array[$fabaolevel];
    }


    public static function getFabaoOfferExp() {
        return 10;
    }

    public static function getFabaoNeedGold() {
        return 20000;
    }


    public static function getFabaoVipPYMaxNum($vipLevel) {
        $array = array(20, 50, 50, 100, 100, 1000, 1000, 2000, 2000, 5000, 5000);
        return $array[$vipLevel];
    }

    public static function getFabaoNextVipPYMaxNum($vipLevel) {
        $array = array(20, 50, 50, 100, 100, 1000, 1000, 2000, 2000, 5000, 5000);
        $now = $array[$vipLevel];
        $vipLevel++;
        $next = $array[$vipLevel];
        if ($now != $next) {
            return array($vipLevel, $next);
        } else {
            for ($vipLevel; $vipLevel <= 10; $vipLevel++) {
                if ($array[$vipLevel] != $now) {
                    return array($vipLevel, $array[$vipLevel]);
                }
            }
        }
    }

    public static function getFeixianResuit($arg1, $arg2, $arg3) {
        $com = new Common();
        if ($arg1 != 0 || $arg2 != 0 || $arg3 != 0) {  
            if ($arg1 != 0) { 
                $r1 = $arg1;
            } else {
                $r1 = $com->getRandomFeixian();
            }
            if ($arg2 != 0) {
                $r2 = $arg2;
            } else {
                $r2 = $com->getRandomFeixian();
            }
            if ($arg3 != 0) {
                $r3 = $arg3;
            } else {
                $r3 = $com->getRandomFeixian();
            }
        } else {  
            //do {
            $r1 = $com->getRandomFeixian();
            $r2 = $com->getRandomFeixian();
            $r3 = $com->getRandomFeixian();
            //}while($r1==6&&$r2==6&&$r3==6);
        }
        $data['l1'] = $r1;
        $data['l2'] = $r2;
        $data['l3'] = $r3;
        return $data;
    }

  
    public static function getRandomFeixian() {
        $num = rand(1, 100);
		$array = array(0=>0,1=>5,2=>15,3=>50,4=>85,5=>95,6=>100);
		foreach ($array as $key => $value) {
			if($num>$value&&$num<=$array[$key+1]){
				return $key+1;
			}
		}
    }

	public static function getFarmOpenNum($vip){
		if($vip<2){
			return 2;
		}else if($vip>=2&&$vip<6){
			return 6;
		}else{
			return 12;
		}
	}

	public static function judgeActiveDailyBox($box_s,$num){
		$box = explode(",", $box_s);
		$open = 0; 
		$temp = 0;
		$array = array(1 => 100,2=>200,3=>500,4=>1000,5=>5000,6=>100000); 
		foreach ($array as $key => $value) {
			if($num>=$array[$key]&&$num<$array[$key+1]){
				$open = $key;
			}
		}
		if($open){
			for ($i=0; $i < count($box); $i++) {
				if($open-1>=$i){
					if($box[$i]=="2"){ 
						continue;
					}
					if($box[$i]=="0"){
						$box[$i]="1";
						$temp = 1;
					}	
				}
			}
		}
		$box_s = implode(",", $box);
		return $temp;
	}
	public static function getRihuoBoxAward($index){
		$boxAward = array(0 =>array("repu"=>50,"yb_sys"=>20,"exp_card"=>"349*5"),
						  1 =>array("repu"=>100,"yb_sys"=>50,"exp_card"=>"350*5"),
						  2 =>array("repu"=>200,"yb_sys"=>100,"exp_card"=>"350*10"),
						  3 =>array("repu"=>400,"yb_sys"=>200,"exp_card"=>"351*5"),
						  4 =>array("repu"=>1000,"yb_sys"=>500,"exp_card"=>"352*2"));
		return $boxAward[$index];
	}
	public static function orderZhoufu($list){
		foreach ($list as $key => $value) {
			$att = explode(":", $value['attribute']);
			switch ($att[0]) {
				case "fury" :
					$fury[$value['id']] = $value;
				case "speed" :
					$speed[$value['id']] = $value;
					break;
				case "strength" :
					$strength[$value['id']] = $value;
					break;
				case "intelligence" :
					$intelligence[$value['id']] = $value;
					break;
				case "hp" :
					$hp[$value['id']] = $value;
					break;
				case "phy_att" :
					$phy_att[$value['id']] = $value;
					break;
				case "mag_att" :
					$mag_att[$value['id']] = $value;
					break;
				case "phy_def" :
					$phy_def[$value['id']] = $value;
					break;
				case "mag_def" :
					$mag_def[$value['id']] = $value;
					break;
				case "crit" :
					$crit[$value['id']] = $value;
					break;
				case "crit_def" :
					$crit_def[$value['id']] = $value;
					break;
				case "hit" :
					$hit[$value['id']] = $value;
					break;
				case "miss" :
					$miss[$value['id']] = $value;
					break;
			}//@switch
			
		}
		$utils = new Utils();
		$temp = array(); 
		if ($fury) {
			$utils -> orderArray($fury, "class", "desc");
			$temp = ($fury) ? array_merge($temp, $fury) : $fury;
		}	
		if ($speed) {
			$utils -> orderArray($speed, "class", "desc");
			$temp = ($temp) ? array_merge($temp, $speed) : $speed;
		}
		if ($strength) {
			$utils -> orderArray($strength, "class", "desc");
			$temp = ($temp) ? array_merge($temp, $strength) : $strength;
		}
		if ($intelligence) {
			$utils -> orderArray($intelligence, "class", "desc");
			$temp = ($temp) ? array_merge($temp, $intelligence) : $intelligence;
		}
		if ($hp) {
			$utils -> orderArray($hp, "class", "desc");
			$temp = ($temp) ? array_merge($temp, $hp) : $hp;
		}
		if ($phy_att) {
			$utils -> orderArray($phy_att, "class", "desc");
			$temp = ($temp) ? array_merge($temp, $phy_att) : $phy_att;
		}
		if ($mag_att) {
			$utils -> orderArray($mag_att, "class", "desc");
			$temp = ($temp) ? array_merge($temp, $mag_att) : $mag_att;
		}
		if ($phy_def) {
			$utils -> orderArray($phy_def, "class", "desc");
			$temp = ($temp) ? array_merge($temp, $phy_def) : $phy_def;
		}
		if ($mag_def) {
			$utils -> orderArray($mag_def, "class", "desc");
			$temp = ($temp) ? array_merge($temp, $mag_def) : $mag_def;
		}
		if ($crit) {
			$utils -> orderArray($crit, "class", "desc");
			$temp = ($temp) ? array_merge($temp, $crit) : $crit;
		}
		if ($crit_def) {
			$utils -> orderArray($crit_def, "class", "desc");
			$temp = ($temp) ? array_merge($temp, $crit_def) : $crit_def;
		}
		if ($hit) {
			$utils -> orderArray($hit, "class", "desc");
			$temp = ($temp) ? array_merge($temp, $hit) : $hit;
		}
		if ($miss) {
			$utils -> orderArray($miss, "class", "desc");
			$temp = ($temp) ? array_merge($temp, $miss) : $miss;
		}		
		return $temp;
	}
    function updateCompetitiveNum($uid){
    	global $TODAY;
		$user = new User();
		$award = $user->getUserAwardInfo($uid);
		$array = explode(":", $award['competitive_num']);
		$day = (int)$array[0];
		$num = (int)$array[1];
		if($day!=$TODAY){
			$num+=1;
		}else{
			$num = 1;
		}
		$db = new DB();
		$db->update("c_award", array('competitive_num' =>$TODAY.":".$num),"user_id=$uid");
    }
    public static function getJYBattleNum($userVip){
        if($userVip<4){
            return 1;
        }
        else if($userVip<6){
            return 2;
        }
        else{
            return 3;
        }
    }
    public static function getFBNeedTiLi($num){
        return pow(2, ($num-1));
    }
    public  static function setAttributeValue($data,$sourceObj,$dataArray){
        if($sourceObj['hp']) {
                $data['hp'] = Utils::formulaValue($sourceObj['hp'], $dataArray);
            }
            if($sourceObj['phy_att']) {
                $data['phy_att'] = Utils::formulaValue($sourceObj['phy_att'], $dataArray);
            }
            if($sourceObj['phy_def']) {
                $data['phy_def'] = Utils::formulaValue($sourceObj['phy_def'], $dataArray);
            }
            if($sourceObj['mag_att']) {
                $data['mag_att'] = Utils::formulaValue($sourceObj['mag_att'], $dataArray);
            }
            if($sourceObj['mag_def']) {
                $data['mag_def'] = Utils::formulaValue($sourceObj['mag_def'], $dataArray);
            }
            if($sourceObj['hit']) {
                $data['hit'] = Utils::formulaValue($sourceObj['hit'], $dataArray);
            }
            if($sourceObj['miss']) {
                $data['miss'] = Utils::formulaValue($sourceObj['miss'], $dataArray);
            }
            if($sourceObj['crit']) {
                $data['crit'] = Utils::formulaValue($sourceObj['crit'], $dataArray);
            }
            if($sourceObj['crit_def']) {
                $data['crit_def'] = Utils::formulaValue($sourceObj['crit_def'], $dataArray);
            }
            if($sourceObj['strength']) {
                $data['strength'] = Utils::formulaValue($sourceObj['strength'], $dataArray);
            }
            if($sourceObj['intelligence']) {
                $data['intelligence'] = Utils::formulaValue($sourceObj['intelligence'], $dataArray);
            }
            if($sourceObj['speed']) {
                $data['speed'] = Utils::formulaValue($sourceObj['speed'], $dataArray);
            }
    }

    function getLoginAward($uid){
    	global $TODAY;
		$userObj = new User();
		$award = $userObj->getUserAwardInfo($uid);
		if($award['login_award']){
			$awardStatus = json_decode($award['login_award']);
			$Day1 = (int)$awardStatus[2]['time'];
			$Day2 = (int)$awardStatus[1]['time'];
			if($Day1+24*3600==$TODAY&&$Day2+24*3600==$Day1){         
				$data['status']=3;  
			}else if($Day1+24*3600==$TODAY&&$Day2+24*3600!=$Day1){
				$data['status']=2;  
			}else if($Day1!=$TODAY){
				$data['status']=1;  
			}else{
				$data['status']=0; 
			}
		}else{
			$data['status']=1;  
		}
		return $data;
		//$login_award = json_decode($award['login_award']);
    }
	public static function isDrop($num){
		if(rand(0, 100)<=$num){
			return true;
		}
		return false;
	}
	public static function getNumOfTrainByVip($vip){
		$a = array(0=>1,1=>1,2=>2,3=>2,4=>3,5=>3,6=>4,7=>4,8=>5,9=>6,10=>6);
		return $a[$vip];
	}
}

?>

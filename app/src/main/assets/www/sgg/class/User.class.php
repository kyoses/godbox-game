<?php
include_once dirname(__FILE__).'/../Lib.php';
class User {
 
    function createUser($name,$key,$area,$gender,$img,$acc_id,$acc_type,$plat_info){
        $db=new DB();
        $userID=$this->insertUser($name, $acc_id,$gender,$img,$acc_type,$plat_info);
        return $userID;
    }
    function insertUser($name, $account_id,$gender,$img,$acc_type,$plat_info){
        $db = new DB();      
		$insert['name'] = $name;
        $insert['account_id'] = $account_id;
        $insert['account_type'] = $acc_type;
        $insert['plat_info'] = $plat_info;
        $insert['gender']=$gender;
        $insert['img']=$img;
        $insert['create_time']=time();
        $insert['last_login_time']=time();
        $insert['login_days'] = 1;        
        $db->insert('c_user', $insert);
        $uid = $db->insert_id();
        if ($uid > 0) {
            $award = array('user_id' => $uid,'title_today'=>0,'salary_today'=>0,'paiming_num'=>"0:0",'fiexian_num'=>"0:0",'competitive_num'=>"0:0");
            $db->insert("c_award", $award);
            return $uid;
        }
    }
	function searchBypingbiName($name){
        $db=new DB();
        $sql="select id from c_user_pingbi1 where uname like '%$name%'";
		 
        $data=$db->get_one($sql);
         if($data){            
			return $data;
        }
    }
	function checkUser($type,$id){
		$db=new DB();
		$sql="select * from c_user where account_id=".$id." and account_type=".$type;
        $data=$db->get_one($sql);
        return $data;
	}

    function selectPlatUser($plateName){
        $db=new DB();
        $sql="select * from c_user where name='$plateName'";
        $data=$db->get_one($sql);
        if($data){            
			return $data;
        }
    }

    function updateUser($uid, $update) {
        $db = new DB();        
		$db->update('c_user', $update, 'id=' . $uid);
        
		$mc = Mc::singleton();
		$mc->delete("c_user".$uid); 
    }


    function selectUser($uid) {
        $db = new DB();        
		$mc = Mc::singleton();
        $data = $mc->get('c_user' . $uid);
        if (!$data) {
            $sql = "select * from c_user where id=$uid";
            $data = $db->get_one($sql);
            if ($data) {
                $mc->mset('c_user' . $uid, $data);        
				return $data;
            }
        } else {
            return $data;
        }
    }

 
	 function getUserVipLevel($yb_total) {
        $level = array(0=>0,1 => 100, 2=> 500, 3 => 1000, 4 => 2000, 5 => 5000, 6 => 10000, 7 => 20000, 8=>50000, 9=>100000, 10=>500000);
        foreach ($level as $key => $value) {
            if($yb_total>=$value&&$yb_total<$level[$key+1]){
            	$has = 1;
            	return $key;
            }
        }
		if(!$has){
			return 10;
		}
    }

     function getUserMaxEnergy($vip_level) {
        return 50;
    }

     function getUserUpExp($level) {
        if ($level < 90) {
            return round((pow($level, 4.3) / 1400 + $level) * 240); 
        } else {
            return round((pow($level, 4.45) / 1000 + $level) * 240); 
        }
    }

     

    function addGold($user, $gold) {
        $newGold = (int)($user["gold"] + $gold);
        $db = new DB(); 

		$table = 'c_user';
        $dataArray = array("gold" => $newGold);
        $condition = " id=".$user["id"];
        $db->update($table, $dataArray, $condition);


        $mc = Mc::singleton();
        $user["gold"] = $newGold;
        $mc->mset('c_user' . $user["id"], $user);
    }

    function addYB($user, $yb) {
        $newYB = (int)($user["yb"] + $yb);
        $db = new DB(); 
		$table = 'c_user';

        $dataArray = array("yb" => $newYB);
        $condition = " id=" . $user["id"];
        $db->update($table, $dataArray, $condition);


        $mc = Mc::singleton();
        $user["yb"] = $newYB;
        $mc->mset('c_user' . $user["id"], $user);
    }
	

	function addYBTotal($user, $amount){
		$newYBTotal = (int)($user["yb_total"] + $amount);
        $db = new DB(); 
   
		$table = 'c_user';

        $dataArray = array("yb_total" => $newYBTotal);
        $condition = " id=" . $user["id"];
        $db->update($table, $dataArray, $condition);

        $mc = Mc::singleton();
        $user["yb_total"] = $newYBTotal;
        $mc->mset('c_user' . $user["id"], $user);
	}

    function addYBSys($user, $yb_sys) {
        $newYBSys = (int)($user["yb_sys"] + $yb_sys);
        $db = new DB(); 
     
		$table = 'c_user';

        $dataArray = array("yb_sys" => $newYBSys);
        $condition = " id=" . $user["id"];
        $db->update($table, $dataArray, $condition);


        $mc = Mc::singleton();
        $user["yb_sys"] = $newYBSys;
        $mc->mset('c_user' . $user["id"], $user);
    }
    
      
	function minusYBorYBSys($user,$yb){
        $db=new DB();
        $mc = Mc::singleton();
        $half=(int)($yb/2);
        if($user['yb']>=$half&&$user['yb_sys']>=$half){      
			$user['yb']-=$half;
            $user['yb_sys']-=$half;
            $dataArray=array("yb"=>$user['yb'],'yb_sys'=>$user['yb_sys']);
            $db->update('c_user',$dataArray,' id='.$user['id']);
            $mc->mset('c_user' . $user["id"], $user);
            return true;
        }
        else if($user['yb']>=$yb){         
			$user['yb']-=$yb;
            $dataArray=array("yb"=>$user['yb']);
            $db->update('c_user',$dataArray,' id='.$user['id']);
            $mc->mset('c_user' . $user["id"], $user);
            return true;
        }
        else{        
			return false;
        }
    }

    function addExp($user, $exp,$updateDatabase=true) {
        $newExp = $exp;

		
        $levelExp = $this->getUserUpExp($user['level']);
        while($newExp>=$levelExp-$user['exp']){          
		$newExp -= ($levelExp-$user['exp']);           
			$user['level']+=1;
            $user['exp']=0;
            $newLevel=$user['level'];
            $levelExp = $this->getUserUpExp($user['level']);
        }
        if($newExp>0){
            $user['exp']+=$newExp;
        }
        if($updateDatabase){
            $db = new DB();      
			$table = 'c_user';
            $condition = " id=" . $user["id"];
            $db->update($table, array('exp'=>$user['exp'],'level'=>$user['level']), $condition);


            $mc = Mc::singleton();
            $mc->mset('c_user' . $user["id"], $user);
        }

        if ($newLevel) {
            return $newLevel;
        }
    }

    function addReputation($user, $reputation) {
        $newReputation = (int)($user["reputation"] + $reputation);
        $db = new DB();     
		$table = 'c_user';
        $dataArray = array("reputation" => $newReputation);
        $condition = " id=" . $user["id"];
        $db->update($table, $dataArray, $condition);

  
        $mc = Mc::singleton();
        $user["reputation"] = $newReputation;
        $mc->mset('c_user' . $user["id"], $user);
    }
    
  
	function updateDirectorProgress($user){
        $db=new DB();
        $db->update('c_user',array('progress'=>$user['progress']),' id='.$user['id']);
        

        $mc=Mc::singleton();
        $mc->mset('c_user'.$user['id'],$user);
    }


    function setQingfuInfo($user, $qingfushi) {
        $condition = " id=" . $user["id"];
        $db = new DB();   
		$db->update('c_user', array('qingfushi' => $qingfushi), $condition); 

        $mc = Mc::singleton();
        $user["qingfushi"] = $qingfushi;
        $mc->mset('c_user' . $user["id"], $user);
    }


    function getToplimitInZX($uid) {
        $userObj = $this->selectUser($uid);
        $level = $userObj['level'];
		$array = array(1=>0,2=>10,3=>20,4=>30,5=>40,6=>200);
		for($i=1;$i<=6;$i++){
			if($level>=$array[$i]&&$level<$array[$i+1]){
				return $i;
			}
		}  
    }


	function getUserFeixian($uid) {
        $db = new DB(); 
		$sql = "select * from c_feixian where user_id=$uid";
        $c_time = time();
		global $TODAY;
        $last_time = floor(($c_time - $TODAY) / (3 * 3600)) * 3 * 3600 + $TODAY;  
        $data = $db->get_one($sql);
        if ($data == null) {         
		$data = array('user_id' => $uid, 'last_time' => $last_time, 'num' => 1,'day_add'=>0,'num_add'=>0,'note'=>"");
            $db->insert("c_feixian", $data);
            return $data;
        } else {
            $gaptime = $last_time - $data['last_time'];
            $n = floor($gaptime / (3 * 60 * 60));
			if($n>0){
	            $data['num'] = $data['num'] + $n;
	            if ($data['num'] > 8) {
	                $data['num'] = 8;
	            }
				$data['last_time'] = $last_time;
	            $db->update("c_feixian", array('num' => $data['num'], 'last_time' => $last_time), "user_id=$uid");
			}
            return $data;
        }
    }

    function feixian($uid,$n=-1,$list=null) {
        $db = new DB();      
		$fei= $this->getUserFeixian($uid);
		$num = $fei['num']+$n;
		if($n==-1){  		
		$fx_note = $fei['note'];	
			if($fx_note){
				$array = json_decode($fx_note);
				array_push($array,$list);
				if(count($array)>=8){
					array_shift($array);  			
					}
				$fx_note = json_encode($array);
			}else{
				$fx_note = json_encode(array($list));	
			}
			$mc = Mc::singleton();
			$mc->mset("fxnote_"+$uid,$fx_note);
			$db->update("c_feixian", array('num' => $num,'note'=>$fx_note), "user_id=$uid");
		}else{  
			$addNum = $fei['num_add']+1;
			$db->update("c_feixian", array('num' => $num,'num_add'=>$addNum), "user_id=$uid");
		}
    }



    function getAllGuaji() {
        $mc = Mc::singleton();
        $data = $mc->get("s_guaji");
        if (!$data) {
            $db = new DB();        
			$sql = "select * from s_guaji";
            $data = $db->get_all($sql);
            $mc->mset('s_guaji', $data);     
			}
        return $data;
    }



    function getUserGuaji($uid) {
        $db = new DB();       
		$sql = "select * from c_guaji where user_id=$uid";
        $data = $db->get_one($sql);
		if(!$data){
			for($i=1;$i<=12;$i++){
				$id_array[$i] = 0;
			}
			$id_strs = json_encode($id_array);
			$data = array('user_id' =>$uid,'id_strs'=>$id_strs,'start_time'=>0,'last_time'=>0);
			$db->insert("c_guaji", $data);
			$data['id_strs'] = $id_array;
		}
		else{
			$data['id_strs'] = json_decode($data['id_strs']);
		}
        return $data;
    }

	function getUserYaoqianshu($uid) {
        $db = new DB();
        $sql = "select * from c_yaoqianshu where user_id=$uid";
        $data = $db->get_one($sql);
        return $data;
    }


    function updateUserYaoqianshu($uid, $array) {
        $db = new DB();       
		$gj = $this->getUserYaoqianshu($uid);
        if ($gj) {
            $db->update("c_yaoqianshu", $array, "user_id=$uid");
        } else {
            $db->insert("c_yaoqianshu", $array);
        }
    }

	function inserUserInfoRelatedVip($uid,$dataArray){
        $db=new DB();
        $db->insert('c_user_vip', $dataArray);
        $newID=$db->insert_id();
        $dataArray['id']=$newID;

        $mc = Mc::singleton();
        $mc->mset('c_user_vip'.$uid,$dataArray);
    }
    function selectUserInfoRelatedVip($uid){
        $db = new DB();    
		$mc = Mc::singleton();
        $data = $mc->get('c_user_vip'.$uid);
        if (!$data) {
            $sql = "select * from c_user_vip where user_id=$uid";
            $data = $db->get_one($sql);
            if ($data) {
                $mc->mset('c_user_vip'.$uid, $data);               
				return $data;
            }
            else{
                $db->insert('c_user_vip', array('user_id'=>$uid));
            }
        } else {
            return $data;
        }
    }

    function addUserTili($uid,$tili){
		$user = $this->selectUser($uid);
		$userStren=$this->selectUserInfoRelatedVip($uid);
	    $strenArray=  explode(',', $userStren['strength']);
	    $strenMax=Common::getMaxTiLi($this->getUserVipLevel($user['yb_total']));
	    if($strenArray[0]==$strenMax&&$tili<0){
	        $strenArray[1]=time();
	    }
	    $strenArray[0]=$strenArray[0]+$tili;
            /*
		if($strenArray[0]>$strenMax){
			$strenArray[0] = $strenMax;
		}*/
        $strenArray[0] = $strenArray[0]<0?0:$strenArray[0];
	    $dataArray=array('strength'=>$strenArray[0].','.$strenArray[1].','.$strenArray[2].','.$strenArray[3]);
	    $this->updateUserInfoRelatedVip($uid, $dataArray);
		$mc = Mc::singleton();
        $mc->delete('c_user_vip'.$uid);
		return $strenArray[0];
    }

	function updateUserInfoRelatedVip($uid,$dataArray){
        $db=new DB();
        $db->update('c_user_vip', $dataArray, 'user_id='.$uid);
        $mc = Mc::singleton();
        $data=$data = $mc->get('c_user_vip' . $uid);
        if($data){
            foreach($dataArray as $key => $value){
                $data[$key]=$value;
            }
            $mc->mset('c_user_vip'.$uid,$data);
        }
    }

	function checkOnLine($uid){
        $mc=Mc::singleton();
        $on=$mc->get("on".$uid);
        if($on)
            return 1;
        else
            return 0;
    }

	function addActiveDaily($uid,$num){
		global $TODAY;
		$db=new DB();
		$sql = "select * from c_rihuo where user_id=$uid";
		$rihuo = $db->get_one($sql);
		$data = null;
        if(!$rihuo){ 		
		$db->insert("c_rihuo", array('user_id' => $uid,'today'=>$TODAY,'num'=>$num));
			$data['new'] = 0;
			$data['num'] = $num;
        }else{       	
        	if($rihuo['today']==$TODAY){   		
			$n_num = $rihuo['num']+$num;
				$status = $rihuo['box_status'];
				$boxs = Common::judgeActiveDailyBox($status,$n_num);
				$db->update("c_rihuo", array('box_status' => $status,'num'=>$n_num),'user_id='.$uid);
				$data['new'] = 0;
				$data['num'] = $n_num;
				if($boxs){
					$data['new'] = 1;  
				}
        	}else{
				$db->update("c_rihuo", array('today'=>$TODAY,'num'=>$num,'box_status'=>'0,0,0,0,0' ),'user_id='.$uid);
				$data['new'] = 0;
				$data['num'] = $num;
        	}
        }	
		return $data;
	}

	function getUserDailyActive($uid){
		global $TODAY;
		$db=new DB();
		$sql = "select * from c_rihuo where user_id=$uid";
		$rihuo = $db->get_one($sql);
		if(!$rihuo){  		
		$rihuo = array('user_id' => $uid,'today'=>$TODAY,'num'=>0,'box_status'=>'0,0,0,0,0');
			$db->insert("c_rihuo", $rihuo);
        }else{
        	if($rihuo['today']!=$TODAY){     		
        		$rihuo = array('today'=>$TODAY,'box_status' => "0,0,0,0,0",'num'=>0);
				$db->update("c_rihuo",$rihuo,'user_id='.$uid);
			}
		}	
		return $rihuo;
	}

	function getUserAwardInfo($uid){
		$db=new DB();
		$sql = "select * from c_award where user_id=$uid";
		$award = $db->get_one($sql);
		if(!$award){
			$award = array('user_id' => $uid,'title_today'=>0,'salary_today'=>0,'paiming_num'=>"0:0",'fiexian_num'=>"0:0",'competitive_num'=>"0:0");
			$db->insert("c_award", $award);
		}
		return $award;
	}

    function searchByUserName($name){
        $db=new DB();
        $sql="select id from c_user_name where name='$name'";
        $data=$db->get_one($sql);
        return $data;
    }

	

    function getMapAward($user,$map_id){
    	$battle = new Battle();
    	$drop = $battle->selectMapDrop();
		$map_award = $drop[$map_id];
		if(!$map_award){
			return 0;
		}
		$userObj = new User();

		foreach ($map_award as $key => $value) {
			switch ($value['type']) {
                case 1:             	
				if(Common::isDrop($value['per'])){
                		$data['exp'] = $value['num'];
                		$userObj->addExp($user, $data['exp']);
                	}
                    break;
                case 2:             	
				if(Common::isDrop($value['per'])){
                		$data['gold'] = $value['num'];
                		$userObj->addGold($user, $data['gold']);
                		//Logger::writeGoldConsumeLog($user['id'], $user['account_id'], $user['account_type'], $data['gold'], "class/User.class.php");
                	}
                    break;
                case 3:				
				if(Common::isDrop($value['per'])){
                		$data['yb'] = $value['num'];
                		$userObj->addYB($user, $data['yb']);
                	}
                    break;
				case 6:				
				if(Common::isDrop($value['per'])){
                		$data['repu'] = $value['num'];
                		$userObj->addReputation($user, $data['repu']);
                	}
                    break;
            }
		}
    	return $data;
    }

	function updateDirector($uid,$dataArray){
    	$db=new DB();
        $db->update('c_battle', $dataArray, 'user_id='.$uid);
        
        $mc=Mc::singleton();
        $data=$mc->get("c_battle".$uid);
        if($data){
            foreach($dataArray as $key => $value){
                $data[$key]=$value;
            }
            $mc->mset('c_battle'.$uid,$data);
        }
    }

	function selectNum($arr,$start,$end){
		$db=new DB();
		$i=0;
		foreach($arr as $key=>$vv){
			$sql = "select create_time from c_user where id=$vv";
			$data = $db->get_one($sql);
			if($data['create_time']>=$start && $data['create_time']<=$end){
				$i++;
			}
		}
		return $i;
	}

	function createCode($code){
		$db=new DB();	
		foreach($code as $key=>$val){
			$changeCode['code_id'] = $val['code_id'];
			$changeCode['type'] = $val['type'];
			$db->insert("s_activation", $changeCode);
		}
	}
	

	function rand_num($rand)
	{
	    $n = mt_rand(10000000,99999999);
		foreach($rand as $key=>$val){
			if(in_array($n,$val)){
				$this->rand_num($rand);
			}
		}
	    return $n;
	}

	function getCode(){
		$db=new DB();
		$sql = "select * from s_activation";
		$query = $db->query($sql);
		while($row = mysql_fetch_array($query)){
			$info[$row['code_id']]['code_id'] = $row['code_id'];
			$info[$row['code_id']]['type'] = $row['type'];
		}
		return $info;
	}
	


	
	function actionCard($uid,$code){
		$db=new DB();
		$sql = "select code_id from s_activation where code_id='$code'";
		$query = $db->query($sql);
		while($row = mysql_fetch_array($query)){
			$isCode['code_id'] = $row['code_id'];
		}
		if(count($isCode)<=0){
			return 4;
		}
		
		$sql2 = "select user_id,code_id from c_user_activation where code_id='$code'";
		$query2 = $db->query($sql2);
		$num=0;
		while($row = mysql_fetch_array($query2)){
			$num++;
		}
		if($num>0){
			return 5;
		}
		$cardType = substr($code,0,1);

		$sql1 = "select user_id,code_id from c_user_activation where user_id=$uid";
		$query1 = $db->query($sql1);
		$info = array();
		while($row = mysql_fetch_array($query1)){
			$info[$row['code_id']]['user_id'] = $row['user_id'];
			$info[$row['code_id']]['code_id'] = $row['code_id'];
		}
		$flag=0; 	
		if(count($info)>0){ 		
		foreach($info as $key=>$val){
				if(substr($val['code_id'],0,1)==$cardType){
					$flag=1;
				}
			}
			if($flag==1){ 			
				return 3;
			}else{
				$codeInfo['user_id'] = $uid;
				$codeInfo['code_id'] = $code;
				$codeInfo['get_time'] = time();
				$db->insert('c_user_activation', $codeInfo);
				return $cardType; 
			}
		}else{
			$codeInfo['user_id'] = $uid;
			$codeInfo['code_id'] = $code;
			$codeInfo['get_time'] = time();
			$db->insert('c_user_activation', $codeInfo);
			return $cardType; 
		}
	}
}
?>
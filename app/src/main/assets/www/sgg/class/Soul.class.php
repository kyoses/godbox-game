<?php
 
include_once dirname(__FILE__).'/../Lib.php';
class Soul{
	
	public function getUserJuhunInfo($uid){
		$mc=Mc::singleton();
        $data=$mc->get("juhun".$uid);
		if(!$data){
			$db=new DB();
			$sql = "select * from c_user_soul where user_id=$uid";
			$data = $db->get_one($sql);
			if(!$data){
				$data = array('user_id' =>$uid,'green_soul'=>0,'blue_soul'=>0,'purple_soul'=>0,'orange_soul'=>0);
				// $left_soul = array(array('type' =>1,'num'=>0),array('type' =>1,'num'=>0),
				                   // array('type' =>1,'num'=>0),array('type' =>1,'num'=>0) , 
				                   // array('type' =>1,'num'=>0),array('type' =>1,'num'=>0));
				// $data['left_soul'] = json_encode($left_soul);
				$mc->mset("juhun".$uid,$data);
				$db->insert('c_user_soul', $data);
			}
		}
		return $data;
	}
	

	public function gatherGreenSoul(){
		$left_soul = array();
		for($i=0;$i<6;$i++){
			$random = rand(1,100);
			if($random<=85){  
				$type = 1;
			}else{
				$type = 2;
			}
			$num = $this->gatherNumOfSoul();
			array_push($left_soul,array('type'=>$type,'num'=>$num));
		}
		return $left_soul;
	}
	
	public function gatherBlueSoul(){
		$left_soul = array();
		for($i=0;$i<6;$i++){
			$random = rand(1,100);
			if($random<=90){  
				$type = 2;
			}else{
				$type = 3;
			}
			$num = $this->gatherNumOfSoul();
			array_push($left_soul,array('type'=>$type,'num'=>$num));
		}
		return $left_soul;
	}
	

	public function gatherPurpleSoul(){
		$left_soul = array();
		for($i=0;$i<6;$i++){
			$random = rand(1,100);
			if($random<=90){  
				$type = 3;
			}else{
				$type = 4;
			}
			$num = $this->gatherNumOfSoul();
			array_push($left_soul,array('type'=>$type,'num'=>$num));
		}
		return $left_soul;
	}
	

	public function gatherNumOfSoul(){
		$random = rand(1,100);
		if($random<=10){
			return 3;
		}else if($random>10&&$random<=50){
			return 5;
		}else if($random>50&&$random<=75){
			return 7;
		}else if($random>75&&$random<=90){
			return 10;
		}else if($random>90&&$random<=100){
			return 15;
		}
	}
	
 
	public function updateUserSoul($uid,$array){
		$db = new DB();
		$db->update('c_user_soul',$array,'user_id='.$uid);
		$mc=Mc::singleton();
        $mc->delete("juhun".$uid);
	}
}
?>
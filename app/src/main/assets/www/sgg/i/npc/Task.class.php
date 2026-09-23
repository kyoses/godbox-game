<?php

include_once dirname(__FILE__).'/../Lib.php';
class Task{
 
    function selectTask(){
        $mc = Mc::singleton();
        $data = $mc->get("s_task");
        if(!$data){
            $db = new DB();      
			$sql = "select * from s_task";
            $data = $db->get_all($sql);
            $mc->mset('s_task',$data);       
			}
        return $data;
    }

    function selectTaskStep(){
        $mc = Mc::singleton();
        $data = $mc->get("s_task_step");
        if(!$data){
            $db = new DB();           
			$sql = "select * from s_task_step";
            $query = $db->query($sql);
            while($row = $db->fetch_array($query)) {
                $data[$row['task_id']][$row['id']]=$row;
            }
            $mc->mset('s_task_step',$data);       
			}
        return $data;
    }

    function selectTaskCondition(){
        $mc = Mc::singleton();
        $data = $mc->get("s_task_condition");
        if(!$data){
            $db = new DB();          
			$sql = "select * from s_task_condition";
            $query = $db->query($sql);
            while($row = $db->fetch_array($query)) {
                $data[$row['task_id']]=$row;
            }
            $mc->mset('s_task_condition',$data);       
			}
        return $data;
    }
   
    function selectTaskReward(){
        $mc = Mc::singleton();
        $data = $mc->get("s_task_reward");
        if(!$data){
            $db = new DB();          
			$sql = "select * from s_task_reward";
            $query = $db->query($sql);
            while($row = $db->fetch_array($query)) {
                $data[$row['task_id']][$row['id']]=$row;
            }
            $mc->mset('s_task_reward',$data);       
			}
        return $data;        
    }
 
	function getUserTask($uid){
        $mc = Mc::singleton();
        $data = $mc->get("c_task".$uid);
        if(!$data){
            $db = new DB();          
			$sql = "select * from c_task where user_id=".$uid." order by id desc";
            $query=$db->query($sql);
            while($row = $db->fetch_array($query)) {
                $data[$row['task_id']]=$row;
            }
            $mc->mset("c_task".$uid,$data);       
			}
        return $data;
    }
  
	function getUserTaskCondition($uid){
        $mc = Mc::singleton();
        $data = $mc->get("c_task_condition".$uid);
        if(!$data){
            $db = new DB();            
			$sql = "select * from c_task_condition where user_id=".$uid;
            $query=$db->query($sql);
            while($row = $db->fetch_array($query)) {
                $data[$row['task_id']]=$row;
            }
            $mc->mset("c_task_condition".$uid,$data);      
			}
        return $data;

    }


    function getUserTaskInfo($uid){
        $userTask=$this->getUserTask($uid);
        $task=$this->selectTask();
        $reword=$this->selectTaskReward();
        $userTaskCondition=$this->getUserTaskCondition($uid);
        
		$battleObj = new Battle();
        $ubattle = $battleObj->selectUserBattle($uid);
        if($ubattle){
            $ubid = $ubattle['battle_id'];
            $s_battle = $battleObj->selectBattleTargetObj($ubid);
			$ubid_order = $s_battle['battle_order']; 
        }
        else{
            $ubid=0;
        }
		if($userTask){
	        foreach($userTask as $row){
	            $taskID=$row["task_id"];
	            $data[$taskID]["id"]=$row["id"];
	            $data[$taskID]["task_id"]=$row["task_id"];
	            $data[$taskID]["status"]=$row["status"];
	            $data[$taskID]["name"]=$task[$taskID]["name"];
				$data[$taskID]["info"]=$task[$taskID]["info"];
	            $data[$taskID]["type"]=$task[$taskID]["type"];
	            $data[$taskID]["typeName"]=intval($task[$taskID]["type"])==1?"涓荤嚎":"鏀嚎";
	            $data[$taskID]["battle_id"]=$task[$taskID]["battle_id"];
				$task_battle = $battleObj->selectBattleTargetObj($task[$taskID]["battle_id"]);
				$data[$taskID]["battle_order"] = $task_battle['battle_order'];
				$data[$taskID]["battle_type"] = $task_battle['type'];
	            if(!$sysBattle){
	                $battle=new Battle();
	                $sysBattle=$battle->selectBattle();
	            }
	            $data[$taskID]["battle_name"]=$sysBattle[$data[$taskID]["battle_id"]]["name"];
	            $data[$taskID]["map_id"]=$sysBattle[$data[$taskID]["battle_id"]]["map_id"];
	            $data[$taskID]["user_bid"]=$ubid;
				$data[$taskID]["user_bid_order"]=$ubid_order; 				
	            $user_jybattle = $battleObj->selectUserJYBattle($uid);
				$user_jy = $battleObj->selectBattleTargetObj($user_jybattle['battle_id']);
				$data[$taskID]["user_jy_order"] = $user_jy['battle_order'];
	            $data[$taskID]["img"]=$task[$taskID]["img"];
	
	            $data[$taskID]["conType"]=$userTaskCondition[$taskID]["type"];
	            $data[$taskID]["conValue"]=$userTaskCondition[$taskID]["value"];
	            $data[$taskID]["conNum"]=$userTaskCondition[$taskID]["num"];
	            $data[$taskID]["conFinished"]=$userTaskCondition[$taskID]["finished"]?$userTaskCondition[$taskID]["finished"]:0;
							
				$data[$taskID]["conFinished"] = $data[$taskID]["conFinished"]>$data[$taskID]["conNum"]?$data[$taskID]["conNum"]:$data[$taskID]["conFinished"];
	            if($data[$taskID]["status"]){
	            	$data[$taskID]["conFinished"] = $data[$taskID]["conNum"];
	            }
	            $data[$taskID]["reward"]=$reword[$taskID];
	            if($data[$taskID]["reward"]){
	                foreach($data[$taskID]["reward"] as $key=>$rewordRow){
	                    if($rewordRow["type"]==3){                                                    
						if(!$sysProp){
	                            $prop=new Prop();
	                            $sysProp=$prop->selectProp();
	                            $data[$taskID]["reward"][$key]["propName"]=$sysProp[$rewordRow["value"]]["name"];                        }
	                    }
	                    if($rewordRow["type"]==4){                                               
						$equip=new Equip();
                            $allEquip=$equip->selectEquip();
                            $data[$taskID]["reward"][$key]["equipName"]=$allEquip[$rewordRow["value"]]["name"];
							}
						
	                }
	            }
	        }
        }else{
        	return null;
        }
        if(count($data))
            return $data;
    }

    function removeTask($uid,$taskID){
        $db = new DB();      
		$db->delete("c_task", "user_id=$uid and task_id=$taskID");
        $db->delete("c_task_condition","user_id=$uid and task_id=$taskID");
    }

 
    function startNewTask($uid,$finishedTaskID){
        $task=$this->selectTask();
        if($task[$finishedTaskID]["next"]){
   
            $taskCondition=$this->selectTaskCondition();
            $taskIDS=explode(",", $task[$finishedTaskID]["next"]);

            foreach($taskIDS as $taskID){
                foreach($taskCondition[$taskID] as $value){
                    if($value["type"]==1){                       
					continue;
                    }
                    else if($value["type"]==2 && !$type_2){  
                        $type_2=1;
                    }else if($value["type"]==3 && !$type_3){   
                        $type_3=1;
                    }else if($value["type"]==4 && !$type_4){  
                    	$type_4=1;
                    }else if($value["type"]==5 && !$type_5){  
                    	$type_5=1;
                    }else if($value["type"]==6 && !$type_6){  
                    	$type_6=1;
                    }
                }
            }
            if($type_2){               
			$battle=new Battle();
                $u_battle = $battle->selectUserBattle($uid);               
				$u_jy_battle = $battle->selectUserJYBattle($uid);
                $battleAll=$battle->selectBattle();
            }
            if($type_3){  
                $prop=new Prop();
                $allProp=$prop->getUserBagProp($uid);
                if(!empty($allProp)){
                	foreach($allProp as $one){
                    	if($one["type"]!=1){
                        	unset($one);
						}
               		}
                }
            }
            foreach($taskIDS as $taskID){
                $this->insertTask($uid, $taskID, $taskCondition,$allProp,$u_battle['battle_id'],$u_jy_battle['battle_id'],$battleAll);
            }
        }
    }
 
    function insertTask($uid,$taskID,$taskCondition,$ucailiao='',$ubattleid='',$ujybattleid='',$battleAll=null){
        // if(!$taskCondition)
            // $taskCondition=$this->selectTaskCondition();
        $db=new DB();

        $finished=0;
        $status=0;
		
	
		if($taskCondition[$taskID]["type"]==2){
     
        	$TaskAll = $this->selectTask();
			$bid = $TaskAll[$taskID]['battle_id'];
	
			if($battleAll[$bid]['type']==1){	
				if($battleAll[$taskCondition[$taskID]["value"]]['battle_order']<$battleAll[$ubattleid]['battle_order']){
	                $status=1;
					$finished = $taskCondition[$taskID]["num"];  
				}
			}else if($battleAll[$bid]['type']==2){  
				if($battleAll[$taskCondition[$taskID]["value"]]['battle_order']<$battleAll[$ujybattleid]['battle_order']){
	                $status=1;
					$finished = $taskCondition[$taskID]["num"];  
				}
			}
        }else if($taskCondition[$taskID]["type"]==3){            
		foreach($ucailiao as $one){
                if($one["prop_id"]==$taskCondition[$taskID]["value"]){
                    $finished+=$one["num"];
                    if($finished>=$taskCondition[$taskID]["num"]){
                        break;
					}
                }
            }
            if($finished>=$taskCondition[$taskID]["num"]){
                $status=1;
            }else{
                $status=0;
			}
        }else if($taskCondition[$taskID]["type"]==4){  
        	$npc = new Npc();
			$userNpc = $npc->getUserNpcList($uid);
			$finished = 0;
			$taskCondition[$taskID]["num"]=1;
			foreach ($userNpc as $key => $value) {
				if($value['npc_id']==$taskCondition[$taskID]["value"]){
					//Logger::writeTestLog("zhaomu task is".$value['npc_id']." ");
					$finished = 1;
					$status = 1;
					break;
				}
			}
        }else if($taskCondition[$taskID]["type"]==5){  
        	$battle = new Battle();
        	$NumInFormation = $battle->getNpcNumOfFormation($uid);
			$finished = $NumInFormation;
			$taskCondition[$taskID]["num"] = $taskCondition[$taskID]["value"];
			if($NumInFormation>=(int)$taskCondition[$taskID]["value"]){
				//Logger::writeTestLog("buzhen task is".$NumInFormation." ");
				$status = 1;
			}
        }else if($taskCondition[$taskID]["type"]==6){  
        	$equip = new Equip();
			$userEquip = $equip->getUserAllEquipNoAttr($uid);
			$finished = 0;
			$taskCondition[$taskID]["num"] = $taskCondition[$taskID]["value"];
			foreach ($userEquip as $key => $value) {
				if($finished<=$value['up_level']){
					$finished = $value['up_level'];
				}
				if($value['up_level']>=$taskCondition[$taskID]["value"]){
					//Logger::writeTestLog("qianghua task is".$taskCondition[$taskID]["value"]." ");
					$status = 1;
					break;
				}
			}
        }
        
      
        $dataArray=array("user_id"=>$uid,"task_id"=>$taskID,"status"=>$status);
		//Utils::dump($dataArray);exit;
        $db->insert("c_task", $dataArray);
  
        $dataArray=array("user_id"=>$uid,"task_id"=>$taskID,"type"=>$taskCondition[$taskID]["type"],"value"=>$taskCondition[$taskID]["value"],"num"=>$taskCondition[$taskID]["num"],"finished"=>$finished);
        $db->insert("c_task_condition", $dataArray);
    }


	function takeTask($uid,$taskID){
        $userTask=$this->getUserTask($uid);
        if(!$userTask[$taskID]){
            return;
		}
        $userTaskCondition=$this->getUserTaskCondition($uid);
        if($userTaskCondition[$taskID]){
            if($userTaskCondition[$taskID]["type"]==1||$userTaskCondition[$taskID]["type"]==3){ 
                if(intval($userTaskCondition[$taskID]["finished"])<intval($userTaskCondition[$taskID]["num"]))
                    return;                           
            }
            else{
                if($userTask[$taskID]["status"]==0){ 
                    return;
                }
            }
        }
        
        $reward=$this->selectTaskReward();
        $taskReward=$reward[$taskID];

        $this->removeTask($uid, $taskID);
        if($taskReward){
            $this->receiveReward($uid,$taskReward,$taskID,$userTask,$userTaskCondition);
		}
        $this->startNewTask($uid, $taskID);

       
        $mc = Mc::singleton();
        $mc->delete("c_task".$uid);
        $mc->delete("c_task_condition".$uid);
    }
 
    function receiveReward($uid,$reward,$finishedTaskID,$userTask,$userTaskCondition){
        $db=new DB();       
		$battleObj=new Battle();
        $u_battle = $battleObj->selectUserBattle($uid);     
		$npcObj=new Npc();
        $userNpc=$npcObj->getUserNpcList($uid);
        $allNpc=$npcObj->selectNpc();
		$userObj=new User();
        $user=$userObj->selectUser($uid);
        foreach($reward as $row){    
			if($row["type"]==1){              
			$userObj->addGold($user, $row["value"]);
				//Logger::writeGoldConsumeLog($uid, $user['account_id'], $user['account_type'], $row["value"], "class/Task.class.php");
            }else if($row["type"]==2){
				$data["userLevel"]=$userObj->addExp($user, $row["value"]);
                            
				$formation=$battleObj->formationStringToArray($u_battle["formation"]);              
				foreach($formation as $value){                
				foreach($value as $v){                      
				if($v>0&&$userNpc[$v]["level"]<$user["level"]){ 
						$data["npc"][$v]["newLevel"]=$npcObj->addNpcExp($userNpc, $row["value"], $v);
                            if($data["npc"][$v]["newLevel"]){
                                $data["npc"][$v]["name"]=$allNpc[$userNpc[$v]["npc_id"]]["name"];                            }
                        }
                    }
                }
            }else if($row["type"]==3){             
			$propObj=new Prop();
                $prop=$propObj->getTargetProp($row["value"]);
                $propObj->addProp($uid,$prop,$row["num"]);
            }else if($row["type"]==4){            
			$equipObj=new Equip();
                $equipTem=$equipObj->getTargetEquip($row["value"]);
                $equip=array("user_id"=>$uid,"equip_id"=>$row["value"],"up_level"=>1,"hole_1"=>0,"hole_2"=>0,"hole_3"=>0,"open_1"=>0,"open_2"=>0,"open_3"=>0,"status"=>0,info=>"");
                $equipObj->addUserEquip($uid, $equip);
            }else if($row["type"]==5){   
				$userObj->addYB($user, $row["value"]);
               // Logger::writeConsumeLog($uid, $user['account_id'], 0, $row["value"], "class/Task.class.php");
            }else if($row["type"]==6){   
				$userObj->addReputation($user, $row["value"]);
            }
        }

        if(count($data))
            return $data;
    }

  
function refreshTaskAfterBattle($uid,$battle_id,$num=1){
        $npcObj=new Npc();
        $allSysNpc=$npcObj->selectSysNpcObj();
        $battle=new Battle();
        $userTaskCondition=$this->getUserTaskCondition($uid);
        if(!$userTaskCondition){ 
            return;
        }
        $hasRefreshed=FALSE;
        foreach($userTaskCondition as $row){
            if($row["type"]==1){                                 
			if(intval($row["finished"])>=intval($row["num"]))               
			continue;
                
                if(!$monsterIDS){
                    $allBattle=$battle->selectBattle();
                    $rowIDS=$battle->formationStringToArray($allBattle[$battle_id]["formation"]);
                    foreach($rowIDS as $mosterRow){
                        foreach ($mosterRow as $mosterid){
                            if($mosterid>0){
                                $monsterIDS[]=$allSysNpc[$mosterid]["npc_id"];
                            }
                        }
                    }
                }
                $count=0; 
                foreach($monsterIDS as $id){
                    if($row["value"]==$id)
                        $count++;
                }
				$count*=$num;
                if($count>0){
                    if(!$db)
                        $db=new DB();
                    $finished=$row["finished"];
                    $finished=($finished+$count>=$row["num"]?$row["num"]:$finished+$count);
                    $db->update("c_task_condition", array("finished"=>$row["finished"]+$count),"user_id=$uid and task_id=".$row["task_id"]);                 
					if($finished>=$row["num"])
                        $db->update("c_task",array("status"=>1),"user_id=$uid and task_id=".$row["task_id"]);                 
						$hasRefreshed=TRUE;
                }
            }
            else if($row["type"]==2){           
                if(!$userTask)
                    $userTask=$this->getUserTask($uid);
                
                if($userTask[$row["task_id"]]["status"]==1)                    
					continue;
                if($row["value"]==$battle_id){
                    if(!$db)
                        $db=new DB();
                    $db->update("c_task",array("status"=>1),"user_id=$uid and task_id=".$row["task_id"]); 
                    $db->update("c_task_condition", array("finished"=>1),"user_id=$uid and task_id=".$row["task_id"]);              
					$hasRefreshed=TRUE;
                }
            }
        }
     
        if($hasRefreshed){
     
            $mc = Mc::singleton();
            $mc->delete("c_task".$uid);
            $mc->delete("c_task_condition".$uid);
        }
    }
   
	function refreshTaskAfterAddProp($uid,$prop_id,$num=1){
        $userTask=$this->getUserTask($uid);
        $userTaskCondition=$this->getUserTaskCondition($uid);
        $hasRefreshed=FALSE;
        $prop=new Prop();
        $userProp=$prop->getUserBagProp($uid);
        $left_num=0;                       
        if($userProp){
            foreach($userProp as $one){
                if($one["prop_id"]==$prop_id){
                    $left_num+=$one["num"];
                }
            }
        }
        if($userTaskCondition){
            foreach($userTaskCondition as $row){
                if($row["type"]==3&&$row["value"]==$prop_id){                   
					if($userTask[$row["tast_id"]]["status"]==0){  
                        if($left_num>=$row["num"]){
                            $finished=$row["num"];
                        }
                        else{
                            $finished=$left_num;
                        }
                        if(!$db)
                            $db=new DB();
                        $db->update("c_task_condition", array("finished"=>$finished),"user_id=$uid and task_id=".$row["task_id"]);
                        if($finished>=$row["num"])
                            $db->update("c_task",array("status"=>1),"user_id=$uid and task_id=".$row["task_id"]);
                        $hasRefreshed=TRUE;
                    }
                }
            }
        }
    
        if($hasRefreshed){
       
            $mc = Mc::singleton();
            $mc->delete("c_task".$uid);
            $mc->delete("c_task_condition".$uid);
        }
    }
    //
  
    function refreshTaskAfterSellProp($uid,$prop_id,$num=1){
        $userTask=$this->getUserTask($uid);
        $userTaskCondition=$this->getUserTaskCondition($uid);
        $hasRefreshed=FALSE;
        $prop=new Prop();
        $userProp=$prop->getUserBagProp($uid);
        $left_num=0;         
        foreach($userProp as $one){
            if($userProp["prop_id"]==$prop_id){
                $left_num+=$userProp["num"];
            }
        }
        foreach($userTaskCondition as $row){
            if($left_num<$row["num"]){               
			if($row["type"]==3&&$row["value"]==$prop_id){                 
			if(!$db){
                        $db=new DB();
					}
                    $db->update("c_task_condition", array("finished"=>$left_num),"user_id=$uid and task_id=".$row["task_id"]);
                    $db->update("c_task",array("status"=>0),"user_id=$uid and task_id=".$row["task_id"]);
                    $hasRefreshed=TRUE;
                }
            }
        }
     
        if($hasRefreshed){
     
            $mc = Mc::singleton();
            $mc->delete("c_task".$uid);
            $mc->delete("c_task_condition".$uid);
        }
    }

	function refreshTaskAfterZhaomu($uid){
		$userTask=$this->getUserTask($uid);
		$userTaskCondition=$this->getUserTaskCondition($uid);  	
		if($userTaskCondition){
            foreach($userTaskCondition as $row){
                if($row["type"]==4){
                	$npc = new Npc();
					$userNpc = $npc->getUserNpcList($uid);
					$hasNpc = 0;  
					foreach ($userNpc as $key => $value) {
						if($value['npc_id']==$row["value"]){
							$hasNpc = 1;
							break;
						}
					}
                    if($hasNpc&&$userTask[$row["tast_id"]]["status"]==0){                        
					$db=new DB();
                        $db->update("c_task",array("status"=>1),"user_id=$uid and task_id=".$row["task_id"]);
						$db->update("c_task_condition", array("finished"=>1),"user_id=$uid and task_id=".$row["task_id"]);
                        $hasRefreshed=TRUE;
                    }
                }
            }
        }

        if($hasRefreshed){
     
            $mc = Mc::singleton();
            $mc->delete("c_task".$uid);
            $mc->delete("c_task_condition".$uid);
        }
	}
  
	function refreshTaskAfterBuzhen($uid){
    	$battle = new Battle();
        $NumInFormation = $battle->getNpcNumOfFormation($uid);
		$userTask=$this->getUserTask($uid);
		$userTaskCondition=$this->getUserTaskCondition($uid);  
		if($userTaskCondition){
            foreach($userTaskCondition as $row){
                if($row["type"]==5){
				if($NumInFormation>=$row["value"]&&$userTask[$row["tast_id"]]["status"]==0){ 
				$db=new DB();
                        $db->update("c_task",array("status"=>1),"user_id=$uid and task_id=".$row["task_id"]);
						//Logger::writeTestLog("shangzhentaskFRESH is".$row["value"]." ");
                        $hasRefreshed=TRUE;
                    }
					$db=new DB();
					$db->update("c_task_condition", array("finished"=>$NumInFormation),"user_id=$uid and task_id=".$row["task_id"]);
                }
            }
        }
		
	 
        if($hasRefreshed){
       
            $mc = Mc::singleton();
            $mc->delete("c_task".$uid);
            $mc->delete("c_task_condition".$uid);
        }
    }
 
	function refreshTaskAfterQianghua($uid){
		$userTask=$this->getUserTask($uid);
		$userTaskCondition=$this->getUserTaskCondition($uid);  
		if($userTaskCondition){
            foreach($userTaskCondition as $row){
                if($row["type"]==6){          
					$equip = new Equip();
					$userEquip = $equip->getUserAllEquipNoAttr($uid);
					$isOk = 0;
					$level = 0;
					foreach ($userEquip as $key => $value) {
						if($level<=$value['up_level']){
							$level = $value['up_level'];
						}
					}
                
                    if($level>=$row["value"]&&$userTask[$row["tast_id"]]["status"]==0){                        
						$db=new DB();
                        $db->update("c_task",array("status"=>1),"user_id=$uid and task_id=".$row["task_id"]);
                        $hasRefreshed=TRUE;
						//Logger::writeTestLog("qianghua taskFRESH is".$row["task_id"]." ");
                    }
					$db=new DB();
					$db->update("c_task_condition", array("finished"=>$level),"user_id=$uid and task_id=".$row["task_id"]);
                }
            }
        }
		
		 
        if($hasRefreshed){
         
            $mc = Mc::singleton();
            $mc->delete("c_task".$uid);
            $mc->delete("c_task_condition".$uid);
        }
	}
   
    function orderTask($userTaskInfo){
     		
		foreach ($userTaskInfo as $key => $value) {
			if($userTaskInfo[$key]["status"]==1){  			
				$task_finish[] = $value;
			}else{
				$task_unfinish[] = $value;
			}
		}
		$newTaskArray = array();
	 		
		if(count($task_finish)>0){
			$task_finish = $this->orderByMainAndTarget($task_finish);
			$newTaskArray = $task_finish;
		}
		if(count($task_unfinish)>0){
			$task_unfinish = $this->orderByMainAndTarget($task_unfinish);
			if(count($newTaskArray)>0){
				$newTaskArray = array_merge($newTaskArray, $task_unfinish);
			}else{
				$newTaskArray = $task_unfinish;
			}
		}
		return $newTaskArray;
	}
	 
	function orderByMainAndTarget($task_array){
 		
		foreach ($task_array as $key => $value) {
			if($value["type"]==1){
				$main[] = $value;
			}else{
				$branch[] = $value;
			}
		}
		$task_array = array();  
		if(count($main)>0){
			Utils::orderArray($main, "conType");
			$task_array = array_merge($task_array, $main);
		}
		if(count($branch)>0){
			Utils::orderArray($branch, "conType");
			$task_array = array_merge($task_array, $branch);
		}
		return $task_array;
	}
}
?>

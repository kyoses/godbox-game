<?php



include_once dirname(__FILE__) . '/../Lib.php';

class Prop {



    function selectProp() {
        $mc = Mc::singleton();
        $data = $mc->get("s_prop");
        if (!$data) {
            $db = new DB();         
			$sql = "select * from s_prop";
            $data = $db->get_all($sql);
            $mc->mset('s_prop', $data);      
			}
        return $data;
    }

   
    function selectPropGift() {
        $mc = Mc::singleton();
        $data = $mc->get("s_prop_gift");
        if (!$data) {
            $db = new DB();          
			$sql = "select * from s_prop_gift";
            $query = $db->query($sql);
            while ($row = $db->fetch_array($query)) {
                $data[$row['prop_id']][$row['id']] = $row;
            }
            $mc->mset('s_prop_gift', $data);       
			}
        return $data;
    }

   
	function addProp($uid, $prop, $num = 1) {
        $mc = Mc::singleton();
        $mc->delete('c_prop' . $uid);
        $db = new DB();        
		$sql = "select * from c_prop where user_id=$uid";
        $data = $db->get_all($sql);
        if (count($data) > 0) {
            foreach ($data as $key => $value) {  
                if ($value['prop_id'] == $prop['id'] && $value["status"] == 0) {               
				if ($value['num'] < $prop['stack']) {                       
				$left_num = $value['num'] + $num - $prop['stack'];                      
				if ($left_num > 0) {  
                            $sql = "update c_prop set num=" . $prop['stack'] . " where id=" . $value['id'];
                            $db->query($sql);
                            $num = $left_num;                     
							} else {
                            $sql = "update c_prop set num=num+$num where id=" . $value['id'];
                            $db->query($sql);
                            $num = 0;  
                        }
                    }
                }
            }
        }
        if ($num > 0) {          
		$n = $num / $prop['stack']; 
            $m = $num % $prop['stack']; 
            if ($n >= 1) {  
                for ($i = 0; $i < $n; $i++) {
                    $sql = "insert c_prop(user_id,prop_id,num)values('$uid'," . $prop['id'] . "," . $prop['stack'] . ")";
                    $db->query($sql);
                }
            }
            if ($m > 0) {  
                $sql = "insert c_prop(user_id,prop_id,num)values('$uid'," . $prop['id'] . "," . $m . ")";
                $db->query($sql);
            }
        }
        if ($prop["type"] == 1||$prop["type"] == 5) {
            $taskObj = new Task();
            $taskObj->refreshTaskAfterAddProp($uid, $prop["id"], $num);
        }


        $this->deleteSortDJFromMC($uid);
        $this->deleteSortFZFromMC($uid);
    }


	function deleteProp($uid, $prop, $num = 1) {
        $mc = Mc::singleton();
        $mc->delete('c_prop' . $uid);
        $db = new DB();     
		$sql = "select * from c_prop where user_id=$uid";
        $data = $db->get_all($sql);
        if (count($data) > 0) {
            foreach ($data as $key => $value) {
                if ($value['prop_id'] == $prop['id'] && $value["status"] == 0) {                 
				if ($value['num'] > $num) {
                        $sql = "update c_prop set num = num - $num where id=" . $value['id'];
                        $db->query($sql);
                        break;
                    } else {
                        $sql = "delete from c_prop where id=" . $value['id'];
                        $db->query($sql);
                        $num -= $value['num'];
                        if ($num <= 0) {
                            break;
                        }
                    }
                }
            }
        }


        $this->deleteSortDJFromMC($uid);
        $this->deleteSortFZFromMC($uid);
    }


    function selectZhoufu() {
        $mc = Mc::singleton();
        $data = $mc->get("s_zhoufu");
        if (!$data) {
            $prop = $this->selectProp();
            foreach ($prop as $k => $v) {
                if ($v['type'] == 4) {
                    $data[$v['class']][] = $v;
                }
            }
            $mc->mset('s_zhoufu', $data);      
			}
        return $data;
    }

    /*     * ***************************c_qingfu****************************** */


    function getZhoufuHecheng() {
        $mc = Mc::singleton();
        $data = $mc->get("zhoufuhecheng");
        if (!$data) {
            $db = new DB();          
			$sql = "select * from s_zhoufu";
            $allzhoufuHC = $db->get_all($sql);           
			foreach ($allzhoufuHC as $k => $v) {
                $data[$v['o_prop_id']] = $v;
            }
            $mc->mset("zhoufuhecheng", $data);     
			}
        return $data;
    }

    function randomZhoufuType($zfs_id) {
        $r_n = rand(0, 1000);
        switch ($zfs_id) {
            case 1:
                if ($r_n < 390) {                   //39% 
                    $type = 1;
                } else if ($r_n == 391) {             //0.1%
                    $type = 2;
                } else if ($r_n > 391 && $r_n < 401) {   //0.9%
                    $type = 4;
                } else {                          //60%
                    $type = 7;
                }
                break;
            case 2:
                if ($r_n < 400) {                   //40%
                    $type = 1;
                } else if ($r_n > 399 && $r_n < 409) {   //0.9%
                    $type = 2;
                } else if ($r_n > 409 && $r_n < 500) {   //9%
                    $type = 4;
                } else if ($r_n == 500) {            //0.1%
                    $type = 5;
                } else {                          //50%
                    $type = 7;
                }
                break;
            case 3:
                if ($r_n < 500) {                   //50%
                    $type = 1;
                } else if ($r_n > 499 && $r_n < 590) {   //9%
                    $type = 2;
                } else if ($r_n == 590) {            //0.1%
                    $type = 3;
                } else if ($r_n > 590 && $r_n < 691) {   //10%
                    $type = 4;
                } else if ($r_n > 690 && $r_n < 700) {   //0.9%
                    $type = 5;
                } else {                          //30%
                    $type = 7;
                }
                break;
            case 4:
                if ($r_n < 390) {                    //39%
                    $type = 1;
                } else if ($r_n > 389 && $r_n < 490) {    //10%
                    $type = 2;
                } else if ($r_n > 489 && $r_n < 500) {    //1%
                    $type = 3;
                } else if ($r_n > 499 && $r_n < 700) {    //20%
                    $type = 4;
                } else if ($r_n > 699 && $r_n < 750) {    //5%
                    $type = 5;
                } else {                           //25%
                    $type = 7;
                }
                break;
            case 5:
                if ($r_n < 300) {                    //30%
                    $type = 1;
                } else if ($r_n > 299 && $r_n < 500) {    //20%                 //
                    $type = 2;
                } else if ($r_n > 499 && $r_n < 550) {    //5%
                    $type = 3;
                } else if ($r_n > 549 && $r_n < 850) {    //30%
                    $type = 4;
                } else if ($r_n > 849 && $r_n < 950) {    //10%
                    $type = 5;
                } else {                           //5%
                    $type = 6;
                }
                break;
        }
        return $type;
    }

 
    function getUserZhoufu($uid) {
        $mcKey = "zhoufu_" . $uid;
        $mc = Mc::singleton();
        $data = $mc->get($mcKey);
        if (!$data) {
            $db = new DB();          
			$sql = "select * from c_qingfu where user_id=" . $uid;
            $data = $db->get_all($sql);
            $mc->mset($mcKey, $data);      
			}
        return $data;
    }

    
	function insertZhoufu($uid, $zhoufu) {
        $db = new DB();     
		$dataArray['user_id'] = $uid;
        $dataArray['prop_id'] = $zhoufu;
        $data = $db->insert("c_qingfu", $dataArray);
        $mc = Mc::singleton();
        $mcKey = "zhoufu_" . $uid;
        $mc->delete($mcKey);
        return $db->insert_id();
    }

    function deleteZhoufu($uid, $id) {
        $db = new DB();       
		$sql = "delete from c_qingfu where id='$id'";
        $db->query($sql);
        $mc = Mc::singleton();
        $mcKey = "zhoufu_" . $uid;
        $mc->delete($mcKey);
    }

    /*     * ***************************c_qingfu *************************** */

    function randomZhoufu($zfs_id) {
        $type = $this->randomZhoufuType($zfs_id);
        $allZhoufu = $this->selectZhoufu();
        $arrayZhoufu = array();
        switch ($type) {
            case 1: 
                $arrayZhoufu = $this->getZhoufuArray($allZhoufu[1], 1);
                break;
            case 2:  
                $arrayZhoufu = $this->getZhoufuArray($allZhoufu[2], 1);
                break;
            case 3:  
                $arrayZhoufu = $this->getZhoufuArray($allZhoufu[3], 1);
                break;
            case 4:             
				$arrayZhoufu = $this->getZhoufuArray($allZhoufu[1], 0);
                break;
            case 5:  
                $arrayZhoufu = $this->getZhoufuArray($allZhoufu[2], 0);
                break;
            case 6:  
                $arrayZhoufu = $this->getZhoufuArray($allZhoufu[3], 0);
                break;
            case 7:  
                $arrayZhoufu = $allZhoufu[0];
                break;
        }
        $randIndex = array_rand($arrayZhoufu);
        return $arrayZhoufu[$randIndex];
    }

    function getZhoufuArray($arr, $isBase) {
  
        $count = count($arr);
        $stack = array();
        if ($isBase == 1) {   
            for ($i = 0; $i < $count; $i++) {
                $attr = explode(":", $arr[$i]["attribute"]);
                if ($attr[0] == "hp" || $attr[0] == "phy_att" || $attr[0] == "phy_def" || $attr[0] == "mag_att" || $attr[0] == "mag_def") {
                    array_push($stack, $arr[$i]);
                }
            }
        } else {    
            for ($i = 0; $i < $count; $i++) {
                $attr = explode(":", $arr[$i]["attribute"]);
                if ($attr[0] == "hit" || $attr[0] == "miss" || $attr[0] == "crit" || $attr[0] == "crit_def") {
                    array_push($stack, $arr[$i]);
                }
            }
        }
        return $stack;
    }

    function randZhoufushi($zfs_id) {       
		switch ($zfs_id) {
            case 1:
                $zfs = rand(1, 100) < 50 ? 2 : 1;   //50%
                break;
            case 2:
                $zfs = rand(1, 100) < 40 ? 3 : 1;   //40%
                break;
            case 3:
                $zfs = rand(1, 100) < 20 ? 4 : 1;   //20%
                break;
            case 4:
                $zfs = rand(1, 100) < 30 ? 5 : 1;  //30%
                break;
            case 5:
                $zfs = 1;
                break;
        }
        return $zfs;
    }

 
    function getTargetProp($prop_id) {
        $propAll = $this->selectProp();
        return $propAll[$prop_id];
    }

     function getPropObjInfo($prop_obj_id) {
        $db = new DB();      
		$sql = "select * from c_prop where id=$prop_obj_id";
        $prop_obj = $db->get_one($sql);
        if ($prop_obj) {
            return $prop_obj;
        }
    }

  
	function getUserBagProp($user_id) {
        $mc = Mc::singleton();
        $data = $mc->get('c_prop' . $user_id);
        if (!$data) {
            $db = new DB();          
			$sql = "select * from c_prop where user_id=" . $user_id;
            $data = $db->get_all($sql);
            $mc->mset('c_prop' . $user_id, $data);
        }
        $propAll = $this->selectProp();  
        if (count($data) > 0) {
            foreach ($data as $key => $value) {
                if ($value["status"] == 0) {                 
				$prop = $propAll[$value['prop_id']];
                   	if(!empty($prop)){
	                    foreach ($prop as $k => $v) {
	                        if ($k != 'id') {
	                            $data[$key][$k] = $v;
	                        }
	                    }
                   	}
                } else {
                    unset($data[$key]);
                }
            }
            return $data;
        }
    }

	function getUserAllPropNoAttr($user_id){
        $mc = Mc::singleton();
        $data = $mc->get('c_prop' . $user_id);
        if (!$data) {
            $db = new DB();         
			$sql = "select * from c_prop where user_id=" . $user_id;
            $data = $db->get_all($sql);
            $mc->mset('c_prop' . $user_id, $data);
        }
        return $data;
    }


	function getNumBagProp($user_id, $prop_id) {
        $bagAll = $this->getUserBagProp($user_id);
		$num = 0;
		if(count($bagAll)){
	        foreach ($bagAll as $k => $v) {
	            if ($v['prop_id'] == $prop_id) {
	                $num += $v['num'];
	            }
	        }
		}
        if ($num > 0) {
            return $num;
        } else {
            return 0;
        }
    }


    function getBagPeifang($uid) {
        $data = $this->getUserBagProp($uid);
        if (count($data)) {
            foreach ($data as $key => $v) {
                if ($v["type"] == 5) {
                    $return[] = $v['prop_id'];
                }
            }
            if (count($return)) {
                return $return;
            }
        }
    }


    function randomGiftLibao($propGift) {
        foreach ($propGift as $key => $value) {
            $rate = $value['rate'];
            $rand = rand(1, 100);
            if ($rand <= $rate) {
                if ($data[$value['type']][$value['value']]) {                  
					$data[$value['type']][$value['value']]['num']++;
                } else {
                    $data[$value['type']][$value['value']]['value'] = $value['value'];
                    $data[$value['type']][$value['value']]['type'] = $value['type'];
                    $data[$value['type']][$value['value']]['num'] = 1;
                }
            }
        }
        if (count($data) > 0) {
            return $data;
        }
    }


    function randomGiftBaoxiang($propGift) {
        $rateSplit = 0;                       
		foreach ($propGift as $key => $value) {
            $rateAll+=$value["rate"];
        }
        $rand = rand(1, $rateAll);
        foreach ($propGift as $key => $value) {
            if ($rand > $rateSplit && $rand <= $value["rate"] + $rateSplit) {
                $data[$value["type"]][$value["value"]]["type"] = $value["type"];
                $data[$value["type"]][$value["value"]]["value"] = $value["value"];
                $data[$value["type"]][$value["value"]]["num"] = 1;
                break;
            } else {
                $rateSplit+=$value["rate"];
            }
        }
        if (count($data) > 0) {
            return $data;
        }
    }


    function deletePropByCID($uid, $prop_obj_id) {
        $db = new DB();  
		$db->delete("c_prop", "id=$prop_obj_id");

         $this->deleteSortDJFromMC($uid);
        $this->deleteSortFZFromMC($uid);
    }

     function addPropNoStack($pobj) {
        $db = new DB();
        $db->insert("c_prop", $pobj);
        return $db->insert_id();

         $this->deleteSortDJFromMC($uid);
        $this->deleteSortFZFromMC($uid);
    }

     function getUserBagSortFZ($uid) {
        $mc = Mc::singleton();
        $data = $mc->get("c_propFZSort" . $uid);
        if (count($data) > 0)
            return $data;
    }

     function setUserBagSortFZ($uid, $data) {
        $mc = Mc::singleton();
        $mc->set("c_propFZSort" . $uid, $data);
    }


    function deleteSortFZFromMC($uid) {
        $mc = Mc::singleton();
        $mc->delete("c_propFZSort" . $uid);
    }


    function getUserBagSortDJ($uid) {
        $mc = Mc::singleton();
        $data = $mc->get("c_equipDJSort" . $uid);
        if (count($data) > 0)
            return $data;
    }


    function setUserBagSortDJ($uid, $data) {
        $mc = Mc::singleton();
        $mc->set("c_equipDJSort" . $uid, $data);
    }


    function deleteSortDJFromMC($uid) {
        $mc = Mc::singleton();
        $mc->delete("c_equipDJSort" . $uid);
    }

}

?>

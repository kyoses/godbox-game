<?php

include_once dirname(__FILE__).'/../Lib.php';
class Skill{

    function selectSkill(){
        $mc = Mc::singleton();
        $data = $mc->get("s_skill");
        if(!$data){
            $db = new DB(); 
			$sql = "select * from s_skill";
            $data = $db->get_all($sql);
            $mc->mset('s_skill',$data);  
			}
        return $data;
    }


    function getTargetSkill($skill_id){
        $npcAll = $this->selectSkill();
        return $npcAll[$skill_id];
    }

	function selectSkillEffect(){
        $mc = Mc::singleton();
        $data = $mc->get("s_skill_effect");
        if(!$data){
            $db = new DB();         
			$sql = "select * from s_skill_effect";
            $query = $db->query($sql);
            while($row = $db->fetch_array($query)) {
                $data[$row['skill_id']][$row['id']] = $row;
            }
            $mc->mset('s_skill_effect',$data);   
			}
        return $data;        
    }
}
?>

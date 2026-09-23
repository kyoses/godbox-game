<?php
include_once dirname(__FILE__).'/../Lib.php';
class Dialogue{
    function selectDialogue() {
        $mc = Mc::singleton();
        $data = $mc->get("s_dialogue");
        if (!$data) {
            $db = new DB(); 
            $sql = "select * from s_dialogue";
            $query = $db->query($sql);
        	while ($row = $db->fetch_array($query)) {
                $data[$row['battle_id']][$row['pos']] = $row;
            }
            $mc->mset('s_dialogue', $data); 
        }
        return $data;
    }
    function selectDialogueContent(){
    	$mc = Mc::singleton();
        $data = $mc->get("s_dialogue_content");
        if (!$data) {
            $db = new DB(); 
            $sql = "select * from s_dialogue_content";
            $query = $db->query($sql);
        	while ($row = $db->fetch_array($query)) {
                $data[$row['dialogue_id']][$row['d_order']] = $row;
            }
            $mc->mset('s_dialogue_content', $data); 
        }
        return $data;
    }
	function selectLoadingInfo(){
		$mc = Mc::singleton();
        $data = $mc->get("s_loading");
        if (!$data) {
            $db = new DB(); 
            $sql = "select * from s_loading";
            $data = $db->query($sql);
            $mc->mset('s_loading', $data); 
        }
        return $data;
	}
}
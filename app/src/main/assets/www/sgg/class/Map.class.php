<?php

include_once dirname(__FILE__).'/../Lib.php';
class Map{

    function selectMap(){
        $mc = Mc::singleton();
        $data = $mc->get("s_map");
        if(!$data){
            $db = new DB();          
			$sql = "select * from s_map";
            $query = $db->query($sql);
            while($row = $db->fetch_array($query)) {
                $data[$row['page']][$row['id']]=$row;
            }
            $mc->mset('s_map',$data);      
			}
        return $data;
    }
    function selectMapById($id){
        $db = new DB();
        $sql = "select * from s_map where id='$id'";
        $row = $db->get_one($sql);
        return $row;
    }

	function selectBattle(){
        $mc = Mc::singleton();
        $data = $mc->get("s_battle");
        if(!$data){
            $db = new DB();          
			$sql = "select * from s_battle";
            $data = $db->get_all($sql);
            $mc->mset('s_battle',$data);     
			}
        return $data;
    }

    function selectBattleByMapID($map_id){
        $db = new DB();      
		$sql = "select * from s_battle where map_id=$map_id order by disp_order";
        $data = $db->get_all($sql);

        if(count($data)>0)
            return $data;
    }
    
    function updateMap ($map_id, $array) {
        $db = new DB();
        $db->update('s_map', $array, 'id="'.$map_id.'"');
        $mc = Mc::singleton();
        $mc->delete('s_map');
        $this->selectMap();
    }
}
?>

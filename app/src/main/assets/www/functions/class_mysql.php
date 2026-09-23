<?php
class mysqlclass {
	var $db_id;
	var $querynum = 0;

	function connect($dbhost, $dbuser, $dbpw, $dbname, $pconnect = 0) {
		if($pconnect) {
			if(!$this->db_id=@mysql_pconnect($dbhost, $dbuser, $dbpw)) {
				$this->mysql_errormsg('Can not connect to MySQL server');
			}
		} else {
			if(!$this->db_id=@mysql_connect($dbhost, $dbuser, $dbpw)) {
				$this->mysql_errormsg('Can not connect to MySQL server');
			}
		}
		@mysql_query("set names 'utf8'");
		@mysql_select_db($dbname);
	}

	function select_db($dbname) {
		return @mysql_select_db($dbname,$this->db_id);
	}

	function query($sql) {		
		if(!($query = @mysql_query($sql,$this->db_id))) {
				$this->mysql_errormsg('MySQL Query Error', $sql);
			}		
		$this->querynum++;		
		return $query;
	}
	
	function fetch_array($query, $result_type = MYSQL_ASSOC) {
		return @mysql_fetch_array($query, $result_type);
	}

	function fetch_row($query) {
		$query = @mysql_fetch_row($query);
		return $query;
	}
	
	function num_rows($query) {
		$query = @mysql_num_rows($query);
		return $query;
	}

	function insert_id() {
		$id = @mysql_insert_id();
		return $id;
	}
	
	function free_result($query) {
		return @mysql_free_result($query);
	}
	
	function close() {
		return @mysql_close();
	}
	
	function mysql_errormsg($message = '', $sql = '') {
		echo $message."<br>".$sql."<br>";
		echo $this->errno()." ".$this->error();
		exit;
	}

	function affected_rows() {
		return @mysql_affected_rows();
		//		传回最后查询为INSERT、UPDATE或DELETE所影响的列数目		
	}

	function error() {
		return @mysql_error();
		//从先前MySQL操作传回错误讯息
	}

	function errno() {
		return @intval(mysql_errno());
		//从先前MySQL操作传回错误讯息代号
	}

	function result($query, $row) {
		$query = @mysql_result($query, $row);
		return $query;
		//从MySQL结果传回一格(cell)的内容,效率低.
	}

	function num_fields($query) {
		return @mysql_num_fields($query);
		//传回结果中栏位的数目
	}	
}
$dbhost="localhost:3306";
$dbuser="root"; 
$dbpw="";
$dbname="sg"; 

$db = new mysqlclass;
$db->connect($dbhost,$dbuser,$dbpw,$dbname);
//$db->select_db($dbname);
unset($dbhost, $dbuser, $dbpw, $dbname, $pconnect);

 


?>

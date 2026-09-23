<?php
include_once dirname(__FILE__).'/Config.class.php';
Class DB {

	private $link_id;
	private $handle;
	private $is_log;
	private $time;
        private $hostname = Config::HOSTNAME;
        private $username = Config::USERNAME;
        private $password = Config::PASSWORD;
        private $database = Config::DATABASE;
        private $pconnect = Config::PCONNECT;
        private $log = Config::LOG;
        private $logfilepath = Config::LOGFILEPATH;

 		public function __construct() {
		$this->time = $this->microtime_float();
		$this->connect($this->hostname, $this->username, $this->password, $this->database, $this->pconnect);
		$this->is_log = $this->log;
		if($this->is_log){
			$handle = fopen($this->logfilepath."dblog.txt", "a+");
			$this->handle=$handle;
		}
	}

 	public function __destruct() {
		$this->free_result();
		$use_time = ($this-> microtime_float())-($this->time);
		$this->write_log("短链".$use_time);
		if($this->is_log){
			fclose($this->handle);
		}
	}
        
 	public function connect($dbhost, $dbuser, $dbpw, $dbname, $pconnect = 0,$charset='utf8') {
		if( $pconnect==0 ) {
			$this->link_id = @mysql_connect($dbhost, $dbuser, $dbpw, true);
			if(!$this->link_id){
				$this->halt("链接数据成功?");
			}
		} else {
			$this->link_id = @mysql_pconnect($dbhost, $dbuser, $dbpw);
			if(!$this->link_id){
				$this->halt("链接失败");
			}
		}
		if(!@mysql_select_db($dbname,$this->link_id)) {
			$this->halt('查询');
		}
		@mysql_query("set names ".$charset);
	}
	
 	public function query($sql) {
		$this->write_log("查询".$sql);
		$query = mysql_query($sql,$this->link_id);
		if(!$query) $this->halt('Query Error: ' . $sql);
		return $query;
	}
	
 	public function get_one($sql,$result_type = MYSQL_ASSOC) {
		$query = $this->query($sql);
		$rt =& mysql_fetch_array($query,$result_type);
		$this->write_log("提取数据".$sql);
		return $rt;
	}

 
	public function get_all($sql,$key='id',$result_type = MYSQL_ASSOC) {
		$query = $this->query($sql);
		$rt = array();
		while($row =& mysql_fetch_array($query,$result_type)) {
			$rt[$row[$key]]=$row;
		}
		$this->write_log("提取数据 ".$sql);
		return $rt;
	}
	
 
	public function insert($table,$dataArray) {
		$field = "";
		$value = "";
		if( !is_array($dataArray) || count($dataArray)<=0) {
			$this->halt('插入数据');
			return false;
		}
		while(list($key,$val)=each($dataArray)) {
			$field .="$key,";
			$value .="'$val',";
		}
		$field = substr( $field,0,-1);
		$value = substr( $value,0,-1);
		$sql = "insert into $table($field) values($value)";
		$this->write_log("插入 ".$sql);
		if(!$this->query($sql)) return false;
		return true;
	}

 
	public function update( $table,$dataArray,$condition="") {
		if( !is_array($dataArray) || count($dataArray)<=0) {
			$this->halt('更新数据');
			return false;
		}
		$value = "";
		while( list($key,$val) = each($dataArray))
		$value .= "$key = '$val',";
		$value .= substr( $value,0,-1);
		$sql = "update $table set $value where 1=1 and $condition";
		$this->write_log("更新 ".$sql);
		if(!$this->query($sql)) return false;
		return true;
	}

 	public function delete( $table,$condition="") {
		if( empty($condition) ) {
			$this->halt('删除数据');
			return false;
		}
		$sql = "delete from $table where 1=1 and $condition";
		$this->write_log("删除 ".$sql);
		if(!$this->query($sql)) return false;
		return true;
	}

 
	public function fetch_array($query, $result_type = MYSQL_ASSOC){
		$this->write_log("提取数据");
		return mysql_fetch_array($query, $result_type);
	}

 	public function num_rows($results) {
		if(!is_bool($results)) {
			$num = mysql_num_rows($results);
			$this->write_log("提取".$num);
			return $num;
		} else {
			return 0;
		}
	}

 	public function free_result() {
		$void = func_get_args();
		foreach($void as $query) {
			if(is_resource($query) && get_resource_type($query) === 'mysql result') {
				return mysql_free_result($query);
			}
		}
		$this->write_log("提取");
	}

 	public function insert_id() {
		$id = mysql_insert_id($this->link_id);
		$this->write_log("插入数据.$id");
		return $id;
	}

 	protected function close() {
		$this->write_log("关闭链接");
		return @mysql_close($this->link_id);
	}

 	private function halt($msg='') {
		$msg .= "\r\n".mysql_error();
		$this->write_log($msg);
		die($msg);
	}
	
 	public function write_log($msg=''){
		if($this->is_log){
			$text = date("Y-m-d H:i:s")." ".$msg."\r\n";
			fwrite($this->handle,$text);
		}
	}
	
 	public function microtime_float() {
		list($usec, $sec) = explode(" ", microtime());
		return ((float)$usec + (float)$sec);
	}
}
?>
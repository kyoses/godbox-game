<?php
include_once dirname(__FILE__).'/Config.class.php';
class Mc extends Memcache{
	
    //put your code here
    private static $instance;
    private $host = Config::HOST;
    private $port = Config::PORT;
    private $timeout = Config::TIMEOUT;
    
    private function __construct() {
        $this->addserver($this->host,$this->port,true);
    }
    function mset($name,$data,$time=''){
        if($time > 0){
            $live = $time;
        }
        else{
            $live = $this->timeout;
        }
        $this->set($name,$data,0,$live);
    }

    public static function singleton(){
	 
        if(!isset(self::$instance)){
            $c = __CLASS__;
            self::$instance = new $c;
        }
        return self::$instance;
    }

}
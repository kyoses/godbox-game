<?php

/*
 * 20130218
 * log and statics class
 */

class Logger {

    const LOG_PATH = "/data/sg/";
    

    const L_ENTER = "ENTER";

    const L_REGIST = "REGIST";

    const L_LOGIN = "LOGIN";

    const L_CHARGE = "CHARGE";

    const L_CONSUME = "CONSUME";
 
    const L_G_CONSUME = "GOLD_CONSUME";
 
    const L_ONLINE = "ONLINE";

    const L_CRONTAB = "CRONTAB";

	const L_TEST = "TEST";
    

    const DB_NEW_CHARGER = "c_new_charger";
    
 
    public static function writeEnterLog($user_id, $plat_id, $plat_type, $channel_id){
        $data = array(
            'USER_ID' => $user_id,
            'PLAT_ID' => $plat_id,
            'PLAT_TYPE' => $plat_type,
            'CHANNEL_ID' => $channel_id,
        );
        self::writeLog(self::L_REGIST, $data);
    }
    
    // 鐢ㄦ埛娉ㄥ唽
    public static function writeRegistLog($user_id, $plat_id, $channel_id){
        $data = array(
            'USER_ID' => $user_id,
            'PLAT_ID' => $plat_id,
            'CHANNEL_ID' => $channel_id,
        );
        self::writeLog(self::L_REGIST, $data);
    }
    

    public static function writeLoginLog($user_id, $plat_id, $channel_id){
        $data = array(
            'USER_ID' => $user_id,
            'PLAT_ID' => $plat_id,
            'CHANNEL_ID' => $channel_id,
        );
        self::writeLog(self::L_LOGIN, $data);
    }
    

    public static function writeChargeLog($user_id, $plat_id, $channel_id, $money){
        $data = array(
            'USER_ID' => $user_id,
            'PLAT_ID' => $plat_id,
            'CHANNEL_ID' => $channel_id,
            'MONEY' => $money
        );
        self::writeLog(self::L_CHARGE, $data);
    }
    

    public static function writeConsumeLog($user_id, $plat_id, $channel_id, $money, $file_name){
        $data = array(
            'USER_ID' => $user_id,
            'PLAT_ID' => $plat_id,
            'CHANNEL_ID' => $channel_id,
            'MONEY' => $money,
            'FILE_NAME' => $file_name
        );
        self::writeLog(self::L_CONSUME, $data);
    }
    

    public static function writeGoldConsumeLog($user_id, $plat_id, $channel_id, $money, $file_name){
        $data = array(
            'USER_ID' => $user_id,
            'PLAT_ID' => $plat_id,
            'CHANNEL_ID' => $channel_id,
            'MONEY' => $money,
            'FILE_NAME' => $file_name
        );
        self::writeLog(self::L_G_CONSUME, $data);
    }
    

    public static function writeNewChargerLog($user_id, $plat_id, $channel_id, $money) {
        $charge_time = time();
        include_once dirname(__FILE__) . '/DB.class.php';
        $dbObj = new DB();
        $sql = "insert into ".self::DB_NEW_CHARGER." (user_id, plat_id, channel_id, charge_time, money) values ('$user_id', '$plat_id', '$channel_id', '$charge_time', '$money')";
        $query_id = $dbObj->query($sql);
        return $dbObj->insert_id();
    }
    

    public static function writeOnlineLog ($user_id, $plat_id, $channel_id) {
        $data = array(
            'USER_ID' => $user_id,
            'PLAT_ID' => $plat_id,
            'CHANNEL_ID' => $channel_id,
        );
        self::writeLog(self::L_ONLINE, $data);
    }
    

    public static function writeCrontabLog ($user_id, $plat_id, $channel_id, $content) {
        $data = array(
            'USER_ID' => $user_id,
            'PLAT_ID' => $plat_id,
            'CHANNEL_ID' => $channel_id,
            'CONTENT' => $content,
        );
        self::writeLog(self::L_CRONTAB, $data);
    }
	

	public static function writeTestLog($content){
		$data = array(
            'CONTENT' => $content,
        );
		self::writeLog(self::L_TEST, $data);
	}
    
    private static function writeLog($path, $data){
        $is_windows = preg_match('/win/i', PHP_OS);
        $log_path = $is_windows ? 'e:/sg/' : self::LOG_PATH;
        $content.= 'TIME:'.date("Y-m-d H:i:s", time());
        if($_SERVER['HTTP_CLIENT_IP']){
            $content.= ' IP:'.$_SERVER['HTTP_CLIENT_IP'];
        }elseif($_SERVER['HTTP_X_FORWARDED_FOR']){
            $content.= ' IP:'.$_SERVER['HTTP_X_FORWARDED_FOR'];
        }else{
            $content.= ' IP:'.$_SERVER['REMOTE_ADDR'];
        }
       	if($_SERVER['HTTP_USER_AGENT']){
        	$content.= ' UA:'.$_SERVER['HTTP_USER_AGENT'];
        }
        foreach ($data as $key=>$value) {
            $content.= " ".$key.":".$value;
        }
        $filename = date("Ymd",time());
        $real_path = $log_path.$path.'/'.$filename.'.log';
        $mode = 'a+';
        if (!file_exists($log_path.$path)){
            @mkdir($log_path.$path, 0777, 1);
        }
        $handle = @fopen($real_path, $mode);
        @fwrite($handle, $content."\n");
        @fclose($handle);
    }
}

?>

<?php
 
include_once dirname(__FILE__).'/Lib.php';

define("WB_AKEY",'3814627686');
define("WB_SKEY",'91dcec018e15091ca8b4556f1e47b849');
define("WYX_SIGN_KEY",'01c459f839eda6ccff9569ed241774f7');
define("ACCOUNT_TYPE",1); //1.sina 

define("CM_SENDER", "202");  
define("CM_CPID",'710048');  
define("CM_CPSERVICEID",'604820070738');   
define("CM_CHANNELID",'40204000'); 
$AUTH_KEY = "3s#2sfr52e"; 
$LANGUAGE = "cn";   

date_default_timezone_set('PRC');
$TODAY = mktime(0, 0, 0, date("m"), date("d"),  date("Y"));
//================================提取数据=================================================
if(count($_GET)){
    foreach($_GET as $key_get=>$value_get){
            $$key_get = $value_get;
    }
}
if(count($_POST) > 0){
    foreach($_POST as $key_post=>$value_post){
            $$key_post = $value_post;
    }
}
 
//判断来源
if(!preg_match("/127.0.0./i", $_SERVER['HTTP_HOST']) && $uid && $INNER_KEY != 'n9'){
    $user = new User();
    $user_info = $user->selectUser($uid);
//--------------------暂时屏蔽，用于接入第三方平台
//	if($user_info['account_type']==1&&$user_info["plat_info"]){    //平台判断
//	    if(strtolower(md5($user_info["plat_info"].$user_info["account_id"].WYX_SIGN_KEY))!=$_COOKIE['loginAccess']){
//            setcookie("loginAccess","");
//            exit;
//	    }
//	}else if($user_info['account_type']==2&&$user_info["plat_info"]){  //平台判断
//		if(strtolower(md5($user_info["account_id"].$user_info["plat_info"]))!=$_COOKIE['loginAccess']){
//            setcookie("loginAccess","");
//            exit;
//	    }
//	}

}

//提取数据
if($uid){
    $user = new User();
    $user_info = $user->selectUser($uid);
    if (date("Ymd", $user_info['last_login_time']) != date('Ymd', time())) {
        $login_days = $user_info['login_days'] + 1;
        $user->updateUser($uid, array('login_days' => $login_days, 'last_login_time' =>time()));
    }
    $mc = Mc::singleton();
    $onlineTime = $mc->get("time_".$uid);
    if(!$onlineTime){
            $mc->set("time_".$uid,time(),600);
            //Logger::writeOnlineLog($uid, 0, 0);
            $user->updateUser($uid, array('last_login_time' =>time()));
    }

    if($_COOKIE['cookie'.$uid]){
            $data['charge']=1;
    }
//    if ($uid==27) {
//        Logger::writeTestLog($_SERVER["REQUEST_URI"]);
//    }
}

?>

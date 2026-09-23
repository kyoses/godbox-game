<?php
//鏂版氮寰父鎴忓厖鍊? uid type
include_once dirname(__FILE__).'/../../config.php';
include_once dirname(__FILE__).'/WeiyouxiClient.php';
$user = new User();
$charge = new Charge();
$userInfo = $user->selectUser($uid);
$order_id_pre = SINA_CHARGE_ID;  //鏀粯ID
//100鏀?
$charge_type = array(1 => array(100,8), 2=>array(500,58),3=>array(1000,158),4=>array(5000,988),5=>array(10000,2588),6=>array(50000,15888));  //鍏呭€肩被鍨嬪搴旂殑鍏冨疂
$time = time();  //褰撳墠鏃堕棿鎴?
$od_array = array('user_id' =>$uid , 
                  'account_id'=>$userInfo['account_id'],
				  //'order_id'=>$order_id,
				  'charge_yb_num'=>$charge_type[$type][0],
				  'time'=>$time,
				  'status'=>0);
//$charge->insertOrder($od_array);  //鎻掑叆涓€鏉″厖鍊艰褰?鐘舵€佷负鏈垚鍔?

//涓嬮潰寮€濮嬭皟鐢ㄥ钩鍙板厖鍊兼帴鍙?
//浣跨敤SDK璋冪敤鎺ュ彛 
$amount = $charge_type[$type][0]/10*100;
$desc = $userInfo['name']."鍏呭€?.$charge_type[$type][0]."鍏冨疂";//浜ゆ槗鎻忚堪锛屾渶澶?0涓眽瀛?銆?
$array = array('method' =>'order',
               'source' =>WB_AKEY,
			   'amount' =>$amount,
			   'desc' =>$desc,
			   'uid' =>$userInfo['account_id'],
			   'from' =>'',
			   'sessionkey' =>$userInfo['plat_info']);
ksort($array);
$signature = "";
foreach ($array as $key => $value) {
	if($signature==""){
		$signature = $key."|".$value;
	}else{
		$signature =$signature."|".$key."|".$value;
	}
}
$signature = sha1($signature."|".WB_SKEY);
$params = "method=order&source=".WB_AKEY."&amount=".$amount."&desc=".$desc."&uid=".$userInfo['account_id'].
	     	"&from=&sessionkey=".$userInfo['plat_info']."&signature=".$signature;
$reback1 = file_get_contents('http://i.game.weibo.cn/pay.php?'.$params);  //{"order_id":"51b1986c7e2aa8377"}
$reback1 = json_decode($reback1,true);
if($reback1['order_id']){  //姝ｅ父杩斿洖
	$od_array['order_id'] = $reback1['order_id'];
	$charge->insertOrder($od_array);  //鎻掑叆涓€鏉″厖鍊艰褰?鐘舵€佷负鏈垚鍔?
    $sg_back_url = urlencode("http://".$_SERVER['HTTP_HOST']."/jg01/index.php?account_id=".$userInfo['account_id']."&account_type=1&wyx_session_key=".$userInfo['plat_info']);
	header("Location:http://i.game.weibo.cn/pay.php?method=page&order_id=".$reback1['order_id']."&sessionkey=".$userInfo['plat_info']."&ru=".$sg_back_url);
}
?>
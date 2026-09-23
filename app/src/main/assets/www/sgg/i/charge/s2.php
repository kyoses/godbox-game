<?php
//涓浗绉诲姩鍏呭€? uid type
include_once dirname(__FILE__).'/../../config.php';
$user = new User();
$charge = new Charge();
$userInfo = $user->selectUser($uid);
//100鏀?
$charge_type = array(1 => '20', 2=>'40',3=>'80',4=>'110',5=>'140',6=>'170',7=>'210',8=>'300');  //鍏呭€肩被鍨嬪搴旂殑鍏冨疂
//娑堣垂浠ｇ爜
$consumeCode = array(1 => '000070737024',2=>'000070737025',3=>'000070737026',4=>'000070737027',5=>'000070737028',6=>'000070737029',7=>'000070737030',8=>'000070737031');
$time = time();  //褰撳墠鏃堕棿鎴?
$order_next_id = $charge->getBillOrder()+1;  //鏈浜ゆ槗鐨勬祦姘磇d鐮?
$order_id = (string)CM_CPID.date("YmdHis",  time()).str_pad($order_next_id,6,"0",STR_PAD_LEFT);
$od_array = array('user_id' =>$uid , 
                  'account_id'=>$userInfo['account_id'],
                  'order_id' =>$order_id,
				  'charge_yb_num'=>$charge_type[$type],
				  'time'=>$time,
				  'status'=>0);
$charge->insertOrder($od_array);  
$xml_data = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<request>
	<msgType>BuyGameToolReq</msgType>
	<sender>".CM_SENDER."</sender>
	<userId>".$userInfo['account_id']."</userId>
	<channelId>".CM_CHANNELID."</channelId>
	<cpId>".CM_CPID."</cpId>
	<cpServiceId>".CM_CPSERVICEID."</cpServiceId>
	<consumeCode>".$consumeCode[$type]."</consumeCode>
	<transIDO>".$order_id."</transIDO>
	<versionId>2_0_0</versionId>
</request>
";
$url = 'http://gmp.i139.cn/bizcontrol/BuyGameTool';//鎺ユ敹XML鍦板潃
$header[] = "Content-type: text/xml";//瀹氫箟content-type涓簒ml
$ch = curl_init(); //鍒濆鍖朿url
curl_setopt($ch, CURLOPT_URL, $url);//璁剧疆閾炬帴
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//璁剧疆鏄惁杩斿洖淇℃伅
curl_setopt($ch, CURLOPT_HTTPHEADER, $header);//璁剧疆HTTP澶?
curl_setopt($ch, CURLOPT_POST, 1);//璁剧疆涓篜OST鏂瑰紡
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml_data);//POST鏁版嵁
$response = curl_exec($ch);//鎺ユ敹杩斿洖淇℃伅
if(curl_errno($ch)){//鍑洪敊鍒欐樉绀洪敊璇俊鎭?
	print curl_error($ch);
}
curl_close($ch); //鍏抽棴curl閾炬帴  
/*
$response = "<response>
<msgtype>BuyGameToolResp</msgtype>
<hret>0</hret>
<status>1800</status>
<balance>0</balance>
<point>200</point>
</response>";*/
$res_obj = simplexml_load_string($response);
$res_array = Utils::object_to_array($res_obj);
if($res_array['hret']==0){  
   $amount = $charge_type[$type];
   $user->addYB($userInfo, $amount); 
   $user->addYBTotal($userInfo, $amount);
   $charge->updateOrderStatus($order_id);
   $data['re'] = 1;
   //$data['user'] = $userInfo;
   $data['user']['yb'] = $userInfo['yb'];
   $data['user']['yb_total'] = $userInfo['yb_total'];
   $data['user']['vipLevel'] = $user->getUserVipLevel($userInfo['yb_total']);
   echo json_encode($data);
   exit();
}else{
	$data['re'] = 0;
	echo json_encode($data);
	exit();
}
?>
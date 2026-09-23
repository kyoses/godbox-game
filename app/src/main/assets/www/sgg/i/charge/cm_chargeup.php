<?php
//涓浗绉诲姩鐐规暟鍏呭€? uid type
include_once dirname(__FILE__).'/../../config.php';
$user = new User();
$charge = new Charge();
$userInfo = $user->selectUser($uid);
//100鏀?
$charge_type = array(1 => '20', 2=>'40',3=>'80',4=>'110',5=>'140',6=>'170',7=>'210',8=>'300');  //鍏呭€肩被鍨嬪搴旂殑鍏冨疂
//娑堣垂浠ｇ爜
$consumeCode = array(1=>'400120002000',
					 2=>'400120004000',
					 3=>'400120008000',
					 4=>'400120011000',
					 5=>'400120014000',
					 6=>'400120017000',
					 7=>'400120021000',
					 8=>'400120030000');
$time = time();  //褰撳墠鏃堕棿鎴?
$order_next_id = $charge->getBillOrder()+1;  //鏈浜ゆ槗鐨勬祦姘磇d鐮?
$order_id = (string)CM_CPID.date("YmdHis",  time()).str_pad($order_next_id,6,"0",STR_PAD_LEFT);
$od_array = array('user_id' =>$uid , 
                  'account_id'=>$userInfo['account_id'],
                  'order_id' =>$order_id,
				  'charge_yb_num'=>$charge_type[$type],
				  'time'=>$time,
				  'status'=>0);
$charge->insertOrder($od_array);  //鎻掑叆涓€鏉″厖鍊艰褰?鐘舵€佷负鏈垚鍔?

$xml_data = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<request>
	<msgType>ChargeUpReq</msgType>
	<sender>".CM_SENDER."</sender>
	<userIdType>3</userIdType>
	<userLabel>".$userInfo['account_id']."</userLabel>
	<channelId>".CM_CHANNELID."</channelId>
	<cpId>".CM_CPID."</cpId>
	<cpServiceId>".$consumeCode[$type]."</cpServiceId>
<transIDO>".$order_id."</transIDO>
<versionId>2_0_0</versionId>
</request>
";
$url = 'http://gmp.i139.cn/bizcontrol/ChargeUp';//鎺ユ敹XML鍦板潃
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
<response>
<msgtype>ChargeUpResp</msgtype>
<hret>0</hret>
<status>1100</status>
<balance>100</balance>
</response>
 */


$res_obj = simplexml_load_string($response);
$res_array = Utils::object_to_array($res_obj);
if($res_array['hret']==0){  //琛ㄧず鍏呭€兼垚鍔?
   $charge->updateOrderStatus($order_id);
   $data['re'] = 1;
   echo json_encode($data);
   exit();
}else{
	$data['re'] = 0;
	echo json_encode($data);
	exit();
}
?>
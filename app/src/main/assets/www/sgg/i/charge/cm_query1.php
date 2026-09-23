<?php
//涓浗绉诲姩娑堣垂璁板綍鏌ヨ  uid type
include_once dirname(__FILE__).'/../../config.php';
$user = new User();
$userInfo = $user->selectUser($uid);
$time = time();  //褰撳墠鏃堕棿鎴?
$month = "20".date('ym',$time);   //鏍煎紡涓?00907
$xml_data = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<request>
	<msgType>QueryConsumeRecordReq</msgType>
	<queryType>1</queryType>
	<sender>".CM_SENDER."</sender>
	<channelId>".CM_CHANNELID."</channelId>
	<userIdType>3</userIdType>
	<userLabel>".$userInfo['account_id']."</userLabel>
	<queryMonth>".$month."</queryMonth>
	<queryRange>2</queryRange>
	<payType>3</payType>
	<cpServiceId>".CM_CPSERVICEID."</cpServiceId>
	<packageId></packageId>
	<cpId>".CM_CPID."</cpId>
</request>";

$url = 'http://gmp.i139.cn/bizcontrol/QueryConsumeRecord';//鎺ユ敹XML鍦板潃
$header[] = "Content-type: text/xml";//瀹氫箟content-type涓簒ml
$ch = curl_init(); //鍒濆鍖朿url
curl_setopt($ch, CURLOPT_URL, $url);//璁剧疆閾炬帴
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//璁剧疆鏄惁杩斿洖淇℃伅
curl_setopt($ch, CURLOPT_HTTPHEADER, $header);//璁剧疆HTTP澶?
curl_setopt($ch, CURLOPT_POST, 1);//璁剧?负POST鏂瑰紡
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml_data);//POST鏁版嵁
$response = curl_exec($ch);//鎺ユ敹杩斿洖淇℃伅
if(curl_errno($ch)){//鍑洪敊鍒欐樉绀洪敊璇俊鎭?
	print curl_error($ch);
}
curl_close($ch); //鍏抽棴curl閾炬帴  
$res_obj = simplexml_load_string($response);
$json = json_encode($res_obj);
$array = json_decode($json, true);
//Utils::dump($array);
//$res_array = Utils::object_to_array($res_obj);

/*
 <?xml version="1.0" encoding="utf-8" ?>
	<response>
		<msgType>QueryConsumeRecordResp</msgType>
		<queryType>1</queryType>
		<hRet>0</hRet>
		<status>1102</status>
		<userIdType>3</userIdType>
		<userLabel>1253061410</userLabel>
		<recordList>
			<recordSchema>
				<cpId>710048</cpId>
				<cpName>鍖椾含楦垮竼绉戞妧鏈夐檺鍏徃</cpName>
				<channelId>40204000</channelId>
				<cpServiceId>604820070738</cpServiceId>
				<cpServiceName></cpServiceName>
				<packageName>20鍏冨疂绀煎寘</packageName>
				<toolsId>000070737024</toolsId>
				<toolsName>20鍏冨疂绀煎寘</toolsName>
				<date>20130813 08:38</date>
				<payType>1</payType>
				<payValue>200</payValue>
			</recordSchema>
		</recordList>
	</response>
 */

if($array['hRet']=="0"){
	$data['re'] = 1;
	$list = $array['recordList'];
	$num = 0;
	if(count($list)>0){
		foreach ($list as $key => $value) {
			$data['list'][$key]['time'] = $value['date'];
			$data['list'][$key]['yb'] = $value['payValue']/10;
			$data['list'][$key]['type'] = $value['payType'];
			$num++;
			if($num>=7){
				break;
			}
		}
	}
}else{
	$data['re'] = 0;  //鑾峰彇澶辫触
}
echo json_encode($data);
?>
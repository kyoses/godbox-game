<?php
//涓浗绉诲姩鍏呭€?鐐规暟)璁板綍鏌ヨ  uid type
include_once dirname(__FILE__).'/../../config.php';
$user = new User();
$userInfo = $user->selectUser($uid);
$dailySecon = 24*60*60;
$endtime = $TODAY+$dailySecon;
$starttime = $TODAY-6*$dailySecon;
$st_date = "20".date('ymd',$starttime);   //鏍煎紡涓?0090713
$end_date = "20".date('ymd',$endtime);   //鏍煎紡涓?0090713
$xml_data = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<request>
	<msgType>QueryChargeReq</msgType>
	<sender>".CM_SENDER."</sender>
	<userIdType>3</userIdType>
	<userLabel>".$userInfo['account_id']."</userLabel>
	<channelId>".CM_CHANNELID."</channelId>
	<startDate>".$st_date."</startDate>
	<endDate>".$end_date."</endDate>
	<startSequence></startSequence>
	<recordCount>20</recordCount>
<transIDO>C0000120090102142050799929</transIDO>
<versionId>2_0_0</versionId>
</request>";

$url = 'http://gmp.i139.cn/bizcontrol/QueryChargeUpRecord';//鎺ユ敹XML鍦板潃
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

$res_obj = simplexml_load_string($response);
$json = json_encode($res_obj);
$array = json_decode($json, true);
//$array = Utils::object_to_array($res_obj);
//Utils::dump($array);
if($array['hRet']=="0"){
	$data['re'] = 1;
	$list = $array['chargeList']['consumerSchema'];
	if(count($list)>0){
		foreach ($list as $key => $value) {
			$data['list'][$key]['time'] = $value['date'];
			$data['list'][$key]['yb'] = $value['point']/100;
			$data['list'][$key]['type'] = $value['consumerType'];
			if($key>6){  //鏈€澶氭樉绀?鏉?
				break;
			}
		}
	}
}else{
	$data['re'] = 0;  //鑾峰彇澶辫触
}
echo json_encode($data);
?>
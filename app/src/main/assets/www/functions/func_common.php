<?php
function nohtml($str) {
	$str=str_replace('</p>','</p><br>',$str);
	$str=str_replace('</P>','</P><br>',$str);
	$str=strip_tags($str); 
	return($str);
}
function myhash($length,$t=0) {
	$hash = '';
	if ($t==0) $chars = '0123456789';else $chars = 'ACDEFGHKLMNPQRSTUVWXY345679';
	$max = strlen($chars) - 1;
	mt_srand((double)microtime() * 1000000);
	for($i = 0; $i < $length; $i++) $hash .= $chars[mt_rand(0, $max)];
	return $hash;
}
function echomsg($msg,$url="javascript:history.back(1)") {
	echo "<SCRIPT language=JavaScript>";
	if ($msg<>'') echo "alert(\" 信息：$msg \");";
	echo "window.location='$url';</SCRIPT>";
	exit;
}
function error_document($error_type,$error_info,$back_url,$status="",$url="error_document.php"){
	echo "<SCRIPT language=JavaScript>";
	//if ($msg<>'') echo "alert(\" 信息：$msg \");";
	echo "top.window.location='$url?back_url=".$back_url.$status."&error_type=".$error_type."&error_info=".$error_info."';</SCRIPT>";
	exit;
}
function substr_cn($str,$strlen=10,$other=true) { 
    for($i=0;$i<$strlen;$i++) 
      if(ord(substr($str,$i,1))>0xa0) $j++;
    if($j%2!=0) $strlen++;
    $rstr=substr($str,0,$strlen); 
    if (strlen($str)>$strlen && $other) {$rstr.='..';} 
    return $rstr; 
}
function getfilecontent($fileurl) {
	if ($file = @fopen ($fileurl, "r")) {
		$content='';
		while (!feof ($file)) {
			$line = fgets ($file);
			$content.=$line;   
		}
		fclose($file);
		return $content;
	} else return '';
}
function putfilecontent($filename,$content) {
	$f=@fopen($filename,'w'); 
	$d=@fwrite($f,$content);
	@fclose($f);unset($content);
	return $d;
}
function setopmlfile($filename,$data='',$ac="get") {
	if ($ac=='get' and count($data)<>0) {
		include_once("include/rss.inc");
		$rss = new lastRSS;
		$rs = $rss->Get($filename,1);
		if ($data=='all') $d=$rs['items'];
		else foreach ($rs['items'] as $i => $r) if (in_array($i,$data)) $d[]=$r;
		return $d;	
	}
	if ($ac=='del') {
		include_once("include/rss.inc");
		$rss = new lastRSS;
		$rs = $rss->Get($filename,1);
		//var_dump(array_diff(array_keys($rs['items']),$data));
		
		$d=setopmlfile($filename,array_diff(array_keys($rs['items']),$data));
		$filecontent=getfilecontent($filename);
		$s=explode("<body>",$filecontent);
		$s1=explode("</body>",$s[1]);
		$html=$s[0]."<body></body>".$s1[1];
		putfilecontent($filename,$html);
		setopmlfile($filename,$d,"add");
		
		//var_dump($data);
	}
	if ($ac=='add') {
		if (!file_exists($filename)) {
			$s[0]='<?xml version="1.0"?><head><title>365my RSS</title></head><opml>';
			$s[1]='</body></opml>';
		} else {
			$html='';
			$filecontent=getfilecontent($filename);
			$s=explode("<body>",$filecontent);
		}
		if ($data<>'' ) foreach($data as $i => $d) {
			foreach ($d as $j => $dd) $d[$j]=iconv("gb2312", "UTF-8",$dd); 	
			$html.='<outline title="'.$d['title'].'" text="'.$d['text'].'" xmlUrl="'.$d['xmlUrl'].'" htmlUrl="'.$d['htmlUrl'].'"/>';
		}
		$filecontent=$s[0]."<body>".$html.$s[1];
		return putfilecontent($filename,$filecontent);	
	}
}


function checklogin($u,$s=0) {
	if ($s==0) {
		$msg="你暂时无法登录！";		
	} else {
		$msg="暂时无法访问该空间。";
	}
	$cachef="cache/nologin.data";
	if (!file_exists($cachef)) {
		global $db;
		require_once("../my/include/class_mysql.php");
		$query=$db->query("SELECT * FROM 365my_nologin");
		while ($nol=$db->fetch_array($query)) $nol_list[]=$nol;
		putfilecontent($cachef,serialize($nol_list));
	} else $nol_list=unserialize(getfilecontent($cachef));
	
	if ($nol_list<>'') foreach($nol_list as $nol) {
		if ($u==$nol['u_name']) echomsg($msg);
		if ($s==0 and $_SERVER["REMOTE_ADDR"]==$nol['u_ip']) echomsg("你暂时无法登录！");
	}
}


	/**
	* Passport 加密函数
	*
	* @param		string		等待加密的原字串
	* @param		string		私有密匙(用于解密和加密)
	*
	* @return	string		原字串经过私有密匙加密后的结果
	*/
	function passport_encrypt($txt, $key) {

		// 使用随机数发生器产生 0~32000 的值并 MD5()
		srand((double)microtime() * 1000000);
		$encrypt_key = md5(rand(0, 32000));

		// 变量初始化
		$ctr = 0;
		$tmp = '';

		// for 循环，$i 为从 0 开始，到小于 $txt 字串长度的整数
		for($i = 0; $i < strlen($txt); $i++) {
			// 如果 $ctr = $encrypt_key 的长度，则 $ctr 清零
			$ctr = $ctr == strlen($encrypt_key) ? 0 : $ctr;
			// $tmp 字串在末尾增加两位，其第一位内容为 $encrypt_key 的第 $ctr 位，
			// 第二位内容为 $txt 的第 $i 位与 $encrypt_key 的 $ctr 位取异或。然后 $ctr = $ctr + 1
			$tmp .= $encrypt_key[$ctr].($txt[$i] ^ $encrypt_key[$ctr++]);
		}

		// 返回结果，结果为 passport_key() 函数返回值的 base65 编码结果
		return base64_encode(passport_key($tmp, $key));

	}

	/**
	* Passport 解密函数
	*
	* @param		string		加密后的字串
	* @param		string		私有密匙(用于解密和加密)
	*
	* @return	string		字串经过私有密匙解密后的结果
	*/
	function passport_decrypt($txt, $key) {

		// $txt 的结果为加密后的字串经过 base64 解码，然后与私有密匙一起，
		// 经过 passport_key() 函数处理后的返回值
		$txt = passport_key(base64_decode($txt), $key);

		// 变量初始化
		$tmp = '';

		// for 循环，$i 为从 0 开始，到小于 $txt 字串长度的整数
		for ($i = 0; $i < strlen($txt); $i++) {
			// $tmp 字串在末尾增加一位，其内容为 $txt 的第 $i 位，
			// 与 $txt 的第 $i + 1 位取异或。然后 $i = $i + 1
			$tmp .= $txt[$i] ^ $txt[++$i];
		}

		// 返回 $tmp 的值作为结果
		return $tmp;

	}

	/**
	* Passport 密匙处理函数
	*
	* @param		string		待加密或待解密的字串
	* @param		string		私有密匙(用于解密和加密)
	*
	* @return	string		处理后的密匙
	*/
	function passport_key($txt, $encrypt_key) {

		// 将 $encrypt_key 赋为 $encrypt_key 经 md5() 后的值
		$encrypt_key = md5($encrypt_key);

		// 变量初始化
		$ctr = 0;
		$tmp = '';

		// for 循环，$i 为从 0 开始，到小于 $txt 字串长度的整数
		for($i = 0; $i < strlen($txt); $i++) {
			// 如果 $ctr = $encrypt_key 的长度，则 $ctr 清零
			$ctr = $ctr == strlen($encrypt_key) ? 0 : $ctr;
			// $tmp 字串在末尾增加一位，其内容为 $txt 的第 $i 位，
			// 与 $encrypt_key 的第 $ctr + 1 位取异或。然后 $ctr = $ctr + 1
			$tmp .= $txt[$i] ^ $encrypt_key[$ctr++];
		}

		// 返回 $tmp 的值作为结果
		return $tmp;

	}

	/**
	* Passport 信息(数组)编码函数
	*
	* @param		array		待编码的数组
	*
	* @return	string		数组经编码后的字串
	*/
	function passport_encode($array) {

		// 数组变量初始化
		$arrayenc = array();

		// 遍历数组 $array，其中 $key 为当前元素的下标，$val 为其对应的值
		foreach($array as $key => $val) {
			// $arrayenc 数组增加一个元素，其内容为 "$key=经过 urlencode() 后的 $val 值"
			$arrayenc[] = $key.'='.urlencode($val);
		}

		// 返回以 "&" 连接的 $arrayenc 的值(implode)，例如 $arrayenc = array('aa', 'bb', 'cc', 'dd')，
		// 则 implode('&', $arrayenc) 后的结果为 ”aa&bb&cc&dd"
		return implode('&', $arrayenc);

	}

?>
<?php

 

class Utils {
    /**
    
    * @package Core
    *
    * @param mixed $vars  
    * @param string $label
    * @param boolean $return
    */
    public static function dump($vars, $label = '', $return = false){
        if (ini_get('html_errors')) {
            $content = "<pre>\n";
            if ($label != '') {
                $content .= "<strong>{$label} :</strong>\n";
            }
            $content .= htmlspecialchars(print_r($vars, true));
            $content .= "\n</pre>\n";
        } else {
            $content = $label . " :\n" . print_r($vars, true);
        }
        if ($return) { return $content; }
        echo $content;
        return null;
    }
    /**
 
     * @global type $q
     * @param type $href 
     */
    public static function header_encode($href){
        global $q;
        $href = trim($href);
        $href.=($q)?"&q=$q":'';
        header("Location:$href".'&j=1');
        ob_end_flush();
        exit();
    }
 
    public static function checkMobile($ua){
 
        $mobileUserAgents =  array(
            "Nokia", //ozilla/5.0 (Nokia5800 XpressMusic)UC AppleWebkit(like Gecko) Safari/530
            "SAMSUNG", // SAMSUNG-GT-B7722/1.0+SHP/VPP/R5+Dolfin/1.5+Nextreaming+SMM-MMS/1.2.0+profile/MIDP-2.1+configuration/CLDC-1.1
            "MIDP-2", //j2me2./5.0 (SymbianOS/9.3; U; Series60/3.2 NokiaE75-1 /110.48.125 Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/413 (KHTML, like Gecko) Safari/413
            "CLDC1.1", //M600/MIDP2.0/CLDC1.1/Screen-240X320
            "SymbianOS", //
            "MAUI", //
            "UNTRUSTED/1.0", //  "Windows CE", //Windows /4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 7.11)
            "iPhone", //iPhone ozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; zh-cn) AppleWebKit/532.9 (KHTML, like Gecko) Mobile/8B117
            "iPad", //iPadozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; zh-cn) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10
            "Android", //Androidozilla/5.0 (Linux; U; Android 2.1-update1; zh-cn; XT800 Build/TITA_M2_16.22.7) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17
            "BlackBerry", //BlackBerry8310/2.7.0.106-4.5.0.182
            "UCWEB", //ucwebNokia5800 XpressMusic/UCWEB7.5.0.66/50/999
            "ucweb", //,Mozilla/6.0 (compatible; MSIE 6.0;) Opera ucweb-squid
            "BREW", //REW-Applet/0x20068888 (BREW/3.1.5.20; DeviceId: 40105; Lang: zhcn) ucweb-squid
            "J2ME", //
            "YULONG", //ULONG-CoolpadN68/10.14 IPANEL/2.0 CTC/1.0
            "YuLong", //
            "COOLPAD", //YL-COOLPADS100/08.10.S100 POLARIS/2.9 CTC/1.0
            "TIANYU", //,TIANYU-KTOUCH/V209/MIDP2.0/CLDC1.1/Screen-240X320
            "TY-", //-F6229/701116_6215_V0230 JUPITOR/2.2 CTC/1.0
            "K-Touch", //,K-Touch_N2200_CMCC/TBG110022_1223_V0801 MTK/6223 Release/30.07.2008 Browser/WAP2.0
            "Haier", //-HG-M217_CMCC/3.0 Release/12.1.2007 Browser/WAP2.0
            "DOPOD", //
            "Lenovo", //-P650WG/S100 LMP/LML Release/2010.02.22 Profile/MIDP2.0 Configuration/CLDC1.1
            "LENOVO", //LENOVO-P780/176A
            "HUAQIN", //
            "AIGO-", //-800C/2.04 TMSS-BROWSER/1.0.0 CTC/1.0
            "CTC/1.0", //
            "CTC/2.0", //
            "CMCC", //-Touch_N2200_CMCC/TBG110022_1223_V0801 MTK/6223 Release/30.07.2008 Browser/WAP2.0
            "DAXIAN", //DAXIAN X180 UP.Browser/6.2.3.2(GUI) MMP/2.0
            "MOT-", //-MOTOROKRE6/1.0 LinuxOS/2.4.20 Release/8.4.2006 Browser/Opera8.00 Profile/MIDP2.0 Configuration/CLDC1.1 Software/R533_G_11.10.54R
            "SonyEricsson", //onyEricssonP990i/R100 Mozilla/4.0 (compatible; MSIE 6.0; Symbian OS; 405) Opera 8.65 [zh-CN]
            "GIONEE", //
            "HTC", //
            "ZTE", //TE-A211/P109A2V1.0.0/WAP2.0 Profile
            "HUAWEI", //  "webOS", ozilla/5.0 (webOS/1.4.5; U; zh-CN) AppleWebKit/532.2 (KHTML, like Gecko) Version/1.0 Safari/532.2 Pre/1.0
            "GoBrowser", //3g GoBrowser.User-Agent=Nokia5230/GoBrowser/2.0.290 Safari
            "IEMobile", //Windows CE
            "WAP2.0" //     
			);
        foreach($mobileUserAgents as $v){
            if(strstr($ua,$v)){
                return  'mobile';
            }
        }
        return  'pc';
    }

 
	public static function orderArray(&$array,$key,$sort=''){
        foreach($array as $k=>$v){
            $value[$k] = $v[$key];
        }
        if($sort){
            array_multisort($value,SORT_DESC,$array);
        }
        else{
            array_multisort($value,$array);
        }
    }

    public static function formulaValue($formula,$dataArray){
        if($formula){
            if(!is_array($dataArray) || count($dataArray)<=0) {
                return $formula;
            }
            foreach($dataArray as $key=>$value){
                $formula = str_replace($key, $value, $formula);
            }
            eval("\$data = $formula;");
            return round($data,3); 
        }
    }  

 
	public static function random($length) { 
        $hash = ''; 
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz'; 
        $max = strlen($chars) - 1; 
        mt_srand((double)microtime() * 1000000); 
        for($i = 0; $i < $length; $i++) { 
            $hash .= $chars[mt_rand(0, $max)]; 
        } 
        return $hash; 
    } 

   
	public static function wordscut($string, $length ,$sss=0) { 
        if(strlen($string) > $length) { 
            if($sss){ 
                $length=$length - 3; 
                $addstr=' ...'; 
            } 
            for($i = 0; $i < $length; $i++) { 
                if(ord($string[$i]) > 127) { 
                    $wordscut .= $string[$i].$string[$i + 1]; 
                    $i++; 
                } else { 
                    $wordscut .= $string[$i]; 
                } 
            } 
            return $wordscut.$addstr; 
        } 
        return $string; 
    }
 
	public static function object_to_array($obj){
		$_arr = is_object($obj) ? get_object_vars($obj) : $obj;
		foreach ($_arr as $key => $val){
			$val = (is_array($val) || is_object($val)) ? $this->object_to_array($val) : $val;
			$arr[$key] = $val;
		}
		return $arr;
	}
}
?>

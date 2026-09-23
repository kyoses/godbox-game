<?php


include_once dirname(__FILE__).'/../Lib.php';

class Communicate {
    const S_SYS_ANNOUNCE = "s_sys_announce";
    const S_ACTIVITY = 's_activity';
    const C_AWARD = 'c_award';
    const C_HELP = 'c_help';
    
    public function selectAnnounceList() {
        $db = new DB();
        $sql = "select * from ".self::S_SYS_ANNOUNCE." limit 1";
        $query_id = $db->query($sql);
        $row = $db->fetch_array($query_id);
        return $row;
    }
    public function selectActivityList() {
        $db = new DB();
        $sql = "select * from ".self::S_ACTIVITY." where status=1 order by id";
        $query_id = $db->query($sql);
        while ($row = $db->fetch_array($query_id)) {
            switch ($row['type']) {
                case 2:
                    $row['url'] = "/sgg/i/communicate/acti_award.php";
                    break;
                case 3:
                    $row['url'] = "/sgg/i/communicate/help.php";
                    break;
                case 4:
                    $row['url'] = "/sgg/i/communicate/level_award.php";
                    break;
                case 5:
                    $row['url'] = "/sgg/i/communicate/vip_award.php";
                    break;
                case 6:
                    $row['url'] = "/sgg/i/communicate/checkCode.php";
                    break;
                case 7:
                    $row['url'] = "/sgg/i/communicate/cumulate_award.php";
                    break;
            }
            $array[$row['id']] = $row;
        }
        return $array;
    }
    public function selectActivityById ($acti_id) {
        $db = new DB(); 
        $sql = "select * from ".self::S_ACTIVITY." where id='$acti_id'";
        $query_id = $db->query($sql);
        return $db->fetch_array($query_id);
    }
    
    public function selectHelpList ($user_id) {
        $db = new DB(); 
        $sql = "select * from ".self::C_HELP." where user_1='$user_id' order by id desc";
        $query_id = $db->query($sql);
        if ($db->num_rows($query_id)) {
            $no = 1;
            $userObj = new User();
            while ($row = $db->fetch_array($query_id)) {
                if ($row['st'] == 1) {
                    $user = $userObj->selectUser($row['user_1']);
                    $row['user_name'] = $user['name'];
                }
                else {
                    $row['user_name'] = '瀹㈡湇';
                }
                
                $row['date_time'] = date('m/d H:i', $row['log_time']);
                $array[$no] = $row;
                $no++;
            }
            return $array;
        }
        else {
            return -1;
        }
    }
    public function insertHelp ($from_user, $to_user, $content) {
        $time = time();
        $db = new DB(); 
        $sql = "insert ignore into ".self::C_HELP." (user_1, user_2, log_time, st, content) values ('$from_user', '$to_user', '$time', 1, '$content')";
        $query_id = $db->query($sql);
        $sql = "insert ignore into ".self::C_HELP." (user_1, user_2, log_time, st, content) values ('$to_user', '$from_user' , '$time', 2, '$content')";
        $query_id = $db->query($sql);
    }
}
?>

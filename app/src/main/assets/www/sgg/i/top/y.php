<?php
include_once dirname(__FILE__).'/../../config.php';
//echo $uid;
$userObj=new User();
$user=$userObj->selectUser($uid);
$user['progress']=$progress;
$userObj->updateDirectorProgress($user);
/*if($progress==42){
    $userObj->addReputation($user, $user['reputation']+1);
}*/
?>

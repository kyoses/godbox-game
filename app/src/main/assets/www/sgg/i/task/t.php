<?php
//用户任务接口文件 by shubo
include_once dirname(__FILE__).'/../../config.php';
$task=new Task();

//领取任务
if($taskID){
    $task->takeTask($uid, $taskID);
    //更新用户信息
    $userObj=new User();
    $user=$userObj->selectUser($uid);
    $exp_up = $userObj->getUserUpExp($user['level']);
    $data['user']['level']=$user['level'];
    $data['user']['expUp']=$exp_up;
    $data['user']['exp']=$user['exp'];
    $data['user']['gold']=$user['gold'];
    $data['user']['yb']=$user['yb'];
    $data['user']['yb_sys']=$user['yb_sys'];
	$data['user']['reputation']=$user['reputation'];
}
//
$userTaskInfo=$task->getUserTaskInfo($uid);
if($userTaskInfo){
	$userTaskInfo = $task->orderTask($userTaskInfo);  //在Task.class.php中定义了排序方法(有待性能优化)
	$n = 0;
	foreach ($userTaskInfo as $key => $value) {
		$n++;
		$userTaskInfo[$key]['displayOrder'] = $n;
	}
	unset($n);
	$data['list'] = $userTaskInfo;
}

if($data){
	$data['rt']=1;
}else{
	$data['rt']=0;
}
echo json_encode($data);
exit();
?>

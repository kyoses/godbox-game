<?php
/* 鐐瑰嚮鍚堟垚瑁呭 */
include_once dirname(__FILE__) . '/../../config.php';
$targetId = $hecheng['target']['id'];
$met = $hecheng['met']; //鏉愭枡鏁扮粍
$prop = new Prop();
$data['isSuccess'] = true;
//閬嶅巻鍚堟垚鑺辫垂鐨勯亾鍏?

foreach ($met as $key=>$v){
    $userNum = $prop->getNumBagProp($uid, $v['id']);
    if($userNum>=$v['num']){
        $prop->deleteProp($uid, $v, $v['num']);  //淇敼鐢ㄦ埛閬撳叿涓暟
    }else{
        $data['isSuccess'] = false;    //鐗规畩鎯呭喌(鐢ㄦ埛浣滃紛)
    }  
}
//濡傛灉鏁版嵁娌￠棶棰橈紝鍒欑洿鎺ヤ负瑁呭鍗囩骇
if($data['isSuccess']){
    $equip = new Equip();
    $equip->hechengEquip($uid, $source, $targetId);
}
echo json_encode($data);
exit();
?>

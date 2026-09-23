<?php
/*
 * 充值类
 * 20130605 by verys.
 */
include_once dirname(__FILE__).'/../Lib.php';
class Charge {
	
	function insertOrder($array){
		$db = new DB(); //使用数据库操�?
        $db->insert('c_user_charge', $array);
		$id = $db->insert_id();
        if ($uid > 0) {
            return $id;
        }
		$this->updateBillOrder();
	}
	
	function getBillOrder(){  //获取最新账单索引号
		$db = new DB(); //使用数据库操�?
		$data = $db->get_one("select id from c_bill_order");
		if(!$data){
			$id = 0;
			$db->insert("c_bill_order", array('id' =>$id));
		}else{
			$id = $data['id'];
		}
		return $id;
	}
	
	function updateBillOrder(){   //更新最新的账单id
		$db = new DB(); //使用数据库操�?
		$data = $db->get_one("select id from c_bill_order");
		$id=$data['id']+1;
		$sql = "update c_bill_order set id=".$id;
		$db->query($sql);
	}
	
	//根据订单id获取订单相关信息
	function selectOrderInfoByOrderId($order_id){
		$db = new DB();
		$sql = "select * from c_user_charge where order_id='$order_id'";
		$data =  $db->get_one($sql);
		return $data;
	}
	//更新订单状�?
	function updateOrderStatus($order_id){
		$db = new DB();
		$condition = " order_id='".$order_id."'";
		$db->update('c_user_charge', array("status" =>1),$condition);
	}
	//查看用户的消费记�?
	function selectUserCharge($uid){
		$db = new DB();
		$sql = "select * from c_user_charge where user_id='$uid' and status=1";
		$data = $db->get_all($sql);
		return $data;
	}
}
?>
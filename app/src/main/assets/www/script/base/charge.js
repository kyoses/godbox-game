 
var charge={
	UVip:0,
	moneyExp:0,
	yuanbao:0,
	img:'',
	loadWindow:function(){
		var chargeWindow = new mesWindow("chargeWindow", $("#charge_tmpl").html());
		charge.UVip = $('#btn_vip').attr("vip_lv");
		charge.yuanbao = parseInt($('#ybNum').attr("yb_total"));
		charge.img = $('#userName').attr("per_img");
		$('#uimg').attr("src",charge.img);
		$('#uname').text($('#userName').text());
		var json = [{"start":"0","end":"9"},{"start":"10","end":"49"},{"start":"50","end":"99"},{"start":"100","end":"199"},{"start":"200","end":"499"},{"start":"500","end":"999"},{"start":"1000","end":"1999"},{"start":"2000","end":"4999"},{"start":"5000","end":"9999"},{"start":"10000","end":"49999"},{"start":"50000","end":"50000"}];
		for(key in json){
			if(charge.yuanbao>=500000){
				var NextVipYb = parseInt(json[key]['end']*10)-parseInt(charge.yuanbao)+10;
				$('#describe').text("黄金VIP");
				$('.vipBlood2').css("width","100%");$('.vipBlood2').text(charge.yuanbao+"/"+charge.yuanbao);
			}else{
				if(charge.yuanbao>=json[key]["start"]*10 && charge.yuanbao<json[key]["end"]*10){
					charge.moneyExp = parseInt(((charge.yuanbao/(json[key]["end"]*10)*361)));//vip等级经验条
					var vipLevel = parseInt(key)+1;//下一级vip等级
					var NextVipYb = parseInt(json[key]['end']*10)-parseInt(charge.yuanbao)+10;//升级到下一级vip所需元宝数
					if(charge.yuanbao>=100000){
						$('#describe').text("再充值"+NextVipYb+"元宝，您将成为 黄金VIP");
					}else{
						$('#describe').text("再充值"+NextVipYb+"元宝，您将成为 VIP "+vipLevel);
					}
					var showNum = json[key]['end']*10+10;
					$('.vipBlood2').css("width",charge.moneyExp);$('.vipBlood2').text(charge.yuanbao+"/"+showNum);
				}
			}
		}
		//vip充值界面下测分页
		var current_num=1;//当前页数 
		var describe = '';
		$(".vipUL").hide();
		if(charge.UVip<=1){
			//$(".vipUL:gt(0)").hide();//初始化，前面1条数据显示，其他的数据隐藏。
			$(".vipUL:eq(0)").show();
		}else{
			current_num = charge.UVip;
			$(".vipUL:eq("+(current_num-1)+")").show();
		}
        var total_q=$(".vipUL").length;//总数据 
        var current_page=1;//每页显示的数据 
        var total_page= Math.ceil(total_q/current_page);//总页数  
        if(charge.UVip<10){
        	$('#vipTQ').html("VIP <span class='fs28'>"+charge.UVip+"</span> 特权");
        }else{
        	$('#vipTQ').html("黄金 <span class='fs28'>VIP</span> 特权");
        }
        $("#next").bind(clickEventType,function(){
            if(current_num==total_page){ 
                return false;//如果大于总页数就禁用下一页 
            }else{ 
            	++current_num;
            	if(current_num==total_page){
            		$('#vipTQ').html("黄金 <span class='fs28'>VIP</span> 特权");
            	}else{
            		$('#vipTQ').html("VIP <span class='fs28'>"+current_num+"</span> 特权");
            	}
                $.each($('.vipUL'),function(index,item){ 
                	var start = current_page* (current_num-1);//起始范围 
                	var end = current_page * current_num;//结束范围 
                	if(index >= start && index < end){//如果索引值是在start和end之间的元素就显示，否则就隐 
                		$(this).show();
                	}else {
                		$(this).hide();
                	} 
                });
            }
        });
        $("#prev").bind(clickEventType,function(){
            if(current_num==1){ 
                return false; 
            }else{ 
            	--current_num; 
            	$('#vipTQ').html("VIP <span class='fs28'>"+current_num+"</span> 特权");
                $.each($('.vipUL'),function(index,item){ 
                    var start = current_page* (current_num-1);//起始范围 
                    var end = current_page * current_num;//结束范围 
                    if(index >= start && index < end){//如果索引值是在start和end之间的元素就显示，否则就隐藏 
                    	$(this).show();
                    }else {
                        $(this).hide();  
                    } 
                });      
            } 
        });
        //充值
        $("#btn_vip_pay").bind(clickEventType,charge.sub);
	},
	sub:function(){  //打开充值弹窗
		var chargeDialog = $($("#tmpl_charge_dialog").html());
		chargeDialog.attr("id","equip_showwin");
		chargeDialog.css("z-index",0);
		$("#chargeWindow").append(chargeDialog);
		if(acc_type==1||acc_type==""){  //新浪
			chargeDialog.find(".sn_style").siblings().remove();
		}else if(acc_type==2){  //移动
			chargeDialog.find(".cm_style").siblings().remove();
			chargeDialog.find(".cm_fc").show();
			var cm_btn = chargeDialog.find(".cm_fc");
			cm_btn.show();
			cm_btn.first().attr("id","btn_charge");
			cm_btn.slice(1,2).attr("id","btn_charge_query");
			cm_btn.last().attr("id","btn_charge_note");
		}
		//新浪
		$("#chargeWindow #equip_showwin ul").bind(clickEventType,function(){
			var type = $(this).attr("type");
		    var form = document.createElement("form");
			document.body.appendChild(form);
			form.method="post";
			var i1 = document.createElement("input");
			i1.type = "hidden";
			form.appendChild(i1);
			i1.value = userId;
			i1.name = "uid";
			var i2 = document.createElement("input");
			i2.type = "hidden";
			form.appendChild(i2);
			i2.value = type;
			i2.name = "type";
			
			//根据不同的渠道选择不同的接口
			var channelType = $(this).parent().attr("type");
			if(channelType=="1"){
				if(acc_type==1){
					form.action = "http://"+host+"/sgg/i/charge/s1.php";  //新浪支付平台
				}else{
					form.action = "http://"+host+"/sgg/i/charge/s3.php";  //易宝支付平台
				}
				form.submit();
				
			}else if(channelType=="2"){
				var rmb = parseInt($(this).attr("rmb"));
				Common.alert("购买元宝要花费 "+(rmb*100)+"点数，若点数不足,系统将直接从话费账户中补足相应金额。确认购买?",1,function(){
					$.getJN("http://"+host+"/sgg/i/charge/s2.php", {
			            uid:userId,type:type
			        },function(data){
			             if(data.re==1){
			             	Common.alert("购买元宝失败");
			             	user.refreshUserInfo(data.user);
			             }else{
			             	Common.alert("购买元宝失败");
			             }
			        });
				});
			}
		});
		$(document).bind(touchDown,function(e){
			if($(e.target).attr("class")=="stro20 fs26"||
			   $(e.target).attr("class")=="stro24 fs24"||
			   $(e.target).attr("class")=="vipBox tc fl"||
			   $(e.target).hasClass("cm_fc")){

			}else{
				$("#chargeWindow #equip_showwin ul").unbind(clickEventType)
				equip.hideEquipInfo();
			}
		});
		//CM 点数充值
		$("#btn_charge").bind(clickEventType,function(){
			var dialog = $("<div class='pubPop5 ls1' style='padding-top:0px;top:-480px;left:150px;height:404px;width:600px;;position: relative; z-index: 0;'>" +
					"<div class='exit'></div>" +
					"<div class='fs24 cor55 bors5' style='text-indent:48px;line-height:33px;width:500px;height:100px;margin:70px 30px 20px 30px;background-color:#905d30;'>" +
					"点数充值是将话费费直接转化为移动平台的点数，点数可用来购买任何游戏的道具。请注意点击下方链接将直接扣除话费。</div>" +
					"<div class='cm_cg' id='cm_btn_list'>"+
					"<a class='stro24 fs24 cm_fc'>充值2元</a><a class='stro24 fs24 cm_fc'>充值4元</a>"+
					"<a class='stro24 fs24 cm_fc'>充值8元</a><a class='stro24 fs24 cm_fc'>充值11元</a>"+
					"<a class='stro24 fs24 cm_fc'>充值14元</a><a class='stro24 fs24 cm_fc'>充值17元</a>"+
					"<a class='stro24 fs24 cm_fc'>充值21元</a><a class='stro24 fs24 cm_fc'>充值30元</a>"+
					"</div></div>");
		    dialog.attr("id","equip_showwin");
		    $("#chargeWindow").append(dialog);
		    $("#cm_btn_list a").bind(clickEventType,charge.cmBtnClick);
		});
		//CM 点数充值记录
		$("#btn_charge_query").bind(clickEventType,function(){
			$.getJN("http://"+host+"/sgg/i/charge/cm_query2.php", {
			    uid:userId
	        },function(data){
	             charge.setCMNoteInfo(data,2);
	        });
		});
		//CM查看消费记录
		$("#btn_charge_note").bind(clickEventType,function(){
			$.getJN("http://"+host+"/sgg/i/charge/cm_query1.php", {
			    uid:userId
	        },function(data){
	             charge.setCMNoteInfo(data,1);
	        });
		})
	},
	cm_charge_type:{1:"点数",2:"话费",3:"点数和话费"}  //cm平台计费类别
	,
	setCMNoteInfo:function(data,type){  //设置查询记录的结果显示
		var inf = (type==1)?"消费":"充值点数";
		if(data.re==1){
         	if(data.list){
             	var dialog = $("<div class='pubPop5 ls1' style='padding-top:0px;top:-480px;left:150px;height:404px;width:600px;;position: relative; z-index: 0;'><div class='exit'></div></div>");
             	dialog.attr("id","equip_showwin");
             	var div = $("<div class='chartsList' style='margin-top:70px;'></div>")
             	for(var key in data.list){
             		var t = charge.cm_charge_type[data.list[key].type];
             		if(type==1){
             			div.append("<li><a>"+data.list[key].time+"</a><a>通过"+t+"</a><a>充值 "+data.list[key].yb+"元宝</a></li>");
             		}else{
             			var time = charge.formatTime(data.list[key].time);
             			div.append("<li><a>"+time+"</a><a>充值"+data.list[key].yb+"元话费</a><a>获得点数"+(data.list[key].yb*100)+"</a></li>");
             		}
             	}
             	dialog.append(div);
             	$("#chargeWindow").append(dialog);
         	}else{
         		Common.alert("本月"+inf+"记录为空");
         	}
         }else{
         	Common.alert("获取"+inf+"记录失败");
         }
	}
	,
	cmBtnClick:function(){  //CM点数充值按钮点击
		var type = $(this).index()+1;
		$.getJN("http://"+host+"/sgg/i/charge/cm_chargeup.php", {
		    uid:userId,type:type
        },function(data){
        	if(data.re==1){
        		Common.alert("充值游戏点数成功");
        	}else{
        		Common.alert("充值游戏点数失败");
        	}
        });
	},
	formatTime:function(time){  //格式化时间字符串20130713171020
		var time = time.toString();
		var date = time.substr(0,8);
		var h = time.substr(8,2);
		var m = time.substr(10,2);
		return date+"  "+h+":"+m;
	}
}
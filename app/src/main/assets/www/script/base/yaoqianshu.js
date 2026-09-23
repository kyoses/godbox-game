 
 var YQS = {
 	isLoading:false,
 	loadWindow:function(){
 		if(YQS.isLoading==true){
 			return false;
 		}
 		YQS.isLoading = true;
 		$.getJSON("http://" + host + "/sgg/i/yaoqianshu/y.php", 
		{uid : userId},
		function(data){
			YQS.isLoading = false;
			var fxWindow = new mesWindow("yqswindow", $.tmpl($("#tmpl_yaoqianshu").html(),data).html(),25);
			$("#yqs_gold").text(user.formatGold(data.user.gold));
			if(data.openLots){
				$("#btn_yqs_lots").attr("open",1);
			}
			$("#yqs_tree").attr("data",JSON.stringify(data.yq));
		});	
 	}
 	,SEYQS:function(){  //摇钱树特效
 		/*
 		 * Y坐标不得小于480
 		 * 89<X<445 数组为选定的相对比较的掉落点
 		 */
 		var pArray = new Array("399:425","391:449","374:420","353:433","335:409","354:360","414:393","384:361","405:370",
 		                       "444:375","361:320","429:269","448:276","450:311","463:328","475:313","503:320","514:339",
 		                       "504:290","486:293","454:371","560:416","575:390","600:394","589:408","608:410","631:384",
 		                       "616:360","636:355","658:403");
 		                       
 		var MyMar1=setInterval(function(){
 			var r_num = Math.floor(Math.random()*30);
			var r_pos = pArray[r_num];  //随机坐标
			var r_left = r_pos.split(":")[0]-15;
			var r_top = r_pos.split(":")[1];
			var id = new Date().getTime().toString();   //使用时间戳做为id
			var img,w_h = null;
			if(r_num%2==1){
				img = "yuanbao.png";
				w_h = "width:35px;height:19px;"
			}else{
				img = "jb.png";
				w_h = "width:35px;height:35px;";
			}
			$("body").append("<img id='"+id+"' src='image/sys/"+img+"' style='"+w_h+";position:fixed;top:"+r_top+"px;left:"+r_left+"px;;z-index:10001;' />");
			$("#"+id).animate({top:450},150);
			setTimeout(function(){
				$("#"+id).remove();
 			},200);
 		},50);
 		setTimeout(function(){
 			clearInterval(MyMar1);
 		},1500);
 	},
 	setYQSInfo:function(yq){
 		$("body").append("<div class='yqs_prompt'>摇钱"+yq.y_num+"次，获得金币"+yq.getGold+"</div>");
 		var temp = 0;
 		var pro = setInterval(function(){
 			if(temp%2==1){
 				$("body .yqs_prompt").animate({opacity:0.2},200);
 			}else{
 				$("body .yqs_prompt").animate({opacity:1.0},200);
 			}
 			temp++;
 		},300);
 		setTimeout(function(){
 			clearInterval(pro);
            $("body .yqs_prompt").remove();
        },1500);
		$("#qysLeftNum").text(yq.c_num);
		$("#yqs_n_yb").text(yq.needYB);
		var v_gold = YQS.getGoldByLevel(yq.num+1);
		$("#qysGetGold").text(v_gold);
 	},
 	getSpentByNum:function(num){  //根据当前次数计算所需元宝
 		return (num-1)*6;
 	},
 	getGoldByLevel:function(num) {
 		var gold = 10000*num+40000;
        return gold;
    },
    pub:function(piliang){
		SE.shake($("#yqsTree")); //抖动一下
 		setTimeout(function(){
 			YQS.SEYQS();  //特效
 		},500);
 		isDoing=1;
 		$.getJSON("http://" + host + "/sgg/i/yaoqianshu/y1.php", 
		{uid : userId,isBatch:piliang},
		function(data){
			//摇钱树
			isDoing = 0;
			if(data.re==1){  //成功
				if(data.yq){
					YQS.setYQSInfo(data.yq);
					$("#yqs_tree").attr("data",JSON.stringify(data.yq));
				}
				$("#yqs_user>li:eq(0) span").text(data.user.yb);
				$("#yqs_user>li:eq(1) span").text(user.formatGold(data.user.gold));
				user.refreshUserInfo(data.user);
				UInfo.refreshUInfo(data.user);
				if(data.rihuo){
					Rihuo.refreshRihuoInfo(data.rihuo);
					//刷新日活页面摇钱树的次数
					if($("#rh_list_1").html()){
						var n = parseInt($("#rh_list_1 dd:eq(0)").text());
						$("#rh_list_1 dd:eq(0)").text(n+data.yq.num);
					}
				}
				
			}else if(data.re==0){
				//下级vip可用次数
				var nextVipStatus = data.yq.NVip+"还可摇"+data.yq.NVipNum+"次";
				Common.alert(nextVipStatus,3,chagre.sub);
			}else if(data.re==10){
				Common.alert("<span class='cor95 stro13'>今天的次数已用完，</span>请明日<span class='cor95'>再来</span>");
			}
			else if(data.re==2){
				Common.alert("<span class='cor95 stro13'>元宝不足，是否</span>前往<span class='cor95'>充值</span>",2,"charge.sub");
			}else{
				log("异常情况，可能是VIP等级<span class='cor95 stro13'>不够缺使用了'批量'</span>");
			}
		});
    }
 }
 $(function(){
 	//摇钱树
 	var isDoing = 0; //正在进行否？
 	$("#btn_yqs,#btn_yqs_lots").live(clickEventType,function(e){
// 		var x=getEventX(e);
//		var y=getEventY(e);
//		log(x+":"+y);
//		return false;
 		if(isDoing==1){
 			return false;
 		}
 		var data = JSON.parse($("#yqs_tree").attr("data"));
 		var piliang = (this.id=="btn_yqs_lots")?1:0;  //批量
 		if(parseInt($("#qysLeftNum").text())<=0){
 			Common.alert("<span class='cor95 stro13'>今天的次数已用完，</span>请明日<span class='cor95'>再来</span>");
 			return false;
 		}
 		if(parseInt($("#yqs_yb").text())<parseInt($("#yqs_n_yb").text())){
 			Common.alert("<span class='cor95 stro13'>元宝不足，是否</span>前往<span class='cor95'>充值</span>",2,charge.loadWindow);
 			return false;
 		}
 		if(piliang&&$("#btn_yqs_lots").attr("open")=="0"){
 			Common.alert("对不起，VIP4开放<span class='cor95 stro13'>批量摇钱</span>");
 			return false;
 		}
 		
 		//提示本次摇钱花多少钱，给多少金币
 		var user_yb = parseInt($("#yqs_user li:eq(0) span").text());
 		var user_level = parseInt($("#userLevel").text());
 		var need_yb = 0; //花费的金币总数
 		var yq_num = 0;  //总共摇的次数
 		var get_jb=0;
 		var c_num = data.c_num;  //剩余次数
 		var num = data.num+1;  //当前次数
 		if(piliang==0){  //摇钱一次
 			yq_num = 1;
 			need_yb = data.needYB;
 			get_jb = YQS.getGoldByLevel(num);
 		}else{
 			for(var i=0;i<10;i++){
 				if(c_num<=0||user_yb<need_yb){
 					break;
 				}
 				need_yb+=YQS.getSpentByNum(num);
 				get_jb+=YQS.getGoldByLevel(num);
 				num++;
 				c_num--;
 				yq_num++;		
 			}
 		}
 		if(user_yb<need_yb){
 			Common.alert("<span class='cor95 stro13'>元宝不足，是否</span>前往<span class='cor95'>充值</span>",2,charge.loadWindow);
 			return false;
 		}
 		
 		if(need_yb==0&&piliang==0){
 			YQS.pub(piliang);
 		}else{
	 		Common.alert("<span class='cor95 stro13'>是否消耗"+need_yb+"元宝，</span> 获得<span class='cor95'>"+get_jb+"钱币</span>",5,function(){
	 			YQS.pub(piliang);
	 		});
 		}
 	});
 	
 });
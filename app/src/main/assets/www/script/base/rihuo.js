/**
 * 日活跃度及主公信息***JSSG
 * @author veryszhang
 */
 var Rihuo = {
 	loadWindow:function(){
 		var rhWindow = new mesWindow("rhwindow", $("#rihuo_tmpl").html());
 		$.getJSON("http://" + host + "/sg/i/common/r.php", 
		{uid : userId},
		function(data){
			Rihuo.setBlood(data.r_num);
			Rihuo.setBoxStatus(data.boxs);
			Rihuo.setRihuoList(data);
		});	
 	},
 	setBlood:function(num){  //设置当前日活跃度
 		$("#rh_num").text(num);
 		if(num<=100){
 			num = 120*num/100;
 		}else if(num>100&&num<=200){
 			num = 250*num/200;	
 		}else if(num>200&&num<=500){
 			num = 400*num/500;
 		}else if(num>500&&num<=1000){
 			num = 550*num/1000;
 		}else if(num>1000){
 			num = 700*num/5000;
 		}
 		$("#rh_blood").css("clip","rect(auto,"+num+"px, auto, auto)");
 	},
 	setBoxStatus:function(boxs){
 		var boxArray = boxs.split(",");
 		for(i=0;i<boxArray.length;i++){
 			if(boxArray[i]=="2"){
 				$("#rh_box_list li:eq("+i+")").find("img").attr("src","image/game/"+Rihuo.BoxImg[i]);
 			}
 			if(boxArray[i]=="1"&&boxArray[i+1]=="0"){
 				$("#rh_box_list li:eq("+i+")").addClass("cur");
 			}
 			$("#rh_box_list li:eq("+i+")").attr("st",boxArray[i]);
 		}	
 	},
 	BoxImg:{
 		0:"obox1_lcon.png",
 		1:"Obox5_lcon.png",
 		2:"Obox4_lcon.png",
 		3:"Obox3_lcon.png",
 		4:"Obox2_lcon.png"
 	},
 	setRihuoList:function(data){
 		if(data.list){
 			for(key in data.list){
 				$("#rh_list_"+key).find("dd").first().text(data.list[key]);
 			}
 		}
 		if($("#rh_list_3").find(".fs16").text()=="0"){
 			SE.promptClick("rh_list_3");
 		}
 		if($("#rh_list_6").find(".fs16").text()=="0"){
 			SE.promptClick("rh_list_6");
 		}
 	},
 	refreshRihuoInfo:function(rihuo){
		//如果日活页面打开
		if(document.getElementById("rh_blood")){
			Rihuo.setBlood(rihuo['num']);
			$("#rh_num").text(rihuo['num']);
		}
 	}
 }
 //主公信息
 var UInfo = {
 	isLoading:false,
 	loadWindow:function(){
 		if(UInfo.isLoading){
 			return false;
 		}
 		UInfo.isLoading = true;
 		//部分数据来自主页
 		var my = new Object();
 		var jiang='',tili='';
 		my.level = $("#userLevel").text();
 		my.name = $("#userName").text();
 		my.vip = $("#btn_vip").attr("vip_lv");
 		my.tili = $("#nowTL").attr("nowtl");
 		my.ybsys = $("#dqNum").text();
 		$.getJSON("http://" + host + "/sgg/i/user/z.php", 
		{uid : userId},
		function(data){
			data.img = data.uinfo.img.replace("s","");
			if(data.uinfo.level>=0 && data.uinfo.level<10){
				jiang = "10级+1";
			}
			if(data.uinfo.level>=10 && data.uinfo.level<20){
				jiang = "20级+1";
			}
			if(data.uinfo.level>=20 && data.uinfo.level<30){
				jiang = "30级+1";
			}
			if(data.uinfo.level>=30 && data.uinfo.level<40){
				jiang = "40级+1";
			}
			if(data.uinfo.level>=40){
				jiang = "";
			}
			var TL = [50,50,50,70,70,100,100,100,100,100,100];//保存vip体力上限
			if(my.vip==0){
				tili = my.tili+"/"+TL[0];
			}else if(my.vip==1){
				tili = my.tili+"/"+TL[1];
			}else if(my.vip==2){
				tili = my.tili+"/"+TL[2];
			}else if(my.vip==3){
				tili = my.tili+"/"+TL[3];
			}else if(my.vip==4){
				tili = my.tili+"/"+TL[4];
			}else if(my.vip==5){
				tili = my.tili+"/"+TL[5];
			}else if(my.vip==6){
				tili = my.tili+"/"+TL[6];
			}else if(my.vip==7){
				tili = my.tili+"/"+TL[7];
			}else if(my.vip==8){
				tili = my.tili+"/"+TL[8];
			}else if(my.vip==9){
				tili = my.tili+"/"+TL[9];
			}else{
				tili = my.tili+"/"+TL[10];
			}
			var width=parseInt((data.uinfo.exp/data.expUp)*210);
			if(data.uinfo.yb<10000){
				data.yb = data.uinfo.yb;
			}else{
				data.yb = parseInt(data.uinfo.yb/10000)+"万";
			}
			if(data.uinfo.gold<10000){
				data.gold = data.uinfo.gold;
			}else{
				data.gold = parseInt(data.uinfo.gold/10000)+"万";
			}
			data.b_sum = data.b_sum;
			data.width=width;
			if(my.level>=0){
				data.btn = "pub_btn2";
			}else{
				data.btn = "hpub_btn2";
			}
			//alert(my.level);
			data.curr_exp = data.uinfo.exp;
			data.expUp = data.expUp;
			data.jiang=jiang;
			data.level = my.level;
			data.name = my.name;
			data.limit = data.limit;
			data.vip = my.vip;
			data.xtili = tili;
			data.ybsys = my.ybsys;
			data.reputation = data.uinfo.reputation;
			var uiWindow = new mesWindow("zgwindow", $.tmpl($("#userInfo_tmpl").html(),data).html());
			$("#gerenxinxi").bind(clickEventType,function(){uiWindow.closeWindow(this);});
			$(".index:gt(2)").hide();//初始化，前面4条数据显示，其他的数据隐藏。
			var total_q=$(".index").index()+1;//总数据 
            var current_page=3;//每页显示的数据 
            var current_num=1;//当前页数 
            var total_page= Math.ceil(total_q/current_page);//总页数   
            $(".total").text(total_page);//显示总页数 
            $(".current_page").text(current_num);//当前的页数 
            //下一页 
            $(".selSR").click(clickEventType,function(){ 
                if(current_num==total_page){ 
                    return false;//如果大于总页数就禁用下一页 
                }else{ 
                    $(".current_page").text(++current_num);//点击下一页的时候当前页数的值就加1 
                    $.each($('.index'),function(index,item){ 
                        var start = current_page* (current_num-1);//起始范围 
                        var end = current_page * current_num;//结束范围 
                        if(index >= start && index < end){//如果索引值是在start和end之间的元素就显示，否则就隐 
                           $(this).show(); 
                        }else{ 
                            $(this).hide();  
                        } 
                    }); 
                }
            });
            //上一页方法 
            $(".selSL").click(clickEventType,function(){ 
               if(current_num==1){ 
                   return false; 
               }else{ 
                   $(".current_page").text(--current_num); 
                   $.each($('.index'),function(index,item){ 
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
            
            $('#yaoqiangshu').click(clickEventType,function(){
            	if($('#yaoqiangshu').attr('class') == "wdxx_btn tc fs20 hpub_btn2"){
            		return false;
            	}
            	YQS.loadWindow();
            });
            $('#yaotili').click(clickEventType,function(){  //补充体力
            	if($('#yaotili').attr('class') == "wdxx_btn tc fs20 hpub_btn2"){
            		return false;
            	}
         		$.getJSON("http://" + host + "/sgg/i/tili/b.php", 
         				{uid : userId},
         				function (msg){
         					if(msg.re==3){
         						Common.alert("体力已满，无法<span class='cor95 stro13'>补充</span>");
         					}else if(msg.re==4){
         						Common.alert("今日无法补充体力，提升VIP<span class='cor95 stro13'>可增加补充次数</span>",3,charge.loadWindow);
         					}else if(msg.re==5){
         						Common.alert("元宝<span class='cor95 stro13'>不足，无法购买体力！</span>",2,charge.loadWindow);
         					}else{
         						Common.alert("今日第"+msg.x+"次补充体力，花费"+msg.needYB+"元宝，<span class='cor95 stro13'>获得50点体力，每半小时回复1点</span>",1,UInfo.udateTL);
         					}
         				}
         		);
            });
            $('#yaoCharge').click(clickEventType,function(){charge.loadWindow();});
			//设置血条（总长350）
 			//var length = Math.round(350*(parseInt($("#nowExp").text())/parseInt($("#upExp").text())));
 			//$("#uinfo_exp>div").css("clip","rect(auto,"+length+"px, auto, auto)")
			UInfo.isLoading = false;
		});
 	},
 	udateTL:function(){
 		$.getJSON("http://" + host + "/sgg/i/tili/b.php", 
 				{uid : userId,upadte:1},
 				function (msg){
					if(msg.re==1){
						$('#bt').empty().append("<span class='cor1'>"+msg.nl+"</span>/<span>"+msg.stl+"</span>");
						$('#nowTL').attr("nowtl",msg.nl);
                        $("#ybNum").text(user.formatGold(msg.info.yb));
						$('#nowTL').css("width",parseInt((msg.nl/msg.stl)*104));
						$('#uinfoTL').text(msg.nowTL);
					}
 				}
 		);
 	},
 	refreshUInfo:function(data){  //刷新主公信息
 		//保证主公信息页打开
 		if(!$("#btn_ckch").text()){
 			return false;
 		}
 		if(data.gold){
 			$("#uinfo_attr p:eq(5) em").text(data.gold);
 		}
 		if(data.yb_sys){
 			$("#uinfo_attr p:eq(3) em").text(data.yb_sys);
 		}
 		if(data.yb){
 			$("#uinfo_attr p:eq(4) em").text(data.yb);
 		}
 		if(data.repu){
 			$("#uinfo_attr p:eq(6) em").text(data.repu);
 		}
 		if(data.nowTL>0){
 			$("#uinfo_attr p:eq(0) em").text(data.nowTL);
 		}
 		if(data.exp){
 			var exp = data.exp;
 			var expMax = $("#uinfo_exp>span").text().split("/")[1];
 			$("#uinfo_exp>span").text(exp+"/"+expMax);
 		}
 	},
 	getSalary:function(){  //领取俸禄奖励
 		$.getJSON("http://" + host + "/sg/i/common/r3.php", 
		{uid : userId},
		function(data){
			if(data.re=="1"){
				if(document.getElementById("rh_list_6")){
					$("#rh_list_6").find("dd").first().text(1);
				}
				Common.alert("恭喜您获得了俸禄金币"+data.gold);
				user.refreshUserInfo(data.user);
				user.setCanGetAward("sal");
				if(data.rihuo){
					Rihuo.refreshRihuoInfo(data.rihuo);
					//刷新日活页面摇钱树的次数
					if($("#rh_list_6").html()){
						var n = parseInt($("#rh_list_6 dd:eq(0)").text());
						$("#rh_list_6 dd:eq(0)").text(1);
					}
				}
			}else if(data.re=="0"){
				log("5级以下俸禄为0哦");
			}else{
				Common.alert("今天俸禄已经领取");
			}
		});
 	},
 	getTitleAward:function(){
 		$.getJSON("http://" + host + "/sg/i/common/r2.php", 
		{uid : userId},
		function(data){
			if(data.re=="1"){
				if(document.getElementById("rh_list_3")){
					$("#rh_list_3").find("dd").first().text(1);
				}
				Common.alert("恭喜您获得了称号奖励金币"+data.gold);
				user.refreshUserInfo(data.user);
				user.setCanGetAward("tit");
				if(data.rihuo){
					Rihuo.refreshRihuoInfo(data.rihuo);
					//刷新日活页面摇钱树的次数
					if($("#rh_list_3").html()){
						var n = parseInt($("#rh_list_3 dd:eq(0)").text());
						$("#rh_list_3 dd:eq(0)").text(1);
					}
				}
			}
		});
 	},
 	setUserTitleInfo:function(data){
 		var list = data.s_title;
 		var usertitle = parseInt(data.t_id);
 		if(usertitle>2){ //用户声望大于2
 			var nn =-250*(usertitle-2);
 			$("#titleList>div").css("margin-left",(-15+nn)+"px");
 		}
 		for(key in list){
 			var title = parseInt(list[key].id);
 			var color = (title<=usertitle)?"cor11":"cor1";
 			var str = "<dl class='appeO bor5 fl'><dt class='fs24'>"+list[key].name+"</dt>"+
				"<dd><span class="+color+">需要声望"+list[key].reputation+"</span></dd><dd>属性：</dd><dd>血量+"+list[key].hp+"</dd><dd>阵法+"+list[key].speed+"</dd>"+
				"<dd>力量+"+list[key].strength+"</dd><dd>智力+"+list[key].intelligence+"</dd><dd><span class='cor32'>俸禄：</span></dd><dd>钱币+"+list[key].gold+"</dd>"+
				"<dd>上阵人数：<span class='cor1'>"+list[key].num+"</span></dd></dl>";
 			$("#titleList").addSliderItem(str);
 		}
 		$("#userRepu").text(data.repu);
 	},
 	addTiLi:function(isBatch){
 		$.getJSON("http://" + host + "/sg/i/tili/b.php", 
		{uid : userId,batch:isBatch},
		function(data){
			if(data.re=="1"){
				var addNum = (isBatch==1?50:5);
				Common.alert("成功添加"+addNum+"点体力");
				if($("#uinfo_attr").html()){
					$("#uinfo_attr p:eq(0) em").text(data.user.nowTL);
					$("#uinfo_attr p:eq(3) em").text(data.user.yb_sys);
					$("#uinfo_attr p:eq(4) em").text(data.user.yb);
					//更新补充体力描述信息
					$("#oneAddInfo span:eq(0)").text(data.needYB);
					$("#oneAddInfo span:eq(1),#oneAddInfo em").text(data.needDQ);
					$("#oneAddInfo em").text("+"+data.needDQ);
					//更新批量添加描述信息
					$("#batchAddInfo span:eq(0)").text(data.needYB);
					$("#batchAddInfo span:eq(1),#oneAddInfo em").text(data.needDQ);
					$("#batchAddInfo em").text("+"+data.needDQ);
				}
				user.refreshUserInfo(data.user);
				UInfo.refreshUInfo(data.user);
				//日活
				if(data.rihuo){
					Rihuo.refreshRihuoInfo(data.rihuo);
					//刷新日活页面摇钱树的次数
					if($("#rh_list_5").html()){
						var n = parseInt($("#rh_list_5 dd:eq(0)").text());
						$("#rh_list_5 dd:eq(0)").text(n+1);
					}
				}
				UInfo.setUserTili(data.user.nowTL,data.user.maxTL);
				$("#tiliUserInfo li:eq(0) span").text(data.user.yb);
				$("#tiliUserInfo li:eq(1) span").text(data.user.yb_sys);
				$("#numAddTiLi span:eq(0)").text(data.nowNum);
			}else if(data.re=="2"){
				Common.alert("元宝不足，请充值");
			}else{
				Common.alert("体力或者补充次数已达上限");
			}
		});
 	},
 	loadAddTiliWindow:function(){
 		$.getJSON("http://" + host + "/sg/i/tili/r.php", 
		{uid : userId},
		function(data){
			var tiliWindow = new mesWindow("tiliwindow", $.tmpl($("#addtili_tmpl").html(),data).html());
			UInfo.setUserTili(data.nowTL,data.maxTL);
			$("#tiliWindow_close").bind(clickEventType,function(){
				tiliWindow.closeWindow(this);
			})
		});
 	},
 	setUserTili:function(nowtl,maxtl){  //设置用户体力
 		var blood = parseInt(250*(nowtl/maxtl));
		$("#addtili_num>div").css("clip","rect(auto,"+blood+"px,auto,auto)");
		$("#addtili_num>span>span:eq(0)").text(nowtl);
 		$("#addtili_num>span>span:eq(1)").text(maxtl);
 	}
 }
 $(function(){
 	var userLevel = parseInt($("#userLevel span").text());
 	//主公信息页面tab切换
 	$("#uinfo_tab>ul>li").live(clickEventType,function(){
 		var index = $(this).index();
 		$(this).siblings().removeClass("sd01").addClass("sd02");
 		$(this).removeClass("sd02").addClass("sd01");
 		$("#uinfo_tab .myInfoBc>div:eq("+index+")").siblings().addClass("none");
 		$("#uinfo_tab .myInfoBc>div:eq("+index+")").removeClass("none");
 	});
 	$("#rh_box_list li").live(clickEventType,function(){
 		var loading = false;
 		var index = parseInt($(this).attr("typeid"));
 		if(!loading){
 			loading = true;
	 		$.getJSON("http://" + host + "/sg/i/common/r1.php", 
			{uid : userId,box:index},
			function(data){
				if(data.re=="1"){
					$("#rh_box_list li:eq("+index+")").find("img").attr("src","image/game/"+Rihuo.BoxImg[index]);
					user.refreshUserInfo(data.user);
					Common.alert("恭喜，您获得了"+data.award.repu+"声望，"+data.award.ybsys+"点券以及"+data.award.card_num+"张经验卡！");
				}else if(data.re=="0"){
					Common.alert("当前活跃度不够,箱子礼物暂时不可领取");
				}else{
					Common.alert("当前箱子礼物已经领取啦");
				}
				if(data.box_num<1){ //没有可打开箱子
					$("#topIconList .icon_rh img").removeClass("scale");
				}
				loading = false;
			});
 		}
 	});
 	
 	//摇钱树
 	$("#rh_list_1").live(clickEventType,function(){
 		//15级开放
 		if(userLevel<15){
 			return false;
 		}
 		YQS.loadWindow();
 	});
 	//飞仙
 	$("#rh_list_2").live(clickEventType,function(){
 		//35级开放
 		if(userLevel<35){
 			return false;
 		}
 		Feixian.loadWindow();
 	});
 	//称号奖励
 	$("#rh_list_3").live(clickEventType,function(){
 		//10级开放
 		if(userLevel<10){
 			return false;
 		}
		UInfo.getTitleAward();
 	});
 	//排名奖励4
 	$("#rh_list_4").live(clickEventType,function(){
 		//15级开放
 		if(userLevel<15){
 			return false;
 		}
 		$.getJSON("http://" + host + "/sg/i/competitive/r.php", {uid:userId},function(data){
			if(data&&data.st==1){
				Common.alert("恭喜，排名奖励领取成功");
				User.refreshUserInfo(data.user);
				if(data.rihuo){
					Rihuo.refreshRihuoInfo(data.rihuo);
					//刷新日活页面摇钱树的次数
					if($("#rh_list_4").html()){
						var n = parseInt($("#rh_list_4 dd:eq(0)").text());
						$("#rh_list_4 dd:eq(0)").text(n+1);
					}
				}
			}
			else{
				Common.alert("未到领取时间");
			}
			
		});
 	});
 	//补充体力弹窗
 	$("#rh_list_5").live(clickEventType,function(){
 		UInfo.loadAddTiliWindow();
 	});
 	//俸禄领取6
 	$("#rh_list_6").live(clickEventType,function(){
 		//5级开放
 		if(userLevel<5){
 			return false;
 		}
		UInfo.getSalary();
 	});
 	//竞技场7
 	$("#rh_list_7").live(clickEventType,function(){
 		//15级开放
 		if(userLevel<15){
 			return false;
 		}
 		competitive.loadWindow();
 	});
 	//祭祀8
 	$("#rh_list_8").live(clickEventType,function(){
 		//20级开放
 		if(userLevel<20){
 			return false;
 		}
 		family.loadWindow();
 		var click = setInterval(function(){
 			if($("#menu2").html()){
 				$("#menu2 #list2").trigger(clickEventType);
 				clearInterval(click);
 			}
 		},100);	
 	});
 	//家族副本9
 	$("#rh_list_9").live(clickEventType,function(){
 		//20级开放
 		if(userLevel<20){
 			return false;
 		}
 		family.loadWindow();
 		var click = setInterval(function(){
 			if($("#menu2").html()){
 				$("#menu2 #list3").trigger(clickEventType);
 				clearInterval(click);
 			}
 		},100);
 	});
 	//法宝培养10
 	$("#rh_list_10").live(clickEventType,function(){
 		//40级开放
 		if(userLevel<40){
 			return false;
 		}
 		fabao.loadWindow();
 	});
 	//打开充值页面
 	$("#uinfo_chongzhi").live(clickEventType,function(){
 		hotLinks.vip();
 	});
 	//关闭
 	$("#rihuo_close").live(clickEventType,function(){
 		if($("body .selectQ")){
 			$("body .selectQ").remove();
 		}
 	});
 	//查看称号
 	$("#btn_ckch").live(clickEventType,function(){
 		$.getJSON("http://" + host + "/sgg/i/user/c.php", 
		{uid : userId},
		function(data){
			var titleWindow = new mesWindow("titwindow", $("#chenghao").html());
            $("#titleList").setSlider({row:1,col:1});
            $("#titleList>div").css("margin-left","-15px");
            UInfo.setUserTitleInfo(data);
		});
 	});
 	//添加体力
 	$("#btnAddTili,#btnBatchAddTiLi").live(clickEventType,function(){
 		var isBatch = ($(this).attr("id")=="btnBatchAddTiLi")?1:0;
 		var nowTili = parseInt($("#addtili_num>span>span:eq(0)").text());
 		var maxTili = parseInt($("#addtili_num>span>span:eq(1)").text());
 		var nowNum = parseInt($("#numAddTiLi>span>span:eq(0)").text());
 		var maxNum = parseInt($("#numAddTiLi>span>span:eq(1)").text());
 		if(isBatch==1&&(maxTili-nowTili<50)){
 			Common.alert("体力值充足，不用批量补充");
 			return false;
 		}
 		if(isBatch==0&&(maxTili-nowTili<5)){
 			Common.alert("体力值充足，暂时不用补充");
 			return false;
 		}
 		if(nowTili>=maxTili){
 			Common.alert("当前体力值已达最大，不需要添加");
 			return false;
 		}
 		if(nowNum>maxNum){
 			Common.alert("当前VIP的可充值次数已经用完");
 			return false;
 		}
 		UInfo.addTiLi(isBatch);
 	});
 });
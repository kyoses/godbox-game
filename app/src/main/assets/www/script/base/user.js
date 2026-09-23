/*
 * 首页元素功能
 */
var DialogLevel = 0;  //是否有第一层弹窗弹出
$(document).ready(function(){
	//user.getUserInfo();
	window.onresize = function(){
		window.scrollTo(0,0);
		Common.checkOrientation();
	}
	document.body.addEventListener('touchmove', function(e) {
		window.scrollTo(0,0);
	    e.stopPropagation();
	    e.preventDefault();
	});
	document.onmousewheel=function(e){
		window.scrollTo(0,0);
	    e.stopPropagation();
	    e.preventDefault();
	}
	//Common.Tab.bindTab();//绑定tab按钮的事件
	$(".inpBack").live(clickEventType,function(){
		$(this).parents(".mesWindow").prev().prev().show();
		$(this).parents(".mesWindow").prev().prev().prev().show();
		var _this=$(this);Common.closeWindow(_this);
	});//绑定所有的back按钮的事件
	$(".x,.exit").live(clickEventType,Common.closeAllWindow);//绑定所有的close按钮的事件

	//点击祭坛按钮打开祭坛页面
	$("#btn_jitan").bind(clickEventType,function(){
		var jtWindow = new mesWindow("jtWindow", $("#jitan_tmpl").html());
		if(director.progress==4){//新手点击祭坛选择提示对话
			director.updateProgress();
		}
	});
	//招募
	$("#btn_zhaomu").live(clickEventType,hotLinks.zm);
	//培养
	$("#btn_peiyang").live(clickEventType,function(){
		wuJiang.loadWindow(4);
	});
	//聚魂
	$("#btn_juhun").live(clickEventType,function(){
		Juhun.loadWindow();
	});
	//点击合成按钮装备咒符合成页面
	$("#main_icon .hecheng_icon").bind(clickEventType,hotLinks.hc);
	//点击背包
	$("#btn_bag").bind(clickEventType,hotLinks.bag);
	
	//点击武将
	$("#btn_wj").bind(clickEventType,hotLinks.wjNew);
	
	//任务页面
	$("#btn_task").bind(clickEventType,hotLinks.task);
	//强化页面
	$("#main_icon .qianghua_icon").bind(clickEventType,hotLinks.qh);
	//锻造
	$("#btn_duanzao").bind(clickEventType,hotLinks.dz);
	//摇钱树
	$("#main_icon .yaoqian_icon").bind(clickEventType,hotLinks.yqs);
	//vip充值
	//$("#topIconList .icon_cz").get(0).addEventListener(clickEventType,hotLinks.vip);
	$("#main_taskBtn").bind(clickEventType,function(){
		if($(this).hasClass("dup")){
			$(this).removeClass("dup").addClass("dow");
			$("#main_task").hide();
		}
		else if($(this).hasClass("dow")){
			$(this).removeClass("dow").addClass("dup");
			$("#main_task").show();
		}
	});
	//奖励领取
 	$("#topIconList .icon_lj").live(clickEventType,function(){
 		var salary = $("#topIconList .icon_lj").attr("sal");  //俸禄奖励
 		var title = $("#topIconList .icon_lj").attr("tit");   //称号奖励
 		if(salary){
 			UInfo.getSalary();
 		}else if(title){
 			UInfo.getTitleAward();
 		}
 	})
	//个人信息查看
	$("#area_quanbu").bind(clickEventType,function(){
		UInfo.loadWindow();
	});
	//故事模式
	$(".staWare").bind(clickEventType,hotLinks.smmode);
	//精英模式
	$("#jingying_icon").bind(clickEventType,hotLinks.jymode);
	//竞技场
	$("#jjc_ison").bind(clickEventType,hotLinks.jj);
	var music = document.getElementById("bgMusic");
	//music.play();
        // 活动
    $("#activity_enter").bind(clickEventType,activity.loadWindow);
    //活动按钮的提示特效
//    setInterval(function(){
//    	var src= $("#activity_enter>img").attr("src");
//    	if(src=='image/sys/se_select/hd1.png'){
//    		$("#activity_enter>img").attr("src","image/sys/se_select/hd2.png");
//    	}else{
//    		$("#activity_enter>img").attr("src","image/sys/se_select/hd1.png");
//    	}
//    	window.scrollTo(0,0);
//    },505);
    //充值进入
    $("#charge_enter").bind(clickEventType,hotLinks.charge);
    //布阵入口
    $('#btn_buzhen').bind(clickEventType,hotLinks.bz);
	Common.initGamescreen();
});
var user = {
	currentBattle:0,//用户在普通本的推图进度(是实时更新的)
	userCheck:function(plat_type,account_id,plat_info){
		$.getJN("http://" + host + "/sgg/i/top/check.php", {
            type:plat_type,id:account_id,plat_info:plat_info
        }, function(data) {
            if(data.st==2){  //注册
            	director.showSex();
            }else{ //登录成功
            	userId=data.id;
            	user.refreshUserInfo(data);
            	$('#ybNum').attr("yb_total",data.yb_total);
                user.setFromNpcInfo(data.formation);
                if(data.progress=="0"){
                	//announce.loadWindow();
                }
                data.nt = data.nt||0;
				tiLi.startRefresh(data.nt);
				user.refreshTaskInfo();
            }
        });
        //this.refreshPageTop();
	},
	refreshTaskInfo:function(data){
		if(data==undefined){
			$.getJSON("http://" + host + "/sgg/i/task/t.php", 
			{uid : userId}, 
			function(data) {
				if(data.rt==1){
					user.setUserTaskInfo(data.list);
					//如果任务弹窗打开
					if(document.getElementById("taskList")){
			    		task.addTaskInfo(data.list);
			    	}
				}
			});
		}
		else{
			user.setUserTaskInfo(data);
		}
	},
	scrollInter:null
	,
	refreshPageTop:function(){
		if(this.scrollInter){
			clearInterval(this.scrollInter);
		}
		this.scrollInter = setInterval(function(){
			window.scrollTo(0,0);
		},200);
	}
	,
	setUserTaskInfo:function(data){ //刷新任务时对首页面任务相关进行样式刷新
		var hasGet = 0;  //是否有可领取奖励任务
		for(key in data){
			if(data[key].status=="1"){
				hasGet = 1;
				break;
			}
		}
		//添加感叹号
		if(hasGet&&$("#btn_task").html()==""){
			$("#btn_task").append("<img class='taskPromp' src='image/sys/prompt.png'>");
		}
		//删除感叹号
		if(!hasGet&&$("#btn_task").children().length==1){
			$("#btn_task .taskPromp").remove();
		}
	},
	directorNewUser:function(progress){
		if(progress==5 || progress==6 || progress==7){
			director.startDirect(4);
		}else if(progress==11 || progress==12 || progress==13){
			director.startDirect(10);
		}else if(progress==15 || progress==16 || progress==17){
			director.startDirect(14);
		}else if(progress==18 || progress==19 || progress==20 || progress==22 || progress==23 || progress==24 || progress==25 || progress==26 || progress==27){
			director.startDirect(21);
		}else if(progress==29 || progress==30 || progress==31){
			director.startDirect(28);
		}else if(progress==32){
			director.startDirect(33);
		}else if(progress==36 || progress==37){
			director.startDirect(35);
		}else if(progress==38 || progress==39){
			director.startDirect(40);
		}else{
			director.startDirect(progress);
		}
	}
	,
	refreshUserInfo:function(data,type){
		if(!type){
			type=0;
		}
		if(data.cbattle){
			user.currentBattle=data.cbattle;
		}
		if(data.yb){
			$("#ybNum").text(user.formatGold(data.yb));
		}
		if(data.yb_total){
			$("#ybNum").attr("yb_total",data.yb_total);
		}
		if(data.gold){
			$("#jbNum").text(user.formatGold(data.gold));
			$("#person_info").attr("gold",data.gold);
		}
		if(data.name){
			$("#userName").text(data.name);
		}
		if(data.vipLevel||data.vipLevel==0){
			$("#btn_vip").text("Vip"+data.vipLevel);
            $("#btn_vip").attr("vip_lv", data.vipLevel);
		}
		if(data.img && data.img!=""){
			data.img = data.img.replace("s","");
			$("#userName").attr("per_img",data.img);
		}
		if(data.level){
			var lastLevel=parseInt($("#userLevel").text());  //原等级
			$("#userLevel").text(data.level);
			var level=parseInt(data.level);
			//user.setGNOpen(data.level);
			//纠正新手引导时假领取俸禄的缺陷
			if(!isNaN(lastLevel)){
				if(lastLevel!=level&&director.progress==0){//开启新手引导	
					director.directorImg = $('#userName').attr("per_img");
					//director.startDirectOnLevel(lastLevel+1);
				}
			}
			else{
				if(parseInt(data.progress)>0){//开始新手引导
					director.directorImg=$('#userName').attr("per_img");
					if(type==0){
						user.directorNewUser(data.progress);
					}
				}
			}
		}
		if(data.nowTL||data.nowTL==0){
			//体力
			$('#bt').empty().append("<span>"+data.nowTL+"</span>/<span>"+data.maxTL+"</span>");
			$('#nowTL').attr("nowtl",data.nowTL);
			$('#nowTL').css("width",parseInt((data.nowTL/data.maxTL)*104));
			$('#uinfoTL').text(data.nowTL);
		}
		if(data.exp){
			var WIDTH = 140;   //经验血条总长度
			var progress=Math.floor((data.exp/data.expUp)*WIDTH)+"px";
			$("#nowExp").css("width",progress);
		}
		if(data.reputation){
			$("#person_info").attr("repu",data.reputation);
			$("#userRepu").text(user.formatRepu(data.reputation));
		}
    },
	setCurrentBattle:function(currentBattle){
		var lastBattle=user.currentBattle;
		user.currentBattle=currentBattle;
		var specialBattle={16:10,59:20,72:25};//battle:level
		if(specialBattle[lastBattle]!=undefined){
			var nowLevel=$("#userLevel").find("span").text();
			if(parseInt(nowLevel)>=specialBattle[lastBattle]){
				director.startDirectOnLevel(specialBattle[lastBattle]);
			}
		}
	},
    formatGold:function(gold){
        if(gold<100000){
            return gold;
        }else if(gold<99999999){
            return (parseInt(gold/10000))+"万";
        }else{
        	return (parseInt(gold/100000000))+"亿";
        }
    },
    formatRepu:function(repu){
        if(repu<=10000){
            return repu;
        }else if(repu<99999999){
            return (parseInt(repu/10000))+"万";
        }else{
        	return (parseInt(repu/100000000))+"亿";
        }
    },
	showLoginWindow:function(){
		var bagWindow = new mesWindow("loginWindow", $("#login_tmpl").html(),0,0,703,427);
		$("#u_name").focus();
		$("#u_name").keydown(function(event){
		    if(event.keyCode==13){
		    	$("#u_login").trigger(clickEventType);
		    }
		});
		$("#u_login").bind(clickEventType,function(){
			var name=$("#u_name").val();
			if($.trim(name)==""){
				Common.alert("请输入玩家名称");
				return;
			}
			$.getJN("http://" + host + "/sgg/i/top/l.php", {
				name : name
			}, function(data) {
				if(parseInt(data.st)==1){
					userId=data.id;
					$('#ybNum').attr("yb_total",data.yb_total);
					mesWindow.closeWindowById("loginWindow");//关闭登录弹窗
					user.refreshUserInfo(data);
					user.setFromNpcInfo(data.formation);
					user.refreshTaskInfo();
					//chatMain.startGetMsg();//开始获取系统消息
					if(data.progress=="0"){
						announce.loadWindow();
					}
					//JSFarm.run();
				}
				else if(parseInt(data.st)==2){
					Common.alert("没有此玩家");
				}
				data.nt = data.nt||0;
				tiLi.startRefresh(data.nt);
				//user.refreshPageTop();
			});
		});
		$("#u_register").bind(clickEventType,function(){
			director.showSex();
		});
	},
	setFromNpcInfo:function(formation){
		$("#fromNpcList").empty();
		var i=0,temp = new Array();
		for(key in formation){
			for(kk in formation[key]){
				if(formation[key][kk].id!="0"){
					temp[i] = '<dl nid="'+formation[key][kk].id+'" class="zhaoList zL'+formation[key][kk].class1+'">';
					temp[i] += '<dt class="zhaoListT">'+formation[key][kk].level+'</dt>';
					temp[i] += '<dd><img width=163 height=163 src="image/game/'+formation[key][kk].img+'" /></dd>';
					temp[i] += '<dd class="zhaoStar" id="zhaoStar'+formation[key][kk].id+'">';
					var html='';
					for(var j=0;j<formation[key][kk].star;j++){
						html += "<img src='image/sys/zStar.png' />";
					}
					temp[i] += html;
					//temp[i] += publicFunction.starNum(formation[key][kk].can,formation[key][kk].class1);
					temp[i] += '</dd>';
					temp[i] += '<dd class="wjName">'+formation[key][kk].name+'</dd>';
					temp[i] += '</dl>';
					i++;
				}
			}
		}
		//alert(temp[0]);
		var uLevel = $('#userLevel').text();
		var ZxwjHtml = '';
		if(i==0){//用户阵型上面没有武将
			if(uLevel<10){
				ZxwjHtml = '<dl class="noStar">30级开启</dl><dl class="noStar">10级开启</dl><dl class="noStar"></dl><dl class="noStar">20级开启</dl><dl class="noStar">40级开启</dl>';
			}else if(uLevel>=10 && uLevel<20){
				ZxwjHtml = '<dl class="noStar">30级开启</dl><dl class="noStar"></dl><dl class="noStar"></dl><dl class="noStar">20级开启</dl><dl class="noStar">40级开启</dl>';
			}else if(uLevel>=20 && uLevel<30){
				ZxwjHtml = '<dl class="noStar">30级开启</dl><dl class="noStar"></dl><dl class="noStar"></dl><dl class="noStar"></dl><dl class="noStar">40级开启</dl>';
			}else if(uLevel>=30 && uLevel<40){
				ZxwjHtml = '<dl class="noStar"></dl><dl class="noStar"></dl><dl class="noStar"></dl><dl class="noStar"></dl><dl class="noStar">40级开启</dl>';
			}else{
				ZxwjHtml = '<dl class="noStar"></dl><dl class="noStar"></dl><dl class="noStar"></dl><dl class="noStar"></dl><dl class="noStar"></dl>';
			}
		}else{
			if(i==1){
				if(uLevel<10){
					ZxwjHtml = '<dl class="noStar">30级开启</dl><dl class="noStar">10级开启</dl>'+temp[0]+'<dl class="noStar">20级开启</dl><dl class="noStar">40级开启</dl>';
				}else if(uLevel>=10 && uLevel<20){
					ZxwjHtml = '<dl class="noStar">30级开启</dl><dl class="noStar"></dl>'+temp[0]+'<dl class="noStar">20级开启</dl><dl class="noStar">40级开启</dl>';
				}else if(uLevel>=20 && uLevel<30){
					ZxwjHtml = '<dl class="noStar">30级开启</dl><dl class="noStar"></dl>'+temp[0]+'<dl class="noStar"></dl><dl class="noStar">40级开启</dl>';
				}else if(uLevel>=30 && uLevel<40){
					ZxwjHtml = '<dl class="noStar"></dl><dl class="noStar"></dl>'+temp[0]+'<dl class="noStar"></dl><dl class="noStar">40级开启</dl>';
				}else{
					ZxwjHtml = '<dl class="noStar"></dl><dl class="noStar"></dl>'+temp[0]+'<dl class="noStar"></dl><dl class="noStar"></dl>';
				}
			}else if(i==2){
				if(uLevel<10){
					ZxwjHtml = '<dl class="noStar">30级开启</dl><dl class="noStar">10级开启</dl>'+temp[0]+'<dl class="noStar"></dl><dl class="noStar">40级开启</dl>';
				}else if(uLevel>=10 && uLevel<20){
					ZxwjHtml = '<dl class="noStar">30级开启</dl>'+temp[1]+temp[0]+'<dl class="noStar">20级开启</dl><dl class="noStar">40级开启</dl>';
				}else if(uLevel>=20 && uLevel<30){
					ZxwjHtml = '<dl class="noStar">30级开启</dl>'+temp[1]+temp[0]+'<dl class="noStar">20级开启</dl><dl class="noStar">40级开启</dl>';
				}else if(uLevel>=30 && uLevel<40){
					ZxwjHtml = '<dl class="noStar"></dl>'+temp[1]+temp[0]+'<dl class="noStar">20级开启</dl><dl class="noStar">40级开启</dl>';
				}else{
					ZxwjHtml = '<dl class="noStar"></dl>'+temp[1]+temp[0]+'<dl class="noStar"></dl><dl class="noStar"></dl>';
				}
			}else if(i==3){
				if(uLevel<10){
					ZxwjHtml = '<dl class="noStar">30级开启</dl><dl class="noStar">10级开启</dl>'+temp[0]+'<dl class="noStar"></dl><dl class="noStar">40级开启</dl>';
				}else if(uLevel>=10 && uLevel<20){
					ZxwjHtml = '<dl class="noStar">30级开启</dl>'+temp[1]+temp[0]+temp[2]+'<dl class="noStar">40级开启</dl>';
				}else if(uLevel>=20 && uLevel<30){
					ZxwjHtml = '<dl class="noStar">30级开启</dl>'+temp[1]+temp[0]+temp[2]+'</dl><dl class="noStar">40级开启</dl>';
				}else if(uLevel>=30 && uLevel<40){
					ZxwjHtml = '<dl class="noStar"></dl>'+temp[1]+temp[0]+temp[2]+'<dl class="noStar">40级开启</dl>';
				}else{
					ZxwjHtml = '<dl class="noStar"></dl>'+temp[1]+temp[0]+temp[2]+'<dl class="noStar"></dl>';
				}
			}else if(i==4){
				if(uLevel<10){
					ZxwjHtml = '<dl class="noStar">30级开启</dl><dl class="noStar">10级开启</dl>'+temp[0]+'<dl class="noStar"></dl><dl class="noStar">40级开启</dl>';
				}else if(uLevel>=10 && uLevel<20){
					ZxwjHtml = temp[3]+temp[1]+temp[0]+temp[2]+'<dl class="noStar">40级开启</dl>';
				}else if(uLevel>=20 && uLevel<30){
					ZxwjHtml = temp[3]+temp[1]+temp[0]+temp[2]+'<dl class="noStar">40级开启</dl>';
				}else if(uLevel>=30 && uLevel<40){
					ZxwjHtml = temp[3]+temp[1]+temp[0]+temp[2]+'<dl class="noStar">40级开启</dl>';
				}else{
					ZxwjHtml = temp[3]+temp[1]+temp[0]+temp[2]+'<dl class="noStar"></dl>';
				}
			}else if(i==5){
				if(uLevel<10){
					ZxwjHtml = '<dl class="noStar">30级开启</dl><dl class="noStar">10级开启</dl>'+temp[0]+'<dl class="noStar"></dl><dl class="noStar">40级开启</dl>';
				}else if(uLevel>=10 && uLevel<20){
					ZxwjHtml = temp[3]+temp[1]+temp[0]+temp[2]+temp[4];
				}else if(uLevel>=20 && uLevel<30){
					ZxwjHtml = temp[3]+temp[1]+temp[0]+temp[2]+temp[4];
				}else if(uLevel>=30 && uLevel<40){
					ZxwjHtml = temp[3]+temp[1]+temp[0]+temp[2]+temp[4];
				}else{
					ZxwjHtml = temp[3]+temp[1]+temp[0]+temp[2]+temp[4];
				}
			}
		}
		$("#fromNpcList").append(ZxwjHtml);
		$('.zhaoList').bind(clickEventType,hotLinks.wj);
		$('.zhaoList').each(function(){
			var nid = $(this).attr("nid");
			$(this).bind(clickEventType,function(){wuJiang.showWJOperation(nid)});
		});
	},
	getUserInfo:function(){  //获取刷新用户数据
		$.getJN("http://" + host + "/sgg/i/user/r.php", {
			uid : userId
		}, function(data) {
			user.refreshUserInfo(data.user);
		});
	}
}
var hotLinks={
	//阻止事件冒泡
	preventBubble:function(e){
		e.preventDefault();
        e.cancelBubble = true;
	},
	//主界面点击按钮动画
	clickAnimation:function(){
		$(this).addClass("mainClick");
		$(this).bind(animationEnd,function(){
			$(this).removeClass("mainClick");
			$(this).unbind(animationEnd);
		});
	},
	//武将入口
	wj:function(index){
		if(DialogLevel==0){
            DialogLevel=1;
            wuJiang.loadWindow(); //默认加载武将模块
		}
	},
	zm:function(){
		if(DialogLevel==0){
            DialogLevel=1;
            $("#jtWindow,#windowBackjtWindow").hide();
            Zhaomu.loadWindow();
		}
	},
	wjNew:function(){
		if(DialogLevel==0){
            DialogLevel=1;
            wuJiang.loadWindow(3); //默认加载武将模块
		}
	},
	//背包入口
	bag:function(){
		if(DialogLevel==0){
			DialogLevel=1;
			bag.loadWindow();
		}
	},
	//布阵入口
	bz:function(){
		if(DialogLevel==0){
            DialogLevel=1;
            Buzhen.loadWindow();
        }
	},
	//强化入口
	qh:function(){
		if(DialogLevel==0){
			DialogLevel=1;
			qianghua.loadWindow();
		}
	},
	dz:function(){
		if(DialogLevel==0){
			DialogLevel=1;
			Duanzao.loadWindow();
		}
	},
	//法宝喂养入口
	fb:function(){
		if(DialogLevel==0){
			DialogLevel=1;
			fabao.loadWindow();
		}
	},
	//竞技场入口
	jj:function(){
		log(22);
		Common.alert("尚未开启，各位僵尸粉儿敬请期待");
		/*
		if(DialogLevel==0){
			DialogLevel=1;
			competitive.loadWindow();
		}*/
	},
	//合成入口
	hc:function(e){
		if(DialogLevel==0){
            DialogLevel=1;
            Hecheng.loadWindow(); //默认加载装备合成
        }
	},
	//请符入口
	qf:function(e){
		if(e!=undefined){
			hotLinks.preventBubble(e);
		}
        if(DialogLevel==0){
            DialogLevel=1;
            Qingfu.getQingfuInfo();; //默认加载请符
        }
	},
	//故事模式入口
	smmode:function(){
		if(DialogLevel==0){
			DialogLevel=1;
			map.loadWindow(1);
		}
	},
	//精英副本入口
	jymode:function(){
            if(DialogLevel==0){
                DialogLevel=1;
                elite.loadWindow();
            }
	},
	//法宝副本入口
	fbmode:function(){
		if(DialogLevel==0){
			DialogLevel=1;
			map.loadWindow(3);
		}
	},
	//家族入口
	jz:function(){
		/*
		if(DialogLevel==0){
			DialogLevel=1;
			family.loadWindow();
		}*/
	},
	fx:function(){   //飞仙
		Feixian.loadWindow();
	},
	//任务入口
	task:function(){
		if(DialogLevel==0){
			DialogLevel=1;
			task.loadWindow();
		}
	},
	//聊天接口
	chat:function(){
		/*
		if(DialogLevel==0){
			DialogLevel=1;
			chat.loadWindow();
		}*/
	},
	//摇钱树
	yqs:function(){
		YQS.loadWindow();
	},
	//尸王争霸
	swzb:function(){
		log("尸王争霸，还没开呢，亲");
	}
	,
	//僵尸农场
	jsnc:function(){
		/*
		JSFarm.loadWindow();*/
	},
	//日活跃度
	rh:function(){
		Rihuo.loadWindow();
	},
	//vip查看
	vip:function(){
		$.getJSON("http://" + host + "/sgg/i/common/vip.php", {
            uid : userId
        }, function(data) {
            DialogLevel = 1;
            var n_yb = 287*data.yb_total/data.next_yb;
            var needYB = data.next_yb-data.yb_total;
            var str = "<div class='backpack pre'><p class='vT tc fs28 cor3'>Vip充值</p><img id='closeVipWindow' src='image/sys/close.png' class='close'/>"+
  					  "<div class='main clear ma'><div class='mainC ma'><div class='vipArea bor5 ma'><div class='vipInfo fl'>"+
                      "<p class='vipT fs28 cor3'>亲爱的"+data.name+"：</p><div class='nowLe'>"+
            		  "<p class='fs24 cor3'>您现在的级别：<span class='stro3'>vip"+data.vipLevel+"</span> 会员</p>"+
                      "<div class='blood8'><p style='clip:rect(auto,"+n_yb+"px,auto,auto)'></p><div class='fs22 tc pre'>"+data.yb_total+"/"+data.next_yb+"</div></div>"+
                      "<p class='fs20 cor11' style='padding-top:40px'>再充值"+needYB+"元宝,您将成为 VIP"+(data.vipLevel+1)+"</p></div>"+
		              "<p class='btn1 ma'>充值</p></div><div class='fl' style='width:470px;height:410px;'>" +
		              "<div class='arrowL' style='margin-top:150px;'></div><div id='vipList' class='vipList fl' style='width:405px;height:384px;margin-left:10px;'></div><div class='arrowR' style='margin-top:150px;margin-left:10px;'></div>" +
		              		"</div></div></div></div></div>";
			         /*
			          * <p class='tc cor1 fs24'>VIP "+(data.vipLevel+1)+" 您可以拥有以下特权</p>"+
			          "<ul class='fs20 cor11 bg1 bor5'>";
			          for(key in data.next_vip){
                    	  str += "<li style='margin-left:20px;'>"+data.next_vip[key]+"</li>";
                	  }
			         str+="</ul>
			          */
            var vipWindow = new mesWindow("vipwindow",str);
            $("#closeVipWindow").live(clickEventType, function() {
                vipWindow.closeWindow(this);
                DialogLevel=0;
            });
            $("#vipList").setSlider({row:1,col:1});
            //遍历所有vip等级的说明
            var vip = Common.userVipInfo();
            for(key in vip){
            	var context = "<div class='fl' style='margin-left:12px;width:390px;'><p class='tc cor1 fs24'>VIP "+key+" 您可以拥有以下特权</p>" +
            			"<ul class='fs20 cor11 bg1 bor5'>";
            	for(i=0;i<vip[key].length;i++){
            		context += "<li style='margin-left:20px;'>"+vip[key][i]+"</li>";
            	}
            	context+="</ul></div>";
            	$("#vipList").addSliderItem(context);
            }
            var nextVip = parseInt(data.vipLevel);
            $("#vipList>div").css("margin-left","-"+nextVip*403+"px")
        });
	},
	//充值入口
	charge:function(){
		charge.loadWindow();
	},
	//弹出充值成功弹窗
	alertChargeSuccess:function(){
		alert("充值成功");
	}
	
}
var tiLi={
	nextTime:0,
	nextStandardTime:1800,
	delayTime:3000,
	startRefresh:function(nt){
		if(nt==undefined){
			tiLi.nextTime=1800*1000;
		}
		else{
			tiLi.nextTime=nt*1000;
		}
		setTimeout(tiLi.refresh,tiLi.nextTime+tiLi.delayTime);//延迟几秒刷新
	},
	refresh:function(){
		$.getJSON("http://" + host + "/sgg/i/tili/t.php", {
            uid : userId
        }, function(data) {
            user.refreshUserInfo(data);
			if(data.nt>0){
				tiLi.startRefresh(data.nt);
			}
			else{
				tiLi.nextTime=0;
			}
			user.getUserInfo();  //刷新用户数据
        });
	}
}
var chatMain={
	startGetMsg:function(){
		$.getJSON("http://"+host+"/sgg/i/chat/m.php", {},
		function(data){
			var str="";
			for(key in data.msg){
				str+=data.msg[key].content+"&nbsp;&nbsp;&nbsp;&nbsp;";
			}
			$("#mainmsg").html(str);
			if(parseInt(data.pst)==1){//有私人聊天消息
				;
			}
			setTimeout(chatMain.startGetMsg,30000);
		});
	}
}
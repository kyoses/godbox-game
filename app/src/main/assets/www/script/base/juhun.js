
 var Juhun = {
 	asynchronous:true,
 	loadWindow:function(){
		var jhWindow = new mesWindow("jhWindow", $("#juhun_tmpl").html());
		$("#btn_jh_list>li").bind(clickEventType,Juhun.juhunClick);
		$("#tuihuan_list>div").bind(clickEventType,Juhun.duihuanClick);
		this.getJuhunInfo();
	},
	getJuhunInfo:function(){
		$.getJN("http://" + host + "/sgg/i/juhun/a.php", {
		uid : userId
		}, function(data) {
			Juhun.setJuhunInfo(data);
		});
	},
	setJuhunInfo:function(data){
		Juhun.asynchronous = false;
		//如果有可收集的聚魂数据
		if(data.left_soul){
			$("#btn_jh_list li:lt(3)").hide();  //隐藏三个聚魂按钮
			$("#btn_jh_list li:eq(3)").show();  //显示收集按钮
			Juhun.setLeftSoul(data.left_soul);  //显示已聚好的魂
		}else{
			$("#btn_jh_list li:lt(3)").show();
			$("#btn_jh_list li:eq(3)").hide();
			Juhun.setLeftSoulEmpty();
		}
		//设置用户当前各种混的数量
		if(data.green_soul||data.green_soul==0){
			$("#jh_num_list>li:eq(0) p").text(data.green_soul);
			$("#jh_num_list>li:eq(1) p").text(data.blue_soul);
			$("#jh_num_list>li:eq(2) p").text(data.purple_soul);
			$("#jh_num_list>li:eq(3) p").text(data.orange_soul);
		}
	},
	setLeftSoul:function(left_soul){
		if($("#hunList .p14").html()){
			return false;
		}
		//遍历用户魂列表
		for(key in left_soul){
			var img = "";
			if(left_soul[key].type=="1"){  //绿魂
				img = "<img src='image/sys/l_pol.png'>";
			}else if(left_soul[key].type=="2"){  //蓝魂
				img = "<img src='image/sys/b_pol.png'>";
			}else if(left_soul[key].type=="3"){  //紫魂
				img = "<img src='image/sys/z_pol.png'>";
			}else if(left_soul[key].type=="4"){  //橙魂
				img = "<img src='image/sys/h_pol.png'>";
			}
			img = $(img);
			$("#hunList>div:eq("+key+")").append(img).append("<p>"+left_soul[key].num+"</p>");
			img.addClass("jhSE");
		}
		setTimeout(function(){
			Juhun.asynchronous = true;
			$("#hunList img").removeClass('jhSE');
		},900);
	},
	setLeftSoulEmpty:function(){  //收集所聚的魂
		if($("#hunList .p14").html()){
			$("#hunList>div").each(function(i){
				$(this).find("img").addClass("jh_move"+(i+1));
				$(this).find("p").remove();
			});
			setTimeout(function(){
				$("#hunList>div").empty();
				Juhun.asynchronous = true;
			},950);
		}else{
			$("#hunList>div").empty();
			Juhun.asynchronous = true;
		}
	},
	juhunClick:function(){   //聚魂三个按钮及收集
		if(!Juhun.asynchronous){
			return false;
		}
		Juhun.asynchronous = false;
		var index = parseInt($(this).attr("data-type"));
		if(index<4){  //三种聚魂
			$.getJN("http://" + host + "/sgg/i/juhun/j.php", {
			uid : userId,type:index
			}, function(data) {
				Juhun.asynchronous = true;
				if(data.re==1){
					Juhun.setJuhunInfo(data);
					user.refreshUserInfo(data.user);
				}else{
					if(index==3){
						Common.alert("对不起，元宝不足？");
					}else{
						Common.alert("对不起，钱币不足？");
					}
				}
				
			});
		}else{  //收取
			$.getJN("http://" + host + "/sgg/i/juhun/s.php", {
			uid : userId
			}, function(data) {
				Juhun.asynchronous = true;
				if(data.re==1){
					Juhun.setJuhunInfo(data);
				}
			});
		}
	},
	duihuanClick:function(){  //兑换系列按钮
		if(!Juhun.asynchronous){
			return false;
		}
		//Juhun.asynchronous = false;
		var index = parseInt($(this).attr("data-type"));
		var num_green = parseInt($("#jh_num_list>li:eq(0) p").text());  //当前绿魂个数
		var num_blue = parseInt($("#jh_num_list>li:eq(1) p").text());   //当前蓝魂个数
		var num_purple = parseInt($("#jh_num_list>li:eq(1) p").text());   //当前紫魂个数
		if(index==1){  //兑换蓝魂
			if(num_green<100){
				Common.alert("您的绿魂不足100,无法参与兑换");
			}else{
				Juhun.prompDialog("bule");
			}
		}else if(index==2){//兑换紫魂
			if(num_blue<100){
				Common.alert("您的蓝魂不足100,无法参与兑换");
			}else{
				Juhun.prompDialog("purple");
			}
		}
	},
	prompDialog:function(type){
		var dhDialog = $($("#ju_convert_tmpl").html());
		dhDialog.find(".pub_btn:eq(0)").attr("id","btn_ju_confirm");
		dhDialog.attr("id","equip_showwin");
		$("#jhWindow .zhaoM1").append(dhDialog);
		if(type=="bule"){
			dhDialog.find("img:eq(0)").attr("src","image/sys/l_pol.png");
			dhDialog.find("img:eq(1)").attr("src","image/sys/b_pol.png");
			$("#btn_ju_confirm").bind(clickEventType,function(e){
				equip.hideEquipInfo();
				Juhun.convertSoul(1);
			});
		}else if(type=="purple"){
			dhDialog.find("img:eq(0)").attr("src","image/sys/b_pol.png");
			dhDialog.find("img:eq(1)").attr("src","image/sys/z_pol.png");
			$("#btn_ju_confirm").bind(clickEventType,function(e){
				equip.hideEquipInfo();
				Juhun.convertSoul(2);
			});
		}
		$(document).bind(touchDown,function(e){
			if($(e.target).attr("id")=="btn_ju_confirm"){
			
			}else{
				$("#btn_ju_confirm").unbind(clickEventType)
				equip.hideEquipInfo();
			}
		});
	},
	convertSoul:function(type){  //兑换
		$.getJN("http://" + host + "/sgg/i/juhun/d.php", {
		uid : userId , type:type
		}, function(data) {
			Juhun.asynchronous = true;
			if(data.re==1){
				Juhun.setJuhunInfo(data);
			}
		});
	}
 }
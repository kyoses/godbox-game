/*武将，招募*/
var wuJiang={
	npcDataCache:null,
	nid:0,
	index:0,
	loadWindow:function(index,clickWJCallBack){
		var wjWindow = new mesWindow("wjWindow", $("#wujiang_tmpl").html());
		$("#wjWindow x,#wjWindow inpBack").bind(clickEventType,function(){
			Buzhen.refreshUserFormation();		
		});
		//if(director.progress==35){
		//	director.updateProgress();
		//}
		$("#wj_list").setSlider({row:1,col:1});
		Common.injectCloseCallBack(wuJiang.closeWindow,"wjWindow");
		Common.Tab.bindTab("nav","tabCon",wuJiang.showWJ,wuJiang.showZM);
        if(index==0||index==undefined){
			//$('#xzWJ').hide();
			wuJiang.showWJ(clickWJCallBack);
		}
		else if(index==1){
			this.index = index;
			$("#nav img:last").trigger(clickEventType);
		}else if(index==3){
			//$('#xzWJ').hide();
			$('#wj').hide();
			$('#zm').hide();
			this.index = index;
			wuJiang.showWJ(clickWJCallBack);
		}else if(index==4){
			//$('#xzWJ').hide();
			$('#wj').hide();
			$('#zm').hide();
			this.index = index;
			wuJiang.showWJ(clickWJCallBack);
		}else{
			$('#xzWJ').show();
			wuJiang.showWJ(clickWJCallBack);
			this.index = index;
			$("#nav img").hide();
		}
		$("#nav>img:eq(0)").bind(clickEventType,function(){
			if(wuJiang.hasWujiangZhaomu){
				wuJiang.hasWujiangZhaomu = false;
				wuJiang.showWJ(clickWJCallBack);
			}
		});
	},
	//关闭所有窗口
	closeWindow:function(){
		wuJiang.npcDataCache=null;//释放缓存
		//xilian.clearCache();//释放缓存
		equip.clearCache();
		jiaoQie.clearCache();
		bagFB.clearCache();
	},
	//关闭第二层窗口
	closeSecondWindow:function(){
		if($("#wjWindow").length==0){//没有有第一层窗口释放缓存
			//xilian.clearCache();
			equip.clearCache();
			jiaoQie.clearCache();
			bagFB.clearCache();
		}
	},
	showWJ:function(clickWJCallBack){
		$("#wj_list").removeAllItem();
		$.getJN("http://" + host + "/sgg/i/npc/w.php", {
            uid : userId    
        }, function(data) {
			Common.Tab.setHasData("part1");//将当前tab设置为已有数据
			$("#wjWindow>.zhaoM").attr("limit",data.limit);  //武将训练人数限制
			var index=0;
			for(key in data.list){
				var temp=$.tmpl($("#onewj_temp"),data.list[key]);
				temp.find("img:first").attr("src",imgfolder+data.list[key].img);
				Common.setNpcClassStar(temp.find(".zhaoStar"),data.list[key].can,data.list[key].star);
				temp.attr({nid:data.list[key].id,level:data.list[key].lv,status:data.list[key].status});
				if(!data.list[key].f){//是否在阵上
					temp.find(".ycz").remove();
				}
				temp.children(".zhaoList").addClass("zL"+data.list[key].cl);
				if(index==0){
					temp.css("margin-left","0px");
				}
				//培养
				if(wuJiang.index==4){
					temp.find(".zhaoList").bind(clickEventType,function(){
						if(!Slider.checkTouchAvailabel(this)){
							return;
						}
						raising.loadWindow($(this).parent().attr("nid"));
					});
				}else{
					if(!clickWJCallBack){
						temp.find(".zhaoList").bind(clickEventType,wuJiang.clickWJ);
					}
					else{
						temp.find(".zhaoList").bind(clickEventType,clickWJCallBack);
					}
				}
				
				//训练相关
				var btn = temp.find(".pub_btn");
				var userLevel = parseInt($("#userLevel").text());
				//20级以下不开放
				if(userLevel<20){
					btn.hide();
				}else{
				    if(data.list[key]['status']==1){
				    	btn.text("训练");
				    }else{
				    	btn.text("加速");
				    	XunLian.setNpcCDTime(temp,data.list[key]['wait']);
				    }
				    btn.bind(clickEventType,XunLian.clickBtnXunlian);
				}
				$("#wj_list").addSliderItem(temp);
				index++;
			}
		});
	},
	clickWJ:function(){
		if(!Slider.checkTouchAvailabel(this)){
			return;
		}
		var nid=$(this).parent().attr("nid");
		wuJiang.showWJOperation(nid);
	}
	,
	//设置缓存的npc的招募数据
	setNpcCacheData:function(data){
		var currentShow=$("#wjzm_npcList").find(".show");
		if(currentShow.length<=0){
			currentShow=$("#wjzm_npcList div:first");
		}
		var index=currentShow.index();
		if(wuJiang.npcDataCache==null){
			wuJiang.npcDataCache=[];
		}
		wuJiang.npcDataCache[index]=data;
	},
	setNPCList:function(data){
		for(key in data){
			$("#wjzm_npcList").append("<div nid='"+data[key].nid+"'>"+data[key].name+"</div>");
		}
		$("#reArrL").bind(clickEventType,function(){wuJiang.moveNpcShow(0);});//向左移动
		$("#reArrR").bind(clickEventType,function(){wuJiang.moveNpcShow(1);});//向右移动
		$("#wjzm_npcList div:first").bind(transitionEnd,wuJiang.showZMAfterMoveNpc);
	},
	showZMAfterMoveNpc:function(){
		var currentShow=$("#wjzm_npcList").find(".show");
		var index=currentShow.index();
		if(wuJiang.npcDataCache[index]){//从缓存中取
			wuJiang.setZhaoMuList(wuJiang.npcDataCache[index]);
		}
		else{//从网络取
			var nid=currentShow.attr("nid");
			wuJiang.showZM(nid);
		}
	},
	moveNpcShow:function(dir){
		var nowNpc=$("#wjzm_npcList").find(".show");
		if(nowNpc.length<=0){
			nowNpc=$("#wjzm_npcList").find("div:first");
		}	
		var index=nowNpc.index();
		var moveObj=$("#wjzm_npcList").find("div:first");
		if(dir==0){//向左移动
			if(index>0){
				moveObj.css("margin-left",-moveObj.width()*(index-1));
				nowNpc.removeClass("show").prev().addClass("show");
			}
		}
		else{//向右移动
			if(index<$("#wjzm_npcList").children().length-1){
				moveObj.css("margin-left",-moveObj.width()*(index+1));
				nowNpc.removeClass("show").next().addClass("show");
			}
		}
	},
	getWJBgColorByClass:function(cl){
		return "reT"+cl;
	},
	loadOneWJInfo:function(data,onPageChangeCallBack,clickEquipCallBack,setDataCallBack){
		if(!data.npc) return;//没有npc数据，直接返回
		var wjConInfo=$.tmpl($("#wjinfocon_tmpl"),data.npc);
		if(!setDataCallBack){
			wuJiang.setWJEquipData(wjConInfo,data,clickEquipCallBack);
		}
		else{
			setDataCallBack(wjConInfo,data,clickEquipCallBack);
		}
		if($("#wjinfo_list").length<=0){//第一次加载
			var oneWjInfo=$($("#wjinfo_tmpl").html());
			if(onPageChangeCallBack){
				oneWjInfo.find("#wjinfocon").setSlider({row:1,col:1,multiPage:true,onPageChange:function(){
					var index=$("#wjinfocon").currentPageIndex()+1;
					$("#wj_cindex").text(index);
					var currentPage=$("#wjinfocon").currentPage();
					if(currentPage.data("data")==undefined){
						var nid=$("#wjinfocon").data(index.toString());
						onPageChangeCallBack(nid);
					}
					else{
						onPageChangeCallBack();
					}
				}});
			}
			else{
				oneWjInfo.find("#wjinfocon").setSlider({row:1,col:1,multiPage:true});
			}
			var nidStr="";
			for(i=1;i<=data.nlist.length;i++){
				if(i==data.npc.index){
					oneWjInfo.find("#wjinfocon").addSliderItem(wjConInfo);
					oneWjInfo.find("#wjinfocon").goToLastPage();
				}
				else{
					oneWjInfo.find("#wjinfocon").addPage();
				}
				oneWjInfo.find("#wjinfocon").data(i.toString(),data.nlist[i-1].id);
			}
			oneWjInfo.find("#wj_cindex").text(data.npc.index);
			oneWjInfo.find("#wj_alllen").text(data.nlist.length);
			oneWjInfo.find("#btn_prevPage").bind(clickEventType,function(){oneWjInfo.find("#wjinfocon").moveToPrevPage();});
			oneWjInfo.find("#btn_nextPage").bind(clickEventType,function(){oneWjInfo.find("#wjinfocon").moveToNextPage();});
			var cPage=oneWjInfo.find("#wjinfocon").currentPage();
			cPage.data("data",{npc:data.npc,equip:data.equip,jq:data.jq,fb:data.fb});
			return oneWjInfo;
		}
		else{
			var currentPage=$("#wjinfocon").currentPage();
			currentPage.html(wjConInfo);
			currentPage.data("data",{npc:data.npc,equip:data.equip,jq:data.jq,fb:data.fb});
		}
	},
	//设置武将穿戴的装备信息
	setWJEquipData:function(wjConInfo,data,clickEquipCallBack){
		clickEquipCallBack=clickEquipCallBack||wuJiang.clickWjEquip;
		wuJiang.setWJImgData(wjConInfo,data,clickEquipCallBack);
		if(data.equip&&data.equip.part_1){
			wjConInfo.find("#part_1").data("data",data.equip.part_1).bind(clickEventType,clickEquipCallBack).children("img").attr("src",imgfolder+data.equip.part_1.img).show();
			wjConInfo.find("#part_1 p").show().find("span").text(data.equip.part_1.level);
		}
		else{
			wjConInfo.find("#part_1").bind(clickEventType,clickEquipCallBack).children().hide();
		}
		if(data.equip&&data.equip.part_2){
			wjConInfo.find("#part_2").data("data",data.equip.part_2).bind(clickEventType,clickEquipCallBack).children("img").attr("src",imgfolder+data.equip.part_2.img).show();
			wjConInfo.find("#part_2 p").show().find("span").text(data.equip.part_2.level);
		}
		else{
			wjConInfo.find("#part_2").bind(clickEventType,clickEquipCallBack).children().hide();
		}
		if(data.equip&&data.equip.part_3){
			wjConInfo.find("#part_3").data("data",data.equip.part_3).bind(clickEventType,clickEquipCallBack).children("img").attr("src",imgfolder+data.equip.part_3.img).show();
			wjConInfo.find("#part_3 p").show().find("span").text(data.equip.part_3.level);
		}
		else{
			wjConInfo.find("#part_3").bind(clickEventType,clickEquipCallBack).children().hide();
		}
		if(data.equip&&data.equip.part_4){
			wjConInfo.find("#part_4").data("data",data.equip.part_4).bind(clickEventType,clickEquipCallBack).children("img").attr("src",imgfolder+data.equip.part_4.img).show();
			wjConInfo.find("#part_4 p").show().find("span").text(data.equip.part_4.level);
		}
		else{
			wjConInfo.find("#part_4").bind(clickEventType,clickEquipCallBack).children().hide();
		}
	},
	//设置武将穿戴的娇妾信息
	setWJJQData:function(wjConInfo,data,clickEquipCallBack){
		clickEquipCallBack=clickEquipCallBack||wuJiang.clickWjEquip;
		wuJiang.setWJImgData(wjConInfo,data,clickEquipCallBack);
		if(data.jq&&data.jq.part_6){
			wjConInfo.find("#part_1").data("data",data.jq.part_6).bind(clickEventType,clickEquipCallBack).children("img").attr("src",imgfolder+data.jq.part_6.img).show();
			wjConInfo.find("#part_1 p").show().find("span").text(data.jq.part_6.level);
		}
		else{
			wjConInfo.find("#part_1").bind(clickEventType,clickEquipCallBack).children().hide();
		}
		if(data.jq&&data.jq.part_7){
			wjConInfo.find("#part_2").data("data",data.jq.part_7).bind(clickEventType,clickEquipCallBack).children("img").attr("src",imgfolder+data.jq.part_7.img).show();
			wjConInfo.find("#part_2 p").show().find("span").text(data.jq.part_7.level);
		}
		else{
			wjConInfo.find("#part_2").bind(clickEventType,clickEquipCallBack).children().hide();
		}
		if(data.jq&&data.jq.part_8){
			wjConInfo.find("#part_3").data("data",data.jq.part_8).bind(clickEventType,clickEquipCallBack).children("img").attr("src",imgfolder+data.jq.part_8.img).show();
			wjConInfo.find("#part_3 p").show().find("span").text(data.jq.part_8.level);
		}
		else{
			wjConInfo.find("#part_3").bind(clickEventType,clickEquipCallBack).children().hide();
		}
		wjConInfo.find("#part_4").children().hide();
	},
	//设置武将穿戴的法宝信息
	setWJFBData:function(wjConInfo,data,clickEquipCallBack){
		clickEquipCallBack=clickEquipCallBack||wuJiang.clickWjEquip;
		wuJiang.setWJImgData(wjConInfo,data,clickEquipCallBack);
		if(data.fb&&data.fb.part_5){
			wjConInfo.find("#part_1").data("data",data.fb.part_5).bind(clickEventType,clickEquipCallBack).children("img").attr("src",imgfolder+data.fb.part_5.img).show();
			wjConInfo.find("#part_1 p").show().find("span").text(data.fb.part_5.level);
		}
		else{
			wjConInfo.find("#part_1").bind(clickEventType,clickEquipCallBack).children().hide();
		}

		wjConInfo.find("#part_2").children().hide();
		wjConInfo.find("#part_3").children().hide();
		wjConInfo.find("#part_4").children().hide();
	},
	setWJImgData:function(wjConInfo,data,clickEquipCallBack){
		wjConInfo.find("#wj_img").attr("src",imgfolder+data.npc.img);
		var expWidth=353;
		var expPer=parseInt(expWidth*data.npc.exp/data.npc.expUp);
		wjConInfo.filter("#wjexp").css("width",expPer+"px");
	},
	clickWjEquip:function(event){
		if($(this).children("img").css("display")=="none"){
			return;
		}
		if(!Slider.checkTouchAvailabel(this)){//滑动当中不允许点击
			return;
		}
		var equipData=$(this).data("data");
		var part=$(this).attr("id");
		if(part){
			var equipInfo=equip.showEquipInfo.call(this,equipData,event);//id和数据中的键值要对应，id=part_1对应wjData.equip.part_1
			equipInfo.find("#equip_price").parent().hide();
			var thisObj=this;
			equipInfo.find("#btn_down").show().bind(clickEventType,function(){
				equip.dropEquip.call(thisObj);
			});
			if(equipData.t=='zb'){
				equipInfo.find("#btn_xiangqian").show();
			}
			wuJiang.fixPosition($(this),equipInfo);
		}
	},
	//更新左面武将的部分数据
	updateLWJPartData:function(data,all,setDataFun,clickEquipCallBack){
		var currentPage=$("#wjinfocon").currentPage();
		var pageData=currentPage.data("data");
		if(all){//全部更新
			pageData=data;
		}else{
			for(key in data){
				//局部信息更新
				if(pageData.npc[key]){
					pageData.npc[key]=data[key];
				}
				else if(pageData.equip[key]){
					pageData.equip[key]=data[key];
				}
			}
		}
		currentPage.data("data",pageData);
		var wjConInfo=$.tmpl($("#wjinfocon_tmpl"),pageData.npc);
		//维持原先绑定的事件
		/*
		wjConInfo.find("#part_1").replaceWith(currentPage.find("#part_1").clone(true));
		wjConInfo.find("#part_2").replaceWith(currentPage.find("#part_2").clone(true));
		wjConInfo.find("#part_3").replaceWith(currentPage.find("#part_3").clone(true));
		wjConInfo.find("#part_4").replaceWith(currentPage.find("#part_4").clone(true));*/
		//////
		//wuJiang.setWJImgData(wjConInfo,pageData,null);
		setDataFun(wjConInfo,pageData,clickEquipCallBack);
		currentPage.html(wjConInfo);
	},
	getLeftCurrentWjID:function(){
		if($("#wjinfocon").length>0){
			var cPIndex=$("#wjinfocon").currentPageIndex()+1;
			return $("#wjinfocon").data(cPIndex.toString());
		}
		else{
			return 0;
		}
	},
	getLeftCurrentWjData:function(){
		var currentPage=$("#wjinfocon").currentPage();
		var pageData=currentPage.data("data");
		return pageData;
	},
	getLeftCurrentWjPage:function(){
		return $("#wjinfocon").currentPage();
	},
	updateWjChangedCallBack:function(callBack){
		if($("#wjinfocon").length>0){
			$("#wjinfocon").get(0).onPageChange=function(){
				var index=$("#wjinfocon").currentPageIndex()+1;
				$("#wj_cindex").text(index);
				if(callBack){
					var currentPage=$("#wjinfocon").currentPage();
					if(currentPage.data("data")==undefined){
						var nid=$("#wjinfocon").data(index.toString());
						callBack(nid);
					}
					else{
						callBack();
					}
				}
			}
		}
	},
	showWJOperation:function(nid,index){
		var wjWindow = new mesWindow("oneWJWindow", $("#wjoperate_tmpl").html());
		wuJiang.nid=nid;
		Common.injectCloseCallBack(wuJiang.closeSecondWindow,"oneWJWindow");
		Common.Tab.bindTab("nav_Bag","",equip.tabChanged,jiaoQie.tabChanged);
		if(!index || index==0){//洗练
			equip.show(nid);
		}
		else if(index==1){//装备
			var tab=$("#requiNav").children().slice(1,2);
			tab.prev().attr("src",tab.prev().attr("clickImg"));
			tab.attr("src",tab.attr("clickImg"));
			equip.show(nid);
		}
		else if(index==2){//娇妾
			jiaoQie.show(nid);
		}
		else if(index==3){//法宝
		
		}
	},
	//对一个元素固定位置,第一个参数是相对于定位的基元素,第二个有参数要进行定位的元素
	fixPosition:function(relativeObj,conObj){
		var conWidth=conObj.outerWidth();//内容宽
		var conHeight=conObj.outerHeight();//内容高
		var rObjWidth=relativeObj.width();//基元素的宽
		var rObjHeight=relativeObj.height();//基元素的高
		
		var popWin=relativeObj.parents(".mesWindow:first");//弹窗
		if(popWin.length>0){
			var popWinWidth=popWin.width();
			var popWinHeight=popWin.height();
		}
		else{
			var popWinWidth=1024;//没有弹窗,主页面的宽度
			var popWinHeight=bodyHeight;//没有弹窗,主页面的高度
		}
		var popWinPos=popWin.length>0?popWin.offset():{top:0,left:0};
		var relativePos=relativeObj.offset();
		relativePos={top:relativePos.top-popWinPos.top,left:relativePos.left-popWinPos.left};//元素相对于所在弹窗的偏移量
		if(popWinWidth-relativePos.left-rObjWidth-15>conWidth){
			var left=relativePos.left+rObjWidth+15;//在基元素右面
		}
		else{
			var left=relativePos.left-conWidth-15;//在基元素左面
		}
		if(popWinHeight-relativePos.top>conHeight){
			var top=relativePos.top//与基元素相平
		}
		else{
			var top=relativePos.top-(conHeight-(popWinHeight-relativePos.top));//在基元素上面
		}
		conObj.css({top:top,left:left});
	}
}

var equip={
	data:null,
	mc:false,
	EType:0,
	npcType:0,
	status:false,
	setCache:function(data){
		equip.data=data;
	},
	clearCache:function(nid){
		equip.data=null;
	},
	tabChanged:function(nid){
		equip.show(nid);
	},
	show:function(nid){
		$('#wjWindow,#windowBackwjWindow').hide();
		$('#WJjiaoqieList').remove();
		$('#wearJiaoqie').remove();
		$('#wuJiao').append('<div class="zhuangBr fl" id="WJequipList" style="width:428px;height:425px;"></div>');
		$('#wuJiao').before('<div class="zhuangBN fl bors10"  id="wearList"  style="width:420px;height:425px;"></div>');
		$("#WJequipList").setSlider({row:4,col:4});
		$("#wearList").setSlider({row:1,col:1,multiPage:true,onPageChange:equip.WJ_list});
		var nlData=nrData=1;
		var equipJson='',p='',leftHtml='',centerHtml='',rightHtml='',bottomHtml='';
		if(!nid){
			wuJiang.nid=0;
		}
		$.getJN("http://" + host + "/sgg/i/bag/b.php", {
			uid : userId,
			nid:wuJiang.nid,
			left:nlData,
			right:nrData
		}, function(data) {
			$('#wearJiaoqie').removeAllItem();
			$('#WJjiaoqieList').removeAllItem();
			if (data.nlist) {
				for (key in data.nlist) {
					if(wuJiang.nid==0){
						wuJiang.nid = data['nlist'][0]['id'];
					}
					if (data['nlist'][key]['id'] == wuJiang.nid) {  //判断是否是当前选中的武将
						if(data.bag){
							for(kk in data.bag){
								//背包装备
								if(kk=='c'){
									for(oKey in data['bag'][kk]){
										equipJson = JSON.stringify(data['bag'][kk][oKey]);
										if(data['bag'][kk][oKey]['type'] == 1){p="武器";}
										if(data['bag'][kk][oKey]['type'] == 2){p="头盔";}
										if(data['bag'][kk][oKey]['type'] == 3){p="衣服";}
										if(data['bag'][kk][oKey]['type'] == 4){p="鞋子";}
										if(data['bag'][kk][oKey]['phy_att']){
											equip.EType = "phy_att="+"'"+data['bag'][kk][oKey]['phy_att']+"'";//1 力量类型
										}else if(data['bag'][kk][oKey]['mag_att']){
											equip.EType = "mag_att="+"'"+data['bag'][kk][oKey]['mag_att']+"'"; //2智力类型
										}else{
											equip.EType="";
										}
										$('#WJequipList').addSliderItem("<div><div class='zhuPub clickEquipBag' "+equip.EType+" price='"+data['bag'][kk][oKey]['price']+"' eid='"+data['bag'][kk][oKey]['eid']+"' wear_equip_img='"+data['bag'][kk][oKey]['img']+"' takeL='"+data['bag'][kk][oKey]['takeL']+"' equip_attribute='"+equipJson+"' type='"+data['bag'][kk][oKey]['type']+"' equip_name='"+data['bag'][kk][oKey]['name']+"' equip_level='"+data['bag'][kk][oKey]['level']+"' part='"+p+"' t='"+data['bag'][kk][oKey]['t']+"'><img src='image/game/"+data['bag'][kk][oKey]['img']+"' /><p class='pub_jb1'><img src='image/sys/pub_jb.png' /></p><p class='xnum1'>"+data['bag'][kk][oKey]['level']+"</p>"+"</div></div>");
									}
								}
							}
						}
						/*武将左侧信息分为上下2部分 topHtml bottomHtml topHtml部分又分为左右两部分 leftHtml rightHtml*/
						//武将上面左侧信息
						leftHtml = '<div class="zhuangBH">';
						if(data.npc){
							wuJiang.nid = data.npc.nid;
							leftHtml += '<dl class="zhaoList zL'+data.npc['class']+' fl">';
							leftHtml += '<dt class="zhaoListT">'+data.npc.level+'</dt>';
							leftHtml += '<dd><img width=163 height=163 src="image/game/'+data.npc.img+'"></dd>';
							leftHtml += '<dd class="zhaoStar">';
							for(var j=0;j<data.npc.star;j++){
								//leftHtml += publicFunction.starNum(data.npc.can, data['npc']['class']);
								leftHtml += "<img src='image/sys/zStar.png' />";
							}
							leftHtml += '</dd>';
							leftHtml += '<dd class="wjName">'+data.npc.name+'</dd>';
							leftHtml += '</dl>';
						}
						//武将上面右侧信息
						rightHtml = '<div class="zBTl fl">';
						if(data.equip){
							if(data.equip.part_1){
								if(data.equip.part_1.phy_att){
									equip.EType = "phy_att="+"'"+data.equip.part_1.phy_att+"'";//1 力量类型
								}
								if(data.equip.part_1.mag_att){
									equip.EType = "mag_att="+"'"+data.equip.part_1.mag_att+"'"; //2智力类型
								}
								equipJson = JSON.stringify(data.equip.part_1);
								rightHtml += "<div class='zBgz1 clickEquipWear' part='1' "+equip.EType+" price='"+data.equip.part_1.price+"' eid='"+data.equip.part_1.eid+"' t='"+data.equip.part_1.t+"' wear_equip_img='"+data.equip.part_1.img+"' wearPosition='武器' allow_equip_level='"+data.equip.part_1.takeL+"' equip_att='"+equipJson+"' equip_level='"+data.equip.part_1.level+"' equip_name='"+data.equip.part_1.name+"'><img src='image/game/"+data.equip.part_1.img+"' /><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.equip.part_1.level+"</p></div>";
							}else{
								rightHtml += '<div class="zBgz1" part="1"></div>';
							}
							if(data.equip.part_2){
								equipJson = JSON.stringify(data.equip.part_2);
								rightHtml += "<div class='zBgz3 clickEquipWear' part='2' price='"+data.equip.part_2.price+"' eid='"+data.equip.part_2.eid+"' t='"+data.equip.part_2.t+"' wear_equip_img='"+data.equip.part_2.img+"' wearPosition='头盔' allow_equip_level='"+data.equip.part_2.takeL+"' equip_att='"+equipJson+"' equip_level='"+data.equip.part_2.level+"' equip_name='"+data.equip.part_2.name+"'><img src='image/game/"+data.equip.part_2.img+"' /><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.equip.part_2.level+"</p></div>";
							}else{
								rightHtml += '<div class="zBgz3 clickEquipWear" part="2"></div>';
							}
							if(data.equip.part_3){
								equipJson = JSON.stringify(data.equip.part_3);
								rightHtml += "<div class='zBgz2 clickEquipWear' part='3' price='"+data.equip.part_3.price+"' eid='"+data.equip.part_3.eid+"' t='"+data.equip.part_3.t+"' wear_equip_img='"+data.equip.part_3.img+"' wearPosition='衣服' allow_equip_level='"+data.equip.part_3.takeL+"' equip_att='"+equipJson+"' equip_level='"+data.equip.part_3.level+"' equip_name='"+data.equip.part_3.name+"'><img src='image/game/"+data.equip.part_3.img+"' /><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.equip.part_3.level+"</p></div>";
							}else{
								rightHtml += '<div class="zBgz2 clickEquipWear" part="3"></div>';
							}
							if(data.equip.part_4){
								equipJson = JSON.stringify(data.equip.part_4);
								rightHtml += "<div class='zBgz4 clickEquipWear' part='4' price='"+data.equip.part_4.price+"' eid='"+data.equip.part_4.eid+"' t='"+data.equip.part_4.t+"' wear_equip_img='"+data.equip.part_4.img+"' wearPosition='鞋子' allow_equip_level='"+data.equip.part_4.takeL+"' equip_att='"+equipJson+"' equip_level='"+data.equip.part_4.level+"' equip_name='"+data.equip.part_4.name+"'><img src='image/game/"+data.equip.part_4.img+"' /><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.equip.part_4.level+"</p></div>";
							}else{
								rightHtml += '<div class="zBgz4 clickEquipWear" part="4"></div>';
							}
						}else{
							rightHtml += '<div class="zBgz1 clickEquipWear" part="1"></div>';
							rightHtml += '<div class="zBgz2 clickEquipWear" part="2"></div>';
							rightHtml += '<div class="zBgz3 clickEquipWear" part="3"></div>';
							rightHtml += '<div class="zBgz4 clickEquipWear" part="4"></div>';
						}
						rightHtml += '</div></div><p class="clear"></p>';
						//下面武将相关属性信息
						if(data.npc){
							bottomHtml = '<div class="zhuangBb bors5 fs22 ls1">';
							bottomHtml += '<ul class="w191 fl">';
							bottomHtml += '<li id="liliang"><span>力量：</span>'+data.npc.str+'</li>';
							bottomHtml += '<li id="zhili"><span>智力：</span>'+data.npc.inte+'</li>';
							bottomHtml += '<li id="hp"><span>生命：</span>'+data.npc.hp+'</li>';
							bottomHtml += '<li id="skill_name"><span>技能：</span>'+data.npc.skname+'</li>';
							bottomHtml += '</ul>';
							bottomHtml += '<ul class="w165 fl">';
							if(data['nlist'][key]['ty']==1){
								bottomHtml += '<li id="phy_att"><span>物理攻击：</span>'+data.npc.phy_att+'</li>';
							}else if(data['nlist'][key]['ty']==2){
								bottomHtml += '<li id="mag_att"><span>法术攻击：</span>'+data.npc.mag_att+'</li>';
							}
							bottomHtml += '<li id="phy_def"><span>物理防御：</span>'+data.npc.phy_def+'</li>';
							bottomHtml += '<li id="mag_def"><span>法术防御：</span>'+data.npc.mag_def+'</li>';
							bottomHtml += '<li id="speed"><span>速度：</span>'+data.npc.speed+'</li>';
							bottomHtml += '</ul>';
							bottomHtml += '</div>';
						}
						equip.npcType = data['nlist'][key]['ty'];
						$('#wearList').addSliderItem("<div class='wj_list_css' npcType='"+data['nlist'][key]['ty']+"' nid='"+data['nlist'][key]['id']+"'>"+leftHtml+rightHtml+bottomHtml+"</div>");
						$("#wearList").goToLastPage();
					}else { //判断不是选中的当前武将
						$('#wearList').addSliderItem("<div class='wj_list_css' npcType='"+data['nlist'][key]['ty']+"' nid='"+data['nlist'][key]['id']+"'><div class='zhuangBH'><dl class='zhaoList fl'><dt class='zhaoListT' id='npcLevel'></dt><dd id='npcImg'></dd><dd class='zhaoStar' id='classStar'></dd><dd class='wjName' id='npcName'></dd></dl><div class='zBTl fl'><div class='zBgz1 clickEquipWear' part='1' id='left1'></div><div class='zBgz3 clickEquipWear' part='2' id='left2'></div><div class='zBgz2 clickEquipWear' part='3' id='left3'></div><div class='zBgz4 clickEquipWear' part='4' id='left4'></div></div></div><p class='clear'></p><div class='zhuangBb bors5 fs22 ls1'><ul class='w191 fl'><li id='liliang'></li><li id='zhili'></li><li id='hp'></li><li id='skill_name'></li></ul><ul class='w165 fl'><li id='phy_def'></li><li id='mag_def'></li><li id='speed'></li></ul></div></div>");
					}
				}
			}
			$('.clickEquipBag').bind(clickEventType,equip.clickEquipBag);
			$('.clickEquipWear').bind(clickEventType,equip.clickEquipWear);
		});			
		if(director.progress==35){
			director.updateProgress();
		}
	},
	WJ_list:function(){//滑动武将信息 
		var equipJson='',p='',leftHtml='',centerHtml='',rightHtml='',bottomHtml='';
		var nlData=nrData=1;
		var WJ_nid = $("#wearList").currentPage().find(".wj_list_css").attr('nid');
		equip.npcType = $("#wearList").currentPage().find(".wj_list_css").attr('npcType');
		$.getJN("http://" + host + "/sgg/i/bag/b.php", {
			uid : userId,
			nid:WJ_nid,
			left:nlData,
			right:nrData
		}, function(data){
			/*武将左侧信息分为上下2部分 topHtml bottomHtml topHtml部分又分为左右两部分 leftHtml rightHtml*/
			//武将上面左侧信息
			if(data.npc){
				wuJiang.nid = data.npc.nid;
				//$('#wearList').currentPage().find(".zhaoList").addClass("zL"+data.npc['class']);
				$('#wearList').currentPage().find(".zhaoList").attr("class","zhaoList fl zL"+data.npc['class']);
				$("#wearList").currentPage().find("#npcLevel").text(data.npc.level);
				$("#wearList").currentPage().find("#npcImg").empty();
				$("#wearList").currentPage().find("#npcImg").append('<img width="163" height="163" src="image/game/'+data.npc.img+'">');
				//var c = publicFunction.starNum(data.npc.can, data['npc']['class']);
				var c='';
				for(var j=0;j<data.npc.star;j++){
					c += "<img src='image/sys/zStar.png' />";
				}
				$("#wearList").currentPage().find("#classStar").empty();
				$("#wearList").currentPage().find("#classStar").append(c);
				$("#wearList").currentPage().find("#npcName").text(data.npc.name);
			}
			//武将上面右侧信息
			if(data.equip){
				if(data.equip.part_1){
					equipJson = JSON.stringify(data.equip.part_1);
					$("#wearList").currentPage().find("#left1").empty();
					if(equip.npcType==1){
						$("#wearList").currentPage().find("#left1").attr("phy_att",data.equip.part_1.phy_att);
					}else if(equip.npcType==2){
						$("#wearList").currentPage().find("#left1").attr("mag_att",data.equip.part_1.mag_att);
					}
					$("#wearList").currentPage().find("#left1").attr({price:data.equip.part_1.price,eid:data.equip.part_1.eid,t:data.equip.part_1.t,wear_equip_img:data.equip.part_1.img,wearPosition:"武器",allow_equip_level:data.equip.part_1.takeL,equip_att:equipJson,equip_level:data.equip.part_1.level,equip_name:data.equip.part_1.name});
					$("#wearList").currentPage().find("#left1").append("<img src='image/game/"+data.equip.part_1.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.equip.part_1.level+"</p>");
				}else{
				}
				if(data.equip.part_2){
					equipJson = JSON.stringify(data.equip.part_2);
					$("#wearList").currentPage().find("#left2").empty();
					$("#wearList").currentPage().find("#left2").attr({price:data.equip.part_2.price,eid:data.equip.part_2.eid,t:data.equip.part_2.t,wear_equip_img:data.equip.part_2.img,wearPosition:"衣服",allow_equip_level:data.equip.part_2.takeL,equip_att:equipJson,equip_level:data.equip.part_2.level,equip_name:data.equip.part_2.name});
					$("#wearList").currentPage().find("#left2").append("<img src='image/game/"+data.equip.part_2.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.equip.part_2.level+"</p>");
				}else{
				}
			}
			//武将右侧信息
			if(data.equip){
					rightHtml = '<div class="zBTl fl">';
					if(data.equip.part_3){
						equipJson = JSON.stringify(data.equip.part_3);
						$("#wearList").currentPage().find("#left3").empty();
						$("#wearList").currentPage().find("#left3").attr({price:data.equip.part_3.price,eid:data.equip.part_3.eid,t:data.equip.part_3.t,wear_equip_img:data.equip.part_3.img,wearPosition:"头盔",allow_equip_level:data.equip.part_3.takeL,equip_att:equipJson,equip_level:data.equip.part_3.level,equip_name:data.equip.part_3.name});
						$("#wearList").currentPage().find("#left3").append("<img src='image/game/"+data.equip.part_3.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.equip.part_3.level+"</p>");
					}else{
					}
					if(data.equip.part_4){
						equipJson = JSON.stringify(data.equip.part_4);
						$("#wearList").currentPage().find("#left4").empty();
						$("#wearList").currentPage().find("#left4").attr({price:data.equip.part_4.price,eid:data.equip.part_4.eid,t:data.equip.part_4.t,wear_equip_img:data.equip.part_4.img,wearPosition:"鞋子",allow_equip_level:data.equip.part_4.takeL,equip_att:equipJson,equip_level:data.equip.part_4.level,equip_name:data.equip.part_4.name});
						$("#wearList").currentPage().find("#left4").append("<img src='image/game/"+data.equip.part_4.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.equip.part_4.level+"</p>");
					}else{
					}
			}
			if(data.npc){
				wuJiang.nid = data.npc.nid;
				$("#wearList").currentPage().find("#liliang").html("<span>力量：</span>"+data.npc.str);
				$("#wearList").currentPage().find("#zhili").html("<span>智力：</span>"+data.npc.inte);
				$("#wearList").currentPage().find("#hp").html("<span>生命：</span>"+data.npc.hp);
				$("#wearList").currentPage().find("#skill_name").html("<span>技能：</span>"+data.npc.skname);
				if(equip.npcType==1){
					$("#wearList").currentPage().find("#phy_att").remove();
					$("#wearList").currentPage().find("#mag_att").remove();
					$("#wearList").currentPage().find(".w165").prepend("<li id='phy_att'><span>物理攻击：</span>"+data.npc.phy_att+"</li>");
				}else if(equip.npcType==2){
					$("#wearList").currentPage().find("#mag_att").remove();
					$("#wearList").currentPage().find("#phy_att").remove();
					$("#wearList").currentPage().find(".w165").prepend("<li id='mag_att'><span>法术攻击：</span>"+data.npc.mag_att+"</li>");
				}
				$("#wearList").currentPage().find("#phy_def").html("<span>物理防御：</span>"+data.npc.phy_def);
				$("#wearList").currentPage().find("#mag_def").html("<span>法术防御：</span>"+data.npc.mag_def);
				$("#wearList").currentPage().find("#speed").html("<span>速度：</span>"+data.npc.speed);
			}
		});
	},
	clickEquipBag:function(){
		if(!Slider.checkTouchAvailabel(this)){//滑动当中不允许点击
			return;
		}
		var BagHtml=$($("#equip_show_tmpl").html());
		$(".pubPop").remove();
		var t = $(this).attr("t");
		var _this = $(this);
		if(t=='zb'){ //点击背包装备
			var _this = $(this);
			var equip_level = $(this).attr("equip_level");
			var equip_name = $(this).attr("equip_name");
			var equip_attribute = $(this).attr("equip_attribute");
			var wear_equip_img = $(this).attr('wear_equip_img');
			var takeL = $(this).attr("takeL");
			var wearPosition = $(this).attr("part");
			var part = $(this).attr("type");
			var eid = $(this).attr("eid");
			var equip_attribute_wear = equip_attribute;
			var price = $(this).attr("price");
			if($(this).attr("phy_att")){ //物攻 力量
				var phy_att = $(this).attr("phy_att");
				var type=1;
			}else if($(this).attr("mag_att")){ //法攻 智力
				var type=2;
				var mag_att=$(this).attr("mag_att");
			}else{
				var type=0;
			}
			equip_attribute = JSON.parse(equip_attribute);
			equip_attribute = roleAttr.translateAttr(equip_attribute);
			BagHtml.find("#att").empty();
			$.each(equip_attribute,function(i,item){
				BagHtml.find('#att').append(item.n+":<span class='cor96'>"+item.v+"</span><br/>");
			});
			BagHtml.find('#equip_name').text(equip_name);
			BagHtml.find('#allow_equip_level').text("穿戴等级："+takeL);
			BagHtml.find('#equip_level').text(equip_level);
			BagHtml.find('#wearPosition').text("穿戴部位："+wearPosition);
			BagHtml.find('#equip_img').attr("src",'image/game/'+wear_equip_img);
			BagHtml.find('#price').text("售价："+price);
			$("#oneWJWindow").append(BagHtml);
			if(director.progress==36){
				director.updateProgress();
			}
			$('#sail').bind(clickEventType,function(){
				$('#wear').removeClass("pub_btn");$('#wear').addClass("pub_btn4");
				$('#sail').removeClass("pub_btn");$('#sail').addClass("pub_btn4");
				alertHtml = '<div class="pubPop1 pab"><p class="fs28 cor55">出售 <span class="cor95 stro13">'+equip_name+'</span> 获得<span class="cor95">'+price+'钱币</span></p><div class="mt83"><a class="pub_btn" id="sub_sail">出售</a><a class="pub_btn" id="cancel">关闭</a></div>	</div>';
				$('.pubPop').after(alertHtml);
				$('#sub_sail').bind(clickEventType,function(){
					$.getJN(
							"http://" + host + "/sgg/i/bag/s.php",
							{uid:userId,sellid:eid,t:t},
							function(data){
								_this.empty();
								_this.removeAttr("t");
								$('.pubPop1').remove();
								$('.pubPop').remove();
								user.refreshUserInfo(data.user);
							}
					);
				});
				$('#cancel').bind(clickEventType,function(){
					$('.pubPop1').remove();
					$('.pubPop').remove();
				});
			});
			$('#wear').bind(clickEventType,function(){ //穿戴背包装备
				//防止网速慢刷装备
				if(equip.status==false)
				{
					equip.status=true;
				}else{
					return false;
				}
				if(part == 1){w="武器";}
				if(part == 2){w="头盔";}
				if(part == 3){w="衣服";}
				if(part == 4){w="鞋子";}
				if(phy_att || mag_att){
					if(equip.npcType!=type){
						if(type==1){
							Common.alert('智力型武将无法穿戴 <span class="cor95 stro13">物攻武器</span>');
							equip.status=false;
							return false;
						}
						if(type==2){
							Common.alert('力量型武将无法穿戴 <span class="cor95 stro13">法攻武器</span>');
							equip.status=false;
							return false;
						}
					}
				}
				$.getJN(
					"http://" + host + "/sgg/i/npc/h.php",
					{uid : userId,nid:wuJiang.nid,part:part,untake:0,eid:eid},
					function(data){
							_this.parent().remove();
							$(".wj_list_css").each(function(i){
								if($(this).attr("nid") == wuJiang.nid){
									$(this).find(".clickEquipWear").each(function(j){
										if($(this).attr("part") == part){
											if($(this).children("img").length>0){
												var common='';
												if($(this).attr('phy_att')){
												    common = "phy_att="+phy_att;
												}
												if($(this).attr('mag_att')){
													common = "mag_att="+mag_att;
												}
												$('#WJequipList').insertSliderItem("div:empty","<div><div class='zhuPub clickEquipBag' "+common+" price='"+$(this).attr("price")+"' eid='"+$(this).attr("eid")+"' wear_equip_img='"+$(this).attr("wear_equip_img")+"' takeL='"+$(this).attr("allow_equip_level")+"' equip_attribute='"+$(this).attr("equip_att")+"' type='"+$(this).attr("part")+"' equip_name='"+$(this).attr("equip_name")+"' equip_level='"+$(this).attr("equip_level")+"' part='"+$(this).attr("part")+"' t='"+$(this).attr("t")+"'><img src='image/game/"+$(this).attr("wear_equip_img")+"' /><p class='pub_jb1'><img src='image/sys/pub_jb.png' /></p><p class='xnum1'>"+$(this).attr("equip_level")+"</p></div></div>");
											}
											if(phy_att){
											    $(this).attr('phy_att',phy_att);
											}else if(mag_att){
												$(this).attr('mag_att',mag_att);
											}
											$(this).attr('t',t);$(this).attr("part",part);$(this).attr("wear_equip_img",wear_equip_img);$(this).attr("wearPosition",w);$(this).attr("allow_equip_level",takeL);$(this).attr("equip_att",equip_attribute_wear);$(this).attr("equip_level",equip_level);$(this).attr("equip_name",equip_name);$(this).attr("eid",eid);$(this).attr("price",price);
											$(this).empty();
											$(this).append("<img src='image/game/"+wear_equip_img+"' width=78 height=78 /><p class='pubJb pab fs18 cor55 tc'>"+equip_level+"</p>");
											$('.w191,.w165').empty();
											$('.w191').append('<li id="liliang"><span>力量：</span>'+data.npc.str+'</li><li id="zhili"><span>智力：</span>'+data.npc.inte+'</li><li id="hp"><span>生命：</span>'+data.npc.hp+'</li><li id="skill_name"><span>技能：</span>'+data.npc.skname+'</li>');
											var HL = '';
											if(equip.npcType==1){
												HL  += '<li id="phy_att"><span>物理攻击：</span>'+data.npc.phy_att+'</li>';
											}else if(equip.npcType==2){
												HL  += '<li id="mag_att"><span>法术攻击：</span>'+data.npc.mag_att+'</li>';
											}
											HL  += '<li id="phy_def"><span>物理防御：</span>'+data.npc.phy_def+'</li>';
											HL  += '<li id="mag_def"><span>法术防御：</span>'+data.npc.mag_def+'</li>';
											HL  += '<li id="speed"><span>速度：</span>'+data.npc.speed+'</li>';
											$('.w165').append(HL);
											equip.status=false;
										}
									});
								}
							});
							$('.clickEquipWear').unbind(clickEventType);
							$('.clickEquipBag').unbind(clickEventType);
							$('.clickEquipWear').bind(clickEventType,equip.clickEquipWear);
							$('.clickEquipBag').bind(clickEventType,equip.clickEquipBag);
							$(".pubPop").remove();
							if(director.progress==37){
								director.updateProgress();
							}
					}
				);
			});
			$(document).bind(touchDown,function(e){
				if($(e.target).attr("id")=="wear" || $(e.target).attr("id")=="sail"){
					
				}else{
					$("#sail #wear").unbind(clickEventType);
					equip.hideEquipInfo();
				}
				
			});
		}
	},
	clickEquipWear:function(){
		if(!Slider.checkTouchAvailabel(this)){//滑动当中不允许点击
			return;
		}
		if($(this).children("img").length<=0){
			return false;
		}
		$(".pubPop").remove();
		var BagHtml=$($("#equip_show_tmpl").html());
		var wearAllow_equip_level = $(this).attr('allow_equip_level'); //用户等级
		var wearEquip_att = $(this).attr('equip_att');
		var wearEquip_level = $(this).attr('equip_level');
		var wearEquip_name = $(this).attr('equip_name');
		var wearPosition = $(this).attr('wearPosition');
		var wear_equip_img = $(this).attr('wear_equip_img');
		var t=$(this).attr("t");
		var takel = $(this).attr("takel");
		var _this=$(this);
		var part = $(this).attr("part");
		var eid=$(this).attr("eid");
		var price=$(this).attr("price");
		var common='';
		if($(this).attr("phy_att")){
			common = "phy_att="+$(this).attr("phy_att");
		}
		if($(this).attr("mag_att")){
			common = "mag_att="+$(this).attr("phy_att");
		}
		BagHtml.find('#equip_name').text(wearEquip_name);
		BagHtml.find('#equip_level').text(wearEquip_level);
		BagHtml.find('#equip_img').attr("src",'image/game/'+wear_equip_img);
		var mid = wearEquip_att;
		wearEquip_att = JSON.parse(wearEquip_att);
		wearEquip_att = roleAttr.translateAttr(wearEquip_att);
		BagHtml.find("#att").empty();
		$.each(wearEquip_att,function(i,item){
			BagHtml.find('#att').append(item.n+":<span class='cor96'>"+item.v+"</span><br/>");
		});
		BagHtml.find('#allow_equip_level').text("穿戴等级："+wearAllow_equip_level);
		BagHtml.find('#wearPosition').text("穿戴部位："+wearPosition);
		BagHtml.find('#price').text("售价："+price);
		BagHtml.find('#wear').text("卸下");
		BagHtml.find('#sail').text("关闭");
		$("#oneWJWindow").append(BagHtml);
		$('#sail').bind(clickEventType,function(){
			$(".pubPop").remove();
		});
		$("#wear").bind(clickEventType,function(){
			//防止网速慢刷装备
			if(equip.status==false)
			{
				equip.status=true;
			}else{
				return false;
			}
			$.getJN(
				"http://" + host + "/sgg/i/npc/h.php",
				{uid : userId,nid:wuJiang.nid,part:part,untake:1},
				function(data){
					_this.empty();
					$('#WJequipList').insertSliderItem("div:empty","<div><div class='zhuPub clickEquipBag' "+common+" price='"+price+"' eid='"+eid+"' wear_equip_img='"+wear_equip_img+"' takeL='"+wearAllow_equip_level+"' equip_attribute='"+mid+"' type='"+part+"' equip_name='"+wearEquip_name+"' equip_level='"+wearEquip_level+"' part='"+part+"' t='"+t+"'><img src='image/game/"+wear_equip_img+"' /><p class='pub_jb1'><img src='image/sys/pub_jb.png' /></p><p class='xnum1'>"+wearEquip_level+"</p></div></div>");
					$('.w191,.w165').empty();
					$('.w191').append('<li id="liliang"><span>力量：</span>'+data.npc.str+'</li><li id="zhili"><span>智力：</span>'+data.npc.inte+'</li><li id="hp"><span>生命：</span>'+data.npc.hp+'</li><li id="skill_name"><span>技能：</span>'+data.npc.skname+'</li>');
					var HL = '';
					if(equip.npcType==1){
						HL  += '<li id="phy_att"><span>物理攻击：</span>'+data.npc.phy_att+'</li>';
					}else if(equip.npcType==2){
						HL  += '<li id="mag_att"><span>法术攻击：</span>'+data.npc.mag_att+'</li>';
					}
					HL  += '<li id="phy_def"><span>物理防御：</span>'+data.npc.phy_def+'</li>';
					HL  += '<li id="mag_def"><span>法术防御：</span>'+data.npc.mag_def+'</li>';
					HL  += '<li id="speed"><span>速度：</span>'+data.npc.speed+'</li>';
					$('.w165').append(HL);
					$(".pubPop").remove();
					equip.status=false;
					$('.clickEquipBag').unbind(clickEventType);
					$('.clickEquipBag').bind(clickEventType,equip.clickEquipBag);
				}
			);
		});
		$(document).bind(touchDown,function(e){
			if($(e.target).attr("id")=="wear" || $(e.target).attr("id")=="sail"){
				
			}else{
				$("#sail #wear").unbind(clickEventType);
				equip.hideEquipInfo();
			}
		});
	},
	hideEquipInfo:function(event){
		if(event){
			var srcObj=event.target||event.srcElement;
			if($(srcObj).parents("#equip_showwin").length<=0){
				$("#equip_showwin").remove();
				$(document).unbind(touchDown,equip.hideEquipInfo);//在弹窗外点击删除弹窗
			}
			if($(srcObj).parents("#equip_showwin").length<=0){
				$("#equip_showwin").remove();
				$(document).unbind(touchDown,equip.hideEquipInfo);//在弹窗外点击删除弹窗
			}
		}
		else{
			$("#equip_showwin,#equip_showerji,.pubPop").remove();
			$(document).unbind(clickEventType,equip.hideEquipInfo);
		}
		$(document).unbind(touchDown);
	}
}

var jiaoQie={
	data:null,
	mc:false,
	setCache:function(data){
		jiaoQie.data=data;
	},
	clearCache:function(){
		jiaoQie.data=null;
	},
	tabChanged:function(nid){
		jiaoQie.show(nid);
	},
	show:function(nid){
		var nlData=nrData=1;
		var left = '',right='',top='',bottom='',equipJson='';
		var jiaoQieHtml='';
		$('#WJequipList').remove();
		$('#wearList').remove();
		$('#wuJiao').append('<div class="zhuangBr fl" style="width:428px;height:425px;" id="WJjiaoqieList" ></div>');
		$('#wuJiao').before('<div class="zhuangBN fl bors10"  id="wearJiaoqie"  style="width:420px;height:425px;"></div>');
		$("#wearJiaoqie").setSlider({row:1,col:1,multiPage:true,onPageChange:jiaoQie.JQ_list});
		$("#WJjiaoqieList").setSlider({row:4,col:4});
		$.getJN("http://" + host + "/sgg/i/bag/j.php", {
			uid : userId,
			nid : wuJiang.nid,
			left:nlData,
			right:nrData
		},function(data) {
			var vip = $('#btn_vip').attr("vip_lv");
			$('#WJjiaoqieList').removeAllItem();
			$('#wearList').removeAllItem();
			if(data.jlist){
				for(key in data.jlist){
					equipJson = JSON.stringify(data.jlist[key]);
					$('#WJjiaoqieList').addSliderItem("<div><div class='zhuPub clickBagJiaoQie' equip_level='"+data['jlist'][key]['level']+"' eid='"+data['jlist'][key]['eid']+"' equip_att='"+equipJson+"' equip_name='"+data['jlist'][key]['name']+"' equip_img='"+data['jlist'][key]['img']+"' takeL='"+data['jlist'][key]['takeL']+"'><img src='image/game/"+data['jlist'][key]['img']+"' /><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data['jlist'][key]['level']+"</p></div></div>");
				}
			}
			/*武将左侧信息分为上下2部分 top bottom top部分又分为左右两部分 left right*/
			//武将上面左侧信息
			left = "<div class='zhuangBH'>";
			if(data.nlist){
				for(key in data.nlist){
					if(data['nlist'][key]['id'] == wuJiang.nid){
						left += "<dl class='zhaoList zL"+data.npc['class']+" fl'>";
						left += "<dt class='zhaoListT'>"+data.npc.level+"</dt>";
						left += "<dd><img width=163 height=163 src='image/game/"+data.npc.img+"' /></dd>";
						left += "<dd class='zhaoStar'>";
						for(var j=0;j<data.npc.star;j++){
							left += "<img src='image/sys/zStar.png'>";
						}
						left +=	"</dd>";
						left += "<dd class='wjName'>"+data.npc.name+"</dd>";
						left += "</dl>";
						right = "<div class='zBTl fl'>";
						if(data.jq && data.jq.part_6){
							equipJson = JSON.stringify(data.jq.part_6);
							right += "<div class='zBgz1 clickWearJiaoqie' takeL='"+data.jq.part_6.takeL+"' equip_att='"+equipJson+"' equip_level='"+data.jq.part_6.level+"' takeL='"+data.jq.part_6.takel+"' equip_img='"+data.jq.part_6.img+"' equip_name='"+data.jq.part_6.name+"' eid='"+data.jq.part_6.eid+"'><img src='image/game/"+data.jq.part_6.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.jq.part_6.level+"</p></div>";
						}else{
							right += "<div class='zBgz5'></div>";
						}
						if(data.jq && data.jq.part_7){
							equipJson = JSON.stringify(data.jq.part_7);
							right += "<div class='zBgz2 clickWearJiaoqie clickWearJiaoqie' takeL='"+data.jq.part_7.takeL+"'  equip_att='"+equipJson+"' equip_level='"+data.jq.part_7.level+"' takeL='"+data.jq.part_7.takel+"' equip_img='"+data.jq.part_7.img+"' equip_name='"+data.jq.part_7.name+"' eid='"+data.jq.part_7.eid+"'><img src='image/game/"+data.jq.part_7.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.jq.part_7.level+"</p></div>";
						}else{
							if(vip>=3){
								right += "<div class='zBgz5'></div>";
							}else{
								right += "<div class='zBgz8'></div>";
							}
							
						}
						wuJiang.nid = data.npc.nid;
						if(data.jq && data.jq.part_8){
							equipJson = JSON.stringify(data.jq.part_8);
							right += "<div class='zBgz3 clickWearJiaoqie' takeL='"+data.jq.part_8.takeL+"'  equip_att='"+equipJson+"' equip_level='"+data.jq.part_8.level+"' takeL='"+data.jq.part_8.takel+"' equip_img='"+data.jq.part_8.img+"' equip_name='"+data.jq.part_8.name+"' eid='"+data.jq.part_8.eid+"'><img src='image/game/"+data.jq.part_8.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.jq.part_8.level+"</p></div>";
						}else{
							if(vip>=5){
								right += "<div class='zBgz5'></div>";
							}else{
								right += "<div class='zBgz7'></div>";
							}
						}
						right += "<div class='zBgz6'></div></div></div>";
						bottom = "<p class='clear'></p>";
						bottom += '<div class="zhuangBb bors5 fs22 ls1">';
						bottom += '<ul class="w191 fl">';
						bottom += '<li id="liliang"><span>力量：</span>'+data.npc.str+'</li>';
						bottom += '<li id="zhili"><span>智力：</span>'+data.npc.inte+'</li>';
						bottom += '<li id="hp"><span>生命：</span>'+data.npc.hp+'</li>';
						bottom += '<li id="skill_name"><span>技能：</span>'+data.npc.skname+'</li>';
						bottom += '</ul>';
						bottom += '<ul class="w165 fl">';
						if(data['nlist'][key]['ty']==1){
							bottom += '<li id="phy_att"><span>物理攻击：</span>'+data.npc.phy_att+'</li>';
						}else if(data['nlist'][key]['ty']==2){
							bottom += '<li id="mag_att"><span>法术攻击：</span>'+data.npc.mag_att+'</li>';
						}
						bottom += '<li id="phy_def"><span>物理防御：</span>'+data.npc.phy_def+'</li>';
						bottom += '<li id="mag_def"><span>法术防御：</span>'+data.npc.mag_def+'</li>';
						bottom += '<li id="speed"><span>速度：</span>'+data.npc.speed+'</li>';
						bottom += '</ul>';
						bottom += '</div>';
						$('#wearJiaoqie').addSliderItem("<div type='"+data['nlist'][key]['ty']+"' class='wj_list_css' nid='"+data.npc.nid+"'>"+left+right+bottom+"</div>");
						$("#wearJiaoqie").goToLastPage();
						$('.clickBagJiaoQie').bind(clickEventType,jiaoQie.clickBagJiaoQie);
						$('.clickWearJiaoqie').bind(clickEventType,jiaoQie.clickWearJiaoqie);
					}else{
						var templateHtml = '';
						templateHtml = "<div class='zhuangBH'>";
						templateHtml += "<dl class='zhaoList fl'>";
						templateHtml +=	"<dt class='zhaoListT' id='npcLevel'></dt>";
						templateHtml += "<dd id='npcImg'></dd>";
						templateHtml += "<dd class='zhaoStar' id='classStar'></dd>";
						templateHtml += "<dd class='wjName' id='npcName'></dd>";
						templateHtml += "</dl>";
						templateHtml += "<div class='zBTl fl'>";
						templateHtml += "</div>";
						templateHtml += "</div><p class='clear'></p>";
						templateHtml += "<div class='zhuangBb bors5 fs22 ls1'>";
						templateHtml += "<ul class='w191 fl'>";
						templateHtml += "<li id='liliang'></li><li id='zhili'></li><li id='hp'></li><li id='skill_name'></li>";
						templateHtml += "</ul>";
						templateHtml += "<ul class='w165 fl'>";
						templateHtml += "<li id='phy_def'></li><li id='mag_def'></li><li id='speed'></li>";
						templateHtml += "</ul>";
						templateHtml += "</div>";
						$('#wearJiaoqie').addSliderItem("<div class='wj_list_css' type='"+data['nlist'][key]['ty']+"' nid='"+data.nlist[key]['id']+"'>"+templateHtml+"</div>");
					}
				}
			}
		});
	},
	JQ_list:function(){
		var nlData=nrData=1;
		var left = '',right='',top='',bottom='',bottom1='',equipJson='';
		var JQ_nid = $("#wearJiaoqie").currentPage().find(".wj_list_css").attr('nid');
		var wjType = $("#wearJiaoqie").currentPage().find(".wj_list_css").attr('type');
		$.getJN("http://" + host + "/sgg/i/bag/j.php", {
			uid : userId,
			nid : JQ_nid,
			left:nlData,
			right:nrData
		},function(data) {
			var vip = $('#btn_vip').attr("vip_lv");
			if(data.jq && data.jq.part_6){
				equipJson = JSON.stringify(data.jq.part_6);
				left += "<div class='zBgz1 clickWearJiaoqie' takeL='"+data.jq.part_6.takeL+"' equip_att='"+equipJson+"' equip_level='"+data.jq.part_6.level+"' takeL='"+data.jq.part_6.takel+"' equip_img='"+data.jq.part_6.img+"' equip_name='"+data.jq.part_6.name+"' eid='"+data.jq.part_6.eid+"'><img src='image/game/"+data.jq.part_6.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.jq.part_6.level+"</p></div>";
			}
			else{
				left += "<div class='zBgz5'></div>";
			}
			
			if(data.jq && data.jq.part_7){
				equipJson = JSON.stringify(data.jq.part_7);
				left += "<div class='zBgz2 clickWearJiaoqie clickWearJiaoqie' takeL='"+data.jq.part_7.takeL+"'  equip_att='"+equipJson+"' equip_level='"+data.jq.part_7.level+"' takeL='"+data.jq.part_7.takel+"' equip_img='"+data.jq.part_7.img+"' equip_name='"+data.jq.part_7.name+"' eid='"+data.jq.part_7.eid+"'><img src='image/game/"+data.jq.part_7.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.jq.part_7.level+"</p></div>";
			}else{
				if(vip>=3){
					left += "<div class='zBgz5'></div>";
				}else{
					left += "<div class='zBgz8'></div>";
				}
			}
			wuJiang.nid = data.npc.nid;
			center = publicFunction.starNum(data.npc.can, data['npc']['class']);
			if(data.jq && data.jq.part_8){
				equipJson = JSON.stringify(data.jq.part_8);
				left += "<div class='zBgz3 clickWearJiaoqie' takeL='"+data.jq.part_8.takeL+"'  equip_att='"+equipJson+"' equip_level='"+data.jq.part_8.level+"' takeL='"+data.jq.part_8.takel+"' equip_img='"+data.jq.part_8.img+"' equip_name='"+data.jq.part_8.name+"' eid='"+data.jq.part_8.eid+"'><img src='image/game/"+data.jq.part_8.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.jq.part_8.level+"</p></div>";
			}else{
				if(vip>=5){
					left += "<div class='zBgz5'></div>";
				}else{
					left += "<div class='zBgz7'></div>";
				}
			}
			left += "<div class='zBgz6'></div>";

			bottom += '<li id="liliang"><span>力量：</span>'+data.npc.str+'</li>';
			bottom += '<li id="zhili"><span>智力：</span>'+data.npc.inte+'</li>';
			bottom += '<li id="hp"><span>生命：</span>'+data.npc.hp+'</li>';
			bottom += '<li id="skill_name"><span>技能：</span>'+data.npc.skname+'</li>';
			if(wjType==1){
				bottom1 += '<li id="phy_att"><span>物理攻击：</span>'+data.npc.phy_att+'</li>';
			}else if(wjType==2){
				bottom1 += '<li id="mag_att"><span>法术攻击：</span>'+data.npc.mag_att+'</li>';
			}
			bottom1 += '<li id="phy_def"><span>物理防御：</span>'+data.npc.phy_def+'</li>';
			bottom1 += '<li id="mag_def"><span>法术防御：</span>'+data.npc.mag_def+'</li>';
			bottom1 += '<li id="speed"><span>速度：</span>'+data.npc.speed+'</li>';
			$("#wearJiaoqie").currentPage().find(".zBTl").empty();
			$("#wearJiaoqie").currentPage().find(".zBTl").append(left);
			$("#wearJiaoqie").currentPage().find(".w191").empty();
			$("#wearJiaoqie").currentPage().find(".w191").append(bottom);
			$("#wearJiaoqie").currentPage().find(".w165").empty();
			$("#wearJiaoqie").currentPage().find(".w165").append(bottom1);
			$("#wearJiaoqie").currentPage().find(".zhaoList").addClass("zL"+data.npc['class']);
			$("#wearJiaoqie").currentPage().find("#npcLevel").text(data.npc.level);
			$("#wearJiaoqie").currentPage().find("#npcImg").empty();
			$("#wearJiaoqie").currentPage().find("#npcImg").append("<img width=163 height=163 src='image/game/"+data.npc.img+"' />");
			$("#wearJiaoqie").currentPage().find("#classStar").empty();
			$("#wearJiaoqie").currentPage().find("#classStar").append(publicFunction.starNum(data.npc.can, data['npc']['class']));
			$("#wearJiaoqie").currentPage().find("#npcName").text(data.npc.name);
			$('.clickBagJiaoQie').unbind(clickEventType);
			$('.clickWearJiaoqie').unbind(clickEventType);
			$('.clickBagJiaoQie').bind(clickEventType,jiaoQie.clickBagJiaoQie);
			$('.clickWearJiaoqie').bind(clickEventType,jiaoQie.clickWearJiaoqie);
		});
	},
	clickWearJiaoqie:function(){  //卸下穿戴的娇妾装备
		$(".pubPop").remove();
		var BagHtml=$($("#equip_show_tmpl").html());
		var TakeL = $(this).attr("takeL");
		var eid=$(this).attr("eid");
		var equip_img = $(this).attr("equip_img");
		var equip_name = $(this).attr("equip_name");
		var equip_att = $(this).attr("equip_att");
		var equip_level = $(this).attr("equip_level");
		var temp = equip_att;
		var _this=$(this);
		equip_att = JSON.parse(equip_att);
		equip_att = roleAttr.translateAttr(equip_att);
		BagHtml.find('#equip_name').text(equip_name);
		BagHtml.find('#equip_level').text(equip_level);
		BagHtml.find('#equip_img').attr("src",'image/game/'+equip_img);
		BagHtml.find('#allow_equip_level').text("穿戴等级："+TakeL);
		BagHtml.find('#wear').text("卸下");
		BagHtml.find('#sail').text("关闭");
		BagHtml.find('#price').hide();
		BagHtml.find('#wearPosition').hide();
		$.each(equip_att,function(i,item){
			BagHtml.find('#att').empty();
			BagHtml.find('#att').html(item.n+":<span class='cor96'>"+item.v+"</span>");
		});
		$("#oneWJWindow").append(BagHtml);
		$('#sail').bind(clickEventType,function(){
			$(".pubPop").remove();
		});
		var left = '',bottom1='',bottom='',equipJson='';
		$('#wear').bind(clickEventType,function(){
			//防止网速慢刷装备
			if(equip.status==false)
			{
				equip.status=true;
			}else{
				return false;
			}
			 $.getJN(
				"http://" + host + "/sgg/i/npc/h.php", 
				{uid:userId,nid:wuJiang.nid,part:6,eid:eid,untake:1},
				function(data){
					_this.empty();
					$('#WJjiaoqieList').removeAllItem();
					if(data.jlist){
						$.each(data.jlist,function(index,item){
							equipJson = JSON.stringify(item);
							$('#WJjiaoqieList').addSliderItem("<div><div class='zhuPub clickBagJiaoQie' equip_level='"+item.level+"' eid='"+item.eid+"' equip_att='"+equipJson+"' equip_name='"+item.name+"' equip_img='"+item.img+"' takeL='"+item.takeL+"'><img src='image/game/"+item.img+"' /><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+item.level+"</p></div></div>");
						});
					}
					var vip = $('#btn_vip').attr("vip_lv");
					if(data.jq && data.jq.part_6){
						equipJson = JSON.stringify(data.jq.part_6);
						left += "<div class='zBgz1 clickWearJiaoqie' takeL='"+data.jq.part_6.takeL+"' equip_att='"+equipJson+"' equip_level='"+data.jq.part_6.level+"' takeL='"+data.jq.part_6.takel+"' equip_img='"+data.jq.part_6.img+"' equip_name='"+data.jq.part_6.name+"' eid='"+data.jq.part_6.eid+"'><img src='image/game/"+data.jq.part_6.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.jq.part_6.level+"</p></div>";
					}
					else{
						left += "<div class='zBgz5'></div>";
					}
					
					if(data.jq && data.jq.part_7){
						equipJson = JSON.stringify(data.jq.part_7);
						left += "<div class='zBgz2 clickWearJiaoqie clickWearJiaoqie' takeL='"+data.jq.part_7.takeL+"'  equip_att='"+equipJson+"' equip_level='"+data.jq.part_7.level+"' takeL='"+data.jq.part_7.takel+"' equip_img='"+data.jq.part_7.img+"' equip_name='"+data.jq.part_7.name+"' eid='"+data.jq.part_7.eid+"'><img src='image/game/"+data.jq.part_7.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.jq.part_7.level+"</p></div>";
					}else{
						if(vip>=3){
							left += "<div class='zBgz5'></div>";
						}else{
							left += "<div class='zBgz8'></div>";
						}
						
					}
					wuJiang.nid = data.npc.nid;
					center = publicFunction.starNum(data.npc.can, data['npc']['class']);
					if(data.jq && data.jq.part_8){
						equipJson = JSON.stringify(data.jq.part_8);
						left += "<div class='zBgz3 clickWearJiaoqie' takeL='"+data.jq.part_8.takeL+"'  equip_att='"+equipJson+"' equip_level='"+data.jq.part_8.level+"' takeL='"+data.jq.part_8.takel+"' equip_img='"+data.jq.part_8.img+"' equip_name='"+data.jq.part_8.name+"' eid='"+data.jq.part_8.eid+"'><img src='image/game/"+data.jq.part_8.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.jq.part_8.level+"</p></div>";
					}else{
						if(vip>=5){
							left += "<div class='zBgz5'></div>";
						}else{
							left += "<div class='zBgz7'></div>";
						}
					}
					left += "<div class='zBgz6'></div>";

					bottom += '<li id="liliang"><span>力量：</span>'+data.npc.str+'</li>';
					bottom += '<li id="zhili"><span>智力：</span>'+data.npc.inte+'</li>';
					bottom += '<li id="hp"><span>生命：</span>'+data.npc.hp+'</li>';
					bottom += '<li id="skill_name"><span>技能：</span>'+data.npc.skname+'</li>';
					if(data.npc.phy_att){
						bottom1 += '<li id="phy_att"><span>物理攻击：</span>'+data.npc.phy_att+'</li>';
					}else if(data.npc.mag_att){
						bottom1 += '<li id="mag_att"><span>法术攻击：</span>'+data.npc.mag_att+'</li>';
					}
					bottom1 += '<li id="phy_def"><span>物理防御：</span>'+data.npc.phy_def+'</li>';
					bottom1 += '<li id="mag_def"><span>法术防御：</span>'+data.npc.mag_def+'</li>';
					bottom1 += '<li id="speed"><span>速度：</span>'+data.npc.speed+'</li>';
					$("#wearJiaoqie").currentPage().find(".zBTl").empty();
					$("#wearJiaoqie").currentPage().find(".zBTl").append(left);
					$("#wearJiaoqie").currentPage().find(".w191").empty();
					$("#wearJiaoqie").currentPage().find(".w191").append(bottom);
					$("#wearJiaoqie").currentPage().find(".w165").empty();
					$("#wearJiaoqie").currentPage().find(".w165").append(bottom1);
					$("#wearJiaoqie").currentPage().find("#npcLevel").text(data.npc.level);
					$("#wearJiaoqie").currentPage().find("#npcImg").empty();
					$("#wearJiaoqie").currentPage().find("#npcImg").append("<img width=163 height=163 src='image/game/"+data.npc.img+"' />");
					$("#wearJiaoqie").currentPage().find("#classStar").empty();
					$("#wearJiaoqie").currentPage().find("#classStar").append(publicFunction.starNum(data.npc.can, data['npc']['class']));
					$("#wearJiaoqie").currentPage().find("#npcName").text(data.npc.name);
					$(".pubPop").remove()
					equip.status=false;
					$('.clickBagJiaoQie').unbind(clickEventType);
					$('.clickWearJiaoqie').unbind(clickEventType);
					$('.clickBagJiaoQie').bind(clickEventType,jiaoQie.clickBagJiaoQie);
					$('.clickWearJiaoqie').bind(clickEventType,jiaoQie.clickWearJiaoqie);
				}
			);
		});
		$(document).bind(touchDown,function(e){
			if($(e.target).attr("id")=="wear" || $(e.target).attr("id")=="sail"){
				
			}else{
				$("#wear #sail").unbind(clickEventType);
				equip.hideEquipInfo();
			}
			
		});
	},
	clickBagJiaoQie:function(){ //点击娇妾背包
		if(!Slider.checkTouchAvailabel(this)){//滑动当中不允许点击
			return;
		}
		$(".pubPop").remove();
		var BagHtml=$($("#equip_show_tmpl").html());
		var TakeL = $(this).attr("takeL");
		var eid=$(this).attr("eid");
		var equip_img = $(this).attr("equip_img");
		var equip_name = $(this).attr("equip_name");
		var equip_att = $(this).attr("equip_att");
		var equip_level = $(this).attr("equip_level");
		var temp = equip_att;
		equip_att = JSON.parse(equip_att);
		equip_att = roleAttr.translateAttr(equip_att);
		BagHtml.find('#equip_name').text(equip_name);
		BagHtml.find('#equip_level').text(equip_level);
		BagHtml.find('#equip_img').attr("src",'image/game/'+equip_img);
		BagHtml.find('#allow_equip_level').text("穿戴等级："+TakeL);
		BagHtml.find('#sail').text("关闭");
		BagHtml.find('#price').hide();
		BagHtml.find('#wearPosition').hide();
		$.each(equip_att,function(i,item){
			BagHtml.find('#att').empty();
			BagHtml.find('#att').html(item.n+":<span class='cor96'>"+item.v+"</span>");
		});
		$("#oneWJWindow").append(BagHtml);
		
		$('#sail').bind(clickEventType,function(){
			$(".pubPop").remove();
		});
		$('#wear').bind(clickEventType,function(){
			//防止网速慢刷装备
			if(equip.status==false)
			{
				equip.status=true;
			}else{
				return false;
			}
			var left='',bottom1='',bottom='';
			$.getJN(
				"http://" + host + "/sgg/i/npc/h.php", 
				{uid:userId,nid:wuJiang.nid,part:6,eid:eid,untake:0},
				function(data){
					$('#WJjiaoqieList').removeAllItem();
					if(data.jlist){
						//$('#WJjiaoqieList').removeAllItem();
						$.each(data.jlist,function(index,item){
							equipJson = JSON.stringify(item);
							$('#WJjiaoqieList').addSliderItem("<div><div class='zhuPub clickBagJiaoQie' equip_level='"+item.level+"' eid='"+item.eid+"' equip_att='"+equipJson+"' equip_name='"+item.name+"' equip_img='"+item.img+"' takeL='"+item.takeL+"'><img src='image/game/"+item.img+"' /><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+item.level+"</p></div></div>");
						});
					}
					var vip = $('#btn_vip').attr("vip_lv");
					if(data.jq && data.jq.part_6){
						equipJson = JSON.stringify(data.jq.part_6);
						left += "<div class='zBgz1 clickWearJiaoqie' takeL='"+data.jq.part_6.takeL+"' equip_att='"+equipJson+"' equip_level='"+data.jq.part_6.level+"' takeL='"+data.jq.part_6.takel+"' equip_img='"+data.jq.part_6.img+"' equip_name='"+data.jq.part_6.name+"' eid='"+data.jq.part_6.eid+"'><img src='image/game/"+data.jq.part_6.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.jq.part_6.level+"</p></div>";
					}
					else{
						left += "<div class='zBgz5'></div>";
					}
					
					if(data.jq && data.jq.part_7){
						equipJson = JSON.stringify(data.jq.part_7);
						left += "<div class='zBgz2 clickWearJiaoqie clickWearJiaoqie' takeL='"+data.jq.part_7.takeL+"'  equip_att='"+equipJson+"' equip_level='"+data.jq.part_7.level+"' takeL='"+data.jq.part_7.takel+"' equip_img='"+data.jq.part_7.img+"' equip_name='"+data.jq.part_7.name+"' eid='"+data.jq.part_7.eid+"'><img src='image/game/"+data.jq.part_7.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.jq.part_7.level+"</p></div>";
					}else{
						if(vip>=3){
							left += "<div class='zBgz5'></div>";
						}else{
							left += "<div class='zBgz8'></div>";
						}
						
					}
					wuJiang.nid = data.npc.nid;
					center = publicFunction.starNum(data.npc.can, data['npc']['class']);
					if(data.jq && data.jq.part_8){
						equipJson = JSON.stringify(data.jq.part_8);
						left += "<div class='zBgz3 clickWearJiaoqie' takeL='"+data.jq.part_8.takeL+"'  equip_att='"+equipJson+"' equip_level='"+data.jq.part_8.level+"' takeL='"+data.jq.part_8.takel+"' equip_img='"+data.jq.part_8.img+"' equip_name='"+data.jq.part_8.name+"' eid='"+data.jq.part_8.eid+"'><img src='image/game/"+data.jq.part_8.img+"'><p class='pub_jb1'><img src='image/sys/pub_jb.png'></p><p class='xnum1'>"+data.jq.part_8.level+"</p></div>";
					}else{
						if(vip>=5){
							left += "<div class='zBgz5'></div>";
						}else{
							left += "<div class='zBgz7'></div>";
						}
					}
					left += "<div class='zBgz6'></div>";

					bottom += '<li id="liliang"><span>力量：</span>'+data.npc.str+'</li>';
					bottom += '<li id="zhili"><span>智力：</span>'+data.npc.inte+'</li>';
					bottom += '<li id="hp"><span>生命：</span>'+data.npc.hp+'</li>';
					bottom += '<li id="skill_name"><span>技能：</span>'+data.npc.skname+'</li>';
					if(data.npc.phy_att){
						bottom1 += '<li id="phy_att"><span>物理攻击：</span>'+data.npc.phy_att+'</li>';
					}else if(data.npc.mag_att){
						bottom1 += '<li id="mag_att"><span>法术攻击：</span>'+data.npc.mag_att+'</li>';
					}
					bottom1 += '<li id="phy_def"><span>物理防御：</span>'+data.npc.phy_def+'</li>';
					bottom1 += '<li id="mag_def"><span>法术防御：</span>'+data.npc.mag_def+'</li>';
					bottom1 += '<li id="speed"><span>速度：</span>'+data.npc.speed+'</li>';
					$("#wearJiaoqie").currentPage().find(".zBTl").empty();
					$("#wearJiaoqie").currentPage().find(".zBTl").append(left);
					$("#wearJiaoqie").currentPage().find(".w191").empty();
					$("#wearJiaoqie").currentPage().find(".w191").append(bottom);
					$("#wearJiaoqie").currentPage().find(".w165").empty();
					$("#wearJiaoqie").currentPage().find(".w165").append(bottom1);
					$("#wearJiaoqie").currentPage().find("#npcLevel").text(data.npc.level);
					$("#wearJiaoqie").currentPage().find("#npcImg").empty();
					$("#wearJiaoqie").currentPage().find("#npcImg").append("<img width=163 height=163 src='image/game/"+data.npc.img+"' />");
					$("#wearJiaoqie").currentPage().find("#classStar").empty();
					$("#wearJiaoqie").currentPage().find("#classStar").append(publicFunction.starNum(data.npc.can, data['npc']['class']));
					$("#wearJiaoqie").currentPage().find("#npcName").text(data.npc.name);
					$(".pubPop").remove()
					equip.status=false;
					$('.clickBagJiaoQie').unbind(clickEventType);
					$('.clickWearJiaoqie').unbind(clickEventType);
					$('.clickBagJiaoQie').bind(clickEventType,jiaoQie.clickBagJiaoQie);
					$('.clickWearJiaoqie').bind(clickEventType,jiaoQie.clickWearJiaoqie);
				}
			);
		});
		$(document).bind(touchDown,function(e){
			if($(e.target).attr("id")=="wear" || $(e.target).attr("id")=="sail"){
				
			}else{
				$("#wear #sail").unbind(clickEventType);
				equip.hideEquipInfo();
			}
			
		});
	}
}

var bagFB={
	data:null,
	setCache:function(data){
		bagFB.data=data;
	},
	clearCache:function(){
		bagFB.data=null;
	},
	tabChanged:function(nid){
		wuJiang.updateWjChangedCallBack(bagFB.show);
		bagFB.show(nid);
	},
	show:function(nid){
		var nlData=nrData=1;
		if(nid==undefined){
			nlData=0;
			nid=wuJiang.getLeftCurrentWjID();
			currentPage=wuJiang.getLeftCurrentWjPage();
			wuJiang.setWJFBData(currentPage,currentPage.data("data"));
		}
		if(bagFB.data!=null){//从缓存中取
			var data=bagFB.data;
			var bagFBObj=bagFB.setData(data);
			$("#wjOperate").find(".requiR").remove();
			$("#wjOperate").append(bagFBObj);
			nrData=0;
		}
		if(nlData||nrData){//从网络中取
			$.getJN("http://" + host + "/sgg/i/bag/f.php", {
				uid : userId,
				nid : nid,
				left:nlData,
				right:nrData
			}, function(data) {
				data=data||{};
				if(nlData&&data.npc){
					var wjObj=wuJiang.loadOneWJInfo(data,bagFB.show,null,wuJiang.setWJFBData);
					if(wjObj){
						$("#wjOperate").find("#requiNav").next().after(wjObj);
					}
				}
				if(nrData){
					data.flist=data.flist||[];
					var fbObj=bagFB.setData(data.flist);
					bagFB.setCache(data.flist);
					$("#wjOperate").find(".requiR").remove();
					$("#wjOperate").append(fbObj);
				}
			});
		}
	},
	setData:function(data){
		var equipObj=$($("#equip_tmpl").html());
		var equipListCon=equipObj.find("#wjequip_list");
		equipListCon.setSlider({row:4,col:4});
		if(data){
			for(key in data){
				/*
				var item=$('<div class="pubBox pre"><img src="'+imgfolder+data[key].img+'" /><p class="pubJb fs18 cor55 tc"><img src="image/sys/pub_jb.png"/><span>'+data[key].level+'</span></p></div>');
				item.data("data",data[key]);
				item.data("key",key);
				equipListCon.addSliderItem(item);*/
				if(data[key]){
					var item=bagFB.setOneData(data[key],key);
					equipListCon.addSliderItem(item);
				}
			}
		}
		//equipListCon.find("div.pubBox").bind(clickEventType,equip.clickEquipList);
		equipListCon.autoFillItem('<div class="pubBox"></div>');
		return equipObj;
	},
	setOneData:function(data,key){
		if(data){
			var item=$('<div class="pubBox pre"><img src="'+imgfolder+data.img+'" /><p class="pubJb fs18 cor55 tc"><img src="image/sys/pub_jb.png"/><span>'+data.level+'</span></p></div>');
			item.data("data",data[key]);
			item.data("key",key);
			item.bind(clickEventType,equip.clickEquipList);
			return item;
		}
		else{
			return $('<div class="pubBox pre"></div>');
		}
	}
}
//游戏角色中的各种属性
var roleAttr={
    translateAttr:function(data){
        var ret=[];
        if(data.hp&&parseInt(data.hp)>0)//生命
            ret.push({n:"血上限",v:data.hp});
        if(data.phy_att&&parseInt(data.phy_att)>0)//物理攻击
            ret.push({n:"物理攻击",v:data.phy_att});
        if(data.phy_def&&parseInt(data.phy_def)>0)//物理防御
            ret.push({n:"物理防御",v:data.phy_def});
        if(data.mag_att&&parseInt(data.mag_att)>0)//法术攻击
            ret.push({n:"法术攻击",v:data.mag_att});
        if(data.mag_def&&parseInt(data.mag_def)>0)//法术防御
            ret.push({n:"法术防御",v:data.mag_def});
        if(data.hit&&parseInt(data.hit)>0)//命中
            ret.push({n:"命中",v:data.hit});
        if(data.miss&&parseInt(data.miss)>0)//闪避
            ret.push({n:"闪避",v:data.miss});
        if(data.crit&&parseInt(data.crit)>0)//暴击
            ret.push({n:"暴击",v:data.crit});
        if(data.crit_def&&parseInt(data.crit_def)>0)//抗暴
            ret.push({n:"抗暴",v:data.crit_def});
        if(data.strength&&parseInt(data.strength)>0)//力量
            ret.push({n:"力量",v:data.strength});
        if(data.intelligence&&parseInt(data.intelligence)>0)//智力
            ret.push({n:"智力",v:data.intelligence});
        if(data.speed&&parseInt(data.speed)>0)//速度
            ret.push({n:"速度",v:data.speed});
        return ret;
    }
}
//TODO 镶嵌暂时停用
var xiangqian={
	loadWindow:function(nid,part){
		var xiangqianWin = new mesWindow("xiangqianWin",$("#xiangqian_tmpl").html(),30);
		//设置左侧武将列表格式
		$("#xqWujiangList").setSlider({row:1,col:1,multiPage:true,onPageChange:function(){
			
		}});
		this.getXiangQianInfo(nid);
		//左翻按钮
		$("#xqPageContainer .requiLbl").bind(clickEventType,function(){
			xiangqian.changeNpcList(1);
		});
		//右翻按钮
		$("#xqPageContainer .requiLbr").bind(clickEventType,function(){
			xiangqian.changeNpcList(0);
		});
		
	},
	getXiangQianInfo:function(nid){
		//获取镶嵌页面左侧武将列表
		$.getJN("http://" + host + "/sgg/i/xiangqian/xq.php", {
			uid : userId
		}, function(data) {
			xiangqian.setNpcList(data.nList,nid);
		});
	},
	setNpcList:function(list,nid){  //设置左侧npc列表,并设置显示当前npc
		//插入npc
		for(var key in list){
			var npc = "<div class='npcContainer' npcId='"+key+"'><div class='requiLt'><div class='requiLtl fl'>";
			  if(list[key].part_1){
			      npc+="<div class='pubBox' index='part_1' typeid='"+list[key].part_1.id+"'><img src='image/game/"+list[key].part_1.img+"'><p class='pubJb pab fs18 cor55 tc'>"+list[key].part_1.level+"</p></div>";
			  }else{
			  	  npc+="<div class='pubBox' index='part_1'></div>";
			  }
              if(list[key].part_3){
			      npc+="<div class='pubBox' index='part_3' typeid='"+list[key].part_3.id+"'><img src='image/game/"+list[key].part_3.img+"'><p class='pubJb pab fs18 cor55 tc'>"+list[key].part_3.level+"</p></div></div>";
			  }else{
			  	  npc+="<div class='pubBox' index='part_3'></div></div>";
			  }
              npc+="<div class='requiLtc fl'><p class='fs24'>"+list[key].name+"</p><p class='fs18'>等级"+list[key].level+"级</p><img style='width:179px;height:179px;' src='image/game/"+list[key].img+"' /></div><div class='requiLtl fl'>";
              if(list[key].part_2){
			      npc+="<div class='pubBox pre' index='part_2' typeid='"+list[key].part_2.id+"'><img src='image/game/"+list[key].part_2.img+"'><p class='pubJb pab fs18 cor55 tc'>"+list[key].part_2.level+"</p></div>";
			  }else{
			  	  npc+="<div class='pubBox pre' index='part_2'></div>";
			  }
			  if(list[key].part_4){
			      npc+="<div class='pubBox' index='part_4' typeid='"+list[key].part_4.id+"'><img src='image/game/"+list[key].part_4.img+"'><p class='pubJb pab fs18 cor55 tc'>"+list[key].part_4.level+"</p></div></div>";
			  }else{
			  	  npc+="<div class='pubBox' index='part_4'></div></div>";
			  }
              npc+="</div><p class='clear'></p><div class='zb_blood pre'><div></div><span class='fs16 cor55 pre'>2500000/5000000</span></div>";
              npc+="<ul class='requiLc fs16'><li><img src='image/sys/z.png' /><span>8000</span></li><li><img src='image/sys/l.png' /><span>1000</span></li>";
              npc+="<li><img src='image/sys/s.png' /><span>150000</span></li><li class='cor56'><img src='image/sys/z_n.png' /><span>武圣·千年</span></li></ul></div>";
			$("#xqWujiangList").addSliderItem(npc);
		}
		//设置页码及当前npc
		var allNum = $("#xqWujiangList>div").children().size();
		var currentIndex = $("#xqWujiangList .npcContainer[npcid='"+nid+"']").parent().index();
		$("#xqWujiangList").goToPage(currentIndex);
		$("#xqWujiangIndex").text(currentIndex+1);
		$("#xqWujiangNum").text(allNum);
	},
	changeNpcList:function(left){
		var currentIndex = $("#xqWujiangList").currentPageIndex();
		//左翻
		if(left){
			
		}else{
			
		}
	}	
}
var publicFunction = {
		//获取武将星星个数
		starNum:function(can,classStar){
			var npcClass = {"1":6,"2":6,"3":6,"4":6,"5":6,"6":6,"7":6,"8":5,"9":6,"10":5,"11":6,"12":6,"13":6,"14":6,"15":5,"16":5,"17":5,"18":5};
			var length = '',html='';
			if(can){
				length = npcClass[can];
			}else{
				length = 1;
			}
		    for(var i=0;i<length;i++){
	            if(i<classStar){
	            	html += "<img src='image/sys/zStar.png'>";
	            }else{
	            	html += "<img src='image/sys/zStar1.png'>";
	            }
	        }
		    return html;
		}
}
var bag={
	getPreLoadStaticRes:function(){
		return [
			'image/game/bangbangtang_e.jpg',
			'image/game/baozhu2_p.gif',
			'image/game/baozhu5_p.gif',
			'image/game/baozhu6_p.gif',
			'image/game/baozhu7_p.gif',
			'image/game/brown.jpg',
			'image/game/bu1_p.gif',
			'image/game/bu2_p.gif',
			'image/game/bu3_p.gif',
			'image/game/bu4_p.gif',
			'image/game/bu5_p.gif',
			'image/game/bu6_p.gif',
			'image/game/bu7_p.gif',
			'image/game/dacong_e.jpg',
			'image/game/ding1_p.gif',
			'image/game/ding2_p.gif',
			'image/game/ding4_p.gif',
			'image/game/ding6_p.gif',
			'image/game/ding7_p.gif',
			'image/game/Exp_lcon.png',
			'image/game/gu1_p.gif',
			'image/game/gu2_p.gif',
			'image/game/gu3_p.gif',
			'image/game/gu4_p.gif',
			'image/game/gu5_p.gif',
			'image/game/gu6_p.gif',
			'image/game/gu7_p.gif',
			'image/game/gubang_e.jpg',
			'image/game/heiyuemaozi_e.jpg',
			'image/game/heiyuexiezi_e.jpg',
			'image/game/heiyueyifu_e.jpg',
			'image/game/jiang1_p.gif',
			'image/game/jiang2_p.gif',
			'image/game/jiang3_p.gif',
			'image/game/jiang4_p.gif',
			'image/game/jiang5_p.gif',
			'image/game/jiang6_p.gif',
			'image/game/jiang7_p.gif',
			'image/game/jimaodanzi_e.jpg',
			'image/game/jinbi_lcon.png',
			'image/game/jing1_p.gif',
			'image/game/jing2_p.gif',
			'image/game/jing3_p.gif',
			'image/game/jing4_p.gif',
			'image/game/jing5_p.gif',
			'image/game/jing6_p.gif',
			'image/game/jing7_p.gif',
			'image/game/jingyanka_lcon.png',
			'image/game/lingpai1_p.gif',
			'image/game/lingpai3_p.gif',
			'image/game/lingpai4_p.gif',
			'image/game/lingpai5_p.gif',
			'image/game/lingpai6_p.gif',
			'image/game/lingpai7_p.gif',
			'image/game/lingpai_p2.gif',
			'image/game/maikefeng_e.jpg',
			'image/game/mang1_p.gif',
			'image/game/mang2_p.gif',
			'image/game/mang3_p.gif',
			'image/game/mang4_p.gif',
			'image/game/mang5_p.gif',
			'image/game/mang6_p.gif',
			'image/game/mang7_p.gif',
			'image/game/mingyumaozi_e.jpg',
			'image/game/mingyuxiezi_e.jpg',
			'image/game/mingyuyifu_e.jpg',
			'image/game/peifang_lcon.png',
			'image/game/peifang_p.gif',
			'image/game/pingdiguo_e.jpg',
			'image/game/qiandai_lcon.png',
			'image/game/qiubang_e.jpg',
			'image/game/qixingji_lcon.png',
			'image/game/shenyuanmaozi_e.jpg',
			'image/game/shenyuanxiezi_e.jpg',
			'image/game/shenyuanyifu_e.jpg',
			'image/game/shuzhi_e.jpg',
			'image/game/si1_p.gif',
			'image/game/si2_p.gif',
			'image/game/si3_p.gif',
			'image/game/si4_p.gif',
			'image/game/si6_p.gif',
			'image/game/si7_p.gif',
			'image/game/tangchi_e.jpg',
			'image/game/wugumaozi_e.jpg',
			'image/game/wuguxiezi_e.jpg',
			'image/game/wuguyifu_e.jpg',
			'image/game/xianrenzhang_e.jpg',
			'image/game/xianyu_e.jpg',
			'image/game/xiemuxiezi_e.jpg',
			'image/game/xiemuyifu_e.jpg',
			'image/game/xieshenmaozi_e.jpg',
			'image/game/xieshenxiezi_e.jpg',
			'image/game/xieshenyifu_e.jpg',
			'image/game/yaowenmaozi_e.jpg',
			'image/game/yaowenxiezi_e.jpg',
			'image/game/yaowenyifu_e.jpg',
			'image/game/youlingxiezi_e.jpg',
			'image/game/youlingyifu_e.jpg',
			'image/game/yuanbao_lcon.png',
			'image/game/yuanshen1_p.gif',
			'image/game/yuanshen2_p.gif',
			'image/game/yuanshen3_p.gif',
			'image/game/yuanshen4_p.gif',
			'image/game/yuanshen5_p.gif',
			'image/game/yuanshen6_p.gif',
			'image/game/yuanshen7_p.gif',
			'image/game/yumao1_p.gif',
			'image/game/yumao2_p.gif',
			'image/game/yumao3_p.gif',
			'image/game/yumao4_p.gif',
			'image/game/yumao5_p.gif',
			'image/game/yumao7_p.gif',
			'image/game/zhi1_p.gif',
			'image/game/zhi2_p.gif',
			'image/game/zhi3_p.gif',
			'image/game/zhi4_p.gif',
			'image/game/zhi5_p.gif',
			'image/game/zhi6_p.gif',
			'image/game/zhibi_e.jpg',
			'image/game/zhugun_e.jpg'
		];
	},
	loadWindow:function(){
		//var arr1 = this.getPreLoadStaticRes();
		//ResLoad.resourceLoader(arr1,function(){
			wuJiang.showWJOperation(0,0);
		//},1);
	}
}

/**
 *训练模块
 *by veryszhang
 */
 var XunLian = {
	clickBtnXunlian:function(){   //训练按钮点击事件
		var nid = $(this).parents('.selectNpc').attr("nid");
		var status = $(this).parents('.selectNpc').attr("status");
		if($(this).text()=="训练"&&status=="1"){
			var num_xl = $("#wj_list .selectNpc[status='0']").length;  //当前正在冷却中的个数
			var limit = $("#wjWindow .zhaoM").attr("limit");
			var npcLevel = parseInt($(this).parents('.selectNpc').attr("level"));
			var userLevel = parseInt($("#userLevel").text());
			var vip = parseInt($("#btn_vip").attr("vip_lv"));
			if(npcLevel>=userLevel){
				Common.alert("此武将暂时无法训练，武将等级不能超过主公等级");
				return false;
			}
			if(num_xl>=limit){
				var n_vip = XunLian.nextVipXunlian(vip);
				Common.alert("训练位"+num_xl+"/"+limit+"训练位已满，无法训练，VIP"+n_vip+"可增加1个训练位",3,charge.loadWindow);
				return false;
			}
			XunLian.xunlian(nid);
		}else if($(this).text()=="加速"){
			if(status=="1"){
				return false;
			}
			XunLian.speedUp(nid);
		}
	},
	setNpcCDTime:function(obj,waittime){
		var time = waittime;
		var inter = setInterval(function(){
			if(!$("#wj_list").html()||obj.attr("status")=="1"){  //窗口关闭则时间停
				obj.find(".waittime").text("").attr("time",0);
				clearInterval(inter);
			}
			obj.find(".waittime").text(XunLian.formatTime(time)).attr("time",time);
			time--;
			if(time==0){  //冷却时间到
				clearInterval(inter);
				obj.attr("status","1");
				obj.find(".pub_btn").text("训练");
				obj.find("waittime").empty();
			}
			//log("time interval:"+time);
		},1000);
	},
	formatTime:function(time){  //格式化时间
		var hour = this.setTimeStyle(Math.floor(time/3600));
		var min = this.setTimeStyle(Math.floor((time-parseInt(hour)*3600)/60));
		var sec = this.setTimeStyle(time-parseInt(hour)*3600-parseInt(min)*60);
		return hour+":"+min+":"+sec;
	},
	setTimeStyle:function(num){  //将数字格式化成两位数如0=>00
		if(num>0&&num<10){
			return "0"+num.toString();
		}else if(num==0){
			return "00";
		}else{
			return num.toString();
		}
	},
	xunlian:function(nid){  //训练
		var obj = $("#wj_list .selectNpc[nid='"+nid+"']");
		$.getJN("http://" + host + "/sgg/i/xl/2.php", {
			uid : userId,
			nid:nid
		}, function(data) {
			if(data.re==1){
				obj.attr("status","0");
				obj.attr("level",data.npc.level);
				obj.find(".zhaoListT").text(data.npc.level);
				obj.find(".pub_btn").text("加速");
				var exp = $("<span class='xl_exp'>EXP+"+data.exp+"</span>");
				obj.append(exp);
				exp.animate({top:-300,opacity:0},2000);
				setTimeout(function(){
					exp.remove();
				},2000);
				XunLian.setNpcCDTime(obj,180*60);
			}
		});
	},
	speedUp:function(nid){  //加速
		var that = this;
		var obj = $("#wj_list .selectNpc[nid='"+nid+"']");
		var time = parseInt(obj.find(".waittime").attr("time"));
		var payYb = Math.ceil(((time/60)/3)+1);  //加速所需的元宝
		Common.alert("确定消费"+payYb+"元宝清除冷却时间？",1,function(){
			$.getJN("http://" + host + "/sgg/i/xl/3.php", {
				uid : userId,
				nid:nid
			}, function(data) {
				if(data.re==1){
					obj.attr("status","1");
					setTimeout(function(){
						obj.find(".waittime").text("").attr("time",0);
					},2000);
					obj.find(".pub_btn").text("训练");
				}else if(data.re==0){
					Common.alert("元宝不足,无法清除冷却时间",2,charge.loadWindow);
				}
			});
		});
	},
	nextVipXunlian:function(userVip){  //返回添加一个 训练位的VIP
		var vip = {0:2,1:2,2:4,3:4,4:6,5:6,6:8,7:8,8:10,9:10,10:10};
		return vip[userVip];
	}
 }
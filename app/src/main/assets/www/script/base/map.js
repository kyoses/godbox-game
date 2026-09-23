var map={
	cPage:0,
	mPage:0,
	loadedLen:0,
	mapIcons: null,
	mapImage:null,
    mpage: 0,
	type:0,
	max:0,
	getPreLoadStaticRes:function(){//模块静态资源
		var res=[
			'image/game/cheng.png',
			'image/game/chenglou.png',
			'image/game/chuan.png',
			'image/game/qiao.png',
			'image/game/shan.png',
			'image/game/shulin.png',
			'image/game/shulin2.png',
			'image/game/talou.png',
			'image/game/tan.png'
		];
		return res;
	},
	getMapTitle:function(type){
		if(type==1){
			return "故事";
		}else if(type==2){
			return "精英";
		}else{
			return "盗墓手记";
		}
	}
	,
	loadWindow:function(type){
		map.type=type;
		ResLoad.resourceLoader(map.getPreLoadStaticRes(),function(){
			var mapWindow = new mesWindow("mapWindow", $("#map_tmpl").html());
			map.getCurrentMap(map.type);//加载当前进度page的小图标
	
			$("#map_title").text(map.getMapTitle(type));
		},1);
		
	},
	closeFun:function(){
		map.mapIcons=null;
		map.mapImage=null;
		clearInterval(canvasDom.interval);
	},	
	//得到当前中地图数据
	getCurrentMap:function(type){
		$.getJN("http://" + host + "/sgg/i/map/m1.php", {
		uid : userId,
		type:map.type
		}, function(data) {
			map.addMapIcon(data.map);
		});
	},
	//初始化页码的数量
	initialPager:function(allPage){
		map.cPage=allPage;
		map.mPage=allPage;
		$("#map_pager").text(map.mPage);
		$("#map_chapter").text(map.transferToUpper(map.cPage));//跟新章节标题
	},
	//根据页数得到页的中地图数据
	getMapByPage:function(){
		if(map.cPage>=1&&map.cPage<map.mPage){
			$.getJN("http://" + host + "/sgg/i/map/p.php", {
				uid : userId,
				page : map.cPage
			}, function(data) {
				map.addMapIcon(data.map);
			});
		}
		else if(map.cPage==map.mPage){  //最后一页小地图
			if(map.type==2){  //精英副本
				$.getJN("http://" + host + "/sgg/i/map/m.php", {
					uid : userId,
					type:map.type
				}, function(data) {
					map.addMapIcon(data.map);
				});
			}else if(map.type==1){  //故事模式
				map.getCurrentMap(map.type);
			}
			
		}
	},
	//翻页时调用的方法
	pageChanged:function(){
		$("#map_pager").text(map.cPage);
		$("#map_chapter").text(map.transferToUpper(map.cPage));//跟新章节标题
		if(!map.mapImage[map.cPage]){
			map.getMapByPage();
		}
		if(map.cPage==map.mPage){
			$("#nowProgress").show();
		}
	},
	addMapIcon: function (data) {
		var rate=1.82;
		var pageNum = 0;
		$("#mapContainer").empty();
		$("#mapPage>div").unbind(clickEventType);
		for (key in data) {
			var page = $("<div style='position:absolute;width:873px;height:425px;display:none;'></div>");
			var page_data = data[key];
			for(k in page_data){
				var left = Math.floor(page_data[k].posX*rate);
				var top = Math.floor(page_data[k].posY*rate);
				var img = $("<dl style='position:absolute;display:inline;left:"+left+"px;top:"+top+"px;'><span>"+page_data[k].name+"</span><img class='map_icon' src='image/game/"+page_data[k].img+"'/><img class='mapytg' src='image/sys/ytg1.png'/></dl>")
				img.attr("typeid",page_data[k].id);
				img.bind(clickEventType,function(){
					map.loadSmallMapWindow($(this).attr("typeid"));
				});
				if(page_data[k].st==1){
					img.find(".mapytg").hide();
				}
				
				if(page_data[k-1]){
					var c_pos = {"left":left,"top":top};  //当前图标位置
					var p_pos = {"left":Math.floor(page_data[k-1].posX*rate),"top":Math.floor(page_data[k-1].posY*rate)};   //前一图标位置
					map.setPathforMap(page,c_pos,p_pos);
					
				}
				page.append(img);
			}
			page.attr("page",key);
			$("#mapContainer").append(page);
			pageNum++;
        }
        $("#mapPageNum>span").text(pageNum);
        $("#mapContainer>div").last().show();
        map.checkMapPageNum();
        $("#m_tit").attr("class","mapT"+$("#mapContainer>div").last().attr("page"));
        $("#mapPage>div").bind(clickEventType,function(){
        	var index = $(this).index();
        	var showIndex = $("#mapContainer>div:visible").index();
        	var size = $("#mapContainer>div").length;
        	if((index==0&&showIndex==0)||(index==1&&showIndex==size-1)){
        		return false;
        	}
        	if(index==0){
        		var obj = $("#mapContainer>div:visible");
        		obj.prev().show();
        		obj.prev().siblings().hide();
        		$("#m_tit").attr("class","mapT"+obj.prev().attr("page"));
        	}else{
        		var obj = $("#mapContainer>div:visible");
        		obj.next().show();
        		obj.next().siblings().hide();
        		$("#m_tit").attr("class","mapT"+obj.next().attr("page"));
        	}
        	$("#mapPageNum span").first().text($("#mapContainer>div:visible").index()+1);
        	map.checkMapPageNum();
        });
        //新手用户最早一次进入战斗推图界面
       if(director.progress==14){
    	   director.updateProgress();
       }
    },
    checkMapPageNum:function(){   //如果不能再翻页，则翻页按钮隐藏
    	var num = $("#mapContainer>div").length;
    	var showIndex = $("#mapContainer>div:visible").index();
    	if(showIndex==0){
    		$("#mapPage>div").first().hide();
    	}else{
    		$("#mapPage>div").first().show();
    	}
    	
    	if(showIndex==num-1){
    		$("#mapPage>div:eq(1)").hide();
    	}else{
    		$("#mapPage>div:eq(1)").show();
    	}
    },
	addNewPage:function(){
		map.mPage++;
		map.cPage=map.mPage;
		//重新获取吧
		map.getCurrentMap(map.type);
	},
	//弹出小地图
	loadSmallMapWindow:function(mapID){
		var smapWindow = new mesWindow("smapWindow", $("#smap_tmpl").html());
		//设置不同的背景
		if(map.type==1){
			$("#map_backGround").addClass("map2");
		}
		else if(map.type==2){
			$("#map_backGround").addClass("map");
		}else{
			$("#map_backGround").addClass("map1");
		}
		$("#smallMapPage div").bind(clickEventType,map.smallPageClick);
		map.getSmallMap(mapID);
	},
	smallPageClick:function(){  //小地图页面翻页
		if($(this).attr("data-fx")=="left"){ //点击左侧翻页
			var current = $("#smap_list>div:visible").prev();
			current.siblings().hide();
			current.show();
		}else{
			var current = $("#smap_list>div:visible").next();
			current.siblings().hide();
			current.show();
		}
		map.checkPreNextPage();
	},
	loadSmallMapWindowFromOtherWin:function(mapID,selectedBid,type){
		map.type=type;
		var smapWindow = new mesWindow("smapWindow", $("#smap_tmpl").html());
		$("#map_backGround").addClass("map2");
		$("#smallMapPage div").bind(clickEventType,map.smallPageClick);
		map.getSmallMap(mapID,selectedBid);
	},
	getSmallMap:function(mapID,selectedBid){
		$.getJN("http://" + host + "/sgg/i/map/s.php", {
			uid : userId,
			map_id:mapID,
			type:map.type
		}, function(data){
			$("#smap_title").text(data.omap.name);
			map.addSmallMapList(data.bs,mapID,selectedBid);
			map.showSaoDangMap();
			//director.handDirectFromOtherClass(map);//页面加载和绘制完成进行新手引导或者功能引导处理
		});
	},
	addSmallMapList:function(data,mapID,selectedBid){
		$("#smap_list").empty();
		$("#smap_list").attr("cmap",mapID);
		var num = 0;
		var page_num = 0;
		var page = null;
		for(key in data){
			if(num%10==0||num==0){
				page = $("<div page='"+(Math.ceil(num/10)+1)+"' style='width:873px;height:395px;'></div>");
			}
			if(data[key].st>0){
				var stu = "";
				if(data[key].st==2){
					stu = '<li><img src="image/sys/ytg1.png"/></li>';
				}
				else{
					stu="<li></li>";
				}
				var selectedCSS=(selectedBid&&data[key].id==selectedBid)?"selectedB":"";
				var guanKa = $("<ul stu='"+data[key].st+"' jsonStr='"+JSON.stringify(data[key])+"' class='"+selectedCSS+"'><li><img style=\"margin:-25px 0 0 8px;\" src='"+imgfolder+data[key].img+"' height='128' width='100' /></li>"+stu+"<li class='smap_class'>"+data[key].name+"</li><li class='saodang' style='display:none'></li><li class='zhandou' style='display:none'></li></ul>");
				guanKa.bind(clickEventType,map.clickSmallMap);
			}
			else{
				var selectedCSS=(selectedBid&&data[key].id==selectedBid)?"selectedB":"";
				var guanKa=$('<ul class="'+selectedCSS+'"><li class="mt187"><img src="image/sys/zdt_pic1.png" /></li><li></li><li class="smap_class">未开启</li></ul>');
			}
			page.append(guanKa);
			num++;
			if(num%10==0){
				$("#smap_list").append(page);
				page=null;
			}
			
		}
		if(num%10!=0){
			$("#smap_list").append(page);
		}
//		$("#smap_list").goToLastPage();
		//添加特效提示点击
		if(selectedBid){
			var selectObj = $("#smap_list").find(".selectedB");
			var mapIndex = selectObj.parent().index();
				var selectPage = $("#smap_list>div:eq("+mapIndex+")");
				selectPage.show();
				selectPage.siblings().hide();
			selectObj.append("<img class='mapPointer' src='image/sys/map_arrow.png'/>");
		}else{
			var current = $("#smap_list ul[stu=1]").parent();
			if(!current.html()){
				current = $("#smap_list>div:eq(0)");
			}
			current.show();
			current.siblings().hide();
		}
		
		if(director.progress>0){
			if(director.progress==15){
				director.updateProgress();
			}else if(director.progress==23){
				director.updateProgress();
			}else if(director.progress==29){
				director.updateProgress();
			}
		}else{
            $(document).bind(touchDown,function(e){
//            alert('class:'+$(e.target).attr('class')+'|src:'+$(e.target).attr('src'));
	            if($(e.target).attr('stu') || $(e.target).attr('class') == 'smap_class' || $(e.target).attr('class') == 'saodang' || $(e.target).attr('class') == 'zhandou' || $(e.target).attr('src')){
	                
	            }else{
	            	if(document.getElementById("btnDialogSaodang")){
						$("#btnDialogSaodang").unbind(clickEventType);
					}
					if(document.getElementById("btn_beginBattle")){
						$("#btn_beginBattle").unbind(clickEventType);
					}
	                $("#smap_list").find(".saodang").attr('style', 'display:none');
	                $("#smap_list").find(".saodang").removeAttr('id');
	                $("#smap_list").find(".zhandou").attr('style', 'display:none');
	                $("#smap_list").find(".zhandou").removeAttr('id');
			    }
		     });
		}
		map.checkPreNextPage();
	},
	//小地图分页提示图标检查
	checkPreNextPage:function(){
		var max = $("#smap_list>div").length;
		var index = $("#smap_list>div:visible").index()+1;
		$("#smap_pager").text(index+"/"+max);
		//左翻页按钮是否显示
		if(index==1){
			$("#smallMapPage>.fanyeL").hide();
		}else{
			$("#smallMapPage>.fanyeL").show();
		}
		
		//右按钮是否显示
		if(max>index){
			$("#smallMapPage>.fanyeR").show();
		}else{
			$("#smallMapPage>.fanyeR").hide();
		}
	},
	//精英本和法宝本处理扫荡地图的功能
	showSaoDangMap:function(){
		if(map.type==3){//法宝本
			$("#btnSDMap").show().bind(clickEventType,map.saoDangMapHandler);
		}
		else if(map.type==2){//精英本
			var userVip=parseInt($("#btn_vip").text());
			if(userVip>=2){
				$("#btnSDMap").show().bind(clickEventType,map.saoDangMapHandler);
			}
		}
	},
	saoDangMapHandler:function(){
		var mapID=$("#smap_list").attr("cmap");
		$.getJN("http://" + host + "/sgg/i/fight/t.php", {
			uid : userId,
			map_id:mapID,
			type:map.type
		},
		function(data){
			if(data.st){
				var st=parseInt(data.st);
				if(st==1){
					battle.bid=1;
					if(!data.drop){
						data.drop=new Object();
					}
					battle.showWinWindow(data.drop);
					if(tiLi.nextTime<=0){//扫荡完后体力值，前端开启自动增加功能
						tiLi.startRefresh();
					}
					Buzhen.refreshUserFormation();
				}
				else if(st==2){
					Common.alert("体力不够，请补充<span class='cor95 stro13'>体力</span>",1,UInfo.loadWindow);
				}
				else if(st==3){
					Common.alert("精英本非V及V1用户你不能使用扫荡<span class='cor95 stro13'>功能</span>");
				}
				else if(st==4){
					//Common.alert("没有可以扫荡的战斗或当天此地图所有战斗的<span class='cor95 stro13'>次数已满</span>");
					Common.alert("今日战斗次数已满，提升VIP <span class='cor95 stro13'>可增加次数</span>",3,charge.sub);
				}
				else if(st==10){
					Common.alert("今日战斗次数已满，请明日再来<span class='cor95 stro13'>请明日再来</span>");
				}
				else if(st==5){
					Common.alert("没有可以扫荡<span class='cor95 stro13'>的战斗</span>");
				}
			}
		});
	},
	clickSmallMap:function(){
		if(!Slider.checkTouchAvailabel(this)){//滑动当中不允许点击
			return;
		}
		var myData=$.parseJSON($(this).attr("jsonStr"));
		var bid=myData.id;
		myData.drops=new Object();
		if(myData.hasOwnProperty("drop")){
			for(key in myData.drop){
				if(parseInt(myData.drop[key].r)<100){
					myData.drop[key].v2="(概率)"+myData.drop[key].v;
				}
				switch(parseInt(myData.drop[key].t)){
					case 4:
					if(myData.drop[key].tt<=4){
						myData.drop[key].t="装备";
					}
					else if(myData.drop[key].tt==5){
						myData.drop[key].t="法宝";
					}
					else if(myData.drop[key].tt==6){
						myData.drop[key].t="娇妾";
					}
					break;
					case 5:
					myData.drop[key].t="道具";
					break;
				}
			}
			myData.drops.show="";
		}
		else{
			myData.drops.show="none";
		}
//		var mapWindow = new mesWindow("battlePreWindow", $.tmpl($("#battle_pre").html(),myData).html());
		if(document.getElementById("btnDialogSaodang")){
			$("#btnDialogSaodang").unbind(clickEventType);
		}
		if(document.getElementById("btn_beginBattle")){
			$("#btn_beginBattle").unbind(clickEventType);
		}
        $("#smap_list").find(".saodang").attr('style', 'display:none');
        $("#smap_list").find(".saodang").removeAttr('id');
        $("#smap_list").find(".zhandou").attr('style', 'display:none');
        $("#smap_list").find(".zhandou").removeAttr('id');
        $("#elite_s_list").find(".zhandou").attr('style', 'display:none');
        $("#elite_s_list").find(".zhandou").removeAttr('id');
        $(this).find(".zhandou").fadeIn("3000");
        $(this).find(".zhandou").attr('id', 'btn_beginBattle');
		if(map.type!=0&&map.type!=undefined){//如果是法宝本和精英本不显示扫荡功能
			$("#sd_slidContainer").prev().nextAll().remove();
			$("#battlePreWindow .backPopM").height(300);
		}
		var that = this;
		if(director.progress>0){
			if(director.progress==16){
				director.updateProgress();
			}else if(director.progress==24){
				director.updateProgress();
			}else if(director.progress==30){
				director.updateProgress();
			}
		}
		$("#btn_beginBattle").bind(clickEventType,function(){
			var tili = parseInt($("#nowTL").attr("nowtl"));
			//alert(tili);
			if(tili<1){
         		$.getJSON("http://" + host + "/sgg/i/tili/b.php", 
     				{uid : userId},
     				function (msg){
     					if(msg.re==3){
     						Common.alert("体力已满，无法<span class='cor95 stro13'>补充</span>");
     					}else if(msg.re==4){
     						Common.alert("今日无法补充体力，提升VIP<span class='cor95 stro13'>可增加补充次数</span>",3,charge.loadWindow);
     					}else if(msg.re==5){
     						Common.alert("元宝<span class='cor95 stro13'>不足，无法购买体力！</span>",2,charge.loadWindow);
     					}
     					else{
     						Common.alert("今日第"+msg.x+"次补充体力，花费"+msg.needYB+"元宝，<span class='cor95 stro13'>获得50点体力，每半小时回复1点</span>",1,UInfo.udateTL);
     					}
     				}
         		);
				//Common.alert("体力不够，请补充<span class='cor95 stro13'>体力 </span>",1,UInfo.loadWindow);
				return false;
			}
			
			var userLevel = parseInt($("#userLevel span").text());
			//等级限制
			if(userLevel<parseInt(myData.level)){
				Common.alert("主公等级未达到关卡开放要求，您可以通过任务及<span class='cor95 stro13'>精英劫塔功能升级。 </span>");
				return false;
			}
			var isFirst = ($(that).has(".ytg").html())?true:false;
			//战斗音效
//			var music = document.getElementById("battle_audio");
//			music.play();
			battle.getBattleInfo(bid,isFirst);
			mesWindow.closeWindowById("battlePreWindow");
		});
		if(parseInt(myData.st)==2){//已通时才有扫荡功能
            if (parseInt(map.type) == 1) {
                $(this).find(".saodang").fadeIn("3000");
                $(this).find(".saodang").attr('id', 'btnDialogSaodang');
            }
            $("#btnDialogSaodang").bind(clickEventType,function(){
                var tili = parseInt($("#nowTL").attr("nowtl"));
                if(tili<1){
                   // Common.alert("体力不够，请补充<span class='cor95 stro13'>体力</span>",1,UInfo.loadWindow);
                	map.saoDangHandler(myData.id);
                	return false;
                }
                if($('#btn_vip').text()<1){
                    Common.alert("vip1可使用精英劫塔<span class='cor95 stro13'>扫荡功能</span>",3,charge.sub);
                    return false;
                }
               map.saoDangHandler(myData.id);
            });
		}
		else{//蒙灰按钮
            $("#btnDialogSaodang").unbind(clickEventType);
		}
	},
	saoDangHandler:function(bid){
		var sDWindow = new mesWindow("sDWindow", $("#saodang_tmpl").html());
		$("#dropList").setSlider({row:1,col:1,dir:"top",onMove:map.setSlidBlock});
		$("#sdChoice li").bind(clickEventType,function(){
			$(this).parent().children().removeClass("over");
			$(this).addClass("over");
		});
        $("#sd_max").attr("max", parseInt($("#nowTL").attr("nowtl")));
        map.max = $("#sd_max").attr("max");
        map.saoDangButton();
		$("#beginSD").bind(clickEventType,function(){
			map.commonSaoDand(bid);
		});
	},
	//扫荡加减按钮
	saoDangButton:function(){
	    $("#sd_jian").unbind(clickEventType);
	    $("#sd_jia").unbind(clickEventType);
        if(map.max>1){
        	$("#sd_jia").addClass("hjia");
        }else{
        	$("#sd_jia").addClass("jia");
        }
        $("#sd_jian").bind(clickEventType,function(){
        	var val = parseInt($("#sd_val").text());
        	if (val > 1) {
                val--;
                $("#sd_val").text(val);
            }
        	$("#sd_jia").removeClass("jia");
        	$("#sd_jia").addClass("hjia");
        });
        $("#sd_jia").bind(clickEventType,function(){
            var val = parseInt($("#sd_val").text());
            if (val < map.max) {
                val++;
                $("#sd_val").text(val);
            }
            if(val==map.max)
            {
            	$("#sd_jia").addClass("jia");
            	$("#sd_jia").removeClass("hjia");
            }
        });
        $("#sd_max").bind(clickEventType,function(){
            $("#sd_val").text(map.max);
        	$("#sd_jia").addClass("jia");
        	$("#sd_jia").removeClass("hjia");
        });
	},
	//扫荡次数
	commonSaoDand:function(bid){
		var num=parseInt($("#sd_val").text());
		map.saoDangButton();
		if(num>$("#nowTL").attr("nowtl")){
			Common.alert("当前体力"+map.max+"，<span class='cor95 stro13'>无法完成本次扫荡，是否购买体力？</span>",1,map.saoDangBuyTL,bid);
			return false;
		}
		if(num==0){
			map.saoDangBuyTL(bid);
			return false;
		}
		if(num==$("#nowTL").attr("nowtl")){
			$("#sd_max").attr("max",0);
			$("#beginSD").unbind(clickEventType);
			$("#beginSD").bind(clickEventType,function(){
				map.saoDangBuyTL(bid);
			});
		}
		$.getJN("http://" + host + "/sgg/i/fight/s.php", {
			uid : userId,
			bid:bid,
			num:num
		},
		function(data){
			if(parseInt(data.st)==1){
				battle.bid=bid;
				//添加扫荡掉落物品信息
				$("#dropList").removeAllItem();
				map.setSlidBlock();
				map.addOneDrop(data.drop);
				if(tiLi.nextTime<=0){//扫荡完后体力值，前端开启自动增加功能
					tiLi.startRefresh();
				}
				//扫荡后刷新任务数据
				user.refreshTaskInfo();
				user.refreshUserInfo(data.user);
				$('#bt').empty().append("<span class='cor1'>"+data.user.nowTL+"</span>/<span>"+data.user.maxTL+"</span>");
				$('#nowTL').attr("nowtl",data.user.nowTL);
				$('#nowTL').css("width",parseInt((data.user.nowTL/data.user.maxTL)*104));
				$('#uinfoTL').text(data.user.nowTL);
                map.max=map.max-num;
                $('#sd_max').attr("max",map.max);
                $("#beginSD").unbind(clickEventType);
                $("#beginSD").bind(clickEventType,function(){
    				map.commonSaoDand(bid,map.max);
    			});
			}
			else if(parseInt(data.st)==2){
				Common.alert("扫荡的战斗还<span class='cor95 stro13'>没有通过 </span>");
			}
		});
	},
	//扫荡结束体力用完点击扫荡按钮
	saoDangBuyTL:function(bid){
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
 						Common.alert("今日第"+msg.x+"次补充体力，花费"+msg.needYB+"元宝，<span class='cor95 stro13'>获得50点体力,每半小时回复1点</span>",1,map.udateTL,bid);
 					}
 				}
 		);
	},
	//修改体力值
 	udateTL:function(bid){
 		$.getJSON("http://" + host + "/sgg/i/tili/b.php",
 				{uid : userId,upadte:1},
 				function (msg){
					if(msg.re==1){
						user.refreshUserInfo(msg.info);
						$('#bt').empty().append("<span class='cor1'>"+msg.nl+"</span>/<span>"+msg.stl+"</span>");
						$('#nowTL').attr("nowtl",msg.nl);
						$('#nowTL').css("width",parseInt((msg.nl/msg.stl)*104));
						$('#uinfoTL').text(msg.nowTL);
						$("#beginSD").unbind(clickEventType);
						map.max = msg.nl;
						$("#sd_max").attr("max",map.max);
						$("#sd_val").text(1);
						$("#beginSD").unbind(clickEventType);
						$("#beginSD").bind(clickEventType,function(){							
							map.commonSaoDand(bid,map.max);
						});
					}
 				}
 		);
 	},
	addOneDrop:function(dropData,index){
		index=index||1;
		var data=dropData[index];
		if(data){
			var ul=$("<ul></ul>");
			if(data.exp){
				var expDiv="<li>主公EXP<span class='cor82'>"+data.exp+"</span>；出战武将EXP<span class='cor82'>"+data.exp+"</span></li>";
				ul.append(expDiv);
			}
			if(data.yb){
//				if(typeof expDiv!="undefined"){
//					expDiv += "；<span class='cor62'>"+data.yb+"</span>";
//				}
//				else{
					var expDiv="<li>元宝<span class='cor62'>"+data.yb+"</span></li>";
					ul.append(expDiv);
//				}
			}
			if(data.gold){
//				if(typeof expDiv!="undefined"){
//					expDiv += "；钱币<span class='cor62'>"+data.gold+"</span>";
//				}
//				else{
					var expDiv="<li>钱币<span class='cor62'>"+data.gold+"</span></li>";
					ul.append(expDiv);
//				}
			}
			if(data.equip){
				for(key in data.equip){
					ul.append("<li>您获得了<span class='cor106'>"+data.equip[key].name+"</span>*<span class='cor82'>"+data.equip[key].num+"</span></li>");
				}
			}
			if(data.prop){
				for(key in data.prop){
					ul.append("<li>您获得了<span class='cor106'>"+data.prop[key].name+"</span>*<span class='cor82'>"+data.prop[key].num+"</span></li>");
				}
			}
			if(data.newUL){
				ul.append("<li class='cor98'>您升级了！</li>");
			}
			if(data.newNL){
				ul.append("<li class='cor98'>您有武将升级了！</li>");
			}
			
			$("#dropList").addSliderItem(ul);
			$("#dropList").moveDistance(ul.height());
			if(dropData[++index]){
				setTimeout(map.addOneDrop,100,dropData,index);
			}
			else{
				//ul.css("border","none");
				$("#dropList").moveToEnd();
			}
		}
	},
	setSlidBlock:function(){
		var sliderConTop=parseInt($("#dropList").children().slice(0,1).css("margin-top"));
		sliderConTop=isNaN(sliderConTop)?0:sliderConTop;
		if(sliderConTop<=0){
			var conTopLimit=parseInt($("#dropList").children().slice(0,1).height())-parseInt($("#dropList").height());
			if(conTopLimit>=0){
				var sliderBlockTopLimit=258;
				var top=Math.abs(parseInt(sliderConTop/conTopLimit*sliderBlockTopLimit));
				top=top<0?0:top;
				top=top>sliderBlockTopLimit?sliderBlockTopLimit:top;
				$("#sd_Block").css("margin-top",top+"px");
			}
		}
	},
	refreshMap:function(data){
		if(data.npage){//增加新的page
			if($("#mapWindow").length>0){//小于等于0表示是从任务进来来的，没有page地图不刷新
				map.addNewPage();
				mesWindow.closeWindowById("smapWindow");
			}
		}
		else if(data.nmap){//增加新的地图
			map.getMapByPage();
			mesWindow.closeWindowById("smapWindow");
		}else{  //当没有心地图和新页的时候
			var mapID=$("#smap_list").attr("cmap");
			map.getSmallMap(mapID);
		}
	},
	//根据map得到map中的战斗
	getBattles:function(map,selectedBattle){
		
	},
	refreshBattles:function(){
		
	},
	transferToUpper:function(page){
//		var upperCase=["","一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四"];
//		return upperCase[page];
                $("#m_tit").attr('class', 'mapT'+page);
	},
	//为地图图标设置路径指引
	setPathforMap:function(page,c_pos,p_pos){
		var gap = 18;  //路径间隔
		
		//坐标矫正(只针对路径)
		p_pos.left+=50;
		c_pos.left+=50;
		c_pos.top+=50;
		p_pos.top+=50;
		
		var dis_x = Math.abs(c_pos.left-p_pos.left);  //水平间距
		var dis_y = Math.abs(c_pos.top-p_pos.top);  //垂直距离
		var distance = Math.round(Math.sqrt(Math.pow(dis_x,2)+Math.pow(dis_y,2))); //两点距离
		var num = Math.floor(distance/gap);
		var x = Math.floor((p_pos.left-c_pos.left)/num);
		var y = Math.floor((p_pos.top-c_pos.top)/num);
		for(var i=1;i<=num-2;i++){
			var left = c_pos.left+i*x;
			var top = c_pos.top+i*y;
			var img = $("<img src='image/sys/yello.png' style='width:10px;height:10px;position:absolute;left:"+left+"px;top:"+top+"px;' />");
			page.append(img);
		}
	}
	,promp:null//提示给提示点击特效的循环变量
}

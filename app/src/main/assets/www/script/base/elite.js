var elite={
    per_cell:6,
    map_id:0,
    getPreLoadStaticRes:function(){//模块静态资源
		var res=[
			'image/game/jingyingtubiao.png',
			'image/game/jyjt_pic1.jpg',
			'image/game/jyjt_pic2.jpg',
			'image/game/jyjt_pic3.jpg',
			'image/game/jyjt_pic4.jpg',
			'image/game/jyjt_pic5.jpg',
			'image/game/jyjt_pic6.jpg',
			'image/game/jyjt_pic7.jpg'
		];
		return res;
	},
    loadWindow:function(){
    	ResLoad.resourceLoader(map.getPreLoadStaticRes(),function(){
            var eliteWindow = new mesWindow("eliteWindow", $("#elite_tmpl").html());
            $("#elite_list").setSlider({row:1,col:1,dir:"top"});
            elite.showEliteList();
    	},1);
    },
    showEliteList:function(){
        var temp;
        $.getJN("http://"+host+"/sgg/i/map/m.php", {uid:userId,type:2},
            function(data){
                if (data.map) {
                    var n = 1;
                    for (key in data.map) {
                        temp=$.tmpl($("#elite_temp"),data.map);
                        temp.find("#elite_name").text(n);
                        temp.find("#elite_first_user").text(data.map[key].first_name);
                        
                        if (data['map'][key]['st']) {
                            temp.find(".towerPic").bind(clickEventType, elite.clickEliteCallBack);
                            temp.find(".towerR").bind(clickEventType, elite.clickEliteCallBack);
                        }
                        if (data['map'][key]['fighted'] == 2) {
                            temp.find(".towBtn").after("<p class='ytg1'></p>");
                        }
                        // 扫荡相关图标显示
                        if (data['map'][key]['sd'] == 1) {
                            temp.find("#elite_sd").attr("class", "pub_btn2");
                            temp.find("#elite_sd").attr("flag_sd", data['map'][key]['sd']);
                        }
                        else if (data['map'][key]['sd'] == 2) {
                            temp.find("#elite_sd").attr("class", "pub_btn2");
                            temp.find("#elite_sd").text("重置");
                            temp.find("#elite_sd").attr("flag_sd", data['map'][key]['sd']);
                            temp.find("#elite_sd").attr("sd_cost", data['map'][key]['sd_cost']);
                        }
                        else if (data['map'][key]['sd'] == -1) {
                            temp.find("#elite_sd").attr("class", "hpub_btn2");
                            temp.find("#elite_sd").attr("flag_sd", data['map'][key]['sd']);
                        }
                        else if (data['map'][key]['sd'] == -2) {
                            temp.find("#elite_sd").attr("class", "hpub_btn2");
                            temp.find("#elite_sd").attr("flag_sd", data['map'][key]['sd']);
                        }
                        else if (data['map'][key]['sd'] == -3) {
                            temp.find("#elite_sd").attr("class", "hpub_btn2");
                            temp.find("#elite_sd").text("重置");
                            temp.find("#elite_sd").attr("flag_sd", data['map'][key]['sd']);
                        }
                        else {
                            temp.find("#elite_sd").attr("class", "hpub_btn2");
                            temp.find("#elite_sd").attr("flag_sd", -1);
                        }
                        if (!data['map'][key]['st']) {
                            temp.find("#elite_img").attr("src", "image/game/jyjt_pic7.jpg");
                            temp.find("#elite_awa5").removeAttr("src");
                        }
                        else {
                            var str = data['map'][key]['drop_img'].split(',');
                            var nn = 1;
                            for (val in str) {
                                var awa = 'elite_awa'+nn;
                                temp.find("#"+awa).attr("src", 'image/game/'+str[val]);
                                nn++;
                            }
                            temp.find(".towerPic").attr('map_id', data['map'][key]['id']);
                            temp.find(".towerR").attr('map_id', data['map'][key]['id']);
                            temp.find("#elite_img").attr('src', 'image/game/'+data['map'][key]['img']);
                            temp.find("#elite_sd").attr('map_id', data['map'][key]['id']);
                            if (data['map'][key]['sd'] == 2) {
                                temp.find("#elite_sd").bind(clickEventType, function(){
                                    elite.map_id=$(this).attr("map_id");
                                    Common.alert("花费"+$(this).attr("sd_cost")+"元宝重置精英劫塔进度，是否重置",1,elite.eliteReset);
                                });
                            }
                            else {
                                temp.find("#elite_sd").bind(clickEventType, elite.floorTravel);
                            }
                            var ii = "<br /><span class='cor107 fs20'>重置次数 "+((data['map'][key]['sd_left'])?data['map'][key]['sd_left']:0)+"</span>";
                            temp.find("#elite_sd").after(ii);
                        }
                        $("#elite_list").addSliderItem(temp);
                        n++;
                    }
                }
        });
    },
    eliteReset:function(){
            $.getJN("http://" + host + "/sgg/i/fight/elite_reset.php", {uid : userId,map_id:elite.map_id},
            function(data){
                if (data.st==1) {
                    Common.alert("重置成功",9);
                    $("#ybNum").text(user.formatGold(data.yb));
                }
                else if(parseInt(data.st)==-1){
                    Common.alert("VIP2才可重置本层挑战次数",3,charge.sub);
                }
                else if(parseInt(data.st)==-2){
                    Common.alert("元宝不足，前去充值",3,charge.sub);
                }
                else if(parseInt(data.st)==-3){
                    Common.alert("您的重置次数用尽，请明日再来。下一级VIP可重置"+data.next+"次",3,charge.sub);
                }
            });
    },
    floorTravel:function(){
        if (parseInt($("#nowTL").attr("nowtl")) <= 0) {
            Common.alert("体力不足，无法扫荡",1,UInfo.loadWindow);
            return;
        }
        if ($(this).attr("flag_sd") == -1) {
            Common.alert("关卡尚未开启");
            return;
        }
        else if ($(this).attr("flag_sd") == -2) {
            Common.alert("VIP1可使用扫荡功能",3,charge.sub);
            return;
        }
        else if ($(this).attr("flag_sd") == -3) {
            Common.alert("您的重置次数用尽，请明日再来。");
            return;
        }
        
        var eliteFTWindow = new mesWindow("eliteFTWindow", $("#saodang_elite_tmpl").html());
        $("#dropList_elite").setSlider({row:1,col:1,dir:"top",onMove:elite.setSlideBlock});
        var m_id = $(this).attr('map_id');
        $("#elite_beginSD").attr('map_id', $(this).attr('map_id'));
        $("#elite_beginSD").bind(clickEventType,function(){
                $.getJN("http://" + host + "/sgg/i/fight/floorTravel.php", {uid : userId,map_id: $(this).attr('map_id')},
                function(data){
                        if(parseInt(data.st)==1){
                                //$("#beginSD").unbind(clickEventType);
                                //添加扫荡掉落物品信息
                                $("#dropList").removeAllItem();
                                for (val in data.dia) {
                                    elite.addOneDrop(data['dia'][val]['drop']);
                                    elite.setSlideBlock();
                                    if(tiLi.nextTime<=0){//扫荡完后体力值，前端开启自动增加功能
                                            tiLi.startRefresh();
                                    }
                                    //扫荡后刷新任务数据
                                    user.refreshTaskInfo(data['dia'][val]);
                                    //alert(data.user.nowTL);
                                    user.refreshUserInfo(data['dia'][val]['user']);
                                    $('#bt').empty().append("<span class='cor1'>"+data['dia'][val]['user']['nowTL']+"</span>/<span>"+data['dia'][val]['user']['maxTL']+"</span>");
                                    $('#nowTL').attr("nowtl",data['dia'][val]['nowTL']);
                                    $('#nowTL').css("width",parseInt((data['dia'][val]['user']['nowTL']/data['dia'][val]['maxTL'])*104));
                                    $('#uinfoTL').text(data['dia'][val]['user']['nowTL']);
                                }
//                                $("#elite_beginSD").addClass("x");
                                $("#elite_beginSD").addClass("x oneclose");
                                $("#elite_beginSD").text("关闭");
                                $("#elite_beginSD").unbind(clickEventType)
                                $("#eliteFTWindow").find(".exit").attr('map_id', m_id);
                                $("#elite_beginSD").removeAttr("id");
                                Buzhen.refreshUserFormation();  //刷新首页阵上武将信息
                        }
                        else if(parseInt(data.st)==2){
                                Common.alert("扫荡的战斗还<span class='cor95 stro13'>没有通过 </span>");
                        }
                        else if(parseInt(data.st)==3){
                                Common.alert("体力不够，<span class='cor95 stro13'>请补充体力</span>",1,UInfo.loadWindow);
                        }
                        else if(parseInt(data.st)==4){
                                Common.alert("无可扫荡地图");
                        }
                        else {
                            Common.alert("出错请重试");
                        }
                });
        });
    },
    setSlideBlock:function(){
//        alert($("#dropList_elite").children().css('margin-top'));
            var sliderConTop=parseInt($("#dropList_elite").children().slice(0,1).css('margin-top'));
            sliderConTop=isNaN(sliderConTop)?0:sliderConTop;
            if(sliderConTop<=0){
                    var conTopLimit=parseInt($("#dropList_elite").children().slice(0,1).height())-parseInt($("#dropList_elite").height());
                    if(conTopLimit>=0){
                            var sliderBlockTopLimit=258;
//                            var text = $("#elite_text").html()+sliderConTop+'|'+sliderConTop+'|'+conTopLimit+';';
//                            $("#elite_text").html(text);
                            var top=Math.abs(parseInt(sliderConTop/conTopLimit*sliderBlockTopLimit));
                            top=top<0?0:top;
                            top=top>sliderBlockTopLimit?sliderBlockTopLimit:top;
                            $("#sd_Block_elite").css("margin-top",top+"px");
                    }
            }
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
                            if(typeof expDiv!="undefined"){
                                    expDiv += "；<span class='cor62'>"+data.yb+"</span>";
                            }
                            else{
                                    var expDiv="<li>元宝<span class='cor62'>"+data.yb+"</span></li>";
                                    ul.append(expDiv);
                            }
                    }
                    if(data.gold){
                            if(typeof expDiv!="undefined"){
                                    expDiv += "；钱币<span class='cor62'>"+data.gold+"</span>";
                            }
                            else{
                                    var expDiv="<li>钱币<span class='cor62'>"+data.gold+"</span></li>";
                                    ul.append(expDiv);
                            }
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
                    $("#dropList_elite").addSliderItem(ul);
                    $("#dropList_elite").moveDistance(ul.height());
                    if(dropData[++index]){
                            setTimeout(elite.addOneDrop,100,dropData,index);
                    }
                    else{
                            //ul.css("border","none");
                            $("#dropList_elite").moveToEnd();
                    }
            }
    },
    clickEliteCallBack:function(battleId,mapId){
        if(!Slider.checkTouchAvailabel(this)){
            return;
        }
        var eliteWindow = new mesWindow("eliteSWindow", $("#elite_s_tmpl").html());
        //$("#elite_s_list").setSlider({row:2,col:3,onPageChange:elite.cellPageChange});
        map.type = 2;
        var battle_map_id = mapId||$(this).attr("map_id");
        var select_battleId = battleId;
        $.getJN("http://"+host+"/sgg/i/map/s.php", {uid:userId,type:2,map_id:battle_map_id},
            function(data){
                $("#elite_s_name").text(data.omap.name);
                elite.addCheckPointPage(data.bs,battle_map_id,select_battleId);
        });
        $(document).bind(touchDown,function(e){
            if($(e.target).attr('class') == 'chaLi' || $(e.target).attr('class') == 'chalP' || $(e.target).attr('class') == 'chalTxt' || $(e.target).attr('class') == 'chalS' || $(e.target).attr('class') == 'saodang' || $(e.target).attr('class') == 'zhandou' || $(e.target).attr('src')){
                
            }else{
                $("#elite_s_list").find(".zhandou").attr('style', 'display:none');
                $("#elite_s_list").find(".zhandou").removeAttr('id');
            }
        });
        $("#elite_s_name").attr("mid", battle_map_id);
        $("#jyMapPage div").bind(clickEventType,elite.smallPageClick);
    },
    addCheckPointPage:function(data,mapID,selectedBid){
        var length = data.length;
        var total = Math.ceil(length/elite.per_cell);
        $("#elite_s_list").empty();
        for(var i=1;i<=total;i++){
        	$("#elite_s_list").append("<div class='pager' page='"+i+"' style='width:873px;height:425px;'></div>");
        }
        var n = 1, page_temp;
        $("#elite_page").text('1/'+total);
        
        for (key in data) {
            var cp_temp='',page = Math.ceil(n/elite.per_cell),stu='';
            if (n % elite.per_cell == 1) {
                page_temp=$("#elite_s_temp");
                cp_html='';
            }
            if(data[key].st>0){
                if(data[key].fighted==-1){
                    stu = '<li class="jrytz"></li>';
                }
                cp_temp = $("<ul bid='"+data[key].id+"' class='chaLi' page='"+page+"' total='"+total+"' stu='"+data[key].st+"' jsonStr='"+JSON.stringify(data[key])+"'><li class='chalP'><img src='"+imgfolder+data[key].img+"' height='126' width='98' style='margin-left:6px' /></li><li class='chalTxt'>"+data[key].name+"</li><li class='chalS'><img src='image/game/jinbi.jpg' width='46' height='46' /></li><li class='chalS'><img src='"+imgfolder+data[key]['drop'][0]['i']+"' width='46' height='46' /></li><li class='zhandou' style='display:none'></li>"+stu+"</ul>");
                if (data[key].fighted==1) {
                    cp_temp.bind(clickEventType,map.clickSmallMap);
                }
            }
            else {
                cp_temp = "<ul bid='"+data[key].id+"' class='chaLi' page='"+page+"' total='"+total+"'><li class='chalP mt187'><img src='image/sys/zdt_pic1.png' /></li><li class='chalTxt'>未开启</li><li class='chalS'><img src='image/game/jyjt_pic7.jpg' width='46' height='46' /></li><li class='chalS'><img src='image/game/jyjt_pic7.jpg' width='46' height='46' /></li></ul>";
            }
            
            //$("#elite_s_list").addSliderItem(cp_temp);
            var pagers = $("#elite_s_list>div");
            for(var i = 0,n=pagers.length;i<n;i++){
            	if($(pagers[i]).children().length<elite.per_cell){
            		$(pagers[i]).append(cp_temp);
            		break;
            	}
            }
            n++;
            
        }
        //为某场战斗添加特殊指引
        if(typeof selectedBid=="string"){
        	$("#elite_s_list ul[bid='"+selectedBid+"']").append("<img class='jyMapPointer' src='image/sys/map_arrow.png'/>");
        	var page = $("#elite_s_list ul[bid='"+selectedBid+"']").parent().index();
//        	if(page!=0){
//        		$("#elite_s_list").goToPage(page);
//        	}
        	$("#elite_s_list>div:eq("+page+")").show();
        	$("#elite_s_list>div:eq("+page+")").siblings().hide();
        }else{
        	$("#elite_s_list>div:eq(0)").show();
        	$("#elite_s_list>div:eq(0)").siblings().hide();
        }
        elite.checkPreNextPage();
    },
    cellPageChange:function() {
        $("#elite_page").text($("#elite_s_list").currentPage().find("ul").attr("page")+'/'+$("#elite_s_list").currentPage().find("ul").attr("total"));
    },
    //小地图分页提示图标检查
	checkPreNextPage:function(){
		var max = $("#elite_s_list>div").length;
		var index = $("#elite_s_list>div:visible").index()+1;
		$("#elite_page").text(index+"/"+max);
		//左翻页按钮是否显示
		if(index==1){
			$("#jyMapPage>.fanyeL").hide();
		}else{
			$("#jyMapPage>.fanyeL").show();
		}
		
		//右按钮是否显示
		if(max>index){
			$("#jyMapPage>.fanyeR").show();
		}else{
			$("#jyMapPage>.fanyeR").hide();
		}
	},
	smallPageClick:function(){  //小地图页面翻页
		if($(this).attr("data-fx")=="left"){ //点击左侧翻页
			var current = $("#elite_s_list>div:visible").prev();
			current.siblings().hide();
			current.show();
		}else{
			var current = $("#elite_s_list>div:visible").next();
			current.siblings().hide();
			current.show();
		}
		elite.checkPreNextPage();
	}
}

var activity={
	index:0,
	loadWindow:function(){
		var activityWindow = new mesWindow("activitywindow",$("#activity_tmpl").html());
		$("#activityList").setSlider({row:1,col:1,dir:"top",onMove:activity.setSlidBlock});
		activity.getActivityInfo();
	},
	getActivityInfo:function(){
		$.getJSON("http://" + host + "/sgg/i/communicate/activity.php", {uid : userId}, 
		function(data) {
			if($("#activityList").length<=0)//如果为0表示弹窗没有弹出
				return;
			activity.addActivityInfo(data);
			activity.setSlidBlock();
		});
	},
	addActivityInfo:function(data){
		var container=$("#activityList");
		container.removeAllItem();
		if(data==undefined){
			return;
		}
		for(key in data){
			//对第一个进行特殊处理，右侧信息页面显示第一条任务的详细信息
			var item = $("<div class='hdLi' ord_id="+key+">"+data[key].title+"</div>");
			if(key==1){
                            item.attr("class","hdOv");
			}
			item.attr("data",JSON.stringify(data[key]));
			item.bind(clickEventType,activity.activityListClick);
			container.addSliderItem(item);
		}
		$("#activityList>div>div").first().trigger(clickEventType);
	},
	//设置滑块位置
	setSlidBlock:function(){
		var sliderConTop=parseInt($("#activityList").children().slice(0,1).css("margin-top"));
		sliderConTop=isNaN(sliderConTop)?0:sliderConTop;
		if(sliderConTop<=0){
			var conTopLimit=parseInt($("#activityList").children().slice(0,1).height())-parseInt($("#activityList").height());
			if(conTopLimit>=0){
				var sliderBlockTopLimit=384;
				var top=Math.abs(parseInt(sliderConTop/conTopLimit*sliderBlockTopLimit));
				top=top<0?0:top;
				top=top>sliderBlockTopLimit?sliderBlockTopLimit:top;
				$("#a_sBlock").css("margin-top",top+"px");
			}
		}
	},
	//任务列表单击事件
	activityListClick:function(){
            if(!Slider.checkTouchAvailabel(this)){
                    return;
            }
            var data = JSON.parse($(this).attr("data"));
            if ($("#activityList").find(".hdOv").ord_id != data.id) {
                $("#activityList").find(".hdOv").attr("class", "hdLi");
            }
            $(this).attr("class", "hdOv");
            var item = '';
            if (data.type==2) {
                var tmp = JSON.parse(data.content);
                $("#activityinfo2").attr("style", "display:none");
                $("#activityinfo3").attr("style", "display:none");
                if (document.getElementById("a_sBlock3")) {
                    $("#help_scroll").removeAttr("style");
                    $("#a_sBlock3").attr("id", "a_sBlock2");
                }
                $("#a_sBlock2").attr("style", "margin-top:0px");
                $("#help_list").attr("style", "display:none");
//                $("#help_list").removeAllItem();
//                $("#help_list").removeSlider();
                $("#help_block").remove();
                $("#activityinfo").attr('style', 'width:514px;height:408px;overflow:hidden');
                $("#activityinfo").setSlider({row:1,col:1,dir:"top",onMove:activity.setSlidBlockR});
                $("#activityinfo").removeAllItem();
                $.getJN("http://"+host+"/sgg/i/communicate/acti_award.php", {uid:userId, type:2, acti_id:data.id},
                    function(res){
                        if (res.st == -1) {
                            item = res.con+"<div class='tc'><a class='hpub_btn2'>已领取</a></div>";
                        }
                        else if (res.st == 1) {
                            item = res.con+"<div class='tc'><a id='acti_login_award' acti_id='"+data.id+"' class='pub_btn'>领取</a></div>";
                        }
                        else {
                            item = res.con+"<div class='tc'><a class='hpub_btn2'>已领取</a></div>";
                        }
                        $("#activityinfo").addSliderItem(item);
                        if (res.st == 1) $("#acti_login_award").bind(clickEventType, activity.getAward);
                });
            }
            else if (data.type == 3) {
//                $("#activityinfo").removeSlider();
                $("#activityinfo").attr("style", "display:none");
                $("#activityinfo3").attr("style", "display:none");
                $("#help_scroll").attr("style", "margin-top:220px;height:200px");
                $("#a_sBlock2").attr("id", "a_sBlock3");
                $("#a_sBlock3").attr("style", "margin-top:0px");
                var tmpl = "<ul class='h200'><li class='cor107 fs24 mb5'>请输入问题或建议</li><li class='fl'><textarea class='fs22 cor55 textArea' id='help_content'></textarea></li><li class='send fl' id='help_submit'>发送</li></ul><p id='help_block' class='gmL'></p><div id='help_list' style='width:512px;height:180px;'></div>";
                $("#activityinfo2").removeAttr("style");
                $("#activityinfo2").html(tmpl);
                $.getJN("http://"+host+"/sgg/i/communicate/help.php", {uid:userId},
                    function(res){
                        if (res.st == 1) {
                            $("#help_submit").bind(clickEventType, activity.sendHelp);
                            $("#help_list").setSlider({row:1,col:1,dir:"top",onMove:activity.setSlidBlockB});
                            var item='';
                            if (res.list != -1) {
                                for (key in res.list) {
                                    item = "<ul class='gmLi'><li class='cor107 tr'><a class='fl'>"+res['list'][key].user_name+"</a>"+res['list'][key].date_time+"</li><li>"+res['list'][key].content+"</li></ul><p class='gmL'></p>";
                                    $("#help_list").addSliderItem(item);
                                }
                            }
                        }
                    });
            }
            else if (data.type == 4) {
                $("#activityinfo").attr("style", "display:none");
                $("#activityinfo2").attr("style", "display:none");
                $("#activityinfo3").attr("style", "width:514px;height:408px;overflow:hidden");
                if (document.getElementById("a_sBlock3")) {
                    $("#help_scroll").removeAttr("style");
                    $("#a_sBlock3").attr("id", "a_sBlock2");
                }
                $("#a_sBlock2").attr("style", "margin-top:0px");
                $("#activityinfo3").setSlider({row:1,col:1,dir:"top",onMove:activity.setSlidBlockR2});
                $("#activityinfo3").removeAllItem();
                $.getJN("http://"+host+"/sgg/i/communicate/level_award.php", {uid:userId,acti_id:data.id},
                    function(res){
                        if (res.st == -9) {
                            Common.alert("出错请重试");
                        }
                        else {
                            for (key in res) {
                                var yb='',gold='',rep='',prop='',equip='';
                                if (res[key].yb) yb=res[key].yb+'元宝 ';
                                if (res[key].gold) gold=res[key].gold+'金币 ';
                                if (res[key].reputation) rep=res[key].reputation+'声望 ';
                                if (res[key].prop) {
                                    prop = "<ul>";
                                    for (k in res[key].prop) {
                                        prop += "<li><img src='image/game/"+res[key].prop[k].img+"'><p class='angle'>x"+res[key].prop[k].num+"</p></li>";
                                    }
                                    prop += "</ul>";
                                }
                                if (res[key].equip) {
                                    equip = "<ul>";
                                    for (k in res[key].equip) {
                                        equip += "<li><img src='image/game/"+res[key].equip[k].img+"'><p class='angle'>x"+res[key].equip[k].num+"</p></li>";
                                    }
                                    equip += "</ul>";
                                }
                                if (res[key].st == 1) {
                                    item = "<div class='vipPresO'><div class='vipReward shad1'><span class='cor107'>"+key+"级</span> 奖励<p class='rec1 level_award' award='"+res[key].level+"' acti_id="+data.id+">点击领取</p></div><div class='rewardList cor107'>"+yb+gold+rep+prop+equip+"</div><div class='vipState cor55 shad1'>达成</div></div>";
                                }
                                else if (res[key].st == 2) {
                                    item = "<div class='vipPresO'><div class='vipReward shad1'><span class='cor107'>"+key+"级</span> 奖励<p class='rec1 level_award' award='"+res[key].level+"' acti_id="+data.id+" style='display:none'>点击领取</p></div><div class='rewardList cor107'>"+yb+gold+rep+prop+equip+"</div><div class='vipState cor55 shad1'>达成</div></div>";
                                }
                                else if (res[key].st == 3) {
                                    item = "<div class='vipPres'><div class='vipReward shad1'><span class='cor107'>"+key+"级</span> 奖励</div><div class='rewardList cor107'>"+yb+gold+rep+prop+equip+"</div><div class='vipState cor108 shad1'>已领取</div></div>";
                                } 
                                else {
                                    item = "<div class='vipPres'><div class='vipReward shad1'><span class='cor107'>"+key+"级</span> 奖励</div><div class='rewardList cor107'>"+yb+gold+rep+prop+equip+"</div><div class='vipState cor1 shad1'>进行中</div></div>";
                                }
                                item += "<p class='gmL'></p>";
//                                alert(item);
                                $("#activityinfo3").addSliderItem(item);
                            }
                            
                            $("#activityinfo3").find(".level_award").bind(clickEventType, function () {
                                var award=$(this).attr("award"), acti_id=$(this).attr("acti_id");
                                var target = $(this);
                                    $.getJN("http://"+host+"/sgg/i/communicate/level_award.php", {uid:userId,award:award,acti_id:acti_id},
                                        function(res1){
                                            if (res1.st == 1) {
                                                Common.alert("领取成功");
                                                target.parents(".vipPresO").next().next(".vipPresO").find(".level_award").removeAttr("style");
                                                target.parents(".vipPresO").attr("class", "vipPres");
                                                target.parents(".vipPres").find(".vipState").html("已领取");
                                                target.remove();
                                                if (res1.array.yb) {
                                                    $("#ybNum").text(user.formatGold(res1.array.yb));
                                                }
                                                if (res1.array.gold) {
                                                    $("#jbNum").text(user.formatGold(res1.array.gold));
                                                }
                                                if (res1.array.reputation) {
                                                    $("#userRepu").text(user.formatRepu(res1.array.reputation));
                                                }
                                            }
                                            else if (res1.st == -9) {
                                                Common.alert("未知错误，请重试");
                                            }
                                            else {
                                                Common.alert("领取失败，请重试");
                                            }
                                        });
                            });
                        }
                   });
            }
            else if (data.type == 5) {
                $("#activityinfo").attr("style", "display:none");
                $("#activityinfo2").attr("style", "display:none");
                $("#activityinfo3").attr("style", "width:514px;height:408px;overflow:hidden");
                if (document.getElementById("a_sBlock3")) {
                    $("#help_scroll").removeAttr("style");
                    $("#a_sBlock3").attr("id", "a_sBlock2");
                }
                $("#a_sBlock2").attr("style", "margin-top:0px");
                $("#activityinfo3").setSlider({row:1,col:1,dir:"top",onMove:activity.setSlidBlockR2});
                $("#activityinfo3").removeAllItem();
                $.getJN("http://"+host+"/sgg/i/communicate/vip_award.php", {uid:userId,acti_id:data.id},
                    function(res){
                        if (res.st == -9) {
                            Common.alert("出错请重试");
                        }
                        else {
                            for (key in res) {
                                var yb='',gold='',rep='',prop='',equip='';
                                if (res[key].yb) yb=res[key].yb+'元宝 ';
                                if (res[key].gold) gold=res[key].gold+'金币 ';
                                if (res[key].reputation) rep=res[key].reputation+'声望 ';
                                if (res[key].prop) {
                                    prop = "<ul>";
                                    for (k in res[key].prop) {
                                        prop += "<li><img src='image/game/"+res[key].prop[k].img+"'><p class='angle'>x"+res[key].prop[k].num+"</p></li>";
                                    }
                                    prop += "</ul>";
                                }
                                if (res[key].equip) {
                                    equip = "<ul>";
                                    for (k in res[key].equip) {
                                        equip += "<li><img src='image/game/"+res[key].equip[k].img+"'><p class='angle'>x"+res[key].equip[k].num+"</p></li>";
                                    }
                                    equip += "</ul>";
                                }
                                if (res[key].st == 1) {
                                    item = "<div class='vipPresO'><div class='vipReward shad1'><span class='cor107'>Vip"+key+"</span> 奖励<p class='rec1 level_award' award='"+res[key].level+"' acti_id="+data.id+">点击领取</p></div><div class='rewardList cor107'>"+yb+gold+rep+prop+equip+"</div><div class='vipState cor55 shad1'>达成</div></div>";
                                }
                                else if (res[key].st == 2) {
                                    item = "<div class='vipPresO'><div class='vipReward shad1'><span class='cor107'>Vip"+key+"</span> 奖励<p class='rec1 level_award' award='"+res[key].level+"' acti_id="+data.id+" style='display:none'>点击领取</p></div><div class='rewardList cor107'>"+yb+gold+rep+prop+equip+"</div><div class='vipState cor55 shad1'>达成</div></div>";
                                }
                                else if (res[key].st == 3) {
                                    item = "<div class='vipPres'><div class='vipReward shad1'><span class='cor107'>Vip"+key+"</span> 奖励</div><div class='rewardList cor107'>"+yb+gold+rep+prop+equip+"</div><div class='vipState cor108 shad1'>已领取</div></div>";
                                } 
                                else {
                                    item = "<div class='vipPres'><div class='vipReward shad1'><span class='cor107'>Vip"+key+"</span> 奖励</div><div class='rewardList cor107'>"+yb+gold+rep+prop+equip+"</div><div class='vipState cor1 shad1'>进行中</div></div>";
                                }
                                item += "<p class='gmL'></p>";
//                                alert(item);
                                $("#activityinfo3").addSliderItem(item);
                            }
                            
                            $("#activityinfo3").find(".level_award").bind(clickEventType, function () {
                                var award=$(this).attr("award"), acti_id=$(this).attr("acti_id");
                                var target = $(this);
                                    $.getJN("http://"+host+"/sgg/i/communicate/vip_award.php", {uid:userId,award:award,acti_id:acti_id},
                                        function(res1){
                                            if (res1.st == 1) {
                                                Common.alert("领取成功");
                                                target.parents(".vipPresO").next().next(".vipPresO").find(".level_award").removeAttr("style");
                                                target.parents(".vipPresO").attr("class", "vipPres");
                                                target.parents(".vipPres").find(".vipState").html("已领取");
                                                target.remove();
                                                if (res1.array.yb) {
                                                    $("#ybNum").text(user.formatGold(res1.array.yb));
                                                }
                                                if (res1.array.gold) {
                                                    $("#jbNum").text(user.formatGold(res1.array.gold));
                                                }
                                                if (res1.array.reputation) {
                                                    $("#userRepu").text(user.formatRepu(res1.array.reputation));
                                                }
                                            }
                                            else if (res1.st == -9) {
                                                Common.alert("未知错误，请重试");
                                            }
                                            else {
                                                Common.alert("领取失败，请重试");
                                            }
                                        });
                            });
                        }
                   });
            }else if(data.type==6){
                $("#activityinfo2").attr("style", "display:none");
                $("#activityinfo3").attr("style", "display:none");
                if (document.getElementById("a_sBlock3")) {
                    $("#help_scroll").removeAttr("style");
                    $("#a_sBlock3").attr("id", "a_sBlock2");
                }
                $("#a_sBlock2").attr("style", "margin-top:0px");
                $("#help_list").attr("style", "display:none");
                $("#help_block").remove();
                $("#activityinfo").attr('style', 'width:514px;height:408px;overflow:hidden');
                $("#activityinfo").setSlider({row:1,col:1,dir:"top",onMove:activity.setSlidBlockR});
                $("#activityinfo").removeAllItem();
                var html='';
                html = '<p class="cor107">请输入新手卡或感恩卡激活码</p>';
                html += '<textarea class="fs24 cor55 codeAr fb" id="code"></textarea>';
                html += '<div class="tc">';
                html += '<a class="pub_btn" id="getCode">领取</a>';
                html += '</div>';
                html += '<p class="cor108 aTxt">领取注：关注“僵尸三国”并私信官博：僵尸三国新手卡即可获得新手卡激活码!</p>';
                $("#activityinfo").addSliderItem(html);
                var obj = JSON.parse(data.content);
                $('#getCode').bind(clickEventType,function(){
                	var code=$('#code').val();
                	if(code==''){
                		Common.alert('请输入<span class="cor95 stro13">新手卡</span> /感恩卡<span class="cor95">卡号</span>');
                		return false;
                	}
                	$.getJN(
                			"http://"+host+"/sgg/i/communicate/checkCode.php",
                			{uid:userId,code:code},
                			function(msg){
                				if(msg==1){//使用感恩卡成功  更新相关奖励信息
                					$.getJN(
                							"http://"+host+"/sgg/i/user/g.php",
                							{uid:userId},
                							function(info){	
                								var gold = parseInt(info.gold)+parseInt(obj[2].gold);
                            					var reputation = parseInt(info.reputation)+parseInt(obj[2].reputation);
                            					var yb = parseInt(info.yb)+parseInt(obj[2].yb);
                            					$.getJN(
                            						"http://"+host+"/sgg/i/user/g.php",
                            						{uid:userId,act:'update',gold:obj[2].gold,reputation:obj[2].reputation,yb:obj[2].yb},
                            						function(st){
                                    					var json={'gold':gold,'reputation':reputation,'yb':yb};
                                    					user.refreshUserInfo(json);
                                    					Common.alert('获取<span class="cor95 stro13">'+obj[2].gold+'钱币</span>、'+obj[2].reputation+'声望<span class="cor95">'+obj[2].yb+'元宝</span>');
                            						}
                            					);
                							}
                					);
                				}else if(msg==2){ //使用新手卡 更新相关奖励信息
                					$.getJN(
                							"http://"+host+"/sgg/i/user/g.php",
                							{uid:userId},
                							function(info){	
                								var gold = parseInt(info.gold)+parseInt(obj[1].gold);
                            					var reputation = parseInt(info.reputation)+parseInt(obj[1].reputation);
                            					$.getJN(
                            						"http://"+host+"/sgg/i/user/g.php",
                            						{uid:userId,act:'director',gold:obj[1].gold,reputation:obj[1].reputation},
                            						function(st){
                                    					var json={'gold':gold,'reputation':reputation};
                                    					user.refreshUserInfo(json);
                                    					Common.alert('获取<span class="cor95 stro13">'+obj[1].gold+'钱币</span>、'+obj[1].reputation+'声望');
                            						}
                            					);
                							}
                					);
                				}else if(msg==3){//此卡已经使用  或者同类型的卡已经被使用过一次 
                					Common.alert('同一<span class="cor95 stro13">种类的卡</span> 只能使用<span class="cor95">一次</span>');
                				}else{ //输入的感恩卡 或者 新手卡不存在
                					Common.alert('激活码<span class="cor95 stro13">不正确</span>');
                				}
                			}
                	);
                });
            }
            else if(data.type == 7){
                $("#activityinfo2").attr("style", "display:none");
                if (document.getElementById("a_sBlock3")) {
                    $("#help_scroll").removeAttr("style");
                    $("#a_sBlock3").attr("id", "a_sBlock2");
                }
                $("#a_sBlock2").attr("style", "margin-top:0px");
                $("#help_list").attr("style", "display:none");
//                $("#help_list").removeAllItem();
//                $("#help_list").removeSlider();
                $("#help_block").remove();
                $("#activityinfo").attr('style', 'width:514px;height:408px;overflow:hidden');
                $("#activityinfo").setSlider({row:1,col:1,dir:"top",onMove:activity.setSlidBlockR});
                $("#activityinfo").removeAllItem();
                
                $.getJN("http://"+host+"/sgg/i/communicate/cumulate_award.php", {uid:userId, acti_id:data.id},
                    function(res){
                        if (res.st == 2) {
                            item = "<li>"+res.con+"</li><li class='tc'>已全部领取</li>";
                            $("#activityinfo").addSliderItem(item);
                        }
                        else if (res.st == 1) {
                            item = "<li>"+res.con+"</li><li>当前奖励：第"+res.award_type+"天</li><div class='tc'><a id='acti_cumulate_award' acti_id='"+data.id+"' class='pub_btn'>领取</a></div>";
                            $("#activityinfo").addSliderItem(item);
                            $("#acti_cumulate_award").bind(clickEventType, activity.getCumulateAward);
                        }
                        else if (res.st == -1) {
                            item = "<li>"+res.con+"</li><li>当前奖励：第"+res.award_type+"天</li><li class='tc'>已领取</li>";
                            $("#activityinfo").addSliderItem(item);
                        }
                        else if (res.st == -2) {
                            item = "<li>"+res.con+"</li><li>当前奖励：第"+res.award_type+"天</li>";
                            $("#activityinfo").addSliderItem(item);
                        }
                        else {
                            item = "<li>"+res.con+"</li>";
                            $("#activityinfo").addSliderItem(item);
                        }
                    });
            }
            else {
                $("#activityinfo2").attr("style", "display:none");
                $("#activityinfo3").attr("style", "display:none");
                if (document.getElementById("a_sBlock3")) {
                    $("#help_scroll").removeAttr("style");
                    $("#a_sBlock3").attr("id", "a_sBlock2");
                }
                $("#a_sBlock2").attr("style", "margin-top:0px");
                $("#help_list").attr("style", "display:none");
//                $("#help_list").removeAllItem();
//                $("#help_list").removeSlider();
                $("#help_block").remove();
                $("#activityinfo").attr('style', 'width:514px;height:408px;overflow:hidden');
                $("#activityinfo").setSlider({row:1,col:1,dir:"top",onMove:activity.setSlidBlockR});
                $("#activityinfo").removeAllItem();
                item = data.content;
                $("#activityinfo").addSliderItem(item);
            }
	},
        sendHelp:function() {
            if ($("#help_content").val()) {
                var con = $("#help_content").val();
                $.getJN("http://"+host+"/sgg/i/communicate/help.php", {uid:userId,content:con,submit:1},
                    function(data){
                        if (data.st == 1) {
                            Common.alert("发送成功");
                            $.getJN("http://"+host+"/sgg/i/communicate/help.php", {uid:userId},
                                function(res){
                                    if (res.st == 1) {
                                        $("#help_list").removeAllItem();
                                        var item='';
                                        if (res.list != -1) {
                                            for (key in res.list) {
                                                item = "<ul class='gmLi'><li class='cor107 tr'><a class='fl'>"+res['list'][key].user_name+"</a>"+res['list'][key].date_time+"</li><li>"+res['list'][key].content+"</li></ul><p class='gmL'></p>";
                                                $("#help_list").addSliderItem(item);
                                            }
                                        }
                                    }
                                });
                        }
                    });
            }
            else {
                Common.alert("内容不能为空");
            }
        },
        getAward:function () {
//            alert($(this).attr('acti_id'));
            $.getJN("http://"+host+"/sgg/i/communicate/acti_award.php", {uid:userId, acti_id:$(this).attr('acti_id'), type:2, award:1},
                function(data){
                    if (data.st == -1) {
                        Common.alert("今日已领取过登陆奖励");
                        $("#acti_login_award").unbind(clickEventType);
                        $("#acti_login_award").attr("class", 'hpub_btn2');
                        $("#acti_login_award").text("已领取");
                    }
                    else if (data.st == 2) {
                        Common.alert("领取了50元宝，300声望。");
//                        $("#jbNum").text(user.formatGold(data.gold));
                        $("#ybNum").text(user.formatGold(data.yb));
                        $("#userRepu").text(user.formatRepu(data.rep));
                        $("#acti_login_award").unbind(clickEventType);
                        $("#acti_login_award").attr("class", 'hpub_btn2');
                        $("#acti_login_award").text("已领取");
                    }
                    else {
                        Common.alert("已领取");
                        $("#acti_login_award").unbind(clickEventType);
                        $("#acti_login_award").attr("class", 'hpub_btn2');
                        $("#acti_login_award").text("已领取");
                    }
            });
        },
        getCumulateAward:function() {
            $.getJN("http://"+host+"/sgg/i/communicate/cumulate_award.php", {uid:userId, acti_id:$(this).attr('acti_id'), award:1},
                function(data){
                    if (data.st == 1) {
                        if (data.e_name) {
                            Common.alert("领取了"+data.yb+"元宝，娇妾"+data.e_name);
                            var json={'yb':data.left_yb};
                            user.refreshUserInfo(json);
                        }
                        else {
                            Common.alert("领取了"+data.yb+"元宝，"+data.rep+"声望");
                            var json={'yb':data.left_yb, 'reputation':data.left_rep};
                            user.refreshUserInfo(json);
                        }
                        
                        $("#activityList").find(".hdOv").trigger(clickEventType);
                    }
                    else {
                        Common.alert("领取失败，请重试");
                    }
                });
        },
	//设置滑块位置
	setSlidBlockR:function(){
		var sliderConTop=parseInt($("#activityinfo").children().slice(0,1).css("margin-top"));
		sliderConTop=isNaN(sliderConTop)?0:sliderConTop;
		if(sliderConTop<=0){
			var conTopLimit=parseInt($("#activityinfo").children().slice(0,1).height())-parseInt($("#activityinfo").height());
			if(conTopLimit>=0){
				var sliderBlockTopLimit=384;
				var top=Math.abs(parseInt(sliderConTop/conTopLimit*sliderBlockTopLimit));
				top=top<0?0:top;
				top=top>sliderBlockTopLimit?sliderBlockTopLimit:top;
				$("#a_sBlock2").css("margin-top",top+"px");
			}
		}
	},
	//设置滑块位置
	setSlidBlockR2:function(){
		var sliderConTop=parseInt($("#activityinfo3").children().slice(0,1).css("margin-top"));
		sliderConTop=isNaN(sliderConTop)?0:sliderConTop;
		if(sliderConTop<=0){
			var conTopLimit=parseInt($("#activityinfo3").children().slice(0,1).height())-parseInt($("#activityinfo3").height());
			if(conTopLimit>=0){
				var sliderBlockTopLimit=384;
				var top=Math.abs(parseInt(sliderConTop/conTopLimit*sliderBlockTopLimit));
				top=top<0?0:top;
				top=top>sliderBlockTopLimit?sliderBlockTopLimit:top;
				$("#a_sBlock2").css("margin-top",top+"px");
			}
		}
	},
        //设置滑块位置
	setSlidBlockB:function(){
		var sliderConTop=parseInt($("#help_list").children().slice(0,1).css("margin-top"));
		sliderConTop=isNaN(sliderConTop)?0:sliderConTop;
		if(sliderConTop<=0){
			var conTopLimit=parseInt($("#help_list").children().slice(0,1).height())-parseInt($("#help_list").height());
			if(conTopLimit>=0){
				var sliderBlockTopLimit=180;
				var top=Math.abs(parseInt(sliderConTop/conTopLimit*sliderBlockTopLimit));
				top=top<0?0:top;
				top=top>sliderBlockTopLimit?sliderBlockTopLimit:top;
				$("#a_sBlock3").css("margin-top",top+"px");
			}
		}
	},
	getUserInfo:function(){
		$.getJN(
			"http://"+host+"/sgg/i/user/g.php",
			{uid:userId},
			function(msg){
				var data = JSON.stringify(msg);
				return data;
			}
		);
	}
}



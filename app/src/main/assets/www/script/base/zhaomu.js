/***
 * 武将招募模块
 * by veryszhang
 */
 
 var Zhaomu = {
 	loadWindow:function(){
 		var zmWindow = new mesWindow("zmWindow", $("#zhaomu_tmpl").html());
 		$("#wjzm_list").setSlider({row:1,col:1});
 		this.showZM();
 	},
 	showZM:function(){
		$("#wjzm_list").removeAllItem();
		$.getJN("http://" + host + "/sgg/i/npc/z.php", {
			uid : userId
		}, function(data) {
//			if(data['re'] == 0){
//				Common.alert("该武将没有对应的<span class='cor95 stro13'>可招募武将 </span>");
//				return false;
//			}
			if(data.list){            	
				Zhaomu.setZhaoMuList(data.list);
			}
		});
	},
	setZhaoMuList:function(data){
		$("#wjzm_list").removeAllItem();
		var index=0;
		for(key in data){
			var temp=$.tmpl($("#onezm_temp"),data[key]);
			temp.attr('typeid',data[key].id);
			temp.attr('data',JSON.stringify(data[key]));
			temp.find("img:first").attr("src",imgfolder+data[key].img);
			$(temp).find("dl").addClass(" wjL"+data[key]['class']);
			var npcClass = parseInt(data[key]['star']);
			Common.setNpcClassStar(temp.find(".zhaoStar"),data[key]["can"],npcClass);
			if(index==0){
				temp.css("margin-left","0px");
			}
			
			//如果是vip将显示VIP等级
			if(data[key]["n_vip"]!="0"){
				temp.find(".vipZ").show();
				temp.find(".vipZ").css({"margin-top":"-385px"});
			}
			//声望或者钱币不够显示红色
			var userRepu = parseInt($("#person_info").attr("repu"));
			var userGold = parseInt($("#person_info").attr("gold"));
			
			if(userRepu<parseInt(data[key]["n_repu"])){
				temp.find(".zm_npc_repu").addClass("cor1");
			}
			if(userGold<parseInt(data[key]["n_gold"])){
				temp.find(".zm_npc_gold").addClass("cor1");
			}
			temp.bind(clickEventType,Zhaomu.showNpcInfo);
			$("#wjzm_list").addSliderItem(temp);
			index++;
		}
 		if(director.progress==5){//新手指引点击完祭坛 在点击招募
 			director.updateProgress();
 		}
	},
	showNpcInfo:function(){
		if(!Slider.checkTouchAvailabel(this)){//滑动当中不允许点击
			return;
		}
		var data = JSON.parse($(this).attr('data'));
		var zmObj = $.tmpl($("#zhaomu_dialog_tmpl").html(),data);
		zmObj.attr("id","equip_showwin");
		//zmObj.find("dt").addClass("stro"+(13+parseInt(data['class'])));
		var userRepu = parseInt($("#person_info").attr("repu"));
		var userGold = parseInt($("#person_info").attr("gold"));
		var userVip = parseInt($("#btn_vip").attr("vip_lv"));
		
		$("#zmWindow").append(zmObj);
		//如果声望或者金币不够，按钮显示灰色
		if(userRepu<parseInt(data.n_repu)||userGold<parseInt(data.n_gold)||userVip<parseInt(data.n_vip)){
			$("#zmWindow #btn_zhaomu").attr("class",'hsend');
			if(userRepu<parseInt(data.n_repu)){
				$("#equip_showwin .unable").text("声望不足，不可招募").show();
				$("#zmWindow #btn_zhaomu").bind(clickEventType,function(e){
					Common.alert("声望不足，请继续完成任务")
				});
			}else if(userGold<parseInt(data.n_gold)){
				$("#equip_showwin .unable").text("钱币不足，不可招募").show();
				$("#zmWindow #btn_zhaomu").bind(clickEventType,function(e){
					Common.alert("钱币不足!")
				});
			}else{
				$("#equip_showwin .unable").text("VIP等级不足,不可招募").show();
				$("#zmWindow #btn_zhaomu").bind(clickEventType,function(e){
					Common.alert("VIP等级不够，充值VIP将获得更多特权",2,charge.loadWindow)
				});
			}
		}else{
			$("#zmWindow #btn_zhaomu").attr("class",'send');
			$("#zmWindow #btn_zhaomu").bind(clickEventType,function(e){
				equip.hideEquipInfo();
				Zhaomu.zhaomu(data.id,data.npcClass,data.can);
			});
		}
		/*if(director.progress>0){
			director.background($('#equip_showwin'));
		}*/
		if(director.progress>0){
			
		}else{
			$(document).bind(touchDown,function(e){
				if($(e.target).attr("id")=="btn_zhaomu"){
				
				}else{
					$("#btn_zhaomu").unbind(clickEventType)
					equip.hideEquipInfo();
				}
			});
		}
		if(director.progress==6){
			director.updateProgress();
		}
	},
	setAsynchronous:true,
	zhaomu:function(nid,npcClass,can){
    	if(Zhaomu.setAsynchronous){
			Zhaomu.setAsynchronous = false;
	        $.getJN("http://" + host + "/sgg/i/npc/z1.php", {
	            uid : userId, 
	            nid : nid
	        }, function(data) {
	            if(data.re=="2"){
	                Common.alert("恭喜，尸气东来，<span class='cor95 stro13'>成功升阶 </span>");
	                Zhaomu.showZM();  //刷新招募列表
	            }else if(data.re=="1"){
	            	var WName = '';
	            	$('.zhMlist').each(function(){
	            		if($(this).attr('typeid') == nid){
	            			WName = $(this).find('.zhMTt').text();
	            		}
	            	});
	            	if(director.progress==7){//新手指引点击招募成功
	            		$('#zmWindow,#directorCon1,#zmWindow,#jtWindow,.commonBack').remove();
	            	}
	            	Common.alert("成功招募"+WName+"！营中多了<span class='cor95 stro13'>一位大将！</span>",10);
	                Zhaomu.showZM();  //刷新招募列表
	            }
	            user.refreshUserInfo(data.user);
	            user.refreshTaskInfo();
	            Zhaomu.setAsynchronous = true;
	        });
    	}else{
    		return;
    	}
    }
 }
var qianghua={
	selectedNid:0,
    loadWindow:function(){
        wuJiang.loadWindow(2, qianghua.showQiangHuaUI);
    },
    getUserInfo:function (nid) {
//        $("#qh_wj_list").setSlider({row:1,col:1});
		if(nid){//前端没有数据请求数据
			$.getJN("http://"+host+"/sgg/i/qianghua/q.php", {uid:userId,nid:nid},
			function(data){
                            $("#qh_icon").attr('user_gold', data.user.gold);
                            var prev_wj_index = 0, next_wj_index = 0, curr_wj_index = data.npc.index - 1, prev_wj_id = 0, next_wj_id = 0, temp;
                            if (data.npc.index > 2) {
                                prev_wj_index = data.npc.index - 2;
                                prev_wj_id = data['nlist'][prev_wj_index]['id'];
                            }
                            if (data.npc.index < data.nlist.length) {
                                next_wj_index = data.npc.index;
                                next_wj_id = data['nlist'][next_wj_index]['id'];
                            }
                            if (prev_wj_index>0) $("#qh_wj_prev").attr('nid', prev_wj_id);
                            if (next_wj_index>0) $("#qh_wj_next").attr('nid', next_wj_id);
                            var qhData=data.equip?(data.equip.part_1||data.equip.part_2||data.equip.part_3||data.equip.part_4||{}):{};
                            qianghua.setQHData(qhData);
                            var n = 1;
                            for (key in data.nlist) {
                                if (key == curr_wj_index) {
                                    temp=$.tmpl($("#qh_wj_temp"),data.npc);
                                    temp.attr('nid', data['nlist'][key]['id']);
                                    var wj_col = Common.getClassByClass(data['npc']['class']);
                                    temp.find("#wj_name").addClass(wj_col);
                                    temp.find("#wj_name").text(data.npc.name);
                                    Common.setNpcClassStar(temp.find("#qh_star"),data['npc']['can'],data['npc']['class']);
                                    for (val in data.equip) {
                                        if (data['equip'][val]['eid']>0) {
                                            var tmp_zb = "<img src=\"image/game/"+data['equip'][val]['img']+"\" height=\"78\" width=\"78\" /><p class=\"pub_jb1\"><img src=\"image/sys/pub_jb.png\"></p><p class=\"xnum1\">"+data['equip'][val]['level']+"</p>";
                                            temp.find("#"+val).html(tmp_zb);
                                            temp.find("#"+val).data("data",data['equip'][val]).bind(clickEventType, qianghua.clickEquipCallBack);
                                        }
                                    }
                                    if (data.jq) {
                                        for (val in data.jq) {
                                            if (data['jq'][val]['eid']>0) {
                                                var tmp_zb = "<img src=\"image/game/"+data['jq'][val]['img']+"\" height=\"78\" width=\"78\" /><p class=\"pub_jb1\"><img src=\"image/sys/pub_jb.png\"></p><p class=\"xnum1\">"+data['jq'][val]['level']+"</p>";
                                                temp.find("#"+val).html(tmp_zb);
                                                temp.find("#"+val).data("data",data['jq'][val]).bind(clickEventType, qianghua.clickEquipCallBack);
                                            }
                                        }
                                    }
                                    temp.find("#qh_page").text(data.npc.index+'/'+data.nlist.length);
                                    if (n>0) {
                                        temp.find("#qh_wj_prev").bind(clickEventType,function(){$("#qh_wj_list").moveToPrevPage();});
                                    }
                                    if (n<data.nlist.length) {
                                        temp.find("#qh_wj_next").bind(clickEventType,function(){$("#qh_wj_list").moveToNextPage();});
                                    }
                                    $("#qh_wj_list").addSliderItem(temp);
                                    $("#qh_wj_list").goToLastPage();
                                }
                                else {
                                    temp=$($("#qh_wj_temp").html());
                                    temp.filter(".zhuangB").attr('nid', data['nlist'][key]['id']);
                                    temp.find("#qh_page").text(n+'/'+data.nlist.length);
                                    if (n>0) {
                                        temp.find("#qh_wj_prev").bind(clickEventType,function(){$("#qh_wj_list").moveToPrevPage();});
                                    }
                                    if (n<data.nlist.length) {
                                        temp.find("#qh_wj_next").bind(clickEventType,function(){$("#qh_wj_list").moveToNextPage();});
                                    }
                                    $("#qh_wj_list").addSliderItem(temp);
                                }
                                n++;
                            }
			});
		}
		else{//有缓存数据不用请求网路
			var leftData=wuJiang.getLeftCurrentWjData();
			var qhData=leftData.equip?(leftData.equip.part_1||leftData.equip.part_2||leftData.equip.part_3||leftData.equip.part_4||{}):{};
			qianghua.setQHData(qhData);
		}
		$("#rot_eff1").addClass("rotate360");
		$("#rot_eff2").addClass("rotate3602");
    },
    showZhuangBeiUI:function(data) {
        for (key in data) {
            if (data[key]['eid']>0) {
                var tmp_zb = "<img src=\"image/game/"+data[key]['img']+"\" height=\"78\" width=\"78\" /><p class=\"pub_jb1\"><img src=\"image/sys/pub_jb.png\"></p><p class=\"xnum1\">"+data[key]['level']+"</p>";
                $("#"+key).html(tmp_zb);
                $("#"+key).data("data",data[key]).bind(clickEventType, qianghua.clickEquipCallBack);
            }
        }
    },
    showQiangHuaUI:function() {
        if(!Slider.checkTouchAvailabel(this)){
            return;
        }
        var qianghuaWindow = new mesWindow("qianghuaWindow", $("#qianghua_tmpl").html());
        $("#qh_wj_list").setSlider({row:1,col:1,multiPage:true,onPageChange:qianghua.wjPageChange});
        qianghua.getUserInfo($(this).attr('nid'));
    },
    wjPageChange:function() {
        var nnid = $("#qh_wj_list").currentPage().find(".zhuangB").attr('nid');
        $.getJN("http://"+host+"/sgg/i/qianghua/q.php", {uid:userId,nid:nnid},
            function(data){
                var wj_col = Common.getClassByClass(data['npc']['class']);
                $("#qh_wj_list").currentPage().find("#wj_name").addClass(wj_col);
                $("#qh_wj_list").currentPage().find("#wj_name").text(data.npc.name);
                var qhData=data.equip?(data.equip.part_1||data.equip.part_2||data.equip.part_3||data.equip.part_4||{}):{};
                Common.setNpcClassStar($("#qh_wj_list").currentPage().find("#qh_star"),data['npc']['can'],data['npc']['class']);
                for (val in data.equip) {
                    if (data['equip'][val]['eid']>0) {
                        var tmp_zb = "<img src=\"image/game/"+data['equip'][val]['img']+"\" height=\"78\" width=\"78\" /><p class=\"pub_jb1\"><img src=\"image/sys/pub_jb.png\"></p><p class=\"xnum1\">"+data['equip'][val]['level']+"</p>";
                        $("#qh_wj_list").currentPage().find("#"+val).html(tmp_zb);
                        $("#qh_wj_list").currentPage().find("#"+val).data("data",data['equip'][val]).bind(clickEventType, qianghua.clickEquipCallBack);
                    }
                }
                if (data.jq) {
                    for (val in data.jq) {
                        if (data['jq'][val]['eid']>0) {
                            var tmp_zb = "<img src=\"image/game/"+data['jq'][val]['img']+"\" height=\"78\" width=\"78\" /><p class=\"pub_jb1\"><img src=\"image/sys/pub_jb.png\"></p><p class=\"xnum1\">"+data['jq'][val]['level']+"</p>";
                            $("#qh_wj_list").currentPage().find("#"+val).html(tmp_zb);
                            $("#qh_wj_list").currentPage().find("#"+val).data("data",data['jq'][val]).bind(clickEventType, qianghua.clickEquipCallBack);
                        }
                    }
                }
                qianghua.setQHData(qhData);
        });
    },
	clickEquipCallBack:function(){
//            alert('gold1:'+$("#qh_gold").text());
            var partData=$(this).data("data");
            qianghua.setQHData(partData);
//            alert('gold2:'+$("#qh_gold").text());
	},
	setQHData:function(qhData){
		var qhAttr=roleAttr.translateAttr(qhData);
		if(qhData.nattr){
			var qhNAttr=roleAttr.translateAttr(qhData.nattr);//下一次升级增加的属性值
			for(key in qhNAttr){
				qhAttr[key]["nv"]=qhNAttr[key].v;
			}
			qhData.upAttr=qhAttr;
		}
                if (qhData.img) {
                    qhData.imgFPath=imgfolder+qhData.img;
                }
                else {
                    qhData.imgFPath=imgfolder+'brown.jpg';
                }
//                for (key in qhData) {
//                   alert(key+':'+qhData[key]);
//                }
//                alert('img:'+qhData.imgFPath+'|name:'+qhData.name);
		var qhCon=$.tmpl($("#qh_temp"),qhData);
                qhCon.find(".qiangRt").text($("#qh_icon").attr("user_gold"));
		$("#qh_con").empty().append(qhCon);
		if(!qhData.level){//装备栏为空
			qhCon.find(".pubBox").empty();
		}
		else{//装备栏不为空
			qhCon.find(".pub_btn").bind(clickEventType,qhData,qianghua.clickQHBtn);
		}
	},
	removeQHShow:function(){
		$("#qh_con").empty();
	},
	clickQHBtn:function(event){
		var qhData=event.data;
		$.getJN("http://"+host+"/sgg/i/qianghua/s.php", {uid:userId,nid:qhData.onid,equip:qhData.eid},
		function(data){
			if(data.st=="0"){
				Common.alert("强化等级已满，无法<span class='cor95 stro13'>进行强化 </span>");
			}
			else if(data.st=="1"){
				Common.alert("钱币不足，是否<span class='cor95 stro13'>前往摇钱树？ </span>",4,YQS.loadWindow);
			}
			else if(data.st=="2"){
				Common.alert("装备强化等级<span class='cor95 stro13'>不能超过主公等级 </span>");
			}
			else if(data.st=="3"){//强化成功
				//更新穿戴的装备的缓存
				for(key in data.equip){
//                                    alert('equip:'+key);
					qhData[key]=data.equip[key];
				}
                                var selPart = 'part_'+qhData['type'];
                                $("#qh_wj_list").currentPage().find('#'+selPart).find('.xnum1').text(qhData['level']);
				$("#qh_icon").attr('user_gold', data.user.gold);//更新金币数量
				qianghua.setQHData(qhData);//更新右面页面
			}
		});
	}
}

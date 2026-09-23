/**
 *合成页面脚本
 */
 Hecheng = {
 	loadWindow : function() {  //打开合成页面弹窗
 		/*
        var hechengWindow = new mesWindow("hechengWindow", $("#hecheng_tmpl").html());
        //关系窗口，释放内存
        $("#closeHechengWindow").bind(clickEventType, function() {
            Hecheng.h_data = null;
            Hecheng.hechengAble = null;
        });
        //合成按钮
        $("#btn_hecheng").bind(clickEventType,Hecheng.hecheng);
        $("#equipHechengList").setSlider({row:4,col:3});
        Hecheng.getEquipHCList();
        */
    },
    getEquipHCList : function(){ //请求装备列表数据
        //Hecheng.clearHecheng();
        $.getJN("http://"+host+"/sgg/i/hecheng/z.php", {
            uid:userId
        },
        function(data){
            Hecheng.setEquipList(data);  	
        });
    },
    setEquipList:function(equips){ //遍历右侧的装备列表
    	$("#equipHechengList").removeAllItem();
    	$("#equipHechengList>div").css("width","0px");
    	for(key in equips){
            //var equip = "<div typeid='"+key+"'  class='noStre'><img class='hcpos' style='width:80px;height:80px;' src='image/game/"+equips[key].img+"'/><p class='jiaobiao jbma4'>"+equips[key].up_level+"</p></div>";
            var equip = $("<div class='hc_equip' typeid='"+key+"'><p class='hc_pz1'><img src='image/game/"+equips[key].img+"'><span class='hc_num2'>"+equips[key].up_level+"</span</p></div>");
            equip.bind(clickEventType,Hecheng.equipClick)
            $("#equipHechengList").addSliderItem(equip);
        }
        $("#equipHechengList").autoFillItem("<div  class='hc_equip'></div>");
        $("#duanzaoWindow .zhaoM .con_hc").attr('loaded',"1");
    },
    equipClick:function(){  //单击右侧的装备
    	if(!Slider.checkTouchAvailabel(this)){
			return;
		}
        if($(this).attr("typeid")){
        	//setSelect(this);  //设置选中特效
            Hecheng.getEquipHecheng($(this).attr("typeid"));
        }	
    },
    h_data:null      //合成配方数据
    ,
    //获取装备合成的信息
    getEquipHecheng:function(equip_id){
        $.getJN("http://"+host+"/sgg/i/hecheng/q.php", {
            uid:userId,
            equipId:equip_id
        },
        function(data){
        	data.s_id = equip_id;
            Hecheng.setHechengEquip(data);
            Hecheng.h_data = data;
        });
    },
    setHechengEquip:function(data){
    	Hecheng.clearHecheng();
    	//设置目标装备信息
    	$("#t_equip_img").html("<div class='bu_pz"+data.target['class']+"'><img class='bors10' style='width:78px;height:78px;' src='image/game/"+data.target.img+"'></div>")
    	$("#hecheng_info>dt span:eq(0)").text(data.s_equip.name);
    	$("#hecheng_info>dt em").text(data.target.name);
		//属性情况
    	for(key in data.s_equip.attr){
    		for(k in data.target.attr){
    			if(k==key){
    				var attrName = Common.getLongAttrName(key);
    				$("#hecheng_info").append("<dd>"+attrName+" "+data.s_equip.attr[key]+"<span class='zouni1'></span><em>"+data.target.attr[k]+"</em></dd>");
    				break;
    			}
    		}	
        }
    	$("#hecheng_info").append("<dd>所属武将："+data.s_equip.npcName+"</dd>");
    	//设置材料信息
    	var n = 0;
    	for(key in data.met){
    		var obj = $("#metList>div:eq("+n+")");
    		obj.attr("data",JSON.stringify(data.met[key]));
    		obj.html("<img class='bors10' width='79' height='79' src='image/game/"+data.met[key].img+"'><span class='hc_num2'>"+data.met[key].num+"/"+data.met[key].max+"</span>");
    		//如果有一项材料不够
    		if(data.met[key].num<parseInt(data.met[key].max)){
    			Hecheng.hechengAble = false;
    		}
    		obj.bind(clickEventType,Hecheng.getMaterialInfo);
    		n++;
    	}
    	if(Hecheng.hechengAble){
    		$("#btn_hecheng").attr("class","pub_btn");
    	}
    },
    getMaterialInfo:function(){  //点击查看材料信息
    	//如果弹窗在则不弹出
    	if($("#equip_showwin").html()){
    		return false;
    	}
    	var data = JSON.parse($(this).attr("data"));
    	var mater = $("<div id='equip_showwin' class='pubPop4' style='position:absolute;left: 326px;width:200px;height:250px;padding:0 50px 50px 50px;'><div class='pubPopT fs16''>"+
			          "<dl class='cor55 pubPTt'><dt id='equip_name' class='fs20 cor95 stro13'>"+data.name+"</dt></dl>"+
			          "<p class='xz fr' style='height:0px;line-height:0px;'></p>"+
			          "<ul id='sail' class='pubPtc' style='color: rgb(255, 255, 255);'>"+
				      "<li id='text'>"+data.info+"</li></ul></div>"+
		              "<div class='tc pubB'><a style='margin-left:50px;' id='btn_mate_shouji' class='pub_btn2 stro12 fs20 tc fl'>去收集</a>" +
		              "</div></div>");
		$("#duanzaoWindow>.zhaoM").append(mater);
		//wuJiang.fixPosition($(this),mater);
		//去收集
		$("#btn_mate_shouji").bind(clickEventType,function(e){
			$("#equip_showwin").remove();
			$(this).unbind(clickEventType);
			$(document).unbind(touchDown);
			//可以去收集
			//可以去收集
			if(parseInt(data.mate_bid_type)==1){  //故事模式
				if(parseInt(data.u_bid_order)>=parseInt(data.mate_bid_order)){
					map.loadSmallMapWindowFromOtherWin(data.map_id,data.map_bid_id,data.mate_bid_type);
				}else{
					Common.alert("没遇到过掉落该材料的怪物，请继续完成征战");
				}
			}
			
			if(parseInt(data.mate_bid_type)==2){  //精英模式
				if(parseInt(data.u_jybid_order)>=parseInt(data.mate_bid_order)){
					elite.clickEliteCallBack(data.map_bid_id,data.map_id);
				}else{
					Common.alert("没遇到过掉落该材料的怪物，请继续完成精英劫塔");
				}
			}
		});
		//关闭
		$(document).bind(touchDown,function(e){
			if(e.target.id=="btn_mate_shouji"){
				
			}else{
				$("#equip_showwin").remove();
				$(this).unbind(touchDown);
			}
		});
    }
    ,
    hechengAble:true  //标示是否可合成
    ,
    hecheng:function(){  //合成按钮处理
    	if(Hecheng.h_data&&Hecheng.hechengAble){
    		$.getJSON("http://"+host+"/sgg/i/hecheng/h.php", {
                uid:userId,
                source:Hecheng.h_data.s_id,
                hecheng:Hecheng.h_data
            },
            function(data){
                if(data.isSuccess){  //返回合成成功                	
                    Hecheng.clearHecheng(); //清空合成的id以及图片
                    Hecheng.getEquipHCList();
                }
            });
    	}else{
    		Common.alert("<span class='cor95 stro13'>材料不够，不能合成，请继续收集合成材料</span>");
    	}
    },
    clearHecheng:function(){
    	Hecheng.hechengAble = true;
    	Hecheng.h_data = null;
    	$("#s_equip_name").text("原装备");
    	$("#t_equip_name").text("目标装备");
    	$("#t_equip_img,#metList>div").empty();
    	$("#btn_hecheng").attr("class","pub_btn4");
    	$("#hecheng_info>dd").remove();
    },
    hechengEquipForExternal:function(equipId){
        Hecheng.ExtEquipId = equipId;
        Hecheng.loadWindow();		
    },
    hechengZhoufuForExternal:function(zhoufuId){
        Hecheng.ExtZhoufuId = zhoufuId;
        Hecheng.loadWindow();	
    },
    setHechengSE:function(){  //合成特效
    	var array_img = ['se_hecheng/1.png','se_hecheng/2.png','se_hecheng/3.png','se_hecheng/4.png','se_hecheng/5.png',
    	             'se_hecheng/6.png','se_hecheng/7.png','se_hecheng/7.png','se_hecheng/9.png','se_hecheng/10.png'];
    	for(i=1;i<=5;i++){
    		SE.hecheng("hc_e"+i,array_img,87,1000);
    	}
    	SE.hecheng("hc_e6",array_img,150,1000);
    }
 }
 /**
  * 锻造(合成和强化)
  * @type 
  */
 var Duanzao = {
 	loadWindow:function(index){
 		var duanzaoWindow = new mesWindow("duanzaoWindow", $("#duanzao_tmpl").html());
 		$("#equipHechengList").setSlider({row:4,col:3});
 		$("#qh_wj_list").setSlider({row:1,col:1,multiPage:true,onPageChange:qianghua.wjPageChange});
 		if(index==2){  //合成
 			Duanzao.showHecheng();
 		}else{//强化
 			Duanzao.showQianghua();
 		}
 		$("#duanzaoWindow .zhaoNav img").bind(clickEventType,function(){
 			var type = $(this).attr("type");
 			if(type=="1"){
 				Duanzao.showQianghua();
 			}else if(type=="2"){
 				Duanzao.showHecheng();
 			}
 		});
 		//合成按钮
        $("#btn_hecheng").bind(clickEventType,Hecheng.hecheng);
 	},
 	showHecheng:function(){
 		$("#duanzaoWindow .zhaoM .con_hc").show();
 		$("#duanzaoWindow .zhaoM .con_qh").hide();
 		if($("#duanzaoWindow .zhaoM .con_hc").attr('loaded')=="0"){
 			Hecheng.getEquipHCList();
 		}
 	},
 	showQianghua:function(){
 		$("#duanzaoWindow .zhaoM .con_hc").hide();
 		$("#duanzaoWindow .zhaoM .con_qh").show();
 		if($("#duanzaoWindow .zhaoM .con_qh").attr('loaded')=="0"){
 			var ddd = $("#fromNpcList>dl");
 			var nid = 0;
 			$("#fromNpcList>dl").each(function(){
 				if($(this).attr("nid")){
 					nid = $(this).attr("nid");
 				}
 			});
 			qianghua.getUserInfo(nid);
 		}
 	}
 }
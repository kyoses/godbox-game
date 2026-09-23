 
var zhengXingArray = [];
var bz_limit=0;
Buzhen = {
    selectedWJ:null,
    flag:false,
    isChange:false,
    zxObj:null,
    zxTypeid:0,
	zxTypeNam:0,
	zxLevel:0,
	zxClass1:0,
	zxHtml:0,
    loadWindow : function() {
        var bzWindow = new mesWindow("bgwindow", $("#buzhen_tmpl").html(),25);
        $("#close_buzhen_window").bind(clickEventType, function() {
        	Buzhen.selectedWJ=null;Buzhen.flag=false;Buzhen.isChange=false;
        	Buzhen.zxObj=null;Buzhen.zxTypeid=0;Buzhen.zxTypeNam=0;Buzhen.zxLevel=0;
        	Buzhen.zxClass1=0;Buzhen.zxHtml=0;Buzhen.zxHtml=0;
            var zx = Buzhen.getZhenxingString();
            $.getJN("http://" + host + "/sgg/i/form/s.php", { 
                uid : userId,
                f : zx
            },function(data){
            	user.setFromNpcInfo(data.formation);
            	//更新任务
				user.refreshTaskInfo();
            });
            bzWindow.closeWindow(this);
            DialogLevel = 0;
        });
        Buzhen.getZhenxingInfo(userId);
    },
    getZhenxingInfo : function(uid) {
        $.getJN("http://" + host + "/sgg/i/form/f.php", {
            uid : userId
        }, function(data) {
            if (data != null && data != "") {
            	var listlength = 0;
            	bz_limit=data.limit;
                /* 遍历武将列表  */
                if(data.list){
	                for (key in data.list) {
	                	var img = data.list[key].s_img.replace("png", "png"); 
						var wj = "<div class='cell' class1='"+data.list[key].class1+"' typeid='"+data.list[key].id+"' typename='"+ data.list[key].name+ "' level='"+ data.list[key].level+ "'>" +"<p class='bu_pz"+data.list[key].class1+data.list[key].class1+"'><img src='image/game/"+img+"'></p><p class='buJb'><img src='image/sys/bz_jb"+data.list[key].class1+".png'></p><span class='xnum2'>"+data.list[key].level+"</span></div>";
						$("#ZXWujiangList").append(wj);
						listlength++;
	                }
	                //判断用户武将个数不足24个则自动补齐
	                var mo=24-listlength;
	                for(var i=0;i<mo;i++){
	                	$("#ZXWujiangList").append("<div class='cell'></div>");
	                }
                }else{
                	for (var i = 0; i < 24; i++) {
                        $("#ZXWujiangList").append("<div class='cell'></div>");
                    }
                }
                $("#ZXWujiangList div:gt(5)").hide();//初始化，前面6条数据显示，其他的数据隐藏。
                var total_q=$("#ZXWujiangList div").index()+1;//总数据 
                var current_page=6;//每页显示的数据 
                var current_num=1;//当前页数 
                var total_page= Math.ceil(total_q/current_page);//总页数   
                if(total_page==1){
        			$('#next').hide();
        			$('#prev').hide();
                }else{
                	$('#prev').hide();
                }
                $("#next").bind(clickEventType,function(){
                    if(current_num==total_page){ 
                        return false;//如果大于总页数就禁用下一页 
                    }else{ 
                    	++current_num;
                        $.each($('#ZXWujiangList div'),function(index,item){ 
                        	var start = current_page* (current_num-1);//起始范围 
                        	var end = current_page * current_num;//结束范围 
                        	if(index >= start && index < end){//如果索引值是在start和end之间的元素就显示，否则就隐 
                        		if(current_num==total_page){
                        			$('#next').hide();
                        			$('#prev').show();
                        		}else{
                        			$('#next').show();
                        			$('#prev').show();
                        		}
                        		$(this).show();
                        	}else {
                        		$(this).hide();
                        	} 
                        });
                    }
                });
                $("#prev").bind(clickEventType,function(){
                    if(current_num==1){ 
                        return false; 
                    }else{ 
                    	--current_num; 
                        $.each($('#ZXWujiangList div'),function(index,item){ 
                            var start = current_page* (current_num-1);//起始范围 
                            var end = current_page * current_num;//结束范围 
                            if(index >= start && index < end){//如果索引值是在start和end之间的元素就显示，否则就隐藏 
                            	if(current_num==1){
                            		$("#prev").hide();
                            		$("#next").show();
                            	}else{
                        			$('#next').show();
                        			$('#prev').show();
                        		}
                            	$(this).show();
                            }else {
                                $(this).hide();  
                            } 
                        });      
                    } 
                });
                $("#ZXWujiangList .cell").bind(clickEventType, function() {//绑定左侧武将点击事件
                	Buzhen.WjListClick($(this));
                });
                /* 遍历阵型列表 */
                var length = 1;
                $("#zhenxingList div").each(function() {
                    var id = parseInt($(this).attr("id").split("_")[1]);
                    zhengXingArray[id] = this;
                });
                for (key in data.formation) {
                    for (i in data.formation[key]) {
                        if (data.formation[key][i].level) {
                        	//添加阵上npc的属性(id,name,level,class)
                        	var img = data.formation[key][i].s_img.replace("png", "png");
                            $(zhengXingArray[length]).attr({"typeid":data.formation[key][i].id,"typename":data.formation[key][i].name,"level":data.formation[key][i].level,"class1":data.formation[key][i].class1});
                            $(zhengXingArray[length]).html("<img width=96 height=96 src='image/game/"+img+"'/>");
                        }
                        length++;
                    }
                }
            }
            $("#bz_num").text($("#zhenxingList div").find("img").size()+"/"+bz_limit);
            $("#zhenxingList>div").bind(clickEventType, function() {//绑定阵型上面武将点击事件
            	Buzhen.ZhenXingList($(this));
            });
            if(director.progress>0){
            	director.updateProgress();
            }
        });
    },
    getZhenxingString : function() {// 获取要保存的阵型信息
        var ZhenxingString = ""; // 定义返回的阵型信息字符串
        for (var i = 1; i <= 9; i++) {
            var id = "0";
            if ($(zhengXingArray[i]).attr("typeid")) {
                id = $(zhengXingArray[i]).attr("typeid");
            }
            if (ZhenxingString == "") {
                ZhenxingString = id;
            } else {
                if (i == 4 || i == 7) {
                    ZhenxingString += "|" + id;
                } else {
                    ZhenxingString += "," + id;
                }
            }
        }
        return ZhenxingString;
    },
    WjListClick:function(obj){
        if (obj.attr("typeid")) {
        	obj.siblings().children("p").removeClass("bzL ");
        	obj.children("p").eq(0).addClass("bzL");
        	obj.siblings().find(".buJb").removeAttr("style");
        	obj.find(".buJb").css("margin-top","-40px");
        	Buzhen.selectedWJ = obj;
        	Buzhen.isChange=false;  //每点击一次重置一次布阵标示变量 
        	if(director.progress>0){
        		director.updateProgress();
        	}
        }
    },
    //先点击武将阵型上面的武将  在给左侧武将列表绑定点击事件
    wjLeftClick:function(obj){
    	//alert(8);
    	obj.siblings().children("p").removeClass("bzL ");
    	obj.children("p").addClass("bzL");
    	Buzhen.selectedWJ = obj;
    	Buzhen.isChange=false;  //每点击一次重置一次布阵标示变量 
        if(obj.attr("typeid")){ //点击的是武将列表   武将的头像
        	//alert(10);
			var wjLevel = obj.attr("level");
			var wjTypename = obj.attr("typename");
			var wjTypeid = obj.attr("typeid");
			var wjClass1 = obj.attr("class1");
			var wjHtml = obj.find("p").html();
			Buzhen.zxObj.attr({"typeid":wjTypeid,"typename":wjTypename,"level":wjLevel,"class1":wjClass1});
			Buzhen.zxObj.html(wjHtml);
			Buzhen.zxObj.removeClass("bzR");
			obj.find("p").removeClass("bzL");
			obj.attr({"typeid":Buzhen.zxTypeid,"typename":Buzhen.zxTypeName,"level":Buzhen.zxLevel,"class1":Buzhen.zxClass1});
			obj.find("p").eq(0).html(Buzhen.zxHtml);
			obj.find("p").eq(0).removeClass("bu_pz"+wjClass1+wjClass1);
			obj.find("p").eq(0).addClass("bu_pz"+Buzhen.zxClass1+Buzhen.zxClass1);
			obj.find(".buJb").html('<img src="image/sys/bz_jb'+Buzhen.zxClass1+'.png" />');
			obj.find(".xnum2").text(Buzhen.zxLevel);
			Buzhen.selectedWJ = null;
			Buzhen.flag=false;
			$("#ZXWujiangList .cell").unbind(clickEventType);
			$("#ZXWujiangList .cell").bind(clickEventType,function(){
				Buzhen.WjListClick($(this));
			});
        }else if(!obj.attr("typeid")){ //点击的是武将列表页   么有武将头像的地方
        	//alert(9);
        	Buzhen.zxObj.removeAttr("typeid");
        	Buzhen.zxObj.removeAttr("typename");
        	Buzhen.zxObj.removeAttr("level");
        	Buzhen.zxObj.removeAttr("class1");
        	Buzhen.zxObj.removeClass("bzR");
			obj.attr({"typeid":Buzhen.zxTypeid,"typename":Buzhen.zxTypeName,"level":Buzhen.zxLevel,"class1":Buzhen.zxClass1});
			obj.html("<p class='bu_pz"+Buzhen.zxClass1+Buzhen.zxClass1+"'>"+Buzhen.zxHtml+"</p><p class='buJb'><img src='image/sys/bz_jb"+Buzhen.zxClass1+".png' /></p><span class='xnum2'>"+Buzhen.zxLevel+"</span>");
			Buzhen.zxObj.html("");
			obj.find("p").eq(0).addClass("bu_pz"+Buzhen.zxClass1+Buzhen.zxClass1);
			
			$("#bz_num").text($("#zhenxingList div").find("img").size()+"/"+bz_limit);
			Buzhen.selectedWJ = null;
			Buzhen.flag=false;
			$("#ZXWujiangList .cell").unbind(clickEventType);
			$("#ZXWujiangList .cell").bind(clickEventType,function(){
				Buzhen.WjListClick($(this));
			});
		}
    },
    ZhenXingList:function(obj){//点击阵型列表
    	var size = $("#zhenxingList>div").find("img").size();
        if (Buzhen.selectedWJ != null && !obj.attr("typeid")) { // 从武将列表添加   点击阵型列表空白处
        	if(Buzhen.isChange==true){
        		return false;
        	}
        	var limit = bz_limit;
        	if (size >= limit) {
                Common.alert(" <span class='cor95 stro13'>上阵人数</span> 不能超过<span class='cor95'>上限</span>");
                return;
            }
        	obj.attr("typeid", Buzhen.selectedWJ.attr("typeid"));
        	obj.attr("typename",Buzhen.selectedWJ.attr("typename"));
        	obj.attr("level", Buzhen.selectedWJ.attr("level"));
        	obj.attr("class1",Buzhen.selectedWJ.attr("class1"));
        	obj.html(Buzhen.selectedWJ.find("p").html());
            //Buzhen.selectedWJ.children("p").removeClass("bzR");
        	Buzhen.selectedWJ.removeAttr("typeid");Buzhen.selectedWJ.removeAttr("typename");Buzhen.selectedWJ.removeAttr("level");Buzhen.selectedWJ.removeAttr("class1");
        	Buzhen.selectedWJ.empty();
            Buzhen.selectedWJ = null;
            isChange = true;
            if(director.progress>0){
            	director.updateProgress();
            }
        }else if(Buzhen.selectedWJ != null && obj.attr("typeid")){ // 从武将列表添加   点击阵型列表已经在阵上的武将
        	//alert(2);
        	if(Buzhen.isChange==true){
        		return false;
        	}
        	//设置现在阵上被点击的武将参数信息
        	var selectWjTypeid = Buzhen.selectedWJ.attr("typeid");
        	var selectWjTypeName = Buzhen.selectedWJ.attr("typename");
        	var selectWjLevel = Buzhen.selectedWJ.attr("level");
        	var selectWjClass1 = Buzhen.selectedWJ.attr("class1");
        	var selectWjHtml = Buzhen.selectedWJ.find("p").html();
        	//设置武将列表页被选择的武将参数信息
        	var ZhenXingTypeid = obj.attr("typeid");
        	var ZhenXingTypeName = obj.attr("typename");
        	var ZhenXingLevel = obj.attr("level");
        	var ZhenXingClass1 = obj.attr("class1");
        	var ZhenXingHtml = obj.html();
        	//设置阵上武将为武将列表页的武将信息
            obj.attr("typeid",selectWjTypeid);
            obj.attr("typename",selectWjTypeName);
            obj.attr("level",selectWjLevel);
            obj.attr("class1",selectWjClass1);
            obj.html(selectWjHtml);
            //设置武将列表页被选择的武将信息为武将阵型 上 被替换掉的武将的信息
            Buzhen.selectedWJ.attr("typeid",ZhenXingTypeid);
            Buzhen.selectedWJ.attr("typename",ZhenXingTypeName);
            Buzhen.selectedWJ.attr("level",ZhenXingLevel);
            Buzhen.selectedWJ.attr("class1",ZhenXingClass1);
            Buzhen.selectedWJ.find("p").eq(0).html(ZhenXingHtml);
            Buzhen.selectedWJ.find("p").eq(0).find("img").attr({width:95,height:95});
            Buzhen.selectedWJ.find("p").eq(0).removeClass("bzL");
            Buzhen.selectedWJ.find("p").eq(0).removeClass("bu_pz"+selectWjClass1+selectWjClass1);
            Buzhen.selectedWJ.find("p").eq(0).addClass("bu_pz"+ZhenXingClass1+ZhenXingClass1);
            Buzhen.selectedWJ.find(".buJb").removeAttr("style");
            Buzhen.selectedWJ.find(".buJb").html('<img src="image/sys/bz_jb'+ZhenXingClass1+'.png">');
            Buzhen.selectedWJ.find(".xnum2").text(ZhenXingLevel);
            Buzhen.isChange = true;
            Buzhen.selectedWJ = null;
        }else if(Buzhen.selectedWJ == null && (obj.attr("typeid") || !obj.attr("typeid"))){//直接点击武将阵型 替换 阵型已布置的武将
        	//alert(3);
        	if(Buzhen.zxObj==obj){
        		return false;
        	}
        	if(Buzhen.flag){
        		//alert(4);
        		var zxTypeidNew = obj.attr("typeid");
        		var zxTypeNameNew = obj.attr("typename");
        		var zxLevelNew = obj.attr("level");
        		var zxClass1New = obj.attr("class1");
        		var zxHtmlNew = obj.html();
        		if(zxTypeidNew!=undefined && zxTypeNameNew!=undefined && zxLevelNew!=undefined && zxClass1New!=undefined && zxHtmlNew!=undefined){
            		obj.html(Buzhen.zxHtml);
            		obj.attr("typeid",Buzhen.zxTypeid);
            		obj.attr("typename",Buzhen.zxTypeName);
            		obj.attr("level",Buzhen.zxLevel);
            		obj.attr("class1",Buzhen.zxClass1);
            		Buzhen.zxObj.attr("typeid",zxTypeidNew);
            		Buzhen.zxObj.attr("typename",zxTypeNameNew);
            		Buzhen.zxObj.attr("level",zxLevelNew);
            		Buzhen.zxObj.attr("class1",zxClass1New);
            		Buzhen.zxObj.html(zxHtmlNew);
            		Buzhen.zxObj.removeClass("bzR");
            		Buzhen.zxObj=obj;
        		}else{
        			obj.html(Buzhen.zxHtml);
        			obj.attr({"typeid":Buzhen.zxTypeid,"typename":Buzhen.zxTypeName,"level":Buzhen.zxLevel,"class1":Buzhen.zxClass1});
        			Buzhen.zxObj.removeAttr("typeid");Buzhen.zxObj.removeAttr("typename");Buzhen.zxObj.removeAttr("level");Buzhen.zxObj.removeAttr("class1");
        			Buzhen.zxObj.html("");
        			Buzhen.zxObj.removeClass("bzR");
        			Buzhen.zxObj=obj;
        		}
            	Buzhen.selectedWJ=null;Buzhen.flag=false;Buzhen.isChange=false;
            	Buzhen.zxObj=null;Buzhen.zxTypeid=0;Buzhen.zxTypeNam=0;Buzhen.zxLevel=0;
            	Buzhen.zxClass1=0;Buzhen.zxHtml=0;Buzhen.zxHtml=0;
        		//Buzhen.flag=false;
        	}else{
        		//alert(5);
        		if(obj.html()==''){
        			return false;
        		}
        		Buzhen.zxTypeid = obj.attr("typeid");
        		Buzhen.zxTypeName = obj.attr("typename");
        		Buzhen.zxLevel = obj.attr("level");
        		Buzhen.zxClass1 = obj.attr("class1");
        		Buzhen.zxHtml = obj.html();
        		Buzhen.zxObj = obj;
        		obj.siblings().removeClass("bzR");
        		obj.addClass("bzR");
        		Buzhen.flag=true;
        		$("#ZXWujiangList .cell").unbind(clickEventType);
                $("#ZXWujiangList .cell").bind(clickEventType, function() {//绑定左侧武将点击事件
                	Buzhen.wjLeftClick($(this));
                });
        	}
        }
        $("#bz_num").text($("#zhenxingList div").find("img").size()+"/"+bz_limit);
    },
    refreshUserFormation:function(){
    	$.getJN("http://" + host + "/sgg/i/form/r.php", { 
            uid : userId
        },function(data){
        	user.setFromNpcInfo(data.formation);
        });
    }
};
$(function(){	
    // 删除武将列表中的武将
    function removeListWujiang(obj) {
        $(obj).html("");
        $(obj).removeAttr("typeid");
        $(obj).removeAttr("typename");
        $(obj).removeAttr("level");
        $(obj).removeAttr("class1");
    }
    //设置武将选中特效
    function setSelectWujiang(obj){
    	clearSelectWujiang();
    	var imgArray = ['se_select/s1.png','se_select/s2.png','se_select/s3.png','se_select/s4.png',
                   'se_select/s5.png','se_select/s6.png','se_select/s7.png','se_select/s8.png'];
        //圈圈的位置
    	var styleStr="width:95px;height:95px;overflow: hidden;";
    	var img = "<dd style='margin-top:-93px;margin-left:-3px;'><img id='bz_select' style='"+styleStr+"' src='image/sys/se_select/s1.png'/></dd>";
    	$(obj).append(img);
    	var n = 0;
    	Buzhen.myselect = setInterval(function(){
    		$("#bz_select").attr("src","image/sys/"+imgArray[n]);
    		n++;
    		if(n==imgArray.length){
    			n=0;
    		}
    	},100);
    }
    function clearSelectWujiang(){
    	clearInterval(Buzhen.myselect);
    	if(document.getElementById("bz_select")){
    		$("#bz_select").remove();
    	}	
    }
    $("#close_buzhen_window").live(clickEventType,function(){
    	clearSelectWujiang();
    });
});

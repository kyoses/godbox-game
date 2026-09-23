var raising = {
    object_id:0,
    rep_cost:100,
    loadWindow:function(obj_id){
        raising.object_id = obj_id;
        var raisingWindow = new mesWindow("raisingwindow",$("#raising_tmpl").html());
        raising.getRaisingInfo(obj_id);
    },
    getRaisingInfo:function(obj_id) {
        raising.raisingClose();
        $.getJN("http://"+host+"/sgg/i/raising/raising.php", {uid:userId, obj_id:obj_id},
            function(data){
//                alert(JSON.stringify(data));
                $("#raising_gen_name").text(data.general.name);
                Common.setNpcClassStar($("#raising_gen_star"),data['general']['can'],data['general']['star']);
                $("#raising_yb").html("<img src='image/sys/gold.png' />&thinsp;"+user.formatRepu(data.user.yb));
                $("#raising_rep").html("声望&thinsp;"+user.formatRepu(data.user.reputation));
                var temp = '';
                var item = "<dt class='fs24 cor55 tc'>武将附加属性</dt>";
                for (key in data.general.info.attr) {
                    var pos = '';
                    if (parseInt(data.general.level) > key) {
                        if (key == 1) {
                            pos = "<div class='sLine1 p8 w120 r15'></div>";
                        }
                        else if (key == 2) {
                            pos = "<div class='sLine2 p9 w150 r10'></div>";
                        }
                        else if (key == 3) {
                            pos = "<div class='sLine4 p10 w135 r52'></div>";
                        }
                        else if (key == 4) {
                            pos = "<div class='sLine3 p11 w183 r25'></div>";
                        }
                        else if (key == 5) {
                            pos = "<div class='sLine2 p12 w170 r30'></div>";
                        }
                        else if (key == 6) {
                            pos = "<div class='sLine1 p13 w240 r40'></div>";
                        }
                        else if (key == 7) {
                        }
                        else {
                            pos = "<div class='sLine1 p8 w120 r15'>";
                        }
                    }
                    if (data.general.class == 1) {
                        if (data.general.level == key) {
                            if (data.general.level == 7) {
                                temp += "<div class='culC3 p"+key+"'><p class='culMLCT fs24 shad1' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>"+pos;
                            }
                            else {
                                temp += "<div class='culC1 p"+key+"'><p class='culMLCT fs24 shad1' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>"+pos;
                            }
                        }
                        else if (data.general.level > key) {
                            temp += "<div class='culC3 p"+key+"'></div>"+pos;
                        }
                        else {
                            temp += "<div class='culC1 p"+key+"'></div>"+pos;
                        }
                    }
                    else if (data.general.class == 2) {
                        if (data.general.level == key) {
                            if (data.general.level == 7) {
                                temp += "<div class='culC4 p"+key+"'><p class='culMLCT fs24 shad1' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>"+pos;
                            }
                            else {
                                temp += "<div class='culC1 p"+key+"'><p class='culMLCT fs24 shad1' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>"+pos;
                            }
                        }
                        else if (data.general.level > key) {
                            temp += "<div class='culC4 p"+key+"'></div>"+pos;
                        }
                        else {
                            temp += "<div class='culC1 p"+key+"'></div>"+pos;
                        }
                    }
                    else if (data.general.class == 3) {
                        if (data.general.level == key) {
                            if (data.general.level == 7) {
                                temp += "<div class='culC5 p"+key+"'><p class='culMLCT fs24 shad1' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>"+pos;
                            }
                            else {
                                temp += "<div class='culC1 p"+key+"'><p class='culMLCT fs24 shad1' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>"+pos;
                            }
                        }
                        else if (data.general.level > key) {
                            temp += "<div class='culC5 p"+key+"'></div>"+pos;
                        }
                        else {
                            temp += "<div class='culC1 p"+key+"'></div>"+pos;
                        }
                    }
                    else if (data.general.class == 4) {
                        if (data.general.level == key) {
                            if (data.general.level == 7) {
                                temp += "<div class='culC6 p"+key+"'><p class='culMLCT fs24 shad1' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>"+pos;
                            }
                            else {
                                temp += "<div class='culC1 p"+key+"'><p class='culMLCT fs24 shad1' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>"+pos;
                            }
                        }
                        else if (data.general.level > key) {
                            temp += "<div class='culC6 p"+key+"'></div>"+pos;
                        }
                        else {
                            temp += "<div class='culC1 p"+key+"'></div>"+pos;
                        }
                    }
                    else if (data.general.class == 5) {
                        if (data.general.level == key) {
                            if (data.general.level == 7) {
                                temp += "<div class='culC3 p"+key+"'><p class='culMLCT fs24 shad1' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>"+pos;
                            }
                            else {
                                temp += "<div class='culC1 p"+key+"'><p class='culMLCT fs24 shad1' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>"+pos;
                            }
                        }
                        else if (data.general.level > key) {
                            temp += "<div class='culC7 p"+key+"'></div>"+pos;
                        }
                        else {
                            temp += "<div class='culC1 p"+key+"'></div>"+pos;
                        }
                    }
                    else if (data.general.class == 6) {
                        if (data.general.level == key) {
                            if (data.general.level == 7) {
                                temp += "<div class='culC3 p"+key+"'><p class='culMLCT fs24 shad1' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>"+pos;
                            }
                            else {
                                temp += "<div class='culC1 p"+key+"'><p class='culMLCT fs24 shad1' style='margin:15px 0 0 60px' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>"+pos;
                            }
                        }
                        else if (data.general.level > key) {
                            temp += "<div class='culC8 p"+key+"'></div>"+pos;
                        }
                        else {
                            temp += "<div class='culC1 p"+key+"'></div>"+pos;
                        }
                    }
                    else {
                        if (data.general.level == key) {
                            temp += "<div class='culC1 p"+key+"'><p class='culMLCT fs24 shad1' id='raising_text'>"+data.general.exp+"/"+data.general.info.attr[key].exp+"</p></div>";
                        }
                        else if (data.general.level > key) {
                            temp += "<div class='culC2 p"+key+"'></div>"+pos;
                        }
                        else {
                            temp += "<div class='culC1 p"+key+"'></div>";
                        }
                    }
                    if (data.general.level>key) {
                        item += "<dd class='culO' id='gen_attr"+key+"'>"+Common.getLongAttrName(data.general.info.attr[key].eff)+"+"+data.general.info.attr[key].val+"</dd>";
                    }
                    else {
                        if (data.general.level == 7) {
                            item += "<dd class='culO' id='gen_attr"+key+"'>"+Common.getLongAttrName(data.general.info.attr[key].eff)+"+"+data.general.info.attr[key].val+"</dd>";
                        }
                        else {
                            item += "<dd class='culH' id='gen_attr"+key+"'>"+Common.getLongAttrName(data.general.info.attr[key].eff)+"+"+data.general.info.attr[key].val+"</dd>";
                        }
                    }
                }
                if (parseInt(data.user.reputation)>=raising.rep_cost) {
                    temp += "<div class='culBtn stro20 fs20 tc' id='raising_on'>100声望</div>";
                }
                else {
                    temp += "<div class='culBtn stro20 fs20 tc' id='raising_on'>"+data.user.cost+"元宝</div>";
                }
                $("#raising_ball").html(temp);
                $("#raising_attr").html(item);
                $("#raising_ball").find(".p7").find(".culMLCT").attr("style", "margin:15px 0 0 60px");
                if (parseInt(data.user.reputation)>=raising.rep_cost) {
                    $("#raising_on").bind(clickEventType, raising.repRaising);
                }
                else {
                    $("#raising_on").bind(clickEventType, raising.ybRaising);
                }
                if (data.general.exp>=data.general.expUp) {
                    $("#raising_lvUp").attr("class", "pub_btn");
                    $("#raising_lvUp").bind(clickEventType, raising.raisingShow);
                    $("#raising_on").html("已满").unbind(clickEventType);
                }
                else {
                    $("#raising_lvUp").attr("class", "pub_btn4");
                    $("#raising_lvUp").unbind(clickEventType);
                }
            });
    },
    repRaising:function() {
//        alert("repUp");
        $.getJN("http://"+host+"/sgg/i/raising/raising.php", {uid:userId, obj_id:raising.object_id, repUp:1},
            function(data){
                if (data.st == -1) {
                    Common.alert("声望不足");
                }
                else if (data.st == 1) {
                    // 升级
                    var gen_class = ((parseInt(data.class) + 2)>8)?8:((parseInt(data.class) + 2));
                    if (data.up_flag == 1) {
                        var ball = data.level;
                        var bef = ball - 1;
                        $("#raising_text").remove();
                        var pos;
                        if (bef == 1) {
                            pos = "<div class='sLine1 p8 w120 r15'></div>";
                        }
                        else if (bef == 2) {
                            pos = "<div class='sLine2 p9 w150 r10'></div>";
                        }
                        else if (bef == 3) {
                            pos = "<div class='sLine4 p10 w135 r52'></div>";
                        }
                        else if (bef == 4) {
                            pos = "<div class='sLine3 p11 w183 r25'></div>";
                        }
                        else if (bef == 5) {
                            pos = "<div class='sLine2 p12 w170 r30'></div>";
                        }
                        else if (bef == 6) {
                            pos = "<div class='sLine1 p13 w240 r40'></div>";
                        }
                        else if (bef == 7) {
                        }
                        else {
                            pos = "<div class='sLine1 p8 w120 r15'>";
                        }
                        
                        if (parseInt(ball) == 7) {
                            $(".p"+ball).html("<p class='culMLCT fs24 shad1' style='margin:15px 0 0 60px' id='raising_text'>"+data.left_exp+"/"+data.expUp+"</p>");
                        }
                        else {
                            $(".p"+ball).html("<p class='culMLCT fs24 shad1' id='raising_text'>"+data.left_exp+"/"+data.expUp+"</p>");
                        }
                        $("#gen_attr"+bef).attr("class", "culO");
                        var tmp_str = $(".p"+bef).attr("class");
                        var str_af = tmp_str.replace(/culC(\d) /, "culC"+gen_class+" ");
                        $(".p"+bef).attr("class", str_af).after(pos);
                    }
                    else if (data.up_flag == 2) {
                        $("#gen_attr7").attr("class", "culO");
                        $("#raising_text").html(data.left_exp+"/"+data.expUp);
                        $("#raising_lvUp").attr("class", "pub_btn");
                        $("#raising_lvUp").bind(clickEventType, raising.raisingShow);
                        $("#raising_on").html("已满").unbind(clickEventType);
                        var ball = data.level;
                        var tmp_str = $(".p"+ball).attr("class");
                        var str_af = tmp_str.replace(/culC(\d) /, "culC"+gen_class+" ");
                        $(".p"+ball).attr("class", str_af).after(pos);
                    }
                    else {
                        $("#raising_text").html(data.left_exp+"/"+data.expUp);
                    }
                    $("#raising_rep").html("声望&thinsp;"+user.formatRepu(data.left_rep));
                    $("#userRepu").text(user.formatRepu(data.left_rep));
                    if (parseInt(data.left_rep)<raising.rep_cost) {
                        $("#raising_on").unbind(clickEventType);
                        $("#raising_on").html((data.raising_num*5+5)+"元宝");
                        $("#raising_on").bind(clickEventType, raising.ybRaising);
                    }
                    
                    if ($("#raising_text").parent().hasClass("p1")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:60px;left:0px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"-10px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else if ($("#raising_text").parent().hasClass("p2")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:20px;left:110px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"-50px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else if ($("#raising_text").parent().hasClass("p3")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:-10px;left:270px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"-80px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else if ($("#raising_text").parent().hasClass("p4")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:100px;left:370px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"30px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else if ($("#raising_text").parent().hasClass("p5")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:170px;left:180px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"90px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else if ($("#raising_text").parent().hasClass("p6")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:260px;left:40px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"190px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else if ($("#raising_text").parent().hasClass("p7")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:330px;left:270px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"260px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:170px;left:180px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"90px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    //                    alert($("#raising_jump").attr("style"));
                    setTimeout(function(){$("#raising_jump").remove();}, 500);
                }
                else {
                    Common.alert("错误的访问，请重试");
                }
            });
    },
    ybRaising:function() {
//        alert("ybUp");
        $.getJN("http://"+host+"/sgg/i/raising/raising.php", {uid:userId, obj_id:raising.object_id, ybUp:1},
            function(data){
                if (data.st == -2) {
                    Common.alert("元宝不足");
                }
                else if (data.st == 1) {
                    // 升级
                    var gen_class = ((parseInt(data.class) + 2)>8)?8:((parseInt(data.class) + 2));
                    if (data.up_flag == 1) {
                        var ball = data.level;
                        var bef = ball - 1;
                        $(".culMLCT").remove();
                        var pos;
                        if (bef == 1) {
                            pos = "<div class='sLine1 p8 w120 r15'></div>";
                        }
                        else if (bef == 2) {
                            pos = "<div class='sLine2 p9 w150 r10'></div>";
                        }
                        else if (bef == 3) {
                            pos = "<div class='sLine4 p10 w135 r52'></div>";
                        }
                        else if (bef == 4) {
                            pos = "<div class='sLine3 p11 w183 r25'></div>";
                        }
                        else if (bef == 5) {
                            pos = "<div class='sLine2 p12 w170 r30'></div>";
                        }
                        else if (bef == 6) {
                            pos = "<div class='sLine1 p13 w240 r40'></div>";
                        }
                        else if (bef == 7) {
                        }
                        else {
                            pos = "<div class='sLine1 p8 w120 r15'>";
                        }
                        
                        if (ball == 7) {
                            $(".p"+ball).html("<p class='culMLCT fs24 shad1' style='margin:15px 0 0 60px' id='raising_text'>"+data.left_exp+"/"+data.expUp+"</p>");
                        }
                        else {
                            $(".p"+ball).html("<p class='culMLCT fs24 shad1' id='raising_text'>"+data.left_exp+"/"+data.expUp+"</p>");
                        }
                        $("#gen_attr"+bef).attr("class", "culO");
                        $("#raising_on").html((data.raising_num*5+5)+"元宝");
                        var tmp_str = $(".p"+bef).attr("class");
                        var str_af = tmp_str.replace(/culC(\d) /, "culC"+gen_class+" ");
                        $(".p"+bef).attr("class", str_af).after(pos);
                    }
                    else if (data.up_flag == 2) {
                        $("#gen_attr7").attr("class", "culO");
                        $(".culMLCT").html(data.left_exp+"/"+data.expUp);
                        $("#raising_lvUp").attr("class", "pub_btn");
                        $("#raising_lvUp").bind(clickEventType, raising.raisingShow);
                        $("#raising_on").html("已满").unbind(clickEventType);
                        var ball = data.level;
                        var tmp_str = $(".p"+ball).attr("class");
                        var str_af = tmp_str.replace(/culC(\d) /, "culC"+gen_class+" ");
                        $(".p"+ball).attr("class", str_af).after(pos);
                    }
                    else {
                        $(".culMLCT").html(data.left_exp+"/"+data.expUp);
                        $("#raising_on").html((data.raising_num*5+5)+"元宝");
                    }
                    $("#raising_yb").html("<img src='image/sys/gold.png' />&thinsp;"+user.formatGold(data.left_yb));
                    $("#ybNum").text(user.formatGold(data.left_yb));
                    
                    if ($("#raising_text").parent().hasClass("p1")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:60px;left:0px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"-10px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else if ($("#raising_text").parent().hasClass("p2")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:20px;left:110px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"-50px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else if ($("#raising_text").parent().hasClass("p3")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:-10px;left:270px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"-80px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else if ($("#raising_text").parent().hasClass("p4")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:100px;left:370px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"30px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else if ($("#raising_text").parent().hasClass("p5")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:170px;left:180px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"90px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else if ($("#raising_text").parent().hasClass("p6")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:260px;left:40px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"190px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else if ($("#raising_text").parent().hasClass("p7")) {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:330px;left:270px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"260px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
                    else {
                        $("#raising_text").parent().after("<div id='raising_jump' class='fs20' style='top:170px;left:180px;width:400px'></div>");
                        $("#raising_jump").text("经验+"+data.get_exp).animate({top:"90px","fontSize":"50px",opacity:"0.1"}, 500);
                    }
//                    alert($("#raising_jump").attr("style"));
                    setTimeout(function(){$("#raising_jump").remove();}, 500);
                }
                else {
                    Common.alert("错误的访问，请重试");
                }
            });
    },
    raisingShow:function() {
        $("#raising_page").removeAttr("style");
        $("#raising_page_close").bind(clickEventType, raising.raisingClose);
        $.getJN("http://"+host+"/sgg/i/raising/raising.php", {uid:userId, obj_id:raising.object_id, raisingPage:1},
            function(data){
                if (data.this_gen) {
                    var str_star = '', str_att='';
                    for(var i=0;i<data.this_gen.star;i++){
                        str_star += "<img src='image/sys/zStar.png'>";
                    }
                    if (data.this_gen.type == 1) {
                        str_att = "物理攻击："+data.this_gen.phy_att;
                    }
                    else {
                        str_att = "法术攻击："+data.this_gen.mag_att;
                    }
                    var item = "<dl class='zhaoList zL"+data.this_gen.class+"'><dt class='zhaoListT'>"+data.level+"</dt><dd><img src='image/game/"+data.this_gen.img+"' height='163' width='163' /></dd><dd class='zhaoStar'>"+str_star+"</dd><dd class='wjName'>"+data.this_gen.name+"</dd></dl><ul class='fl cor55 fs22 pyPLTxt'><li class='cor111'>武将属性</li><li>力量："+data.this_gen.strength+"</li><li>智力："+data.this_gen.intelligence+"</li><li>生命："+data.this_gen.hp+"</li><li>"+str_att+"</li><li>物理防御："+data.this_gen.phy_def+"</li><li>法术防御："+data.this_gen.mag_def+"</li><li><span class='cor111'>技能</span> - <span class='fs22'>"+data.this_gen.skill.name+"</span></li></ul>";
                    $("#raising_this_gen").html(item);
                }
                if (data.next_gen) {
                    var str_star = '', str_att='';
                    for(var i=0;i<data.next_gen.star;i++){
                        str_star += "<img src='image/sys/zStar.png'>";
                    }
                    if (data.next_gen.type == 1) {
                        str_att = "物理攻击：<span class='cor112'>"+data.next_gen.phy_att+"</span>";
                    }
                    else {
                        str_att = "法术攻击：<span class='cor112'>"+data.next_gen.mag_att+"</span>";
                    }
                    var item = "<dl class='zhaoList zL"+data.next_gen.class+"'><dt class='zhaoListT'>"+data.level+"</dt><dd><img src='image/game/"+data.next_gen.img+"' height='163' width='163' /></dd><dd class='zhaoStar'>"+str_star+"</dd><dd class='wjName'>"+data.next_gen.name+"</dd></dl><ul class='fl cor55 fs22 pyPLTxt'><li class='cor111'>武将属性</li><li>力量：<span class='cor112'>"+data.next_gen.strength+"</span></li><li>智力：<span class='cor112'>"+data.next_gen.intelligence+"</span></li><li>生命：<span class='cor112'>"+data.next_gen.hp+"</span></li><li>"+str_att+"</li><li>物理防御：<span class='cor112'>"+data.next_gen.phy_def+"</span></li><li>法术防御：<span class='cor112'>"+data.next_gen.mag_def+"</span></li><li><span class='cor111'>技能</span> - <span class='fs22'>"+data.next_gen.skill.name+"</span></li></ul>";
                    $("#raising_next_gen").html(item);
                }
                var str_type = '', str_button= '';
                if (data.soul_type == 1) {
                    str_type = "<img src='image/sys/l_pol.png'>";
                }
                else if (data.soul_type == 2) {
                    str_type = "<img src='image/sys/b_pol.png'>";
                }
                else if (data.soul_type == 3) {
                    str_type = "<img src='image/sys/z_pol.png'>";
                }
                else if (data.soul_type == 4) {
                    str_type = "<img src='image/sys/h_pol.png'>";
                }
                else {
                    str_type = "<img src='image/sys/h_pol.png'>";
                }
                if (data.user_soul_num < data.soul_num) {
                    str_button = "<a class='pub_btn' id='raising_to_soul'>去聚魂</a><a class='pub_btn4'>升阶</a>";
                }
                else {
                    str_button = "<a class='pub_btn' id='raising_lvUp_conf'>升阶</a>";
                }
                
                var str_tmp = "<span class='cor111'>升阶需要</span>"+str_type+"<span class='cor55'>"+data.user_soul_num+"/"+data.soul_num+"</span>"+str_button+"<a class='pub_btn' id='raising_page_close'>关闭</a>";
                $("#raising_soul_info").html(str_tmp);
                $("#raising_page_close").bind(clickEventType, raising.raisingClose);
                if (document.getElementById("raising_to_soul")) {
                    $("#raising_to_soul").bind(clickEventType, function() {
                        $("#raisingwindow").find(".x").trigger(clickEventType);
                        Juhun.loadWindow();
                    });
                }
                if (parseInt(data.user_soul_num) >= parseInt(data.soul_num)) {
                    $("#raising_lvUp_conf").bind(clickEventType, raising.raisingUp);
                }
            });
    },
    raisingClose:function() {
        $("#raising_page").attr("style", "display:none");
    },
    raisingUp:function() {
        $.getJN("http://"+host+"/sgg/i/raising/raising.php", {uid:userId, obj_id:raising.object_id, raisingUp:1},
            function(data){
                if (data.st == 1) {
                    raising.raisingClose();
                    raising.getRaisingInfo(raising.object_id);
                    wuJiang.showWJ();
                    Buzhen.refreshUserFormation();
                    Common.alert("升阶成功");
                }
                else if (data.st == -5) {
                    Common.alert("魂魄不足");
                }
                else if (data.st == -4) {
                    Common.alert("魂魄信息有误请重试");
                }
                else if (data.st == -6) {
                    Common.alert("下一阶武将不存在");
                }
                else if (data.st == -3) {
                    Common.alert("升阶经验不足，不能升阶");
                }
                else if (data.st == 9) {
                    Common.alert("升阶已满");
                }
                else {
                    Common.alert("请重试");
                }
            });
    }
}



var activity = {
    vip_page:0,
    achieve_page:0,
    loadWindow:function(){
        var activityWindow = new mesWindow("activityWindow",$("#activity_tmpl").html());
        activity.getDailyPage();
        $("#activityWindow").find(".rc").bind(clickEventType, activity.getDailyPage);
        $("#activityWindow").find(".v").bind(clickEventType, activity.getVipPage);
        $("#activityWindow").find(".cj").bind(clickEventType, activity.getAchievePage);
        $("#activityWindow").find(".kf").bind(clickEventType, activity.getHelpPage);
    },
    getDailyPage:function () {
        $("#activityWindow").find(".v").removeClass("over");
        $("#activityWindow").find(".cj").removeClass("over");
        $("#activityWindow").find(".kf").removeClass("over");
        $("#activityWindow").find(".rc").addClass("over");
        $("#acti_vip").attr("style", "display:none");
        $("#acti_help").attr("style", "display:none");
        $("#acti_achieve").attr("style", "display:none");
        $("#acti_daily").removeAttr("style");
        activity.selectDailyReward();
        $("#acti_daily").find(".mrlq").bind(clickEventType, activity.selectDailyReward);
        $("#acti_daily").find(".lxdl").bind(clickEventType, activity.selectCumulateReward);
        $("#acti_daily").find(".jhm").bind(clickEventType, activity.selectActiCode);
    },
    selectDailyReward:function () {
        $("#acti_daily").find(".coverage").remove();
        $("#acti_daily").find(".mrlq").after("<div class='coverage'></div>");
        $.getJN(host+"/i/communicate/acti_award.php", {uid:userId, acti_id:1, type:2},
            function(data){
                var str_next = "";
                if (data.next_gold) str_next = "<p class='fs20 txt2 fl'>VIP"+(parseInt($("#btn_vip").attr("vip_lv"))+1)+"可领取元宝"+data.next_yb+"，声望"+data.next_rep+"，钱币"+user.formatGold(data.next_gold)+"</p>";
                var con = "<p class='fs24 txt1 mt7'>每日登陆送大礼</p><p class='fs20 txt2 fl'>VIP等级越高，每日福利越丰厚！</p>"+str_next+"<p class='fs20 txt2 fl'>当前为VIP"+$("#btn_vip").attr("vip_lv")+"，可领取以下奖品。</p>";
                con += "<ul class='dailyList tc fs18 cor3'>";
                con += "<li><img src='image/sys/dailyY.jpg'><br />元宝*"+data.this_yb+"</li>";
                con += "<li><img src='image/sys/dailyS.jpg'><br />声望*"+data.this_rep+"</li>";
                con += "<li><img src='image/sys/dailyY.jpg'><br />钱币*"+user.formatGold(data.this_gold)+"</li>";
                con += "</ul>";
                if (data.st == -1) {
                    con += "<div class='fs24 cor5 fr dailyBtn'>今日已领取</div>";
                }
                else if (data.st == 1) {
                    con += "<div class='arenaPtn fr dailyBtn' id='acti_login_award' acti_id='1'>领取奖励</div>";
                }
                else {
                    con += "<div class='fs24 cor5 fr dailyBtn'>今日已领取</div>";
                }
                $("#acti_daily_con").html(con);
                if (data.st == 1) $("#acti_login_award").bind(clickEventType, activity.getAward);
            });
    },
    getAward:function () {
        $.getJN(host+"/i/communicate/acti_award.php", {uid:userId, acti_id:1, type:2, award:1},
            function(data){
                if (data.st == -1) {
                    Common.alert("今日已领取过登陆奖励");
                    $("#acti_login_award").unbind(clickEventType);
                    $("#acti_login_award").attr("class", 'fs24 cor5 fr dailyBtn');
                    $("#acti_login_award").text("今日已领取");
                }
                else if (data.st == 2) {
                    Common.alert("领取了"+data.yb_award+"元宝，"+data.rep_award+"声望，"+data.gold_award+"钱币。");
//                        $("#jbNum").text(user.formatGold(data.gold));
                    $("#ybNum").text(user.formatGold(data.yb)).attr('yb', data.yb);
                    $("#userRepu").text(user.formatRepu(data.rep)).attr('repu', data.rep);
                    $("#jbNum").text(user.formatGold(data.gold)).attr('gold', data.gold);
                    $("#acti_login_award").unbind(clickEventType);
                    $("#acti_login_award").attr("class", 'fs24 cor5 fr dailyBtn');
                    $("#acti_login_award").text("今日已领取");
                }
                else {
                    Common.alert("今日已领取");
                    $("#acti_login_award").unbind(clickEventType);
                    $("#acti_login_award").attr("class", 'fs24 cor5 fr dailyBtn');
                    $("#acti_login_award").text("今日已领取");
                }
        });
    },
    selectCumulateReward:function () {
        $("#acti_daily").find(".coverage").remove();
        $("#acti_daily").find(".lxdl").after("<div class='coverage'></div>");
        $.getJN(host+"/i/communicate/cumulate_award.php", {uid:userId, acti_id:2},
            function(res){
                var con = "";
                con += "<p class='fs20 txt1'>连续登录送大礼</p>";
                for (var i=1;i<4;i++) {
                    if (i==1) {
                        con += "<div class='conLog pubBg fl' style='margin-left:-7px'>";
                    }
                    else {
                        con += "<div class='conLog pubBg fl'>";
                    }
                    if (i==3) {
                        con += "<p class='cor3 fs20 tc pt10'>第"+i+"天</p><ul class='conLis fs18 cor3 ls1'><li><img src='image/sys/dailyY.jpg'><br />元宝*"+res[i]['yb']+"</li><li><img src='image/game/"+res[i]['e_img']+"'><br />"+res[i]['e_name']+"</li></ul>";
                    }
                    else {
                        con += "<p class='cor3 fs20 tc pt10'>第"+i+"天</p><ul class='conLis fs18 cor3 ls1'><li><img src='image/sys/dailyY.jpg'><br />元宝*"+res[i]['yb']+"</li><li><img src='image/sys/dailyS.jpg'><br>声望*"+res[i]['rep']+"</li></ul>";
                    }
                    
                    if (res.st == 1) {
                        if (res.award_type==i) {
                            con += "<p class='tc'><a class='arenaPtn' id='acti_cumulate_award' acti_id='2'>领取奖励</a></p>";
                        }
                        else if (res.award_type>i) {
                            con += "<p class='tc fs24 cor5'>已领取</p>";
                        }
                        else {
                            con += "<p class='tc fs24 cor1'></p>";
                        }
                    }
                    else if (res.st == 2) {
                        con += "<p class='tc fs24 cor5'>已领取</p>";
                    }
                    else {
                        if (res.award_type>=i) {
                            con += "<p class='tc fs24 cor5'>已领取</p>";
                        }
                        else {
                            con += "<p class='tc fs24 cor1'></p>";
                        }
                    }
                    con += "</div>";
                }
                
                $("#acti_daily_con").html(con);
                if (document.getElementById("acti_cumulate_award")) $("#acti_cumulate_award").bind(clickEventType, activity.getCumulateAward);
            });
    },
    getCumulateAward:function() {
        $.getJN(host+"/i/communicate/cumulate_award.php", {uid:userId, acti_id:2, award:1},
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

                    activity.selectCumulateReward();
                }
                else {
                    Common.alert("领取失败，请重试");
                }
            });
    },
    selectActiCode:function () {
        $("#acti_daily").find(".coverage").remove();
        $("#acti_daily").find(".jhm").after("<div class='coverage'></div>");
        var con = "";
        con += "<p class='fs20 txt1 mt7'>请输入新手卡或感恩卡激活码</p><div class='codeAr bors10 pre'><textarea class='fb cor55 fs24' id='acti_code_con'></textarea><p class='osha bors10'></p></div><div class='codeBtn arenaPtn' id='acti_code_get'>领取奖励</div><div class='fs22 ls1 cor4'>注：关注“僵尸三国”并私信官博：僵尸三国新手卡即可获得新手卡激活码!</div>";
        $("#acti_daily_con").html(con);
        $("#acti_code_get").bind(clickEventType, activity.getCodeAward);
    },
    getCodeAward:function () {
        var code=$('#acti_code_con').val();
        if(code==''){
            Common.alert('请输入<span class="cor95 stro13">新手卡</span> /感恩卡<span class="cor95">卡号</span>');
        }
        else {
            $.getJN(host+"/i/communicate/checkCode.php",{uid:userId,acti_id:8,code:code},
                function(res){
                    if(res.st==1){//使用感恩卡成功  更新相关奖励信息
                        var con = "获取";
                        if (res.gold) {
                            con += "<span class='cor95 stro13'>"+res.gold+"钱币</span>、";
                            $("#jbNum").text(user.formatGold(res.gold_left));
                        }
                        if (res.reputation) {
                            con += "<span class='cor95'>"+res.reputation+"声望</span>、";
                            $("#userRepu").text(user.formatRepu(res.reputation_left)).attr('repu', res.reputation_left);
                        }
                        if (res.yb) {
                            con += "<span class='cor95'>"+res.yb+"元宝</span>";
                            $("#ybNum").text(user.formatGold(res.yb_left)).attr('yb', res.yb_left);
                        }
                        Common.alert(con);
                    }
                    else if(res.st==2){ //使用新手卡 更新相关奖励信息
                        var con = "获取";
                        if (res.gold) {
                            con += "<span class='cor95 stro13'>"+res.gold+"钱币</span>、";
                            $("#jbNum").text(user.formatGold(res.gold_left));
                        }
                        if (res.reputation) {
                            con += "<span class='cor95'>"+res.reputation+"声望</span>、";
                            $("#userRepu").text(user.formatRepu(res.reputation_left)).attr('repu', res.reputation_left);
                        }
                        if (res.yb) {
                            con += "<span class='cor95'>"+res.yb+"元宝</span>";
                            $("#ybNum").text(user.formatGold(res.yb_left)).attr('yb', res.yb_left);
                        }
                        Common.alert(con);
                    }
                    else if(res.st==3){//此卡已经使用  或者同类型的卡已经被使用过一次 
                        Common.alert('同一<span class="cor95 stro13">种类的卡</span> 只能使用<span class="cor95">一次</span>');
                    }
                    else{ //输入的感恩卡 或者 新手卡不存在
                        Common.alert('激活码<span class="cor95 stro13">不正确</span>');
                    }
                });
        }
    },
    getVipPage:function () {
        $("#activityWindow").find(".rc").removeClass("over");
        $("#activityWindow").find(".cj").removeClass("over");
        $("#activityWindow").find(".kf").removeClass("over");
        $("#activityWindow").find(".v").addClass("over");
        $("#acti_daily").attr("style", "display:none");
        $("#acti_help").attr("style", "display:none");
        $("#acti_achieve").attr("style", "display:none");
        $("#acti_vip").removeAttr("style");
        activity.selectVipLevel();
        $("#acti_vip").find(".djjl").bind(clickEventType, activity.selectVipLevel);
        $("#acti_vip").find(".czfl").bind(clickEventType, activity.selectChargeBack);
        $("#acti_vip").find(".scjl").bind(clickEventType, activity.selectFirstCharge);
    },
    selectVipLevel:function () {
        $("#acti_vip").find(".coverage").remove();
        $("#acti_vip").find(".djjl").after("<div class='coverage'></div>");
//        var con = "<div class='bzBl vipSL spfz fl' style='margin:100px 0 0 -41px'></div><div class='vip_con' style='width:718px;overflow:hidden'></div><div class='bzBl vipSL fr' style='margin:-160px -23px 0 0'></div>";
        var con = "<div class='bzBl vipSL spfz fl vip_con' style='margin:100px 0 0 -41px' id='acti_vip_pre'></div><div class='bzBl vipSL fr' style='margin:-160px -23px 0 0' id='acti_vip_next'></div>";
        $("#acti_vip_con").html(con);
        $.getJN(host+"/i/communicate/vip_award.php",{uid:userId,acti_id:5},
            function(res){
                if (res.st == -9) {
                    Common.alert("出错请重试");
                }
                else {
//                    $("#acti_vip_con").find(".vip_con").setSlider({row:1,col:1});
                    var vip_lv = $("#btn_vip").attr("vip_lv");
                    var charge_flag = $("#btn_vip").attr("vip_lv");
                    for (key in res) {
                        var item,disp;
                        if (key==10||key==9) {
                            disp = "";
                        }
                        else {
                            disp = ";display:none";
                        }
                        item = "<div class='actiVip fl ele"+res[key].level+"' style='margin-right:25px"+disp+"'><p class='fs20 txt1'></p><div class='actiVipLi pubBg'><div class='h191'><div class='fs20 cor1 tr reward'>VIP"+res[key].level+"</div><ul class='actiVipLit fs18 cor3 ls1'><li><img src='image/sys/dailyY.jpg'><br>钱币*"+user.formatGold(res[key].gold)+"</li><li><img src='image/sys/dailyS.jpg'><br>声望*"+user.formatRepu(res[key].reputation)+"</li></ul>";
                        if (res[key]['prop']) {
                            item += "<ul class='actiVipLiB'>";
                            for (k in res[key]['prop']) {
                                item += "<li><img src='image/game/"+res[key]['prop'][k].img+"'><p class='angle'>x"+res[key]['prop'][k].num+"</p></li>";
                            }
                            item += "</ul>";
                        }
                        item += "</div>";
                        if (res[key].st == 1) {
                            item += "<p class='tc mt5'><a class='arenaPtn' id='acti_vip_award' award='"+res[key].level+"'>领取奖励</a></p>";
                        }
                        else if (res[key].st == -1) {
                            if (parseInt(charge_flag)+1 == res[key].level) {
                                item += "<p class='tc mt5'><a class='arenaPtn' id='acti_vip_charge'>去充值</a></p>";
                            }
                        }
                        else if (res[key].st == 2) {
                            
                        }
                        else if (res[key].st == 3) {
                            item += "<p class='tc mt5 fs18 cor5'>已领取</p>";
                        }
                        else {
                            item += "<p class='tc mt5 fs18 cor5'>已领取</p>";
                        }
                        item += "</div>";
                        $("#acti_vip_con").find(".vip_con").after(item);
                    }
                    activity.vip_page = 1;
                    $("#acti_vip_next").bind(clickEventType, activity.pageNext);
                }
                if (document.getElementById("acti_vip_charge")) $("#acti_vip_charge").bind(clickEventType, charge.loadWindow);
                if (document.getElementById("acti_vip_award")) $("#acti_vip_award").bind(clickEventType, activity.getVipChargeAward);
            });
    },
    pageNext:function () {
        if (activity.vip_page == 5) {
            $("#acti_vip_next").unbind(clickEventType);
        }
        else {
            activity.vip_page += 1;
        }
        var eleA = (activity.vip_page-1)*2 + 1, eleB = eleA + 1;
        var str_eleA = '.ele'+eleA, str_eleB = '.ele'+eleB;
        $("#acti_vip_pre").unbind(clickEventType);
        $("#acti_vip_pre").bind(clickEventType, activity.pagePre);
        $("#acti_vip_con").find(".actiVip").attr("style", "margin-right:25px;display:none");
        $("#acti_vip_con").find(str_eleA).attr("style", "margin-right:25px;");
        $("#acti_vip_con").find(str_eleB).attr("style", "margin-right:25px;");
    },
    pagePre:function () {
        if (activity.vip_page == 1) {
            $("#acti_vip_pre").unbind(clickEventType);
        }
        else {
            activity.vip_page -= 1;
        }
        var eleA = (activity.vip_page-1)*2 + 1, eleB = eleA + 1;
        var str_eleA = '.ele'+eleA, str_eleB = '.ele'+eleB;
        $("#acti_vip_next").unbind(clickEventType);
        $("#acti_vip_next").bind(clickEventType, activity.pageNext);
        $("#acti_vip_con").find(".actiVip").attr("style", "margin-right:25px;display:none");
        $("#acti_vip_con").find(str_eleA).attr("style", "margin-right:25px;");
        $("#acti_vip_con").find(str_eleB).attr("style", "margin-right:25px;");
    },
    getVipChargeAward:function () {
        var award = $("#acti_vip_award").attr("award");
        $.getJN(host+"/i/communicate/vip_award.php", {uid:userId,award:award,acti_id:5},
            function(res1){
                if (res1.st == 1) {
                    Common.alert("领取成功");
                    if (res1.array.yb) {
                        $("#ybNum").text(user.formatGold(res1.array.yb)).attr('yb', res1.array.yb);
                    }
                    if (res1.array.gold) {
                        $("#jbNum").text(user.formatGold(res1.array.gold)).attr('gold', res1.array.gold);
                    }
                    if (res1.array.reputation) {
                        $("#userRepu").text(user.formatRepu(res1.array.reputation)).attr('repu', res1.array.reputation);
                    }
//                    $("#acti_vip").find(".djjl").trigger(clickEventType);
                    activity.selectVipLevel();
                }
                else if (res1.st == -9) {
                    Common.alert("未知错误，请重试");
                }
                else {
                    Common.alert("领取失败，请重试");
                }
            });
    },
    selectChargeBack:function () {
        $("#acti_vip").find(".coverage").remove();
        $("#acti_vip").find(".czfl").after("<div class='coverage'></div>");
        var json = {"1":{"charge":100,"award":8},"2":{"charge":500,"award":58},"3":{"charge":1000,"award":158},"4":{"charge":5000,"award":988},"5":{"charge":10000,"award":2588},"2":{"charge":50000,"award":15888}};
//        $("#acti_vip_con").addClass("pre");
        var con = "<p class='fs20 txt1 mt4'>充值返大礼</p><div class='firPunch'><p class='bzBl spfz fl pab rebateL' style='margin:140px 0 0 80px'></p><div class='rebateScr' style='width:718px;overflow:hidden'></div><p class='bzBl fl pab rebateR' style='margin:140px 28px 0 0'></p></div><div class='firPunchB'><p class='fs22 cor4 fl ls1'></p><a class='arenaPtn fr' id='acti_vip_charge'>去充值</a></div>";
        $("#acti_vip_con").html(con);
        $("#acti_vip_con").find(".rebateScr").setSlider({row:1,col:1});
        for (key in json) {
            var item = "<dl class='rebate'><dt>充"+json[key].charge+"元宝</dt><dd>"+json[key].award+"</dd></dl>";
            $("#acti_vip_con").find(".rebateScr").addSliderItem(item);
        }
        $("#acti_vip_charge").bind(clickEventType, charge.loadWindow);
    },
    selectFirstCharge:function () {
        $("#acti_vip").find(".coverage").remove();
        $("#acti_vip").find(".scjl").after("<div class='coverage'></div>");
        $.getJN(host+"/i/communicate/first_charge_award.php", {uid:userId,acti_id:4},
            function(res){
                var con = "<p class='fs20 txt1 mt4'>首次充值奖励</p><ul class='firPunch cor3'>";
                if (res.yb) con += "<li><img src='image/sys/dailyY.jpg'><br />元宝*"+res.yb+"</li>";
                if (res.reputation)  con += "<li><img src='image/sys/dailyS.jpg'><br/>声望*"+res.reputation+"</li>";
                con += "</ul><div class='firPunchB'><p class='fs22 cor4 fl ls1 firstCharge'></p>";
                if (res.st == 1) {
                    con += "<a class='arenaPtn fr' id='acti_vip_first_charge'>领取奖励</a></div>";
                }
                else if (res.st == -2) {
                    con += "<p class='fs22 cor5 fr'>已领取</p></div>";
                }
                else {
                    con += "<a class='arenaPtn fr' id='acti_vip_charge'>去充值</a></div>";
                }
                $("#acti_vip_con").html(con);
                if (document.getElementById("acti_vip_first_charge")) $("#acti_vip_first_charge").bind(clickEventType, activity.getFirstChargeAward);
                if (document.getElementById("acti_vip_charge")) $("#acti_vip_charge").bind(clickEventType, charge.loadWindow);
            });
    },
    getFirstChargeAward:function () {
        $.getJN(host+"/i/communicate/first_charge_award.php", {uid:userId,award:1,acti_id:4},
            function(res){
                if (res.st == 1) {
                    var con = "领取了";
                    if (res.gold) {
                        con += "<span class='cor95 stro13'>"+res.gold+"钱币</span>、";
                        $("#jbNum").text(user.formatGold(res.gold_left));
                    }
                    if (res.reputation) {
                        con += "<span class='cor95'>"+res.reputation+"声望</span>、";
                        $("#userRepu").text(user.formatRepu(res.rep_left)).attr('repu', res.rep_left);
                    }
                    if (res.yb) {
                        con += "<span class='cor95'>"+res.yb+"元宝</span>";
                        $("#ybNum").text(user.formatGold(res.yb_left)).attr('yb', res.yb_left);
                    }
                    Common.alert(con);
                }
                else if (res.st == -1) {
                    Common.alert("尚未充值，前去充值",2, charge.loadWindow);
                }
                else if (res.st == -2) {
                    Common.alert("已领取过奖励");
                }
                else {
                    Common.alert("已领取过奖励");
                }
//                $("#acti_vip").find(".scjl").trigger(clickEventType);
                activity.selectFirstCharge();
            });
    },
    getAchievePage:function () {
        $("#activityWindow").find(".v").removeClass("over");
        $("#activityWindow").find(".kf").removeClass("over");
        $("#activityWindow").find(".rc").removeClass("over");
        $("#activityWindow").find(".cj").addClass("over");
        $("#acti_vip").attr("style", "display:none");
        $("#acti_help").attr("style", "display:none");
        $("#acti_daily").attr("style", "display:none");
        $("#acti_achieve").removeAttr("style");
        activity.achieve_page=1;
        activity.getUserAchieveByType(1);
    },
    getUserAchieveByType:function (type) {
        $.getJN(host+"/i/achieve/user_achieve.php", {uid:userId,type:type},
            function(res){
                // 取得成就类型
                if (res.type) {
                    var item_type = "<p class='bzBl vipSL spfz fl ml10' id='achieve_type_bef'></p>";
                    var k_begin = (activity.achieve_page - 1)*5+1, k_end = activity.achieve_page*5;
                    var nn = 1;
                    for (key in res.type) {
                        if (nn>=k_begin && nn<=k_end) {
                            if (key == 1) {
                                item_type += "<li><p class='dej' type='"+key+"'></p></li>";
                            }
                            else if (key == 2) {
                                item_type += "<li><p class='qb' type='"+key+"'></p></li>";
                            }
                            else if (key == 3) {
                                item_type += "<li><p class='jjc' type='"+key+"'></p></li>";
                            }
                            else if (key == 4) {
                                item_type += "<li><p class='qh' type='"+key+"'></p></li>";
                            }
                            else if (key == 5) {
                                item_type += "<li><p class='tg' type='"+key+"'></p></li>";
                            }
                            else if (key == 6) {
                                item_type += "<li><p class='wj' type='"+key+"'></p></li>";
                            }
                            else {
                                item_type += "<li><p class='dej' type='"+key+"'></p></li>";
                            }
                        }
                        nn++;
                    }
                    item_type += " <p class='bzBl vipSL fr ml10' id='achieve_type_aft'></p>";
                    $("#acti_achieve_type").html(item_type);
                    $("#acti_achieve_type").find(".coverage").remove();
                    $("#acti_achieve_type li>p").bind(clickEventType, function(){
                            activity.getUserAchieveByType($(this).attr("type"));
                            });
                    if (k_begin>=6) {
                        $("#achieve_type_bef").bind(clickEventType, function() {
                            activity.achieve_page--;
                            var type = (activity.achieve_page - 1)*5+1;
                            activity.getUserAchieveByType(type);
                            });
                    }
                    else {
                        $("#achieve_type_bef").unbind(clickEventType);
                    }
                    if (nn-1>k_end) {
                        $("#achieve_type_aft").bind(clickEventType, function() {
                            activity.achieve_page++;
                            var type = (activity.achieve_page - 1)*5+1;
                            activity.getUserAchieveByType(type);
                            });
                    }
                    else {
                        $("#achieve_type_aft").unbind(clickEventType);
                    }
                    if (type == 1) {
                        $("#acti_achieve_type").find(".dej").after("<div class='coverage'></div>");
                    }
                    else if (type == 2) {
                        $("#acti_achieve_type").find(".qb").after("<div class='coverage'></div>");
                    }
                    else if (type == 3) {
                        $("#acti_achieve_type").find(".jjc").after("<div class='coverage'></div>");
                    }
                    else if (type == 4) {
                        $("#acti_achieve_type").find(".qh").after("<div class='coverage'></div>");
                    }
                    else if (type == 5) {
                        $("#acti_achieve_type").find(".tg").after("<div class='coverage'></div>");
                    }
                    else if (type == 6) {
                        $("#acti_achieve_type").find(".wj").after("<div class='coverage'></div>");
                    }
                    else {
                        $("#acti_achieve_type").find(".dej").after("<div class='coverage'></div>");
                    }
                }
                if (res.achieve) {
                    $("#acti_achieve_list").removeAllItem();
                    $("#acti_achieve_list").setSlider({row:1,col:1,dir:"top",onMove:activity.setSlidBlockC});
                    var bind_flag = 0;
                    for (key in res.achieve) {
                        var item_achieve="", str_award="", str_img="";
                        for (kk in res.achieve[key]['award']) {
                            if (res.achieve[key]['award'][kk]['type'] == 1) {
                                str_award += "钱币*"+user.formatGold(res.achieve[key]['award'][kk]['info'])+" ";
                            }
                            else if (res.achieve[key]['award'][kk]['type'] == 2) {
                                str_award += "元宝*"+res.achieve[key]['award'][kk]['info']+" ";
                            }
                            else if (res.achieve[key]['award'][kk]['type'] == 3) {
                                str_award += "经验*"+res.achieve[key]['award'][kk]['info']+" ";
                            }
                            else if (res.achieve[key]['award'][kk]['type'] == 4) {
                                str_award += "声望*"+res.achieve[key]['award'][kk]['info']+" ";
                            }
                            else if (res.achieve[key]['award'][kk]['type'] == 5) {
                                str_award += "绿魂*"+res.achieve[key]['award'][kk]['info']+" ";
                            }
                            else if (res.achieve[key]['award'][kk]['type'] == 6) {
                                str_award += "蓝魂*"+res.achieve[key]['award'][kk]['info']+" ";
                            }
                            else if (res.achieve[key]['award'][kk]['type'] == 7) {
                                str_award += "紫魂*"+res.achieve[key]['award'][kk]['info']+" ";
                            }
                            else if (res.achieve[key]['award'][kk]['type'] == 8) {
                                str_award += "橙魂*"+res.achieve[key]['award'][kk]['info']+" ";
                            }
                            else if (res.achieve[key]['award'][kk]['type'] == 9) {
                                str_award += res.achieve[key]['award'][kk]['info']['name']+"*"+res.achieve[key]['award'][kk]['info']['num']+" ";
                            }
                            else {
                                str_award += " ";
                            }
                        }
                        if (res.achieve[key]['type'] == 1) {
                            str_img = "<p class='achiPic fl'><img src='image/sys/ach_dj.png' width='50' height='50'></p>";
                        }
                        else if (res.achieve[key]['type'] == 2) {
                            str_img = "<p class='achiPic fl'><img src='image/sys/ach_qb.png' width='50' height='50'></p>";
                        }
                        else if (res.achieve[key]['type'] == 3) {
                            str_img = "<p class='achiPic fl'><img src='image/sys/ach_jjc.png' width='50' height='50'></p>";
                        }
                        else if (res.achieve[key]['type'] == 4) {
                            str_img = "<p class='achiPic fl'><img src='image/sys/ach_qh.png' width='50' height='50'></p>";
                        }
                        else if (res.achieve[key]['type'] == 5) {
                            str_img = "<p class='achiPic fl'><img src='image/sys/ach_tg.png' width='50' height='50'></p>";
                        }
                        else if (res.achieve[key]['type'] == 6) {
                            str_img = "<p class='achiPic fl'><img src='image/sys/ach_wj.png' width='50' height='50'></p>";
                        }
                        else {
                            str_img = "<p class='achiPic fl'><img src='image/sys/ach_dj.png' width='50' height='50'></p>";
                        }
                        var str_flag = "";
                        if (res.achieve[key]['status'] == 1) {
                            str_flag = "class='achieveLio' achi_id='"+key+"' type='"+res.achieve[key]['type']+"'";
                        }
                        else if (res.achieve[key]['status'] == 2) {
                            str_flag = "class='achieveLi'";
                        }
                        else {
                            str_flag = "class='achieveLiq gray'";
                        }
                        item_achieve = "<div "+str_flag+">"+str_img+"<ul class='achiList fl fs18'><li class='fs20 cor55 tc acT'>"+res.achieve[key]['name']+"</li><li class='acList'><a>"+res.achieve[key]['info']+"</a><a class='award_con'>奖励:"+str_award+"</a></li></ul></div>";
                        $("#acti_achieve_list").addSliderItem(item_achieve);
                        if (res.achieve[key]['status'] == 1) {
                            if (bind_flag == 0) {
                                $("#acti_achieve_list .achieveLio[achi_id]").bind(clickEventType, activity.getAchieveAward);
                                bind_flag = 1;
                            }
                        }
                    }
                }
            });
    },
    getAchieveAward:function () {
        if(!Slider.checkTouchAvailabel(this)){
            return;
        }
        var type = $(this).attr("type"), achi_id = $(this).attr("achi_id"), con = $(this).find(".award_con").text();
        $(this).unbind(clickEventType);
        $.getJN(host+"/i/achieve/get_achieve_award.php", {uid:userId,achi_id:achi_id},
            function(res){
                if (res.st == 2) {
                    Common.alert("奖励已领取");
                }
                else if (res.st == 1) {
                    if (res.gold_left) {
                        $("#jbNum").text(user.formatGold(res.gold_left)).attr('gold', res.gold_left);
                    }
                    if (res.yb_left) {
                        $("#ybNum").text(user.formatGold(res.yb_left)).attr('yb', res.yb_left);
                    }
                    if (res.rep_left) {
                        $("#userRepu").text(user.formatRepu(res.rep_left)).attr('repu', res.rep_left);
                    }
                    if (parseInt(res.ulevel) > parseInt($("#userLevel").text())) {
                        $("#userLevel").text(res.ulevel);
                    }
                    Common.alert("成功领取了"+con);
                    activity.getUserAchieveByType(type);
                }
                else {
                    Common.alert("未完成该成就无法领取");
                }
            });
    },
    getHelpPage:function () {
        $("#activityWindow").find(".rc").removeClass("over");
        $("#activityWindow").find(".v").removeClass("over");
        $("#activityWindow").find(".cj").removeClass("over");
        $("#activityWindow").find(".kf").addClass("over");
        $("#acti_daily").attr("style", "display:none");
        $("#acti_vip").attr("style", "display:none");
        $("#acti_achieve").attr("style", "display:none");
        $("#acti_help").removeAttr("style");
        $.getJN(host+"/i/communicate/help.php", {uid:userId},
            function(res){
                if (res.st == 1) {
                    $("#help_submit").bind(clickEventType, activity.sendHelp);
                    $("#help_list").setSlider({row:1,col:1,dir:"top",onMove:activity.setSlidBlockB});
                    var item='';
                    if (res.list != -1) {
                        for (key in res.list) {
                            item = "<ul class='actiList'><li class='cor107'>"+res['list'][key].user_name+"<a class='fr fs18'>"+res['list'][key].date_time+"</a></li><li>"+res['list'][key].content+"</li></ul><p class='actiLi'></p>";
                            $("#help_list").addSliderItem(item);
                        }
                    }
                }
            });
    },
    sendHelp:function() {
        if ($("#help_content").val()) {
            var con = $("#help_content").val();
            $.getJN(host+"/i/communicate/help.php", {uid:userId,content:con,submit:1},
                function(data){
                    if (data.st == 1) {
                        Common.alert("发送成功");
                        $.getJN(host+"/i/communicate/help.php", {uid:userId},
                            function(res){
                                if (res.st == 1) {
                                    $("#help_list").removeAllItem();
                                    var item='';
                                    if (res.list != -1) {
                                        for (key in res.list) {
                                            item = "<ul class='actiList'><li class='cor107'>"+res['list'][key].user_name+"<a class='fr fs18'>"+res['list'][key].date_time+"</a></li><li>"+res['list'][key].content+"</li></ul><p class='actiLi'></p>";
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
    //设置滑块位置
    setSlidBlockB:function(){
        var sliderConTop=parseInt($("#help_list").children().slice(0,1).css("margin-top"));
        sliderConTop=isNaN(sliderConTop)?0:sliderConTop;
        if(sliderConTop<=0){
                var conTopLimit=parseInt($("#help_list").children().slice(0,1).height())-parseInt($("#help_list").height());
                if(conTopLimit>=0){
                        var sliderBlockTopLimit=205;
                        var top=Math.abs(parseInt(sliderConTop/conTopLimit*sliderBlockTopLimit));
                        top=top<0?0:top;
                        top=top>sliderBlockTopLimit?sliderBlockTopLimit:top;
                        $("#a_sBlock3").css("margin-top",top+"px");
                }
        }
    },
    //设置滑块位置
    setSlidBlockC:function(){
        var sliderConTop=parseInt($("#acti_achieve_list").children().slice(0,1).css("margin-top"));
        sliderConTop=isNaN(sliderConTop)?0:sliderConTop;
        if(sliderConTop<=0){
                var conTopLimit=parseInt($("#acti_achieve_list").children().slice(0,1).height())-parseInt($("#acti_achieve_list").height());
                if(conTopLimit>=0){
                        var sliderBlockTopLimit=205;
                        var top=Math.abs(parseInt(sliderConTop/conTopLimit*sliderBlockTopLimit));
                        top=top<0?0:top;
                        top=top>sliderBlockTopLimit?sliderBlockTopLimit:top;
                        $("#a_sBlock4").css("margin-top",top+"px");
                }
        }
    }
}


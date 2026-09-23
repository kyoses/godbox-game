// 竞技场
var arena = {
    free_refresh:2,
    rank_tgt:0,
    cooling_cost:2,
    free_fight:15,
    fight_cell:5,
    fight_num:0,
    cooling_left:0,
    bless_eff:0,
    loadWindow:function(){
        var arenaWindow = new mesWindow("arenaWindow",$("#arena_tmpl").html());
        arena.getArenaInfo();
        $('#arena_bless').bind(clickEventType, arena.doBless);
        $("#arena_rank").bind(clickEventType, arena.arenaRank);
    },
    getArenaInfo:function(){
        $.getJSON(host+"/i/arena/arena_index.php", {uid : userId}, 
            function(data) {
                arena.fight_num = data.user.chall_num;
                $('#arena_u_img').attr('src', data.user.img);
                var fight_left = (arena.free_fight-data.user.chall_num)>0?(arena.free_fight-data.user.chall_num):0;
                $('#arena_u_fight').text(fight_left);
                $('#arena_u_rank').text(data.user.rank);
                var cooling_time = data.user.cooling_left;
                if (data.user.refresh_num<arena.free_refresh) {
                    $("#arena_bless_cost").text("免费");
                }
                else {
                    $("#arena_bless_cost").text("20元宝");
                }
                $('#arena_vip_msg').html(arena.getVipMsg($('#btn_vip').attr('vip_lv')));
                $('#arena_bless_eff').text(data.user.extra_reward);
                arena.bless_eff = data.user.extra_reward;
                if (data.user.cooling_left>0) {
                    arena.cooling_left = data.user.cooling_left;
                    $("#arena_u_cooling").attr("class", 'cor1');
                    arena.setCDTime($('#arena_u_cooling'), data.user.cooling_left, 1);
                }
                else {
                    arena.cooling_left = 0;
                    $('#arena_u_cooling').text('00:00:00').removeAttr("class");
                }
                if (data.user.reward_left>0) {
                    $('#arena_u_reward_cooling').attr("class", 'cor1');
                    arena.setCDTime($('#arena_u_reward_cooling'), data.user.reward_left, 2);
                }
                var item = "";
                for (key in data.rival) {
//                    item += "<dl class='arenaFM' rank='"+data.rival[key].rank+"' name='"+data.rival[key].name+"'><dt><img src='"+data.rival[key].img+"' width='158' height='158' /></dt><dd class='stro13'>"+data.rival[key].rank+"</dd><dd><span>Lv</span>"+data.rival[key].level+"&thinsp;"+data.rival[key].name+"</dd></dl>";
                    item += "<dl class='arenaFM fs20 ls1' rank='"+data.rival[key].rank+"' name='"+data.rival[key].name+"'><dt>"+data.rival[key].rank+"</dt><dd><img src='"+data.rival[key].img+"' width='127' height='130' class='player'></dd><dd class='playerSc'>Lv"+data.rival[key].level+"</dd><dd class='playerName'>"+data.rival[key].name+"</dd></dl>";
                }
                $("#arena_rival_list").html(item);
                $("#arena_rival_list").find(".arenaFM").bind(clickEventType, arena.arenaFightHint);
            });
    },
    setCDTime:function(html_id, left_time, type) { // 设置倒计时
        var html_obj = html_id, time = left_time;
        var clock = setInterval(function() {
            if(!$("#arena_tmpl").html()||document.getElementById("tx_show")){  //窗口关闭则时间停
                html_obj.text("");
                clearInterval(clock);
            }
            html_obj.text(XunLian.formatTime(time));
            time--;
            if(time==-1){  //冷却时间到
                if (type == 1) {
                    arena.cooling_left = 0;
                    html_obj.removeAttr("class");
                }
                clearInterval(clock);
            }
        },1000);
    },
    getVipMsg:function (vip_lv) {
        var msg = ['VIP0可获<br />20%-60%','VIP1可获<br />20%-60%','VIP2可获<br />20%-60%','VIP3可获<br />20%-100%','VIP4可获<br />20%-100%','VIP5可获<br />20%-100%'
                   ,'VIP6可获<br />20%-180%','VIP7可获<br />20%-180%','VIP8可获<br />20%-260%','VIP9可获<br />20%-260%','VIP10可获<br />20%-260%'];
        return msg[vip_lv]; 
    },
    doBless:function () {
        $("#arena_bless").unbind(clickEventType);
        var time = 2;
        var clock1 = setInterval(function(){
            var i = parseInt(Math.random()*100);
            $('#arena_bless_eff').text(i);
            if(time==0){  //冷却时间到
                $('#arena_bless_eff').text(arena.bless_eff);
                clearInterval(clock1);
            }
        },100);
        var clock = setInterval(function() {
            time--;
            if(time==0){  //冷却时间到
                $('#arena_bless_eff').text(arena.bless_eff);
                clearInterval(clock);
            }
        },1000);
        $.getJSON(host+"/i/arena/arena_bless.php", {uid : userId}, 
            function(data) {
                if (data.st == 1) {
                    var str = arena.getVipMsg($('#btn_vip').attr('vip_lv'));
                    if (data.refresh_num<arena.free_refresh) {
                        $("#arena_bless_cost").text("免费");
                    }
                    else {
                        $("#arena_bless_cost").text("20元宝");
                    }
                    $("#ybNum").text(user.formatGold(data.left_yb)).attr('yb', data.left_yb);
                }
                else if (data.st == -1) {
                    Common.alert("元宝不足，前去充值",2,charge.loadWindow);
                }
                else {
                    Common.alert('出错请重试');
                }
                arena.bless_eff = data.eff;
                $('#arena_bless_eff').text(data.eff);
                $('#arena_bless').bind(clickEventType, arena.doBless);
            });
    },
    arenaFightHint:function() {
        arena.rank_tgt = $(this).attr('rank');
        var u_yb = parseInt($('#ybNum').attr('yb'));
        var name = $(this).attr('name');
        if (arena.cooling_left > 0) {
            if (u_yb < arena.cooling_cost) {
                Common.alert("清除冷却时间需要"+arena.cooling_cost+"元宝，元宝不足，前去充值",2,charge.loadWindow);
            }
            else {
                if (arena.fight_num>=arena.free_fight) {
                    var cost = arena.cooling_cost + (arena.fight_num - arena.free_fight + 1)*arena.fight_cell;
                    Common.alert("花费"+cost+"元宝清除冷却时间并挑战"+name, 6, arena.arenaFight);
                }
                else {
                    Common.alert("花费"+arena.cooling_cost+"元宝清除冷却时间并挑战"+name, 6, arena.arenaFight);
                }
            }
        }
        else if (arena.fight_num>=arena.free_fight) {
            var fight_cost = (arena.fight_num-arena.free_fight+1)*arena.fight_cell>0?(arena.fight_num-arena.free_fight+1)*arena.fight_cell:arena.fight_cell;
            if (u_yb > fight_cost) {
                Common.alert("花费"+fight_cost+"元宝增加本次挑战", 6, arena.arenaFight);
            }
            else {
                Common.alert("挑战需要"+fight_cost+"元宝，元宝不足，前去充值",2,charge.loadWindow);
            }
        }
        else {
            Common.alert("是否挑战"+name, 6, arena.arenaFight);
        }
    },
    arenaFight:function() {
        $.getJN(host+"/i/fight/f.php", {
            uid:userId,rank_tgt:arena.rank_tgt
        }, function(data){
            if (data.st == -11) {
                Common.alert("清除冷却时间需"+data.cost+"元宝，元宝不足，前去充值",2,charge.loadWindow);
            }
            else if (data.st == -12) {
                Common.alert("挑战需要"+data.cost+"元宝，元宝不足，前去充值",2,charge.loadWindow);
            }
            else if (data.st == -13) {
                Common.alert("对手排位信息有误，请重新进入竞技场");
            }
            else {
                battle.setCompetitiveInfo(data,data.tid);
            }
        });
    },
    arenaRank:function() {
        var arenaRankWindow = new mesWindow("arenaRankWindow",$("#arena_rank_tmpl").html());
        $("#arena_rank_list").setSlider({row:1,col:1,dir:"top",onMove:arena.setSlidBlock});
        $.getJSON(host+"/i/arena/arena_rank.php", {uid : userId}, 
            function(data) {
                var item = "", str_award = "";
                for (key in data.users_rank) {
                    item += "<li><a>"+data.users_rank[key].rank+"</a><a>"+data.users_rank[key].name+"</a><a>lv"+data.users_rank[key].level+"</a></li>";
                }
                $("#arena_rank_list").addSliderItem(item);
                if (data.award_st == 1) {
                    str_award = "<a class='pub_btn' id='arena_award'>领奖</a>";
                }
                else if (data.award_st == 2) {
                    str_award = "<a class='pub_btn4' id='arena_award'>已领奖</a>";
                }
                else {
                    str_award = "<a class='pub_btn4' id='arena_award'>已领奖</a>";
                }
                var item1 = "<p class='stro26 chartsRT'>奖励排名:"+data.user.reward_rank+"</p><p class='chartsRC cor55'>奖励:<br/>"+data.con+"<br />每日20:00结算奖励</p><p><a class='pub_btn' id='arena_record'>挑战记录</a>"+str_award+"</p>";
                $("#arena_award_info").html(item1);
                if (data.award_st == 1) {
                    $("#arena_award").bind(clickEventType, arena.getArenaAward);
                }
                $("#arena_record").bind(clickEventType, arena.arenaRecord);
            });
    },
    setSlidBlock:function(){
        var sliderConTop=parseInt($("#arena_rank_list").children().slice(0,1).css("margin-top"));
        sliderConTop=isNaN(sliderConTop)?0:sliderConTop;
        if(sliderConTop<=0){
            var conTopLimit=parseInt($("#arena_rank_list").children().slice(0,1).height())-parseInt($("#arena_rank_list").height());
            if(conTopLimit>=0){
                var sliderBlockTopLimit=274;
                var top=Math.abs(parseInt(sliderConTop/conTopLimit*sliderBlockTopLimit));
                top=top<0?0:top;
                top=top>sliderBlockTopLimit?sliderBlockTopLimit:top;
                $("#arena_r_block").css("margin-top",top+"px");
            }
        }
    },
    getArenaAward:function() {
        $.getJSON(host+"/i/arena/arena_award.php", {uid : userId}, 
            function(data) {
                if (data.st == 2) {
                    Common.alert("今日奖励已领取");
                }
                else if (data.st == 1) {
                    Common.alert("领取成功，得到了"+data.rep+"声望，"+data.gold+"金钱");
                    $("#jbNum").text(user.formatGold(data.left_gold)).attr('gold', data.left_gold);
                    $("#userRepu").text(user.formatRepu(data.left_rep)).attr('repu', data.left_rep);
                }
                else {
                    Common.alert("今日奖励已领取");
                }
                $("#arena_award").attr('class', 'pub_btn4').text("已领奖").unbind(clickEventType);
            });
    },
    arenaRecord:function() {
        $("#arena_record_win").removeAttr('style');
        $("#arena_record_close").bind(clickEventType, arena.recordClose);
        $("#arena_record_list").setSlider({row:1,col:1,dir:"top",onMove:arena.setSlidBlock2});
        $.getJSON(host+"/i/arena/arena_record.php", {uid : userId}, 
            function(data) {
                var item = "";
                if (data.list == -1) {
                    item = "<ul class='chartsPLi'><li></li><li>尚无挑战记录</li></ul>";
                }
                else {
                    for (key in data.list) {
                        var str_res = "", str_rank = "";
                        if (data.list[key].result == 1) {
                            str_res = "<li><img src='image/sys/s.png'></li>";
                            if (data.list[key].rank == 0) {
                                str_rank = "<li>你排名不变</li><li></li>";
                            }
                            else {
                                str_rank = "<li>你排名升至</li><li>"+data.list[key].rank+"</li>";
                            }
                        }
                        else {
                            str_res = "<li><img src='image/sys/b.png'></li>";
                            if (data.list[key].rank == 0) {
                                str_rank = "<li>你排名不变</li><li></li>";
                            }
                            else {
                                str_rank = "<li>你排名降至</li><li>"+data.list[key].rank+"</li>";
                            }
                        }
                        item += "<ul class='chartsPLi'>"+str_res+"<li>"+data.list[key].name+"</li><li><img src='image/sys/vs.png'></li><li>"+data.list[key].tgt_name+"</li>"+"<li>"+data.list[key].record_str+"</li>"+str_rank+"</ul>";
                    }
                }
                $("#arena_record_list").addSliderItem(item);
            });
    },
    setSlidBlock2:function(){
        var sliderConTop=parseInt($("#arena_record_list").children().slice(0,1).css("margin-top"));
        sliderConTop=isNaN(sliderConTop)?0:sliderConTop;
        if(sliderConTop<=0){
            var conTopLimit=parseInt($("#arena_record_list").children().slice(0,1).height())-parseInt($("#arena_record_list").height());
            if(conTopLimit>=0){
                var sliderBlockTopLimit=284;
                var top=Math.abs(parseInt(sliderConTop/conTopLimit*sliderBlockTopLimit));
                top=top<0?0:top;
                top=top>sliderBlockTopLimit?sliderBlockTopLimit:top;
                $("#arena_r_block2").css("margin-top",top+"px");
            }
        }
    },
    recordClose:function() {
        $("#arena_record_win").attr('style', 'display:none');
        $("#arena_record_close").unbind(clickEventType);
    }
}



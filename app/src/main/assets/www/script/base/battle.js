var battle={
	bid:0,//pve战斗标识
	tid:0,//pvp竞技场战斗标识
	isLoading:false,//防止多次点击战斗
	result:"",
	drop:{},
	dataStr:{},//战斗数据
	mustEnd:false,//控制立即结束
	dialogueB:null,//战斗结束时对话
	// Android: 把 bid 映射到 sys_formation（脚本敌人阵型）
	_sysFormations: {
		1: '5 0 0|0 0 0|0 0 0',
		2: '2 0 0|0 3 0|0 0 0',
		3: '3 0 0|0 0 0|0 2 4',
		4: '5 0 0|0 3 0|0 0 4',
		5: '5 0 0|0 4 0|0 0 4'
	},
	getSysFormation:function(bid){
		var id = parseInt(bid) || 1;
		return battle._sysFormations[id] || '1 0 0|0 0 0|0 0 0';
	},
	getPreLoadStaticRes:function(){
		return [
			'image/game/tx/afury1.png',
			'image/game/tx/afury2.png',
			'image/game/tx/afury3.png',
			'image/game/tx/attjn1.png',
			'image/game/tx/attjn2.png',
			'image/game/tx/attjn3.png',
			'image/game/tx/death.png',
			'image/game/tx/dizzy1.png',
			'image/game/tx/dizzy2.png',
			'image/game/tx/dizzy3.png',
			'image/game/tx/fshi1.png',
			'image/game/tx/fshi2.png',
			'image/game/tx/hp1.png',
			'image/game/tx/hp2.png',
			'image/game/tx/hp3.png',
			'image/game/tx/huanxue1.png',
			'image/game/tx/huanxue2.png',
			'image/game/tx/huanxue3.png',
			'image/game/tx/jiannu1.png',
			'image/game/tx/jiannu2.png',
			'image/game/tx/jiannu3.png',
			'image/game/tx/jiaxue1.png',
			'image/game/tx/jiaxue2.png',
			'image/game/tx/jiaxue3.png',
			'image/game/tx/long1.png',
			'image/game/tx/matt1.png',
			'image/game/tx/matt2.png',
			'image/game/tx/matt3.png',
			'image/game/tx/natt1.png',
			'image/game/tx/natt2.png',
			'image/game/tx/natt3.png',
			'image/game/tx/nfatt1.png',
			'image/game/tx/nfatt2.png',
			'image/game/tx/nfatt3.png',
			'image/game/tx/number.png',
			'image/game/tx/sfatt1.png',
			'image/game/tx/sfatt2.png',
			'image/game/tx/sfatt3.png',
			'image/game/tx/sfatt4.png',
			'image/game/tx/sfatt5.png',
			'image/game/tx/sword1.png',
			'image/game/tx/sword2.png',
			'image/game/tx/sword3.png',
			'image/game/tx/sword4.png',
			'image/game/tx/sword5.png',
			'image/game/tx/sword6.png',
			'image/game/tx/wareP_bg.png',
			'image/game/tx/wareP_bg1.png',
			'image/game/tx/ware_fg0.png',
			'image/game/tx/ware_fg1.png',
			'image/game/tx/ware_fg3.png',
			'image/game/tx/ware_fg4.png',
			'image/game/tx/xue.png'
		];
	},
	loadWindow:function(isFirst){
		var battleWindow=new mesWindow("battleWindow",$("#battle_tmpl").html(),0,0,1024,687);
		$("#battle_fastend").bind(clickEventType,battle.battleEnd);
		//battle.bid=battle.tid=0;
		battle.isLoading=true;//战斗开始加载
		battle.mustEnd=false;
		battle.dialogueB=null;
		//battle.addBackScreen();
		
		//首次战斗隐藏快速结束按钮
//		if(!isFirst){
//			$("#battle_fastend").hide();
//		}
		//Common.injectCloseCallBack(battle.closeWindow,"battleWindow");//注入关闭窗体事件
	},
	//添加背幕
	addBackScreen:function(){
		var bodyWidth=$("#wraper").width();
		var backWidth1=parseInt(bodyWidth/2);
		var backWidth2=bodyWidth-backWidth1;
		var back=$("<div style='position:absolute;width:"+bodyWidth+"px;height:"+bodyHeight+"px;'></div>");
		var back1=$("<div id='bBackScreen1' style='background-color:black;position:absolute;top:-20px;height:"+bodyHeight+"px;width:"+backWidth1+"px;left:0px;' class='bBackAnimation'></div>");
		var back2=$("<div id='bBackScreen2' style='background-color:black;position:absolute;top:-20px;height:"+bodyHeight+"px;width:"+backWidth2+"px;right:0px;' class='bBackAnimation'></div>");
		back.append(back1).append(back2);
		$("body").append(back);
	},
	//移除背幕
	removeScreen:function(callBack,callBackData){
		var screen1=$("#bBackScreen1");
		var screen2=$("#bBackScreen2");
		screen1.css("width","0px");
		screen2.css("width","0px");
		screen2.parent().remove();
		callBack(callBackData);
		//});
	},
	closeWindow:function(){
		if(battle.isLoading){
			return;
		}
		mesWindow.closeWindowById("battleWindow");
		//director.handDirectFromOtherClass(battle);//页面加载和绘制完成进行新手引导或者功能引导处理
	},
	fastEnd:function(){
		battle.isLoading=false;
		battle.mustEnd=true;
		if(battle.result=="left"){
			battle.showWinWindow(battle.drop);
		}
		else{
			battle.showLostWindow();
		}
		battle.bid=battle.tid=0;
		battle.result="";
		battle.drop={};
		battle.dataStr=null;
        $("#elite_s_list").find(".saodang").attr('style', 'display:none');
        $("#elite_s_list").find(".saodang").removeAttr('id');
        $("#elite_s_list").find(".zhandou").attr('style', 'display:none');
        $("#elite_s_list").find(".zhandou").removeAttr('id');
        $("#smap_list").find(".saodang").attr('style', 'display:none');
        $("#smap_list").find(".saodang").removeAttr('id');
        $("#smap_list").find(".zhandou").attr('style', 'display:none');
        $("#smap_list").find(".zhandou").removeAttr('id');
		
		//director.handDirectFromOtherClass(battle);//页面加载和绘制完成进行新手引导或者功能引导处理
	},
	battleEnd:function(){
		$("#tx_show").remove();
		if(battle.dialogueB){
			/*
			$(".battle").find("dt").empty();
			$(".battle").find("dd").remove();*/
			battle.showDialogue(battle.dialogueB,battle.fastEnd);
		}
		else{
			battle.fastEnd();
		}
	},
	//pve战斗
	getBattleInfo:function(bid,isFirst){
		if(battle.isLoading){
			return;
		}
		if(director.progress>0){
			$('.commonBack').remove();
			$('#directorCon1').remove();
			$('#directorBack').remove();
			$(".talkPop").remove();
		}
		battle.isLoading = true;
		ResLoad.resourceLoader(battle.getPreLoadStaticRes(),function(){
			battle.loadWindow(isFirst);
			battle.bid=bid;
			// Android 改造：绕过 PHP f.php，直接调 SgBridge.battleFight
			try {
				var playerFormation = (typeof Buzhen !== 'undefined' && Buzhen.currentFormation)
					? Buzhen.currentFormation
					: '2 0 0|0 0 0|0 0 0';
				var sysIds = battle.getSysFormation(bid);
				var raw = SgBridge.battleFight(playerFormation, sysIds);
				var data = JSON.parse(raw);
				data.st = 0;
				data.result = data.winner;
				data.next = null;
				try { data.user = JSON.parse(SgBridge.userGetInfo()); } catch(e) { data.user = null; }

				if(data.st){
					if(parseInt(data.st)==1){
						Common.alert("<span class='cor95 stro13'>体力</span> 不足");
					}
					else if(parseInt(data.st)==2){
						Common.alert("<span class='cor95 stro13'>当天战斗次数</span> 已满");
					}
					battle.isLoading=false;
					battle.closeWindow();
					return;
				}
				if(data.next){
					if(data.next.type==1){
						user.setCurrentBattle(data.next.nborder);
					}
					if(typeof map !== 'undefined' && map.refreshMap) map.refreshMap(data.next);
				}
				if(typeof tiLi !== 'undefined' && tiLi.nextTime<=0){
					tiLi.startRefresh();
				}
				battle.dataStr=data;
				battle.result=data.result;

				if(battle.result=="left"){
					if(typeof user !== 'undefined' && user.refreshTaskInfo) user.refreshTaskInfo();
					if(typeof Buzhen !== 'undefined' && Buzhen.refreshUserFormation) Buzhen.refreshUserFormation();
				}
				if(data.drop){
					battle.drop=data.drop;
				}

				if(data.user){
					user.refreshUserInfo(data.user);
				}
				if(data.dialogueB){
					battle.dialogueB=data.dialogueB;
				}
				battle.showBattle(data);
			} catch(e) {
				battle.isLoading=false;
				battle.closeWindow();
				Common.alert('战斗错误: ' + e.message);
			}
		},1);
		/*
		var data={"start":{"left":[[0,0,0],[0,{"hp":11740,"fury":50,"img":"liuchan.png","img_small":"liuchanh.jpg"},0],[0,{"hp":800,"fury":50,"img":"zhangfei.png","img_small":"zhangfeih.jpg"},0]],"right":[[0,0,{"hp":2564,"fury":50,"img":"guai.png","img_small":"zabing11.gif"}],[{"hp":2564,"fury":50,"img":"guai.png","img_small":"zabing5.gif"},{"hp":4134,"fury":50,"img":"boss.png","img_small":"zajiang7.gif"},0],[0,0,0]]},"string":[
		/*{"att":{"pos":"right11","hp":0,"nt":"1","skill":{"name":"\u5486\u54ee\u00b7\u5341\u5e74"},"fury":0},"def":{"121":{"pos":"left121","lianji":{"1":{"hp":-60},"2":{"miss":1}}}}},
		{"att":{"pos":"right11","hp":0,"nt":"1","skill":0,"fury":75},"def":{"121":{"pos":"left121","miss":1,"fury":75,"effect":[0]}}},
		{"att":{"pos":"left21","hp":0,"nt":"1","skill":0,"fury":100},"def":{"011":{"pos":"right011","hp":-70,"fury":100,"effect":[0]}}}
		/*{"att":{"pos":"right10","hp":0,"nt":"1","skill":{"name":"\u65cb\u98ce"},"fury":0},"def":{"111":{"pos":"left111","hp":-1084,"effect":["2","5"],"fury":75}}},
		{"att":{"pos":"left21","hp":0,"nt":"1","skill":{"name":"\u5486\u54ee\u00b7\u4e07\u5e74"},"fury":0},"def":{"011":{"pos":"right011","lianji":{"1":{"miss":1},"2":{"hp":-200},"3":{"hp":-360},"4":{"hp":-300},"5":{"hp":-450}}}}},
		{"att":{"pos":"right11","hp":0,"nt":"1","skill":{"name":"\u82f1\u9b42"},"fury":0},"def":{"111":{"pos":"left111","hp":-3010,"effect":["2"]},"011":{"pos":"right011","fury":"50","effect":["6"]}}}
		],"result":"right","user":{"nowTL":307,"maxTL":30}}
		battle.showBattle(data);*/
	},
	//pvp竞技场战斗
	setCompetitiveInfo:function(data,tid){
		if(battle.isLoading){
			return;
		}
		battle.loadWindow();
		battle.tid=tid;
		battle.result=data.result;
		if(data.drop){
			battle.drop=data.drop;
		}
		//battle.showBattle(data);
		setTimeout(battle.showBattle,0,data);
	},
	initialBattle:function(data){
		var furyRate=89/100;
		var allHp=0;
		for(key1 in data.left){
			for(key2 in data.left[key1]){
				if(data.left[key1][key2]!=0){
					var wj=$("#left"+key1+key2);
					var maxhp=data.left[key1][key2].hp;
					allHp+=maxhp;
					//var fury=Math.round(data.left[key1][key2].fury*furyRate);
					var img=data.left[key1][key2].img_small;
					var bimg=data.left[key1][key2].img;//大图
					var member=$("<div class='wareBox"+data.left[key1][key2]['class']+" pre'></div>");
					if(data.left[key1][key2].type=="2"){//武将类型
						member.append('<img class="spfz" src="'+imgfolder+img+'" npctype="'+data.left[key1][key2].type+'" bimg="'+bimg+'"><p class="wareFs pab"></p><div class="wareB pab"><p class="wareBlod3 pab hpAndFuryAni" style="width:71px;"></p></div>');//力量型
					}
					else{
						member.append('<img class="spfz" src="'+imgfolder+img+'" npctype="'+data.left[key1][key2].type+'" bimg="'+bimg+'"><p class="wareWl pab"></p><div class="wareB pab"><p class="wareBlod3 pab hpAndFuryAni" style="width:71px;"></p></div>');//智力型
					}
					wj.append(member);
					wj.attr({max_hp:maxhp,hp:maxhp});
				}
			}
		}
		data.limg = data.limg.replace(".", "s."); //将大头像换为对应的小头像
		$("#leftImg").css("background","url("+data.limg+") no-repeat");
		$("#leftName").text(data.lname);
		$("#leftBlood").attr({"allHp":allHp,"nAllHp":allHp});
		allHp=0;
		for(key1 in data.right){
			for(key2 in data.right[key1]){
				if(data.right[key1][key2]!=0){
					var wj=$("#right"+key1+key2);
					var maxhp=data.right[key1][key2].hp;
					allHp+=maxhp;
					var img=data.right[key1][key2].img_small;
					var bimg=data.right[key1][key2].img;//大图
					var member=$("<div class='wareBox"+data.right[key1][key2]['class']+" pre'></div>");
					if(data.left[key1][key2].type=="2"){//武将类型
						member.append('<img src="'+imgfolder+img+'" bimg="'+bimg+'"><p class="wareFs pab spfz" style="left:63px;"></p><div class="wareB pab spfz"><p class="wareBlod3 pab hpAndFuryAni" style="width:71px;"></p></div>');//力量型
					}
					else{
						member.append('<img src="'+imgfolder+img+'" bimg="'+bimg+'"><p class="wareWl pab spfz" style="left:63px;"></p><div class="wareB pab spfz"><p class="wareBlod3 pab hpAndFuryAni" style="width:71px;"></p></div>');//智力型
					}
					wj.append(member);
					wj.attr({max_hp:maxhp,hp:maxhp});
				}
			}
		}
		if(data.rimg.indexOf("image/sys")>=0){
			var rimg=data.rimg;
		}
		else{
			var rimg=imgfolder+data.rimg;
		}
		$("#rightImg").append("<img src='"+rimg+"'>");//css("background","url("+rimg+") no-repeat");
		$("#rightName").text(data.rname);
		$("#rightBlood").attr({"allHp":allHp,"nAllHp":allHp});
	},
	showDialogue:function(dialogueData,callBack,callBackData){
		var dialog=$($("#battleDialog_tmpl").html());
		dialog.css("width",$("#wraper").width());
		dialog.css("height",height);
		$("body").append(dialog);
		battle.showOneDialogue(dialogueData,1,callBack,callBackData);
	},
	showOneDialogue:function(dialogueData,dialogueOrder,callBack,callBackData){
		var flag=0;
		
		if(dialogueData[dialogueOrder]){
			var data=dialogueData[dialogueOrder];
			var userImg=$("#userName").attr("per_img");
			if(data['head_img'] == ''){
				$('#uImg').attr("src",userImg);
				$('#uImg').addClass("conDirLeft");
				$("#uimg").show();
				$("#npcimg").hide();
				$("#uimg_content").text(data["content"]);
			}else{
				$("#npcimg").css("left","450px");
				$("#uimg").hide();
				$("#npcimg").show();
				$("#nImg").attr("src","image/game/"+data['head_img']);
				$('#nImg').addClass("conDirLeft");
				$("#npcimg_content").text(data["content"]);
			}
			
			//if(dialogueData[++dialogueOrder]){
				//alert(dialogueOrder);
				//var timeID=setTimeout(battle.showOneDialogue,3000,dialogueData,dialogueOrder,callBack,callBackData);
				$("#bDialog").unbind(clickEventType).bind(clickEventType,function(){
					//clearTimeout(timeID);
					battle.showOneDialogue(dialogueData,++dialogueOrder,callBack,callBackData);
				});
			//}
			//else{
				//setTimeout("$('#bDialog').remove();callBack(callBackData);",1000)
				//$('#bDialog').remove();
				//callBack(callBackData);
			//}
		}
		else{//对话结束
			//battle.removeScreen();
			$("#bDialog").remove();
			callBack(callBackData);
			//battle.removeScreen(callBack,callBackData);
		}
	},
	showBattle:function(data){
		battle.initialBattle(data.start);
		//data.dialogueA={"1":{"content":"臭小子哪里来的，敢到这捣乱","head_img":"image/game/boss.png"},"2":{"content":"哼，我是你老子，来教训你了","head_img":""},"3":{"content":"O(∩_∩)O哈哈~，你好大的口气","head_img":"image/game/boss.png"},"4":{"content":"口气大不大，你试过了就知道了,受死吧","head_img":""}};
		if(data.dialogueA){
			battle.showDialogue(data.dialogueA,function(){
				battle.removeScreen(battle.startBattleAnimation,data);
			});
		}
		else{
			battle.removeScreen(battle.startBattleAnimation,data);
		}
	},
	startBattleAnimation:function(data){
		$("body").append('<div id="tx_show" style="position:absolute;top:0px;left:0px;width:1024px;height:820px;overflow:hidden;"></div>');
		if(data.string){
			setTimeout(battle.onceAttack,1000,data.string);
		}
		else{
			battle.battleEnd();
		}
	},
	//一次攻击
	onceAttack:function(data){
		if(!data[0]||!data[0].att||!data[0].def){
			//battle.fastEnd();
			battle.battleEnd();
			return;
		}
		var attObj=$("#"+data[0].att.pos).find("div:first");
		battle.normalAtt(attObj,data[0],function(){
			battle.onceAttackEnd(data);
		});
	},
	onceAttackEnd:function(data){
		data.shift();
		if(data.length>0){
			if(!battle.mustEnd){
				//setTimeout(battle.onceAttack,1000,data);
				battle.onceAttack(data);
			}
		}
		else{
			battle.battleEnd();
		}
	},
	clearBuff:function(obj){
		var id=obj.parent().attr("id");
		$("#tx_show").find("#defAnibuff"+id+"1").remove();
		$("#tx_show").find("#defAnibuff"+id+"2").remove();
	},
	//攻击动画
	normalAtt:function(obj,data,callBack){
		battle.clearBuff(obj);
		obj.addClass("normalAtt");
		obj.bind(animationEnd,function(){
			obj.removeClass("normalAtt");
			obj.unbind(animationEnd);
			
			if(data.att.effect&&data.att.skill=="0"){
				for(var key in data.att.effect){
					var effect = defEffect.getEffect(data.att.effect[key],data.att.nt);
					if(effect.attAnimate){
						var rect=effect.rect;
						var id=obj.parent().attr("id");
						var mainFrames=effect.attAnimate;
						var pos=obj.offset();
						var divStr1=$("<div style='position:absolute;width:"+rect.w+"px;height:"+rect.h+"px;top:"+(pos.top+rect.y)+"px;left:"+(pos.left+rect.x)+"px;'><img style='width:"+rect.w+"px;height:"+rect.h+"px' id='att"+id+"' src=''/></div>");
						$("#tx_show").append(divStr1);
						if(typeof mainFrames!="undefined"){
							mainPage.playAnimation("att"+id,mainFrames,0,1,function(){
								divStr1.remove();
								if(data.att.skill&&data.att.skill!="0"){//有技能释放
									battle.skillAnimation(obj,data.att.skill,data.def,callBack,data.att.nt);
								}
								else{
									battle.mutiDefAnimation(data.def,callBack,data.att.nt);
								}
							});
						}
						break;
					}
				}
			}
			if(typeof effect=="undefined"){
				if(data.att.skill&&data.att.skill!="0"){//有技能释放
					battle.skillAnimation(obj,data.att.skill,data.def,callBack,data.att.nt,data);
				}
				else{
					battle.mutiDefAnimation(data.def,callBack,data.att.nt);
				}
			}
			/*
			if(data.att.fury){//攻击方怒气动画
				var animateCounter=new animateEffectCounter(1,0);
				battle.hpAndFuryAnimation(obj,animateCounter,0,data.att.fury);
			}*/
		});
	},
	//放技能时的特效
	skillAnimation:function(attObj,skill,defObj,callBack,npcType,data){
		var width=$("body").width();
		width=width>1024?1024:width;
		var parentID=attObj.parent().attr("id");
		var strDiv=$($("#battleSkill_tmpl").html());
		strDiv.css("width",width+"px");
		var bImg=imgfolder+attObj.find("img").attr("bimg");
		var npcType = attObj.find("img").attr("npctype");
		//var skillName=battle.getSkillName(sname);

		strDiv.bind(animationEnd,function(){
			if(npcType=="1"){
				strDiv.find("#wj_bigImg").css("background","url("+bImg+") no-repeat 30px -35px").show();
			}else{
				strDiv.find("#wj_bigImg").css({"background":"url("+bImg+") no-repeat"}).show();
			}
			
			strDiv.find("#wj_skillName").show();
			strDiv.find("#wj_skillName").text(skill.name).addClass("stro2");//attr("src",skillName).parent().show();
			var pointLeft=parseInt(strDiv.find(".wareP_fg0").css("left"));
			var pointRight=pointLeft+strDiv.find(".wareP_fg0").width();
			if(parentID.indexOf("left")>=0){
				strDiv.addClass("skillLeft");
				var npcImgLeft=pointLeft+10-strDiv.find("#wj_bigImg").width();
				var skillNameLeft=width-pointRight-5-strDiv.find("#wj_skillName").width();
				strDiv.find("#wj_bigImg").css("left",npcImgLeft+"px");
				strDiv.find("#wj_skillName").css("right",skillNameLeft+"px");
			}
			else{
				strDiv.addClass("skillRight");
				var npcImgLeft=width-pointRight+10-strDiv.find("#wj_bigImg").width()-30; 
				var skillNameLeft=pointLeft-5-strDiv.find("#wj_skillName").width();
				strDiv.find("#wj_bigImg").css("right",npcImgLeft+"px");
				strDiv.find("#wj_skillName").css("left",skillNameLeft+"px");
			}
			
			strDiv.find("#wj_bigImg").bind(transitionEnd,function(){
				var showSkillTX=function(childIndex){
					if(childIndex==0){
						strDiv.children().slice(3,4).show();
					}
					else if(childIndex<=4){
						strDiv.children().slice(childIndex-1,childIndex).show();
					}
					if(childIndex>=4){
						setTimeout(function(){
							strDiv.remove();
							//释放攻击动画
							if(data.att.effect){
								for(var key in data.att.effect){
									var effect = defEffect.getEffect(data.att.effect[key],data.att.nt);
									if(effect.attAnimate){
										var rect=effect.rect;
										var id=attObj.parent().attr("id");
										var mainFrames=effect.attAnimate;
										var pos=attObj.offset();
										var divStr1=$("<div style='position:absolute;width:"+rect.w+"px;height:"+rect.h+"px;top:"+(pos.top+rect.y)+"px;left:"+(pos.left+rect.x)+"px;'><img style='width:"+rect.w+"px;height:"+rect.h+"px' id='att"+id+"' src=''/></div>");
										
										if(effect.attAnimate[0].url=="image/game/tx/attjn1.png"&&attObj.parent().attr("id").indexOf("left")!=-1){
											divStr1.find("img").addClass("conDirLeft");
										}
	
										$("#tx_show").append(divStr1);
										if(typeof mainFrames!="undefined"){
											mainPage.playAnimation("att"+id,mainFrames,0,1,function(){
												divStr1.remove();
												battle.mutiDefAnimation(defObj,callBack,npcType);
											});
										}
										break;
									}
								}
							}
							if(typeof effect=="undefined"||!effect.attAnimate){
								battle.mutiDefAnimation(defObj,callBack,npcType);
							}
							//攻击动画完成
							
						},500);
					}
					else{
						setTimeout(showSkillTX,30,++childIndex);
					}
				}
				setTimeout(showSkillTX,30,0);
			});
		});
		$("#tx_show").append(strDiv);
		//吕布技能
		if(skill.id=="17"||skill.id=="18"||skill.id=="19"||skill.id=="184"||skill.id=="193"){
			setTimeout(function(){
				if(attObj.parent().attr("id").indexOf("left")!=-1){
					battle.dragonsHowl();
				}else{
					battle.dragonsHowl(1);
				}	
			},1600);
		}
	},
	//被攻击方目标有多个时
	mutiDefAnimation:function(defObj,callBackParent,npcType){
		var defLength=0;
		for(key in defObj){
			defLength++;
		}
		var completedNum=0;
		var everyDefCallBack=function(){//每一个防守方特效完成后调用的方法
			completedNum++;
			if(completedNum==defLength){
				callBackParent();
			}
		}
		for(key in defObj){
			var pos_id=battle.getDefPos(defObj[key].pos);
			var oneDefObj=$("#"+pos_id);
			if(oneDefObj.length>0){
				if(!defObj[key].miss){
					if(defObj[key].lianji){
						battle.lianJiAnimation(oneDefObj.find("div:first"),defObj[key],everyDefCallBack,npcType,defObj[key].hp,defObj[key].fury);//连击特效
					}
					else{
						battle.defAnimation(oneDefObj.find("div:first"),defObj[key],everyDefCallBack,npcType,defObj[key].hp,defObj[key].fury);
					}
				}
				else{
					battle.missAnimation(oneDefObj.find("div:first"),everyDefCallBack);
				}
			}
			else{
				everyDefCallBack();
			}
		}
	},
	//死亡处理
	deathAnimation:function(obj,callBack){
		var nowhp=parseInt(obj.parent().attr("hp"));
		if(nowhp<=0){
			/*
			var animateCounter=new animateEffectCounter(1,0);
			animateCounter.setCallBack(callBack);
			battle.hpAndFuryAnimation(obj,animateCounter,0,0);*/
			battle.clearBuff(obj);
			obj.addClass("death");
			obj.find(".wareWl,.wareB").remove();
			obj.find("img").attr("src","image/game/tx/death.png").addClass("conDirLeft");
			callBack();
		}
		else{
			callBack();
		}
	},
	//被击中动画
	kickAnimation:function(obj,animateCounter){
		if(obj.parent().attr("id").indexOf("left")>=0){
			obj.addClass("def2");
		}else{
			obj.addClass("def1");
		}
		obj.bind(animationEnd,function(){
			obj.removeClass("def1 def2");
			obj.unbind(animationEnd);
			animateCounter.addCompletedNum();
		});
	},
	//飙血动画
	bloodAnimation:function(obj,animateCounter){
		var pos=obj.offset();
		if(obj.parent().attr("id").indexOf("left")>=0){
			rotateStr="";
		}
		else{
			rotateStr="left:"+(pos.left+30)+"px;-webkit-transform:rotate(90deg);-moz-transform:rotate(90deg);-ms-transform:rotate(90deg);-o-transform:rotate(90deg);transform:rotate(90deg);";
		}
		var divStr2=$("<div style='position:absolute;width:144px;height:144px;top:"+(pos.top-65)+"px;left:"+(pos.left-100)+"px;"+rotateStr+"'><img  id='defBD"+obj.parent().attr("id")+"' src=''/></div>");
		$("#tx_show").append(divStr2);
		mainPage.playAnimation("defBD"+obj.parent().attr("id"),[{url:"image/game/tx/hp1.png",nextT:120},{url:"image/game/tx/hp2.png",nextT:120},{url:"image/game/tx/hp3.png",nextT:120}],0,1,function(){
			divStr2.remove();
			animateCounter.addCompletedNum();
		});
	},
	//技能额外信息显示动画(比如打掉的血量和加的血)
	extraInfoAnimation:function(obj,animateCounter,info,noDelay){
		var pos=obj.parent().offset();
		var divArray=new Array();
		var nextTime=0;
		var completedNum=0;
		var aniClass=(noDelay==undefined&&info.length<=1)?"showExtra":"showExtra2";
		for(key in info){
			var text=battle.translateTextToImage(info[key]);
			divArray.push($("<div class='"+aniClass+"' style='position:absolute;width:300px;height:40px;line-height:40px;text-align:center;top:"+(pos.top)+"px;left:"+(pos.left-100)+"px;'>"+text+"</div>"));
			divArray[key].bind(animationEnd,function(){
				$(this).remove();
				completedNum++;
				if(completedNum==info.length){
					animateCounter.addCompletedNum();
				}
			});
			if(key==0){
				$("#tx_show").append(divArray[key]);
			}
			else{
				battle.nextExtraInfo(key,divArray,nextTime);
			}
			nextTime+=500;
		}
	},
	//将显示的文字转换为图片
	translateTextToImage:function(text){
		var argType=typeof text;
		if(argType=="object"){
			if(text.hp){//显示血信息
				var endStr="";
				if(parseInt(text.hp)>0){
					endStr="_1";
				}
				var num="numz"+endStr;
				var numStr="<div class='"+num+"'></div>";
				if(text.type&&text.type=="crit"){//有暴击
					numStr='<div class="baoji"></div>'+numStr;
				}
				var textStr=text.hp.toString().replace("-","");//去掉负号
				for(i=0;i<textStr.length;i++){
					numStr+=("<div class='num"+textStr.substr(i,1)+endStr+"'></div>");
				}
				return numStr;
			}
			else{
				return "";
			}
		}
		else if(argType=="string"){
			if(text=="闪避"){
				return '<div class="shanbi"></div>';
			}else{
				return "";
			}
		}
	},
	dragonsHowl:function(right){
		var bg = $("<div style='position:absolute;width:1024px;height:768px;'></div>");
		var bg1 = $("<div style='position:absolute;width:1024px;height:768px;'></div>");
		
		if(right){
			dragon1 = $("<img src='image/game/tx/long1.png' style='position:absolute;top:170px;left:700px;'/>");
			blood = $("<img src='image/game/tx/xue.png' style='position:absolute;top:70px;left:0px;'/>");
		}else{
			var dragon1 = $("<img src='image/game/tx/long1.png' style='position:absolute;top:170px;left:0px;'/>");
			var blood = $("<img src='image/game/tx/xue.png' style='position:absolute;top:70px;left:700px;'/>");
		}
		
		var dragon2 = dragon1.clone();  //紧跟在第一条小龙后面的两条龙
		var dragon3 = dragon1.clone();
		var dragon4 = dragon1.clone(); //后出来的两条小龙
		var dragon5 = dragon1.clone();  
		var dragon6 = dragon1.clone();  //大龙
		bg.append(dragon1);
		if(right){
			dragon1.addClass("dragon1_r");
		}else{
			dragon1.addClass("dragon1");
		}
		
		$("#tx_show").append(bg1).append(bg);
		setTimeout(function(){
			bg.prepend(dragon2).prepend(dragon3).append(dragon6);
			if(right){
				dragon2.addClass("dragon2_r");
				dragon3.addClass("dragon3_r");
				dragon6.addClass("dragon4_r");
			}else{
				dragon2.addClass("dragon2");
				dragon3.addClass("dragon3");
				dragon6.addClass("dragon4");
			}			
		},200);
		setTimeout(function(){
			bg.append(blood);
			bg1.css({"background-color":"white","opacity":"0.6"});
			setTimeout(function(){
				blood.hide();
				bg1.hide();
			},200);
		},700);
		setTimeout(function(){
			bg.prepend(dragon4).prepend(dragon5);
			if(right){
				dragon4.addClass("dragon2_r");
				dragon5.addClass("dragon3_r");
			}else{
				dragon4.addClass("dragon2");
				dragon5.addClass("dragon3");
			}	
		},850);
		setTimeout(function(){
			blood.show();
			bg1.show();
			setTimeout(function(){
				blood.hide();
				bg1.hide();
			},200);
		},1100);
		setTimeout(function(){
			bg.remove();
			bg1.remove();
			blood.remove();
			dragon1.remove();
			dragon2.remove();
			dragon3.remove();
			dragon4.remove();
			dragon5.remove();
			dragon6.remove();
		},1500);
	},
	nextExtraInfo:function(key,array,nextTime){
		setTimeout(function(){$("#tx_show").append(array[key]);},nextTime);
	},
	//血条和怒气条效果
	hpAndFuryAnimation:function(obj,animateCounter,hpNum){
		//血条动画
		if(hpNum!=undefined&&parseInt(hpNum)!=0){
			var maxHp=parseInt(obj.parent().attr("max_hp"));
			var nowhp=parseInt(obj.parent().attr("hp"));
			var inithp=nowhp;
			nowhp+=hpNum;
			if(nowhp<0){
				nowhp=0;
			}
			obj.parent().attr("hp",nowhp);
			var hpGap=nowhp-inithp;
			var hpObj=obj.find(".wareBlod3");
			hpObj.bind(transitionEnd,function(){
				hpObj.unbind(transitionEnd);
				/*
				if(nowhp<=0){
					battle.clearBuff(obj);
				}*/
				if(animateCounter)
					animateCounter.addCompletedNum();
			});
			hasAnimate=false;
			if(obj.parent().attr("id").indexOf("left")>=0){
				var lastHpGroove=parseInt(hpObj.css("width"));
				var nowHpGroove=parseInt(nowhp/maxHp*71);
				if(lastHpGroove!=nowHpGroove){
					hpObj.css("width",nowHpGroove+"px");
					hasAnimate=true;
				}
			
				//$("#leftTTHp").text(nowTThp);
				var allHp=parseInt($("#leftBlood").attr("allHp"));
				var nowAllHp=parseInt($("#leftBlood").attr("nAllHp"));
				nowAllHp+=hpGap;
				$("#leftBlood").attr("nAllHp",nowAllHp);
				$("#leftBlood").css("width",parseInt(nowAllHp/allHp*284)+"px");
			}
			else{
				var lastHpGroove=parseInt(hpObj.css("width"));
				var nowHpGroove=parseInt(nowhp/maxHp*71);
				if(lastHpGroove!=nowHpGroove){
					hpObj.css("width",nowHpGroove+"px");
					hasAnimate=true;
				}
				//$("#rightTTHp").text(nowTThp);
				var allHp=parseInt($("#rightBlood").attr("allHp"));
				var nowAllHp=parseInt($("#rightBlood").attr("nAllHp"));
				nowAllHp+=hpGap;
				$("#rightBlood").attr("nAllHp",nowAllHp);
				$("#rightBlood").css("width",parseInt(nowAllHp/allHp*284)+"px");
			}
			if(!hasAnimate){
				hpObj.unbind(transitionEnd);
				if(animateCounter)
					animateCounter.addCompletedNum();
			}
		}
	},
	//连击动画(连击特效单独处理，与其他特效不同)
	lianJiAnimation:function(obj,defData,callBack,npcType,hpNum,fury){
		var effect=defEffect.getEffect(3,npcType);//连击效果
		var frames=effect.animate;
		var rect=effect.rect;
		var id=obj.parent().attr('id');
		var pos=obj.offset();
		var divStr1=$("<div style='position:absolute;width:"+rect.w+"px;height:"+rect.h+"px;top:"+(pos.top+rect.y)+"px;left:"+(pos.left+rect.x)+"px;'><img style='width:"+rect.w+"px;height:"+rect.h+"px' id='defLJAni"+id+"' src='"+frames[0].url+"'/></div>");
		$("#tx_show").append(divStr1);
		battle.onceLianJi({obj:obj,id:id,lianJiData:defData["lianji"],frames:frames,index:0,callBack:function(){
			divStr1.remove();
			battle.defAnimation(obj,defData,callBack,npcType,hpNum,fury);
		}});
	},
	onceLianJi:function(args){
		args.index++;
		if(args.lianJiData[args.index]==undefined){
			args.callBack();
			return;
		}
		$("#defLJAni"+args.id).show();
		args.frames[1].callBack=new Array();
		var animateCounter=new animateEffectCounter(3,0);
		args.frames[1].callBack.push(function(){
			battle.kickAnimation(args.obj,animateCounter);
		});
		if(args.lianJiData[args.index].miss){//连击被闪避
			args.frames[1].callBack.push(function(){
				battle.extraInfoAnimation(args.obj,animateCounter,["闪避"],true);
			});
		}
		else{
			args.frames[1].callBack.push(function(){
				battle.extraInfoAnimation(args.obj,animateCounter,[{hp:args.lianJiData[args.index].hp,type:args.lianJiData[args.index].crit?"crit":undefined}],true);
			});
			if(parseInt(args.lianJiData[args.index].hp)!=0){
				animateCounter.allNum++;
				args.frames[1].callBack.push(function(){
					battle.hpAndFuryAnimation(args.obj,animateCounter,args.lianJiData[args.index].hp);
				});
			}
		}
		animateCounter.setCallBack(battle.onceLianJi,args);
		mainPage.playAnimation("defLJAni"+args.id,args.frames,0,1,function(){$("#defLJAni"+args.id).hide();animateCounter.addCompletedNum();});
	},
	defAnimation:function(obj,defData,callBack,npcType,hpNum,fury){
		var newEffect={
			a:null,//是否有被击中效果
			b:null,//是否有飙血效果
			c:null,//是否有附加信息效果
			d:[],//动作实体效果
			e:[]//是否有buff效果
		};
		var allEffectNum=0;
		var e=defData.effect;
		if(e!=undefined){
			for(key in e){
				if(e[key]=="6"){
					//TODO
				}
				var effect=defEffect.getEffect(e[key],npcType);
				if(effect.kickEffect&&newEffect.a==null){
					newEffect.a=effect.kickEffect.fromFrame;
					allEffectNum++;
				}
				if(effect.hpEffect&&newEffect.b==null){
					newEffect.b=effect.hpEffect.fromFrame;
					allEffectNum++;
				}
				//附加信息
				if(effect.extraEffect){
					newEffect.c=effect.extraEffect.fromFrame;
					if(!newEffect.extraInfo){
						newEffect.extraInfo=new Array();
						allEffectNum++;
					}
					newEffect.extraInfo=newEffect.extraInfo.concat(effect.extraEffect.info);
				}
				if(key==0&&hpNum!=undefined&&parseInt(hpNum)!=0){//第一个技能效果才加计数器
					allEffectNum++;
				}
				/*
				if(key==0&&fury!=undefined){//第一个技能效果才加计数器
					allEffectNum++;
				}*/
				if(!effect.isbuff){
					if(newEffect.d.length==0){
						newEffect.d.push(effect);
						allEffectNum++;
					}
					else{//根据优先级进行插入排序
						var len=newEffect.d.length;
						for(key2 in newEffect.d){
							if(newEffect.d[key2].priority>effect.priority){
								newEffect.d.splice(key2,0,effect);
								break;
							}
						}
						if(len==newEffect.d.length){//长度没有变化
							newEffect.d.push(effect);
						}
					}
				}
				else{
					newEffect.e.push(effect);
				}
			}
		}
		else{//攻击方自己掉血(比如有反噬，比如换血)
			if(hpNum!=undefined){
				allEffectNum=2;//只有掉血和掉血显示信息动画
				var animateCounter=new animateEffectCounter(allEffectNum,0);
				animateCounter.setCallBack(function(){
					battle.deathAnimation(obj,callBack);
				});
				//animateCounter.setCallBack(callBack);
				battle.extraInfoAnimation(obj,animateCounter,[{hp:hpNum}]);
				battle.hpAndFuryAnimation(obj,animateCounter,hpNum);
				return;
			}
		}
		var id=obj.parent().attr('id');
		var pos=obj.offset();
		var animateCounter=new animateEffectCounter(allEffectNum,0);
		//设置buff效果
		if(newEffect.e.length>0){
			animateCounter.setCallBack(function(){
				var buffID=id+"1";
				if($("#defAnibuff"+buffID).length>0){
					buffID=id+"2";
				}
				var divStr1=$("<div style='position:absolute;top:0px;left:0px;'><img style='width:0px;height:0px' id='defAnibuff"+buffID+"' src=''/></div>");
				$("#tx_show").append(divStr1);
				for(key in newEffect.e){
					$("#defAnibuff"+buffID).css({width:newEffect.e[key].rect.w,height:newEffect.e[key].rect.h});
					$("#defAnibuff"+buffID).parent().css({top:(pos.top+newEffect.e[key].rect.y+"px"),left:(pos.left+newEffect.e[key].rect.x+"px")});
					mainPage.playAnimation("defAnibuff"+buffID,newEffect.e[key].animate,0,0);
				}
				battle.deathAnimation(obj,callBack);
				//callBack();
			});
		}
		else{
			
			animateCounter.setCallBack(function(){
				battle.deathAnimation(obj,callBack);
			});
			//animateCounter.setCallBack(callBack);
		}
		//设置第一个动画效果
		if(newEffect.d.length>0){
			var mainFrames=newEffect.d[0].animate;
			var rect=newEffect.d[0].rect;
			if(newEffect.a!=null){
				if(newEffect.a>=mainFrames.length){
					newEffect.a=mainFrames.length-1;
				}
				if(mainFrames[newEffect.a].callBack==undefined){
					mainFrames[newEffect.a].callBack=new Array();
				}
				mainFrames[newEffect.a].callBack.push(function(){
					battle.kickAnimation(obj,animateCounter);
				});
			}
			if(newEffect.b!=null){
				if(newEffect.b>=mainFrames.length){
					newEffect.b=mainFrames.length-1;
				}
				if(mainFrames[newEffect.b].callBack==undefined){
					mainFrames[newEffect.b].callBack=new Array();
				}
				mainFrames[newEffect.b].callBack.push(function(){
					battle.bloodAnimation(obj,animateCounter);
				});
			}
			if(newEffect.c!=null){
				if(newEffect.c>=mainFrames.length){
					newEffect.c=mainFrames.length-1;
				}
				if(mainFrames[newEffect.c].callBack==undefined){
					mainFrames[newEffect.c].callBack=new Array();
				}
				mainFrames[newEffect.c].callBack.push(function(){
					battle.extraInfoAnimation(obj,animateCounter,[{hp:hpNum,type:defData.crit?"crit":undefined}]);
				});
			}
			//血条动画
			if(hpNum!=undefined&&parseInt(hpNum)!=0){
				if(mainFrames[1].callBack==undefined){
					mainFrames[1].callBack=new Array();
				}
				mainFrames[1].callBack.push(function(){
					battle.hpAndFuryAnimation(obj,animateCounter,hpNum);
				});
			}
			/*
			//怒气动画
			if(fury!=undefined){
				if(mainFrames[1].callBack==undefined){
					mainFrames[1].callBack=new Array();
				}
				mainFrames[1].callBack.push(function(){
					battle.hpAndFuryAnimation(obj,animateCounter,0,fury);
				});
			}*/
			//将以后的动画效果合并
			if(newEffect.d.length>1){
				for(i=1;i<newEffect.d.length;i++){
					mainFrames=mainFrames.concat(newEffect.d[i].animate);
				}
			}
		}
		else if(newEffect.a!=null||newEffect.b!=null||newEffect.c!=null || hpNum!=undefined){// || fury!=undefined)
			if(newEffect.a!=null){
				battle.kickAnimation(obj,animateCounter);
			}
			if(newEffect.b!=null){
				battle.bloodAnimation(obj,animateCounter);
			}
			if(newEffect.c!=null){
				battle.extraInfoAnimation(obj,animateCounter,[{hp:hpNum,type:defData.crit?"crit":undefined}]);
			}
			if(hpNum!=undefined&&parseInt(hpNum)!=0){
				battle.hpAndFuryAnimation(obj,animateCounter,hpNum);
			}
			/*
			if(fury!=undefined&&parseInt(fury)!=0){
				battle.hpAndFuryAnimation(obj,animateCounter,0,fury);
			}*/
		}
		else{
			animateCounter.callBack(animateCounter.args);
		}
		if(typeof mainFrames!="undefined"){
			var divStr1=$("<div style='position:absolute;width:"+rect.w+"px;height:"+rect.h+"px;top:"+(pos.top+rect.y)+"px;left:"+(pos.left+rect.x)+"px;'><img style='width:"+rect.w+"px;height:"+rect.h+"px' id='defAni"+id+"' src=''/></div>");
			$("#tx_show").append(divStr1);
			if(typeof mainFrames!="undefined"){
				mainPage.playAnimation("defAni"+id,mainFrames,0,1,function(){
					//if(newEffect.e.length==0){
						//divStr1.find("img").hide();
						divStr1.remove();
					//}
					animateCounter.addCompletedNum();
				});
			}
		}
	},
	//闪避动画
	missAnimation:function(obj,callBack){
		var animateCounter=new animateEffectCounter(2,0);
		animateCounter.setCallBack(callBack);
		battle.kickAnimation(obj,animateCounter);
		battle.extraInfoAnimation(obj,animateCounter,["闪避"]);
		//battle.hpAndFuryAnimation(obj,animateCounter,0,fury);  //闪避也有怒气的
	},
	getDefPos:function(pos){
		if(pos.length==7){  //#left000
			var pos_id = "left"+pos.substr(5,2);
		}else if(pos.length==8){   //right000
			var pos_id = "right"+pos.substr(6,2);
		}
		return pos_id;
	},
	showLostWindow:function(){
		tmpl="battleLost_tmpl";
		//alert(1);
		var userLevel = parseInt($("#userLevel").text());
		var battleLostWindow=new mesWindow("bLostWindow",$("#"+tmpl).html());
		Common.injectCloseCallBack(battle.closeWindow,"bLostWindow");//注入关闭战斗窗体
		if(userLevel<15){
			$("#lost_bag").show();
			$("#lost_bag").bind(clickEventType,function(){
				battle.closeCurrentWindow();
				battle.closeOtherWindow();
                if (document.getElementById("eliteWindow")) {
                    mesWindow.closeWindowById("eliteWindow");
                    DialogLevel=0;
                }
                if (document.getElementById("eliteSWindow")) {
                    mesWindow.closeWindowById("eliteSWindow");
                    DialogLevel=0;
                }
				hotLinks.bag();
			});
		}else {
            $("#lost_bag").text('');
            $("#lost_bag").removeAttr('id');
        }
		$("#btn_back").bind(clickEventType,function(){
			battleLostWindow.closeWindow(this);
			battle.closeWindow();
		});
		//alert(userLevel);
		if(userLevel>10){
			$("#lost_buzhen").show().bind(clickEventType,function(){
				battle.closeCurrentWindow();
				battle.closeOtherWindow();
                if (document.getElementById("eliteWindow")) {
                    mesWindow.closeWindowById("eliteWindow");
                    DialogLevel=0;
                }
                if (document.getElementById("eliteSWindow")) {
                    mesWindow.closeWindowById("eliteSWindow");
                    DialogLevel=0;
                }
				hotLinks.bz();
			});
		}
		$("#lost_fabao").bind(clickEventType,function(){
			battle.closeCurrentWindow();
			battle.closeOtherWindow();
			hotLinks.fb();
		});
		if(userLevel>5){
			$("#lost_qianghua").show().bind(clickEventType,function(){
				battle.closeCurrentWindow();
				battle.closeOtherWindow();
                if (document.getElementById("eliteWindow")) {
                    mesWindow.closeWindowById("eliteWindow");
                    DialogLevel=0;
                }
                if (document.getElementById("eliteSWindow")) {
                    mesWindow.closeWindowById("eliteSWindow");
                    DialogLevel=0;
                }
				Duanzao.loadWindow(1);
			});
		}
		$("#lost_hecheng").bind(clickEventType,function(){
			battle.closeCurrentWindow();
			if(document.getElementById("taskwindow")){
				mesWindow.closeWindowById("taskwindow");
				Dia.level1=0;
			}
			if(!document.getElementById("hechengWindow")){
				hotLinks.hc();
			}
		});
		$("#lost_xilian").bind(clickEventType,function(){
			battle.closeCurrentWindow();
			battle.closeOtherWindow();
			hotLinks.wj();
		});
		$("#lost_task").bind(clickEventType,function(){
			battle.closeCurrentWindow();
			battle.closeOtherWindow();
            if (document.getElementById("eliteWindow")) {
                mesWindow.closeWindowById("eliteWindow");
                DialogLevel=0;
            }
            if (document.getElementById("eliteSWindow")) {
                mesWindow.closeWindowById("eliteSWindow");
                DialogLevel=0;
            }
			hotLinks.task();
		});
		if($("#lost_btn_container>a:visible").length>3){
			$("#lost_btn_container").css("height","180px");
		}
		/*
		$("#lost_qingfu").bind(clickEventType,function(){
			battle.closeCurrentWindow();
			battle.closeOtherWindow();
			hotLinks.qf();
		});*/
//		var music = document.getElementById("battle_audio");
//			music.pause();
	},
	closeCurrentWindow:function(){
		mesWindow.closeWindowById("bLostWindow");
		mesWindow.closeWindowById("battleWindow");
//                if (document.getElementById("eliteWindow")) {
//                    mesWindow.closeWindowById("eliteWindow");
//                    DialogLevel=0;
//                }
//                if (document.getElementById("eliteSWindow")) {
//                    mesWindow.closeWindowById("eliteSWindow");
//                    DialogLevel=0;
//                }
		if(document.getElementById("smapWindow")){
			mesWindow.closeWindowById("smapWindow");
		}
		if(document.getElementById("mapWindow")){
			mesWindow.closeWindowById("mapWindow");
			DialogLevel=0;
		}
	},
	closeOtherWindow:function(){
		if(document.getElementById("hechengWindow")){
			mesWindow.closeWindowById("hechengWindow");
			DialogLevel=0;
		}
		if(document.getElementById("taskwindow")){
			mesWindow.closeWindowById("taskwindow");
			DialogLevel=0;
		}
		if(document.getElementById("competitiveWindow")){
			competitive.closeWindow();
		}
	},
	showWinWindow:function(data){
		var tmpl = "";
		if(battle.bid){
			if(data.exp){
				data.exp.show="";
				if(data.exp.newUL){
					data.exp.newULShow="";
				}
				else{
					data.exp.newULShow="none";
				}
				if(data.exp.newNL){
					data.exp.newNLShow="";
				}
				else{
					data.exp.newNLShow="none";
				}
			}
			else{
				data.exp=new Object();
				data.exp.show="none";
				data.exp.newULShow="none";
				data.exp.newNLShow="none";
			}
			if(data.gold){
				data.gold.show="";
			}
			else{
				data.gold=new Object();
				data.gold.show="none";
			}
			data.wupin=new Object();
			data.wupin.a=new Object();
			data.wupin.b=new Object();
			data.wupin.a.show=data.wupin.b.show="none";
			data.wupin.show="none";
			data.wupin.replace="";
			if(data.equip){
				data.wupin.a.name=data.equip[0].name;
				data.wupin.a.img="<img src='"+imgfolder+data.equip[0].img+"' height='50' width='50' />";
				data.wupin.a.num="*"+data.equip[0].num;
				data.wupin.a.show="";
				data.wupin.show="";
				data.wupin.replace="none";
			}
			if(data.prop){
				data.wupin.b.name=data.prop[0].name;
				data.wupin.b.img="<img src='"+imgfolder+data.prop[0].img+"' height='50' width='50' />";
				data.wupin.b.num="*"+data.prop[0].num;
				data.wupin.b.show="";
				data.wupin.show="";
				data.wupin.replace="none";
			}
			tmpl="battleWin_tmpl";
		}
		else if(battle.tid){
			tmpl="comWin_tmpl";
		}
		var battleWinWindow=new mesWindow("bWinWindow",$.tmpl($("#"+tmpl).html(),data).html());
		Common.injectCloseCallBack(battle.closeWindow,"bWinWindow");//注入关闭战斗窗体
		if(director.progress==17){
			director.updateProgress();
		}else if(director.progress==25){
			director.updateProgress();
		}else if(director.progress==31){
			director.updateProgress();
		}
		$("#btn_confirm").bind(clickEventType,function(){
			battleWinWindow.closeWindow(this);
			mesWindow.closeWindowById("battleWindow");
			if(director.progress==19){
				director.updateProgress();
			}else if(director.progress==26){
				director.updateProgress();
			}else if(director.progress==32){
				director.updateProgress();
			}
                        if (document.getElementById("elite_s_list")) {
                            var elite_mid = $("#elite_s_name").attr("mid");
                            $("#windowBackeliteSWindow").remove();
                            $("#eliteSWindow").remove();
                            elite.clickEliteCallBack('', elite_mid);
                        }
		});
//		var music = document.getElementById("battle_audio");
//			music.pause();
	}
	
}

//一次出手特效计数器
function animateEffectCounter(allNum,completedNum,callBack,args){
	this.allNum=allNum;
	this.completedNum=completedNum;
	this.callBack=callBack;
	this.args=args;
}
animateEffectCounter.prototype.addCompletedNum=function(){
	this.completedNum++;
	if(this.completedNum>=this.allNum){//执行回调函数
		if(this.callBack!=undefined){
			this.callBack(this.args);
		}
	}
}
animateEffectCounter.prototype.setCallBack=function(callBack,args){
	this.callBack=callBack;
	this.args=args;
}
//

//防御方收到攻击后的效果
var defEffect={
	getEffect:function(effect,npcType){
		var effectNum=parseInt(effect);
		switch(effectNum){
			case 0:
				if(parseInt(npcType)==1){//普通物理攻击
					return {
						animate:[{url:"image/game/tx/natt1.png",nextT:120},{url:"image/game/tx/natt2.png",nextT:120},{url:"image/game/tx/natt3.png",nextT:120}],
						rect:{x:-25,y:-25,w:144,h:144},
						kickEffect:{fromFrame:1},//是否有被击中效果，以及从第几帧开始出现被击中效果
						hpEffect:{fromFrame:1},//是否有飙血效果,以及从第几帧开始出现飙血效果
						extraEffect:{fromFrame:1,info:["hp"]}//是否有额外战斗信息显示(减掉的血或者闪避或者其他信息)
					}
				}
				else{//普通法术攻击
					return {
						animate:[{url:"image/game/tx/nfatt1.png",nextT:120},{url:"image/game/tx/nfatt2.png",nextT:120},{url:"image/game/tx/nfatt1.png",nextT:120}],
						rect:{x:-18,y:-35,w:144,h:144},
						kickEffect:{fromFrame:1},//是否有被击中效果，以及从第几帧开始出现被击中效果
						hpEffect:{fromFrame:1},//是否有飙血效果,以及从第几帧开始出现飙血效果
						extraEffect:{fromFrame:1,info:["hp"]}//是否有额外战斗信息显示(减掉的血或者闪避或者其他信息)
					}
				}
			break;
			case 1://加血技能效果
				return {
					animate:[{url:"image/game/tx/jiaxue1.png",nextT:120},{url:"image/game/tx/jiaxue2.png",nextT:120},{url:"image/game/tx/jiaxue3.png",nextT:120}],
					rect:{x:-20,y:-25,w:144,h:144},
					priority:5,//优先级
					extraEffect:{fromFrame:1,info:["hp"]}//是否有额外战斗信息显示(加的血或者闪避或者其他信息)
				}
			break;
			case 2://减血技能效果
				if(parseInt(npcType)==1){//单体物理技能攻击(物理减血技能效果)
					return {
						//TODO全屏特效
						attAnimate:[{url:"image/game/tx/attjn1.png",nextT:120},{url:"image/game/tx/attjn2.png",nextT:120},{url:"image/game/tx/attjn3.png",nextT:120}],
						animate:[{url:"image/game/tx/sword1.png",nextT:120},{url:"image/game/tx/sword2.png",nextT:120},{url:"image/game/tx/sword3.png",nextT:120},{url:"image/game/tx/sword4.png",nextT:120},{url:"image/game/tx/sword5.png",nextT:120},{url:"image/game/tx/sword6.png",nextT:120}],
						rect:{x:-25,y:-25,w:144,h:144},
						kickEffect:{fromFrame:1},//是否有被击中效果，以及从第几帧开始出现被击中效果
						hpEffect:{fromFrame:1},//是否有飙血效果,以及从第几帧开始出现飙血效果
						extraEffect:{fromFrame:1,info:["hp"]},//是否有额外战斗信息显示(减掉的血或者闪避或者其他信息)
						priority:1//优先级
					}
				}
				else{//单体法术技能攻击(法术减血技能效果)
					return {
						//attAnimate:[{url:"image/game/tx/attfs1.png",nextT:120},{url:"image/game/tx/attfs2.png",nextT:120},{url:"image/game/tx/attfs3.png",nextT:120},{url:"image/game/tx/attfs4.png",nextT:120}],
						animate:[{url:"image/game/tx/sfatt1.png",nextT:120},{url:"image/game/tx/sfatt2.png",nextT:120},{url:"image/game/tx/sfatt3.png",nextT:120},{url:"image/game/tx/sfatt4.png",nextT:120},{url:"image/game/tx/sfatt5.png",nextT:120}],
						rect:{x:-60,y:-200,w:272,h:351},
						kickEffect:{fromFrame:1},//是否有被击中效果，以及从第几帧开始出现被击中效果
						hpEffect:{fromFrame:1},//是否有飙血效果,以及从第几帧开始出现飙血效果
						extraEffect:{fromFrame:1,info:["hp"]},
						priority:1//优先级
					}
				}
			break;
			case 3://连击技能效果
				return {
					animate:[{url:"image/game/tx/matt1.png",nextT:120},{url:"image/game/tx/matt2.png",nextT:120},{url:"image/game/tx/matt3.png",nextT:120}],
					rect:{x:-35,y:-25,w:144,h:144},
					kickEffect:{fromFrame:1},
					//hpEffect:{fromFrame:1},
					extraEffect:{fromFrame:1,info:["hp"]},
					priority:1//优先级
				}
			break;
			case 4://换血技能效果
				return {
					animate:[{url:"image/game/tx/huanxue1.png",nextT:120},{url:"image/game/tx/huanxue2.png",nextT:120},{url:"image/game/tx/huanxue3.png",nextT:120}],
					rect:{x:-25,y:-25,w:144,h:144},
					kickEffect:{fromFrame:1},
					hpEffect:{fromFrame:1},
					extraEffect:{fromFrame:1,info:["hp"]},
					priority:4//优先级
				}
			break;
			case 5://减怒技能效果
				return {
					animate:[{url:"image/game/tx/jiannu1.png",nextT:120},{url:"image/game/tx/jiannu2.png",nextT:120},{url:"image/game/tx/jiannu3.png",nextT:120}],
					rect:{x:-25,y:-25,w:140,h:170},
					kickEffect:{fromFrame:1},
					priority:3//优先级
				}
			break;
			case 6://加怒技能效果
				return {
					animate:[{url:"image/game/tx/afury1.png",nextT:120},{url:"image/game/tx/afury2.png",nextT:120},{url:"image/game/tx/afury3.png",nextT:120}],
					rect:{x:-20,y:-10,w:135,h:131},
					priority:2//优先级
				}
			break;
			case 7://击晕技能效果
				return {
					animate:[{url:"image/game/tx/dizzy1.png",nextT:150},{url:"image/game/tx/dizzy2.png",nextT:150},{url:"image/game/tx/dizzy3.png",nextT:150}],
					infinite:0,//是否循环播放,默认是1只播放一次，0循环播放
					rect:{x:-12,y:-20,w:120,h:62},
					kickEffect:{fromFrame:1},
					priority:7,//优先级
					isbuff:1//是否是状态效果
				}
			break;
			case 8://反噬技能效果
				return {
					animate:[{url:"image/game/tx/fshi1.png",nextT:200},{url:"image/game/tx/fshi2.png",nextT:200}],
					infinite:0,//是否循环播放,默认是1只播放一次，0循环播放
					rect:{x:-35,y:-35,w:180,h:180},
					priority:6,//优先级
					isbuff:1//是否是状态效果
				}
			break;
		}
	}
}

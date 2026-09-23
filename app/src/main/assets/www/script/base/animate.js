//开场战斗剧情动画 by yangziyi
var animate = {
	loadWindow:function(){
		var jsonAnimateContent = {'1':"公元190年",'2':"十八路诸侯兴义师，讨伐董卓",'3':"虎牢关"};
		var background = $('<div class="animateStart" id="backgound"><div id="Content" style="color:#FFFFFF; font-size:50px; text-align:center;"></div></div>');
		background.css("height",height);
		//background.find("#Content").css("padding-top","30%");
		$("body").append(background);
		background.get(0).addEventListener('touchmove', function(e) {
			window.scrollTo(0,0);
		    e.stopPropagation();
		    e.preventDefault();
		});
		background.get(0).addEventListener(clickEventType,function(e){
			e.stopPropagation();
		    e.preventDefault();
		});
		animate.animateCommon(jsonAnimateContent,1);
	},
	animateCommon:function(jsonAnimateContent,index){//屏幕文字信息
		var max = 0; //用于保存对话最大值
		for(key in jsonAnimateContent){
			max++;
		}
		if(jsonAnimateContent[index]){ //屏幕文字存在
			$('#Content').text(jsonAnimateContent[index]);
			if(index<max){
				if(index==1){
					$('#Content').hide();
					setTimeout(function(){
						$('#Content').fadeIn();
						setTimeout(function(){$('#Content').fadeOut();setTimeout(function(){animate.animateCommon(jsonAnimateContent,++index);},1000);},2000);
					},2000);
				}else{
					$('#Content').hide();
					$('#Content').fadeIn();
					setTimeout(function(){$('#Content').fadeOut();setTimeout(function(){animate.animateCommon(jsonAnimateContent,++index);},1000);},2000);
				}
			}else{//前三条对话结束 处理第4条对话
				$('#Content').hide();
				$('#Content').css("color","red");
				$('#Content').css("font-size","100px");
				$('#Content').fadeIn();
				setTimeout(function(){$('#Content').fadeOut();setTimeout(function(){ResLoad.resourceLoader(battle.getPreLoadStaticRes(),function(){director.startDirect(1);});},1000);},2000);
			}
		}else{//暂时保留屏幕文字不存在分支
			
		}
	},
	battle:function(){
		//var jsonBattle = {"start":{"left":[[{"hp":"20000","fury":0,"img":"liubei.png","class":6,"img_small":"liubeih.png","type":1},{"hp":"20000","fury":0,"img":"guanyu.png","class":6,"img_small":"guanyuh.png","type":1},{"hp":"20000","fury":0,"img":"zhangfei.png","class":6,"img_small":"zhangfeih.png","type":1}],[0,0,0],[0,0,0]],"right":[[{"hp":"8000","fury":0,"img":"zabing9.png","class":6,"img_small":"zabing9.png","type":1},{"hp":"8000","fury":0,"img":"zabing9.png","class":6,"img_small":"zabing9.png","type":1},{"hp":"8000","fury":0,"img":"zabing9.png","class":6,"img_small":"zabing9.png","type":1}],[{"hp":"8000","fury":0,"img":"zabing10.png","class":6,"img_small":"zabing10.png","type":1},{"hp":"8000","fury":0,"img":"zabing10.png","class":6,"img_small":"zabing10.png","type":1},{"hp":"8000","fury":0,"img":"zabing10.png","class":6,"img_small":"zabing10.png","type":1}],[0,{"hp":"50000","fury":0,"img":"lvbu.png","class":6,"img_small":"lvbuh.png","type":1},0]],"lname":"123","limg":"image\/sys\/person.png","rname":"\u86ee\u65cf\u5f3a\u76d7\u4e8c","rimg":"zabing3.png"}};
		//var jsonBattle = {"start":{"left":[[{"hp":"20000","fury":0,"img":"liubei.png","class":6,"img_small":"liubeih.png","type":1},{"hp":"20000","fury":0,"img":"guanyu.png","class":6,"img_small":"guanyuh.png","type":1},{"hp":"20000","fury":0,"img":"zhangfei.png","class":6,"img_small":"zhangfeih.png","type":1}],[0,0,0],[0,0,0]],"right":[[{"hp":"8000","fury":0,"img":"zabing9.png","class":6,"img_small":"zabing9.png","type":1},{"hp":"8000","fury":0,"img":"zabing9.png","class":6,"img_small":"zabing9.png","type":1},{"hp":"8000","fury":0,"img":"zabing9.png","class":6,"img_small":"zabing9.png","type":1}],[{"hp":"8000","fury":0,"img":"zabing10.png","class":6,"img_small":"zabing10.png","type":1},{"hp":"8000","fury":0,"img":"zabing10.png","class":6,"img_small":"zabing10.png","type":1},{"hp":"8000","fury":0,"img":"zabing10.png","class":6,"img_small":"zabing10.png","type":1}],[0,{"hp":"50000","fury":0,"img":"lvbu.png","class":6,"img_small":"lvbuh.png","type":1},0]],"lname":"123","limg":"image\/sys\/person.png","rname":"\u86ee\u65cf\u5f3a\u76d7\u4e8c","rimg":"image\/sys\/zabing3.png"},"string":[{"att":{"pos":"left03","hp":"20000","nt":"1","skill":{"id":"199","name":"\u767e\u6218\u8fde\u51fb"},"fury":"0","effect":["3"]},"def":{"102":{"pos":"right102","fury":"41","effect":["6"],"lianji":{"1":{"hp":"-2000"},"2":{"hp":-2000}}}}}]};
		//var battleWindow=new mesWindow("battleWindow",$("#battle_tmpl").html(),0,0,1024,height);
		//battle.initialBattle(jsonBattle.start);
		//battle.startBattleAnimation(jsonBattle);
		//animate.addScreen();
		
	}
}
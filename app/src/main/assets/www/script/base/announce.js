var announce = {
    loadWindow:function () {
        var announceWindow = new mesWindow("announceWindow", $("#announce_tmpl").html());
        announce.getAnnounceList();
    },
    getAnnounceList:function() {
        $("#comm_announce").setSlider({row:1,col:1,dir:"top",onMove:announce.setSlidBlock});
        $.getJN("http://"+host+"/sgg/i/communicate/announce.php", {uid:userId},
            function(data){
                $("#comm_announce").addSliderItem(data.content);
            });
        
    },
    //设置滑块位置
    setSlidBlock:function(){
            var sliderConTop=parseInt($("#comm_announce").children().slice(0,1).css("margin-top"));
            sliderConTop=isNaN(sliderConTop)?0:sliderConTop;
            if(sliderConTop<=0){
                    var conTopLimit=parseInt($("#comm_announce").children().slice(0,1).height())-parseInt($("#comm_announce").height());
                    if(conTopLimit>=0){
                            var sliderBlockTopLimit=338;
                            var top=Math.abs(parseInt(sliderConTop/conTopLimit*sliderBlockTopLimit));
                            top=top<0?0:top;
                            top=top>sliderBlockTopLimit?sliderBlockTopLimit:top;
                            $("#ann_sBlock").css("margin-top",top+"px");
                    }
            }
    }
}

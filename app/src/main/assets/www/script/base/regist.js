var regist = {
    loadWindow:function() {
        var regWindow = new mesWindow("regWindow",$("#reg_tmpl").html());
        $("#reg_submit").bind(clickEventType, regist.changeUserInfo);
        $("#reg_close").bind(clickEventType, function(){
            $("#reg_submit").unbind(clickEventType);
            regWindow.closeWindow($(this));
        });
    },
    changeUserInfo:function () {
        var account = $("#reg_acc").val();
        var password = $("#reg_pwd").val();
        if (!account) {
            $("#reg_err").text("账号不能为空");
            return;
        }
        if (!password) {
            $("#reg_err").text("密码不能为空");
            return;
        }
        $.getJN(host+"/tool/changeUserInfo.php", {uid:userId, account:account, password:password},
            function(data){
                if (data.st == 1) {
                    Common.alert("账号密码修改成功");
                    $("#windowBackregWindow").remove();
                    $("#regWindow").remove();
                    $("#btn_reg").attr("style", "display:none");
                }
                else if (data.st == -1) {
                    if (data.info.err_reg) {
                        $("#reg_err").text("账号已绑定过");
                    }
                    else if (data.info.err_account_len) {
                        $("#reg_err").text("账号长度不足6位");
                    }
                    else if (data.info.err_passwd_len) {
                        $("#reg_err").text("密码长度不足6位");
                    }
                    else if (data.info.err_account_form) {
                        $("#reg_err").text("账号格式有误");
                    }
                    else if (data.info.err_passwd_form) {
                        $("#reg_err").text("密码格式有误");
                    }
                    else {
                        $("#reg_err").text("出错请重试");
                    }
                }
                else if (data.st == -2) {
                    $("#reg_err").text("账号已存在");
                }
                else if (data.st == -3) {
                    $("#reg_err").text("修改账号密码失败请重试");
                }
                else if (data.st == -4) {
                    $("#reg_err").text("用户账号不存在请重新登录");
                }
                else {
                    $("#reg_err").text("未知错误请重新登录");
                }
            });
    }
}

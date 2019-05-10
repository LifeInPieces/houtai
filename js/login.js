$(function(){
   $(".btn-block").click(function(){
      getOutData();
   })
//    按回车键实现页面登录
   $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            $(".btn-block").click();
        }
    });
    // 渲染数据
    function getOutData() {
        var username=$("#username").val()
        var password=$("#password").val()
        if(username=="" || password==""){
            $(".errortitle").html("用户名或密码不能为空")
            return;
        }
        $.ajax({
            url: "http://111.67.196.139:80/ssm_lj_web/user/login.do",
            type: "get",
            dataType: "json",
            data: {
              username:username,
              password:password
            },
            success: function (res) {
                var token=localStorage.setItem("token",res.token)
                if (res.success) {
                    $(".btn-block").html(res.message)
                    location.href="../index.html"
                } else {
                    $(".errortitle").html(res.message)
                    $("#password").val("")
                }
            }
        });
    }
  })
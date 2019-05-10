$(function(){
     // 动态渲染数据的根路径
     http()
     var page=1;
     var size=10;
     var username;
     var password;
     getjiankongData();
       
     $("#asideTable").delegate("li", "click", function () {
        $(this).addClass("active").siblings().removeClass("active")
        var url=window.location.href.lastIndexOf('index.html')
        url=localStorage.setItem("url",url)
    })
      
     // 渲染数据
     function getjiankongData() {
        username = localStorage.getItem("username")
        password = localStorage.getItem("password")
         $.ajax({
             url: http + "/userkehu/see.do",
             type: "get",
             dataType: "json",
             data: {
                 username:username,
                 password:password,
                 token:token
             },
             success: function (res) {
                 var html = template("asideTel", {
                    "res": res
                });
                $("#asideTable").html(html);
                $('#asideTable').children("li").eq(0).attr('class','active');
                $(".contant_main ul:eq("+0+")").addClass("item").siblings().removeClass("item");
                $("#asideTable").children("li").eq(0).click()
      }

         });
 
         //   初始化头部用户昵称
         usernme()
         
     }

     // 子级渲染数据
        $("#asideTable").delegate("li", "click", function () {
            modulesId = $(this).data("id");
            $.ajax({
                url: http + "/modules/find.do",
                type: "get",
                dataType: "json",
                data: {
                    token:token,
                    modulesId:modulesId
                },
                success: function (res) {
                    var html = template("contentTel", {
                        "res": res
                    });
                    $("#contentTable").html(html);
                }
            });
        })

     $(".backjiankong").click(function(){
        $.ajax({
            url: http + "/userkehu/up.do",
            type: "get",
            dataType: "json",
            data: {
                page: page,
                size: size,
                token:token
            }
        });
        window.localStorage.removeItem('url')
        var m = 50; // 几秒后跳转 自定义
        var timd =setInterval(function(){
        m--;
        if(m==0){
        clearInterval(timd);
        location.href="egis.html";
        }
        })
     })
})
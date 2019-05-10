$(function(){
    http()
    //   初始化头部用户昵称
    usernme()
    $("#asideTable").delegate("li", "click", function () {
        $(this).addClass("active").siblings().removeClass("active")
    })

    $("#asideTable").delegate("li", "click", function () {
        var url=window.location.href.lastIndexOf('index.html')
        url=localStorage.setItem("url",url)
    })
    getindexData();
     // 初始化渲染数据
     function getindexData() {
         $.ajax({
             url: http + "/modules/findByUserId.do",
             type: "get",
             dataType: "json",
             data: {
                 token:token
             },
             success: function (res) {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                if (res.success == false) {
                    toastr.error(res.message);
                }
                 var html = template("asideTel", {
                     "res": res
                 });
                 $("#asideTable").html(html);
                 $('#asideTable').children("li").eq(0).attr('class','active');
                 $(".contant_main ul:eq("+0+")").addClass("item").siblings().removeClass("item");
                 $("#asideTable").children("li").eq(0).click()
             }
         });
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

        // 提醒模块
        remind()
        function remind(){
            $.ajax({
                url: http + "/remind/findByUserId.do",
                type: "get",
                dataType: "json",
                data: {
                    token:token
                },
                success: function (res) {
                    var html = template("readdataTel", {
                        "res": res
                    });
                    $(".readdata").html(html);
                }
            });
        }
   
})
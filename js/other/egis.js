$(function(){
   // 动态渲染数据的根路径
   http()
   var size = 10;
   var page = 1;
   var pageCount = 0;
   var userkehuId = 0
   getuserkehuData();
   // 渲染数据
   function getuserkehuData() {
       $.ajax({
           url: http + "/userkehu/findAll.do",
           type: "get",
           dataType: "json",
           data: {
               page: page,
               size: size,
               token:token
           },
           success: function (res) {
               // 分页页数
               pageCount = Math.ceil(res.total / size);
               var html = template("egisTel", {
                   "rows": res.rows
               });
               $("#egisTable").html(html);
               makePageButton(page, pageCount)

           }
       });
       //   初始化头部用户昵称
       usernme()
   }
   // 分页
   makePageButton(page, pageCount)
   // 点击分页按钮
   $(".pagination").on("click", ".item", function () {
       page = parseInt($(this).attr("data-page"));
       getuserkehuData();
   });

   // 修改数据
 $("#egisTable").delegate(".emit", "click", function () {
    // 回显表单数据
    userkehuId = $(this).data("id");
    $.ajax({
        url: http + "/userkehu/findById.do",
        type: "post",
        dataType: "json",
        data: {
            userkehuId: userkehuId,
            token:token
        },
        success: function (res) {
            $("#status").val(res.status);
            statusdata=res.status
        }
    })
})

// 获取修改数据
$(".preserve_emit").click(function () {
    var status=$("#status").val()
    if(statusdata==status){
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("您还未修改状态");
        return false;
    }
    $.ajax({
        url: http + "/userkehu/update.do",
        type: "post",
        dataType: "json",
        data: {
            status:status,
            uid:userkehuId,
            token:token
        },
        success: function (res) {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            if (res.success == true) {
                toastr.success(res.message);
            } else {
                toastr.error(res.message);
            }
            getuserkehuData()
        }
    });
})

// 删除数据
$("#egisTable").delegate(".egjs_del", "click", function () {
    var userId = $(this).data("id");
    swal({
        title: "操作提示", //弹出框的title
        text: "确定删除吗？", //弹出框里面的提示文本
        type: "warning", //弹出框类型
        showCancelButton: true, //是否显示取消按钮
        confirmButtonColor: "#DD6B55", //确定按钮颜色
        cancelButtonText: "取消", //取消按钮文本
        confirmButtonText: "是的，确定删除！", //确定按钮上面的文档
        closeOnConfirm: true
    }, function () {
        $.ajax({
            url: http + "/userkehu/delete.do",
            type: "post",
            dataType: "json",
            data: {
                   "userId": userId,
                    token:token
            },
            success: function (res) {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                if (res.success == true) {
                    toastr.success(res.message);
                } else {
                    toastr.error(res.message);
                }
                getuserkehuData()
            }
        })
    });
});
// 关键字查询
$(".btn_found").click(function () {
    var companyname = $("#companyName").val()
    // 数据为空时不能查询
    if (companyname == "") {
        return false;
    }
    $.ajax({
        type: "get",
        url: http + "/userkehu/find.do",
        dataType: "json",
        data: {
            companyname: companyname,
            page: page,
            size: size,
            token:token
        },
        success: function (res) {
            var html = template("egisTel", {
                "rows": res.rows
            });
            $("#egisTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

$("#egisTable").delegate(".jiankonng", "click", function () {
    var  userkehuId = $(this).data("id");
    $.ajax({
        url: http + "/userkehu/findById.do",
        type: "post",
        async: false,
        dataType: "json",
        data: {
            userkehuId: userkehuId,
            token:token
        },
        success: function (res) {
            username=res.username;
            password=res.password
        }
    })
    localStorage.setItem("username", username)
    localStorage.setItem("password", password);
    location.href = "jiankong.html"
})

 //   图片放大
 $("#egisTable").delegate(".idphoto>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})
$("#egisTable").delegate(".bigsplice>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})

$("#egisTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
    $(".Imgsmalls").fadeOut(1000)
  })

})
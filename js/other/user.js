$(function(){
   // 动态渲染数据的根路径
   http()
   var size = 10;
   var page = 1;
   var pageCount = 0;
   var userId = 0
   getuserData();
   // 渲染数据
   function getuserData() {
    // 动态获取数据
    var status={
        0:"审核中",
        1:"可用",
        2:"审核未通过",
        3:"不可用",
      }
     
       $.ajax({
           url: http + "/user/findAll.do",
           type: "get",
           dataType: "json",
           data: {
               page: page,
               size: size,
               token:token
           },
           success: function (res) {
             $.each(res.rows,function(i){
                 statues=status[res.rows[i].statues]
                 res.rows[i].statues=statues
             })
               // 分页页数
               pageCount = Math.ceil(res.total / size);
               var html = template("userTel", {
                   "rows": res.rows
               });
               $("#userTable").html(html);
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
       getuserData();
   });

   function getData() {
    // 获取表单数据
     username = $("#username").val();
     password = $("#password").val();
     introduce = $("#introduce").val();
     statues = $("#statues").val();
     remarks = $("#remarks").val();
     data = {
        username: username,
        password: password,
        introduce: introduce,
        statues: statues,
        remarks: remarks,
        token:token
    }
  }

// 添加数据
$(".preserve_add").click(function () {
    getData()
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
        if (  username == "" || password == "" || introduce == "" || statues == "" ) {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            toastr.error("有星号的表单不能有空项");
            return true;
        }
    }

    $.ajax({
        url: http + "/user/insert.do",
        type: "post",
        dataType: "json",
        data: data,
        success: function (res) {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            if (res.success == true) {
                toastr.success(res.message);
            } else {
                toastr.error(res.message);
            }
            getuserData()
        }
    })
})

 // 修改数据
 $("#userTable").delegate(".emit", "click", function () {
    // 回显表单数据
    userId = $(this).data("id");
    $.ajax({
        url: http + "/user/findById.do",
        type: "post",
        dataType: "json",
        data: {
            userId: userId,
            token:token
        },
        success: function (res) {
            $("#username").val(res.username);
            $("#password").val(res.password);
            $("#introduce").val(res.introduce);
            $("#statues").val(res.statues);
            $("#remarks").val(res.remarks);
        }
    })
})

 // 获取修改数据
 $(".preserve_emit").click(function () {
    getData()
    data.id=userId
    $.ajax({
        url: http + "/user/update.do",
        type: "post",
        dataType: "json",
        data: data,
        success: function (res) {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            if (res.success == true) {
                toastr.success(res.message);
            } else {
                toastr.error(res.message);
            }
            getuserData()
        }
    });
})


 // 删除数据
 $("#userTable").delegate(".user_del", "click", function () {
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
            url: http + "/user/delete.do",
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
                getuserData()
            }
        })
    });
});

// 关键字查询
$(".btn_found").click(function () {
    var username = $("#userName").val()
    // 数据为空时不能查询
    if (username == "") {
        return false;
    }
    $.ajax({
        type: "get",
        url: http + "/user/find.do",
        dataType: "json",
        data: {
            username: username,
            page: page,
            size: size,
            token:token
        },
        success: function (res) {
            var html = template("userTel", {
                "rows": res.rows
            });
            $("#userTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

 // 点击进入入库明细
 $("#userTable").delegate(".userchild", "click", function () {
    var userId = $(this).data("id")
    localStorage.setItem("userId", userId)
    location.href = "userchild.html"
})

})
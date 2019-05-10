$(function(){
// 动态渲染数据的根路径
http()
var size = 10;
var page = 1;
var pageCount = 0;
var remindId=0;
getremindData();
// 渲染数据
function getremindData() {
    $.ajax({
        url: http + "/remind/findAll.do",
        type: "get",
        dataType: "json",
        data: {
            token:token,
            page: page,
            size: size
        },
        success: function (res) {
            // 转换时间
            $.each(res.rows, function (i) {
                var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD HH:mm:ss');
                res.rows[i].date = dataTime;
            })
            // 分页页数
            pageCount = Math.ceil(res.total / size);
            var html = template("remindTel", {
                "rows": res.rows
            });
            $("#remindTable").html(html);
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
    getremindData();
}); 

  // 修改数据
  $("#remindTable").delegate( ".emit", "click", function () {
    // 回显表单数据
    remindId = $(this).data("id");
    $.ajax({
        url: http + "/remind/findById.do",
        type: "post",
        dataType: "json",
        data: {
            remindId: remindId,
            token: token
        },
        success: function (res) {
            res.date = moment(res.date).format('YYYY-MM-DD HH:mm:ss');
            statues = $("#statues").val(res.statues);
            statues=res.statues;
            date = res.date;
            matter = res.matter;
        }
    })
})

 // 获取修改数据
 $(".preserve_emit").click(function () {
     var statues=$("#statues").val()
    $.ajax({
      url: http + "/remind/update.do",
      type: "post",
      dataType: "json",
      data: {
        matter:matter,
        date:date,
        statues:statues,
        id:remindId,
        token:token
      },
      success: function (res) {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        if(res.success==true){
            toastr.success(res.message);
        }else{
            toastr.error(res.message);
        }
       location.reload()
      }
    });

  })

// 删除数据
$("#remindTable").delegate(".remind_del", "click", function () {
    var remindId = $(this).data("id");
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
        url: http + "/remind/delete.do",
        type: "post",
        dataType: "json",
        data: {
          "remindId": remindId,
          "token":token
        },
        success: function (res) {
          toastr.options.positionClass = 'toast-center-center';
          toastr.options.timeOut = '3000';
          if(res.success==true){
              toastr.success(res.message);
          }else{
              toastr.error(res.message);
          }
          location.reload()
        }
      })
    });
  });

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
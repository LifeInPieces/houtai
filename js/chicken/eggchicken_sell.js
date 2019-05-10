$(function(){
    // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var chickenoutId = 0;
  var type = "蛋鸡";
  var pic;
  getchickSellData();
  // 渲染数据
  function getchickSellData() {
    $.ajax({
      url: http + "/chickenout/findAll.do",
      type: "get",
      dataType: "json",
      data: {
        page: page,
        size: size,
        type:type,
        token:token
      },
      success: function (res) {
          $.each(res.rows, function (i) {
            var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
            res.rows[i].date = dataTime;
            res.rows[i].receivablemoney= moneyFormat(res.rows[i].receivablemoney)
            res.rows[i].receivedmoney= moneyFormat(res.rows[i].receivedmoney)
            res.rows[i].needmoney= moneyFormat(res.rows[i].needmoney)
        })
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("chickenSellTel", {
          "rows": res.rows
        });
        $("#chickenSellTable").html(html);
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
    getchickSellData();
  });

  $(".header_right").click(function () {
    receivablemoney = $("#receivablemoney").val("0.00");
    needmoney = $("#needmoney").val("0.00");
  })

  
  $("#chickenSellTable").delegate(".draw", "click", function () {
    $(".mengban_over").show()
    $(".add_draw").show()
    $(".draw_add").css("display", "inline-block");
    $(".preserve_emit").css("display", "none");
    chickenoutId=$(this).data("id") 
  })

  // 上传图片
  $(".draw_add").click(function(){
    var formData = new FormData();
    formData.append("file",$("#input-1").get(0).files[0]);
    formData.append("token",token);
    formData.append("chickenoutId",chickenoutId);
    $.ajax({
      url: http + "/chickenout/uploadimg.do",
      type: "post",
      dataType: "json",
      cache: false,
      processData: false,
      contentType:false,
      data: formData,
      success: function (res) {
          toastr.options.positionClass = 'toast-center-center';
          toastr.options.timeOut = '3000';
          if (res.success == true) {
              toastr.success(res.message);
              var m = 200; // 几秒后跳转 自定义
              var timd =setInterval(function(){
              m--;
              if(m==0){
              clearInterval(timd);
              location.reload()
               }
             })
          } else {
              toastr.error(res.message);
          }
      }
  })
  })

   // 添加数据
   $(".preserve_add").click(function () {
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
      if ($("#outnumber").val() == "" || $("#date").val() == "" || $("#operator").val() == "" 
      || $("#customername").val() == "" || $("#phone").val() == "" || $("#receivablemoney").val() == ""
      || $("#receivedmoney").val() == "" || $("#needmoney").val() == "") {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("有星号的表单不能有空项");
        return true;
      }
    }
    getData()
    $.ajax({
      url: http + "/chickenout/insert.do",
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
        getchickSellData()
      }
    })
  })

   // 修改数据
 $("#chickenSellTable").delegate(".emit", "click", function () {
    // 回显表单数据
    chickenoutId = $(this).data("id");
    $.ajax({
        url: http + "/chickenout/findById.do",
        type: "post",
        dataType: "json",
        data: {
            chickenoutId: chickenoutId,
            token:token
        },
        success: function (res) {
            // 格式化时间
            res.date = moment(res.date).format('YYYY-MM-DD');
            $("#outnumber").val(res.outnumber);
            $("#date").val(res.date);
            $("#num").val(res.num);
            $("#operator").val(res.operator);
            $("#customername").val(res.customername);
            $("#phone").val(res.phone);
            $("#receivablemoney").val(res.receivablemoney)
            $("#receivedmoney").val(res.receivedmoney)
            $("#needmoney").val(res.needmoney);
            $("#remark").val(res.remark);
            pic=res.pic;
        }
    })
})

function getData() {
    // 获取表单数据
    outnumber = $("#outnumber").val();
    date = $("#date").val();
    operator = $("#operator").val();
    customername = $("#customername").val();
    phone = $("#phone").val();
    receivablemoney = $("#receivablemoney").val();
    receivedmoney = $("#receivedmoney").val();
    needmoney = $("#needmoney").val();
    remark = $("#remark").val();
    data= {
        outnumber:outnumber,
        date:date,
        type:type,
        operator:operator,
        customername:customername,
        phone:phone,
        receivablemoney:receivablemoney,
        receivedmoney:receivedmoney,
        needmoney:needmoney,
        remark:remark,
        token:token
    }
  }

// 获取修改数据
$(".preserve_emit").click(function () {
    getData()
   data.id=chickenoutId;
   data.pic=pic;
   $.ajax({
       url: http + "/chickenout/update.do",
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
           getchickSellData()
       }
   });
})

// 删除数据
$("#chickenSellTable").delegate(".chickensell_del", "click", function () {
    var chickenoutId = $(this).data("id");
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
            url: http + "/chickenout/delete.do",
            type: "post",
            dataType: "json",
            data: {
                "chickenoutId": chickenoutId,
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
                getchickSellData()
            }
        })
    });
});

// 关键字查询
$(".buttonDate").click(function () {
    var beforeDate = $("#beforeDate").val()
    var afterDate = $("#afterDate").val()
    if(beforeDate == "" && afterDate == ""){
        return false;
    }
    if (beforeDate > afterDate) {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("时间输入不正确,请从新输入");
        $("#beforeDate").val("")
        $("#afterDate").val("")
        return;
    }
    $.ajax({
        type: "get",
        url: http + "/chickenout/findByDate.do",
        dataType: "json",
        data: {
            beforeDate: beforeDate,
            afterDate: afterDate,
            type:type,
            page: page,
            size: size,
            token:token
        },
        success: function (res) {
            // 转换时间
            $.each(res.rows, function (i) {
                var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                res.rows[i].date = dataTime;
                res.rows[i].receivablemoney= moneyFormat(res.rows[i].receivablemoney)
                res.rows[i].receivedmoney= moneyFormat(res.rows[i].receivedmoney)
                res.rows[i].needmoney= moneyFormat(res.rows[i].needmoney)
            })
            var html = template("chickenSellTel", {
                "rows": res.rows
              });
              $("#chickenSellTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

$(".btn_found").click(function () {
    var operator = $("#ren").val()
    // 数据为空时不能查询
    if (operator == "") {
      return false;
    }
    $.ajax({
      type: "get",
      url: http + "/chickenout/find.do",
      dataType: "json",
      data: {
        operator:operator,
        type:type,
        page: page,
        size: size,
        token:token
      },
      success: function (res) {
        $.each(res.rows, function (i) {
            var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
            res.rows[i].date = dataTime;
            res.rows[i].receivablemoney= moneyFormat(res.rows[i].receivablemoney)
            res.rows[i].receivedmoney= moneyFormat(res.rows[i].receivedmoney)
            res.rows[i].needmoney= moneyFormat(res.rows[i].needmoney)
        })
        var html = template("chickenSellTel", {
            "rows": res.rows
          });
          $("#chickenSellTable").html(html);
        if (res.total < 1) {
          $(".data_num").css("display", "table-row")
        }
      }
    })
  })

    // 点击进入入库明细
    $("#chickenSellTable").delegate(".detail", "click", function () {
        var chickenoutId = $(this).data("id")
        localStorage.setItem("chickenoutId", chickenoutId);
        localStorage.setItem("type",type)
        location.href = "chicken_detail.html"
    })

    //   图片放大
$("#chickenSellTable").delegate(".images>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})

$("#chickenSellTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
})

})
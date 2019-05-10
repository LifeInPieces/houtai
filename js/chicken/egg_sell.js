$(function(){
  // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var eggoutId = 0;
  var pic;
  function each(res){
    $.each(res.rows, function (i) {
      var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
      res.rows[i].date = dataTime;
      res.rows[i].pricekg = moneyFormat(res.rows[i].pricekg)
      res.rows[i].pricea = moneyFormat(res.rows[i].pricea)
      res.rows[i].moneykg = moneyFormat(res.rows[i].moneykg)
      res.rows[i].moneynum = moneyFormat(res.rows[i].moneynum)
    })
  }
  geteggsellData();
  // 渲染数据
  function geteggsellData() {
    $.ajax({
      url: http + "/eggout/findAll.do",
      type: "get",
      dataType: "json",
      data: {
        page: page,
        size: size,
        token:token
      },
      success: function (res) {
       each(res)
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("eggSellTel", {
          "rows": res.rows
        });
        $("#eggSellTable").html(html);
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
    geteggsellData();
  });
  $(".header_right").click(function () {
    moneynum = $("#moneynum").val("0.00")
    moneykg = $("#moneykg").val("0.00")
  })

  $("#eggSellTable").delegate(".draw", "click", function () {
    $(".mengban_over").show()
    $(".add_draw").show()
    eggoutId=$(this).data("id") 
  })

  // 上传图片
  $(".draw_add").click(function(){
    var formData = new FormData();
    formData.append("file",$("#input-1").get(0).files[0]);
    formData.append("token",token);
    formData.append("eggoutId",eggoutId);
    $.ajax({
      url: http + "/eggout/uploadimg.do",
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
      if ($("#outnumber").val() == "" || $("#date").val() == "" || $("#customername").val() == "" 
      || $("#pricekg").val() == "" || $("#weightkg").val() == "" || $("#pricea").val() == ""
      || $("#num").val() == "" || $("#operator").val() == "") {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("有星号的表单不能有空项");
        return true;
      }
    }
    getData()
    $.ajax({
      url: http + "/eggout/insert.do",
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
        geteggsellData()
      }
    })
  })

  function getData() {
    // 获取表单数据
    outnumber = $("#outnumber").val();
    date = $("#date").val();
    customername = $("#customername").val();
    pricekg = $("#pricekg").val();
    weightkg = $("#weightkg").val();
    pricea = $("#pricea").val();
    num = $("#num").val();
    operator = $("#operator").val();
    remark = $("#remark").val();
    moneykg=$("#moneykg").val();
    moneynum=$("#moneynum").val()
    data={
        outnumber: outnumber,
        date: date,
        customername: customername,
        pricekg: pricekg,
        weightkg: weightkg,
        pricea: pricea,
        num: num,
        operator:operator,
        remark: remark,
        moneykg: moneykg,
        moneynum: moneynum,
        token:token
    }
  }

   // 修改数据
   $("#eggSellTable").delegate(".emit", "click", function () {
    // 回显表单数据
    eggoutId = $(this).data("id");
    $.ajax({
        url: http + "/eggout/findById.do",
        type: "post",
        dataType: "json",
        data: {
            eggoutId: eggoutId,
            token:token
        },
        success: function (res) {
            // 格式化时间
            res.date = moment(res.date).format('YYYY-MM-DD');
            $("#outnumber").val(res.outnumber);
            $("#date").val(res.date);
            $("#customername").val(res.customername);
            $("#pricekg").val(res.pricekg);
            $("#weightkg").val(res.weightkg);
            $("#pricea").val(res.pricea);
            $("#num").val(res.num);
            $("#operator").val(res.operator)
            $("#remark").val(res.remark)
            pic=res.pic;
        }
    })
})
// 获取修改数据
$(".preserve_emit").click(function () {
    getData() 
    data.id=eggoutId;
    data.pic=pic;
    $.ajax({
        url: http + "/eggout/update.do",
        type: "post",
        dataType: "json",
        data:data,
        success: function (res) {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            if (res.success == true) {
                toastr.success(res.message);
            } else {
                toastr.error(res.message);
            }
            geteggsellData()
        }
    });
})

 // 删除数据
 $("#eggSellTable").delegate(".eggsell_del", "click", function () {
  var eggoutId = $(this).data("id");
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
          url: http + "/eggout/delete.do",
          type: "post",
          dataType: "json",
          data: {
              "eggoutId": eggoutId,
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
              geteggsellData()
          }
      })
  });
});
  // 关键字查询
  $(".buttonDate").click(function () {
    var beforeDate = $("#beforeDate").val()
    var afterDate = $("#afterDate").val()
    if (beforeDate == "" && afterDate == "") {
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
        url: http + "/eggout/findByDate.do",
        dataType: "json",
        data: {
            beforeDate: beforeDate,
            afterDate: afterDate,
            page: page,
            size: size,
            token:token
        },
        success: function (res) {
            // 转换时间
            each(res)
            var html = template("eggSellTel", {
              "rows": res.rows
            });
            $("#eggSellTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

//   图片放大
$("#eggSellTable").delegate(".images>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})

$("#eggSellTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
})

})
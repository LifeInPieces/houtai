$(function(){
// 动态渲染数据的根路径
http()
var size = 10;
var page = 1;
var pageCount = 0;
var chickenmanureoutId = 0;
var pic;
function each(res){
    $.each(res.rows, function (i) {
        var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
        res.rows[i].date = dataTime;
        res.rows[i].needmoney = moneyFormat(res.rows[i].needmoney)
        res.rows[i].receivedmoney = moneyFormat(res.rows[i].receivedmoney)
        res.rows[i].receivablemoney = moneyFormat(res.rows[i].receivablemoney)
    })
}
getmanureData();
// 渲染数据
function getmanureData() {
    $.ajax({
        url: http + "/chickenmanureout/findAll.do",
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
            var html = template("manureTel", {
                "rows": res.rows
            });
            $("#manureTable").html(html);
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
    getmanureData();
});


$("#manureTable").delegate(".draw", "click", function () {
    $(".mengban_over").show()
    $(".add_draw").show()
    $(".draw_add").css("display", "inline-block");
    $(".preserve_emit").css("display", "none");
    chickenmanureoutId=$(this).data("id") 
  })

  // 上传图片
  $(".draw_add").click(function(){
    var formData = new FormData();
    formData.append("file",$("#input-1").get(0).files[0]);
    formData.append("token",token);
    formData.append("chickenmanureoutId",chickenmanureoutId);
    $.ajax({
      url: http + "/chickenmanureout/uploadimg.do",
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

  $(".header_right").click(function () {
    receivablemoney = $("#receivablemoney").val("0.00");
    needmoney = $("#needmoney").val("0.00")
  })

  // 添加数据
  $(".preserve_add").click(function () {
      getData()
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
        if ( outnumber == "" || date == "" || customername == "" || phone == "" ||
             operator == "" || receivablemoney == "" || receivedmoney == "" || needmoney == "") {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            toastr.error("有星号的表单不能有空项");
            return true;
        }
    }

    $.ajax({
        url: http + "/chickenmanureout/insert.do",
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
            getmanureData()
        }
    })
})

function getData() {
  // 获取表单数据
  outnumber = $("#outnumber").val();
  date = $("#date").val();
  customername = $("#customername").val();
  phone = $("#phone").val();
  operator = $("#operator").val();
  receivablemoney = $("#receivablemoney").val();
  receivedmoney = $("#receivedmoney").val();
  needmoney = $("#needmoney").val();
  remark = $("#remark").val();
  data={
      outnumber: outnumber,
      date: date,
      customername: customername,
      phone: phone,
      operator: operator,
      receivablemoney: receivablemoney,
      receivedmoney: receivedmoney,
      needmoney: needmoney,
      remark: remark,
      token:token
  }
}

// 修改数据
$("#manureTable").delegate(".emit", "click", function () {
    // 回显表单数据
    chickenmanureoutId = $(this).data("id");
    $.ajax({
        url: http + "/chickenmanureout/findById.do",
        type: "post",
        dataType: "json",
        data: {
          chickenmanureoutId: chickenmanureoutId,
          token:token
        },
        success: function (res) {
             // 格式化时间
            res.date = moment(res.date).format('YYYY-MM-DD');
            outnumber = $("#outnumber").val(res.outnumber);
            date = $("#date").val(res.date);
            customername = $("#customername").val(res.customername);
            phone = $("#phone").val(res.phone);
            operator = $("#operator").val(res.operator);
            receivablemoney = $("#receivablemoney").val(res.receivablemoney);
            receivedmoney = $("#receivedmoney").val(res.receivedmoney);
            needmoney = $("#needmoney").val(res.needmoney);
            remark = $("#remark").val(res.remark);
            pic=res.pic;
        }
    })
})

// 获取修改数据
$(".preserve_emit").click(function () {
    getData()
    data.id=chickenmanureoutId;
    data.pic=pic;
    $.ajax({
      url: http + "/chickenmanureout/update.do",
      type: "post",
      dataType: "json",
      data: data,
      success: function (res) {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        if(res.success==true){
            toastr.success(res.message);
        }else{
            toastr.error(res.message);
        }
        getmanureData()
      }
    });
  })

  // 删除数据
  $("#manureTable").delegate(".manure_del", "click", function () {
    var chickenmanureoutId = $(this).data("id");
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
        url: http + "/chickenmanureout/delete.do",
        type: "post",
        dataType: "json",
        data: {
          "chickenmanureoutId": chickenmanureoutId,
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
          getmanureData()
        }
      })
    });
  });

  // 点击进入入库明细
$("#manureTable").delegate(".details", "click", function () {
    var chickenmanureoutId = $(this).data("id")
    localStorage.setItem("chickenmanureoutId", chickenmanureoutId);
    location.href = "selldetail.html"
})

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
        url: http + "/chickenmanureout/findByDate.do",
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
            var html = template("manureTel", {
                "rows": res.rows
            });
            $("#manureTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

  //   图片放大
$("#manureTable").delegate(".images>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})

$("#manureTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
})

})
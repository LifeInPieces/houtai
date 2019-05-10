$(function(){
// 动态渲染数据的根路径
http()
var size = 10;
var page = 1;
var pageCount = 0;
var insuranceId = 0;
var pic;
getinsuranceData();
// 渲染数据
function getinsuranceData() {
    $.ajax({
        url: http + "/insurance/findAll.do",
        type: "get",
        dataType: "json",
        data: {
            page: page,
            size: size,
            token:token
        },
        success: function (res) {
            $.each(res.rows, function (i) {
                var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                res.rows[i].date = dataTime;
                res.rows[i].money = moneyFormat(res.rows[i].money)
            })
            // 分页页数
            pageCount = Math.ceil(res.total / size);
            var html = template("insuranceTel", {
                "rows": res.rows
            });
            $("#insuranceTable").html(html);
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
    getinsuranceData();
});

 // 添加数据
 $(".preserve_add").click(function () {
      getData()
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
        if ( insurancetype == "" || number == "" || date == "" || object == "" ||
             operator == "" || money == "") {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            toastr.error("有星号的表单不能有空项");
            return true;
        }
    }

    $.ajax({
        url: http + "/insurance/insert.do",
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
            getinsuranceData()
        }
    })
})

function getData() {
    // 获取表单数据
    insurancetype = $("#insurancetype").val();
    number = $("#number").val();
    date = $("#date").val();
    object = $("#object").val();
    operator = $("#operator").val();
    money = $("#money").val();
    rember = $("#rember").val();
    data={
        insurancetype: insurancetype,
        number: number,
        date: date,
        object: object,
        operator: operator,
        money: money,
        rember: rember,
        token:token
    }
  }


  $("#insuranceTable").delegate(".draw", "click", function () {
    $(".mengban_over").show()
    $(".add_draw").show()
    $(".draw_add").css("display", "inline-block");
    $(".preserve_emit").css("display", "none");
    insuranceId=$(this).data("id") 
  })

  // 上传图片
  $(".draw_add").click(function(){
    var formData = new FormData();
    formData.append("file",$("#input-1").get(0).files[0]);
    formData.append("token",token);
    formData.append("insuranceId",insuranceId);
    $.ajax({
      url: http + "/insurance/uploadimg.do",
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

// 修改数据
$("#insuranceTable").delegate(".emit", "click", function () {
    // 回显表单数据
    insuranceId = $(this).data("id");
    $.ajax({
        url: http + "/insurance/findById.do",
        type: "post",
        dataType: "json",
        data: {
            insuranceId: insuranceId,
            token:token
        },
        success: function (res) {
             // 格式化时间
            res.date = moment(res.date).format('YYYY-MM-DD');
            insurancetype = $("#insurancetype").val(res.insurancetype);
            number = $("#number").val(res.number);
            date = $("#date").val(res.date);
            object = $("#object").val(res.object);
            operator = $("#operator").val(res.operator);
            money = $("#money").val(res.money);
            rember = $("#rember").val(res.rember);
            pic=res.pic;
        }
    })
})

 // 获取修改数据
 $(".preserve_emit").click(function () {
    getData()
    data.id=insuranceId;
    data.pic=pic;
    $.ajax({
      url: http + "/insurance/update.do",
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
        getinsuranceData()
      }
    });
  })

   // 删除数据
   $("#insuranceTable").delegate(".insurance_del", "click", function () {
    var insuranceId = $(this).data("id");
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
        url: http + "/insurance/delete.do",
        type: "post",
        dataType: "json",
        data: {
          "insuranceId": insuranceId,
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
          getinsuranceData()
        }
      })
    });
  });

  $(".btn_found").click(function () {
    var number = $("#num").val()
    // 数据为空时不能查询
    if (number == "") {
        return false;
    }

    $.ajax({
        type: "get",
        url: http + "/insurance/find.do",
        dataType: "json",
        data: {
            number: number,
            page: page,
            size: size,
            token:token
        },
        success: function (res) {
            // 转换时间
            $.each(res.rows, function (i) {
                var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                res.rows[i].date = dataTime;
                res.rows[i].money = moneyFormat(res.rows[i].money)
            })
            var html = template("insuranceTel", {
                "rows": res.rows
            });
            $("#insuranceTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

//   图片放大
$("#insuranceTable").delegate(".images>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
})
})


$("#insuranceTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
  })

})
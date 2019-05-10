$(function(){
// 动态渲染数据的根路径
http()
var size = 10;
var page = 1;
var pageCount = 0;
var fodderformulaId = 0;
var pic;
function each(res){
    $.each(res.rows, function (i) {
        var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
        res.rows[i].date = dataTime;
        res.rows[i].money= moneyFormat(res.rows[i].money)
        res.rows[i].price= moneyFormat(res.rows[i].price)
    })
}
getenterData();
// 渲染数据
function getenterData() {
    $.ajax({
        url: http + "/fodderformula/findAll.do",
        type: "get",
        dataType: "json",
        data: {
            page: page,
            size: size,
            token:token
        },
        success: function (res) {
            // 分页页数
            each(res)
            pageCount = Math.ceil(res.total / size);
            var html = template("enterTel", {
                "rows": res.rows
            });
            $("#enterTable").html(html);
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
    getenterData();
});

$("#enterTable").delegate(".draw", "click", function () {
    $(".mengban_over").show()
    $(".add_draw").show()
    fodderformulaId=$(this).data("id") 
  })

  // 上传图片
  $(".draw_add").click(function(){
    var formData = new FormData();
    formData.append("file",$("#input-1").get(0).files[0]);
    formData.append("token",token);
    formData.append("fodderformulaId",fodderformulaId);
    $.ajax({
      url: http + "/fodderformula/uploadimg.do",
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

 // 点击新增按钮给计量单位赋值
 $(".header_right").click(function () {
    money = $("#money").val("0.00")
    price = $("#price").val("0.00")
    type=$("#type").val("成品料")
})

function getData() {
    // 获取表单数据
     formulanumber = $("#formulanumber").val();
     formulaname = $("#formulaname").val();
     type = $("#type").val();
     date = $("#date").val();
     weight = $("#weight").val();
     unit = $("#unit").val();
     money = $("#money").val();
     price = $("#price").val()
     remarks = $("#remarks").val()
     data = {
        formulanumber: formulanumber,
        formulaname: formulaname,
        type: type,
        date: date,
        weight: weight,
        unit:unit,
        money: money,
        price: price,
        remarks: remarks,
        token:token
    }
  }

// 添加
$(".preserve_add").click(function () {
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
        if ($("#formulanumber").val() == "" || $("#formulaname").val() == "" || $("#date").val() == ""
        || $("#weight").val() == "" || $("#money").val() == "" || $("#price").val() == "") {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            toastr.error("有星号的表单不能有空项");
            return true;
        }
    }
    getData()
    $.ajax({
        url: http + "/fodderformula/insert.do",
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
            getenterData()
        }
    })
})

 // 修改数据
 $("#enterTable").delegate(".emit", "click", function () {
    // 回显表单数据
    fodderformulaId = $(this).data("id");
    $.ajax({
        url: http + "/fodderformula/findById.do",
        type: "post",
        dataType: "json",
        data: {
            fodderformulaId: fodderformulaId,
            token:token
        },
        success: function (res) {
            // 格式化时间
            res.date = moment(res.date).format('YYYY-MM-DD');
            $("#formulanumber").val(res.formulanumber);
            $("#formulaname").val(res.formulaname);
            $("#type").val(res.type);
            $("#date").val(res.date);
            $("#weight").val(res.weight);
            $("#money").val(res.money);
            $("#price").val(res.price)
            $("#remarks").val(res.remarks);
            $("#unit").val(res.unit);
            pic=res.pic;
        }
    })
})

// 获取修改数据
$(".preserve_emit").click(function () {
  getData()
  data.id=fodderformulaId;
  data.pic=pic;
    $.ajax({
        url: http + "/fodderformula/update.do",
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
            getenterData()
        }
    });
})

 // 删除数据
 $("#enterTable").delegate(".productenter_del", "click", function () {
    var fodderformulaId = $(this).data("id");
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
            url: http + "/fodderformula/delete.do",
            type: "post",
            dataType: "json",
            data: {
                "fodderformulaId": fodderformulaId,
                "token":token
            },
            success: function (res) {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                if (res.success == true) {
                    toastr.success(res.message);
                } else {
                    toastr.error(res.message);
                }
                getenterData()
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
        url: http + "/fodderformula/findByDate.do",
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
            var html = template("enterTel", {
                "rows": res.rows
            });
            $("#enterTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

 // 点击进入入库明细
 $("#enterTable").delegate(".details", "click", function () {
    var fodderformulaId = $(this).data("id")
    localStorage.setItem("fodderformulaId", fodderformulaId);
    location.href = "productenter_details.html"
})

    //   图片放大
    $("#enterTable").delegate(".images>img", "click", function () {
        $(".mengban_over").fadeIn(1000);
        $(this).siblings().fadeIn(1000)
        that=this
        $(document).ready(function () {
            $(that).siblings().zoomMarker({
                rate: 0.2,
            });
       })
    })

    $("#enterTable").delegate(".drawerror", "click", function () {
        $(".mengban_over").fadeOut(1000);
        $(".Imgsmall").fadeOut(1000)
    })
    
})
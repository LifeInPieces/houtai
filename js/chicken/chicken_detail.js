$(function () {
  // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var chickenoutdetailsId = 0;
  var chickenoutId = 0;

  getDetailsData();
  // 渲染数据
  function getDetailsData() {
    chickenoutId = localStorage.getItem("chickenoutId")
    type = localStorage.getItem("type")
    $.ajax({
      url: http + "/chickenoutdetails/findAll.do",
      type: "get",
      dataType: "json",
      data: {
        page: page,
        size: size,
        chickenoutId: chickenoutId,
        token:token
      },
      success: function (res) {
        $.each(res.rows, function (i) {
          res.rows[i].money = moneyFormat(res.rows[i].money)
          res.rows[i].price = moneyFormat(res.rows[i].price)
        })
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("chickenTel", {
          "rows": res.rows
        });
        $("#chikcenTable").html(html);
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
    getDetailsData();
  });

  $(".header_right").click(function () {
    $("#money").val("0.00");
    $(".button").val("辅");
    $("#chickenhousename").css("width", "95%")
    $(".button").css("display", "block")
  })
  // 获取辅助按钮
  $(".button").click(function () {
    currentPage = 1;
    currentSize = 5;
    $.ajax({
      url: http + "/chickenstock/find.do",
      type: "get",
      dataType: "json",
      data: {
        page: currentPage,
        size: currentSize,
        type: type,
        token:token
      },
      success: function (res) {
        var html = template("smallTel", {
          "res": res
        });
        $("#smallName").html(html)
      }
    })
    $(".smallTable").show();
  })
  // 点击取消按钮
  $(".cancel").click(function () {
    $(".smallTable").hide()
  })

  $("#smallName").delegate("tr", "click", function () {
    $(this).addClass("item_tr").siblings().removeClass("item_tr")
    var chickenstockId = $(this).data("id")
    $.ajax({
      url: http + "/chickenstock/findById.do",
      type: "get",
      dataType: "json",
      data: {
        chickenstockId: chickenstockId,
        token:token
      },
      success: function (res) {
        $(".ensure").click(function () {
          if ($("#smallName tr").hasClass("item_tr")) {
            var housenumber = $("#smallName .item_tr td:nth-of-type(1)").html()
            var varieties = $("#smallName .item_tr td:nth-of-type(2)").html()
            $("#chickenhousename").val(housenumber)
            $("#chickentype").val(varieties)
            $(".smallTable").hide()
          }

        })
      }
    })
  })

  // 关键字查询
$(".btn_found").click(function () {
  var smallMaterial = $("#smallMaterial").val()
  // 数据为空时不能查询
  if (smallMaterial == "") {
    return false;
  }
  $.ajax({
    type: "get",
    url: http + "/chickenstock/find.do",
    dataType: "json",
    data: {
      housenumber: smallMaterial,
      page: currentPage,
      size: currentSize,
      token:token
    },
    success: function (res) {
      var html=template("smallTel",{"res":res});
      $("#smallName").html(html)
      if (res.total < 1) {
        $(".data_num").css("display", "table-row")
      }
    }
  })
})
  // 添加数据
  $(".preserve_add").click(function () {
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
      if ($("#chickenhousename").val() == "" || $("#chickentype").val() == "" || $("#outnum").val() == "" ||
        $("#weight").val() == "" || $("#price").val() == "" || $("#money").val() == "") {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("有星号的表单不能有空项");
        return true;
      }
    }
    getData()
    $.ajax({
      url: http + "/chickenoutdetails/insert.do",
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
        getDetailsData()
      }
    })
  })

  function getData() {
    // 获取表单数据
    chickenhousename = $("#chickenhousename").val();
    chickentype = $("#chickentype").val();
    outnum = $("#outnum").val();
    weight = $("#weight").val();
    price = $("#price").val();
    money = $("#money").val();
    remark = $("#remark").val()
    data = {
      chickenhousename: chickenhousename,
      chickentype: chickentype,
      outnum: outnum,
      weight: weight,
      price: price,
      money: money,
      remark: remark,
      type: type,
      chickenoutId: chickenoutId,
      token:token
    }
  }

  // 修改数据
  $("#chikcenTable").delegate(".emit", "click", function () {
    // 回显表单数据
    chickenoutdetailsId = $(this).data("id");
    $.ajax({
      url: http + "/chickenoutdetails/findById.do",
      type: "post",
      dataType: "json",
      data: {
        chickenoutdetailsId: chickenoutdetailsId,
        token:token
      },
      success: function (res) {
        // 格式化时间
        $("#chickenhousename").val(res.chickenhousename);
        $("#chickentype").val(res.chickentype);
        $("#outnum").val(res.outnum);
        $("#weight").val(res.weight);
        $("#price").val(res.price);
        $("#money").val(res.money);
        $("#remark").val(res.remark)
      }
    })
  })

  // 获取修改数据
  $(".preserve_emit").click(function () {
    getData()
    data.id = chickenoutdetailsId;
    $.ajax({
      url: http + "/chickenoutdetails/update.do",
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
        getDetailsData()
      }
    });
  })

  // 删除数据
  $("#chikcenTable").delegate(".chick_del", "click", function () {
    var chickenoutdetailsId = $(this).data("id");
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
        url: http + "/chickenoutdetails/delete.do",
        type: "post",
        dataType: "json",
        data: {
          "chickenoutdetailsId": chickenoutdetailsId,
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
          getDetailsData()
        }
      })
    });
  });

  $(".back").click(function(){
    // 返回按钮
  if(type=="肉鸡"){
    location.href="chicken_sell.html"
  }else{
    location.href="eggchicken_sell.html"
  }
  })
})
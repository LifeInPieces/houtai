$(function(){
  // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var productId = 0;
  var type="肉鸡"
  getProductData();
  // 渲染数据
  function getProductData() {
    $.ajax({
      url: http + "/eggproduction/findAll.do",
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
            res.rows[i].percentage= moneyFormat(res.rows[i].percentage)
           })
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("productTel", {
          "rows": res.rows
        });
        $("#productTable").html(html);
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
    getProductData();
  });

  $(".header_right").click(function () {
    $(".button").val("辅");
    $("#chickenhousename").css("width", "95%")
    $(".button").css("display", "block")
    $("#percentage").val("0.00")
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
            var farmnum=$("#smallName .item_tr td:nth-of-type(3)").html()
            $("#chickenhousename").val(housenumber)
            $("#chickentype").val(varieties)
            $("#farmnum").val(farmnum)
            $(".smallTable").hide()
          }

        })
      }
    })
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
          token:token
      },
      success: function (res) {
          var html = template("smallTel", {
              "rows": res.rows
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
        var html = template("smallTel", {
            "rows": res.rows
        });
        $("#smallName").html(html)
        if (res.total < 1) {
          $(".data_num").css("display", "table-row")
        }
      }
    })
  })

function getData() {
    // 获取表单数据
     chickenhousename = $("#chickenhousename").val();
     chickentype = $("#chickentype").val();
     date = $("#date").val();
     productnum = $("#productnum").val();
     farmnum = $("#farmnum").val();
     percentage = $("#percentage").val();
     productweight = $("#productweight").val()
     remarks = $("#remarks").val()
     data = {
        chickenhousename: chickenhousename,
        chickentype: chickentype,
        date: date,
        productnum: productnum,
        farmnum: farmnum,
        percentage: percentage,
        productweight: productweight,
        remarks: remarks,
        token:token
    }
  }

  // 添加数据
  $(".preserve_add").click(function () {
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
        if ($("#chickenhousename").val() == "" || $("#chickentype").val() == "" || $("#date").val() == "" || $("#productnum").val() == "" ||
            $("#farmnum").val() == "" || $("#percentage").val() == "" || $("#productweight").val() == "" ) {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            toastr.error("有星号的表单不能有空项");
            return true;
        }
    }
    getData()
    $.ajax({
        url: http + "/eggproduction/insert.do",
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
            getProductData()
        }
    })
})

// 修改数据
$("#productTable").delegate(".emit", "click", function () {
    $("#chickenhousename").css("width", "100%")
    $(".button").css("display", "none")
    // 回显表单数据
    productId = $(this).data("id");
    $.ajax({
        url: http + "/eggproduction/findById.do",
        type: "post",
        dataType: "json",
        data: {
            eggproductionId: productId,
            token:token
        },
        success: function (res) {
            // 格式化时间
            res.date = moment(res.date).format('YYYY-MM-DD');
            $("#chickenhousename").val(res.chickenhousename);
            $("#chickentype").val(res.chickentype);
            $("#date").val(res.date);
            $("#productnum").val(res.productnum);
            $("#farmnum").val(res.farmnum);
            $("#percentage").val(res.percentage)
            $("#productweight").val(res.productweight);
            $("#remarks").val(res.remarks);
        }
    })
})

// 获取修改数据
$(".preserve_emit").click(function () {
   getData()
   data.id=productId
    $.ajax({
        url: http + "/eggproduction/update.do",
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
            getProductData()
        }
    });
})


 // 删除数据
 $("#productTable").delegate(".product_del", "click", function () {
    var productId = $(this).data("id");
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
            url: http + "/eggproduction/delete.do",
            type: "post",
            dataType: "json",
            data: {
                "eggproductionId": productId,
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
                getProductData()
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
        url: http + "/eggproduction/findByDate.do",
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
            $.each(res.rows, function (i) {
                var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                res.rows[i].date = dataTime;
                res.rows[i].percentage= moneyFormat(res.rows[i].percentage)
            })
            var html = template("productTel", {
                "rows": res.rows
              });
              $("#productTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

 $(".btn_found").click(function () {
    var chickenhousename = $("#number").val()
    // 数据为空时不能查询
    if (chickenhousename == "") {
      return false;
    }
    $.ajax({
      type: "get",
      url: http + "/eggproduction/find.do",
      dataType: "json",
      data: {
        chickenhousename:chickenhousename,
        page: page,
        size: size,
        token:token
      },
      success: function (res) {
        $.each(res.rows, function (i) {
            var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
            res.rows[i].date = dataTime;
            res.rows[i].percentage= moneyFormat(res.rows[i].percentage)
        })
        var html = template("productTel", {
            "rows": res.rows
          });
          $("#productTable").html(html);
        if (res.total < 1) {
          $(".data_num").css("display", "table-row")
        }
      }
    })
  })


})
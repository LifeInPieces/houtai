$(function(){
    // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var chickenshareId = 0;
  var buychickenId = 0;
  var varieties;

  getDistributionData();
  // 渲染数据
  function getDistributionData() {
    buychickenId = localStorage.getItem("buychickenId")
    varieties=localStorage.getItem("varieties")
    type=localStorage.getItem("type")
    $.ajax({
      url: http + "/chickenshare/findAll.do",
      type: "get",
      dataType: "json",
      data: {
        page: page,
        size: size,
        buychickenId: buychickenId,
        token:token
      },
      success: function (res) {
        $.each(res.rows, function (i) {
            res.rows[i].money= moneyFormat(res.rows[i].money)
        })
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("distributionTel", {
          "rows": res.rows
        });
        $("#distributionTable").html(html);
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
    getDistributionData();
  });

  $(".header_right").click(function () {
    varieties=$("#varieties").val(varieties)
    $(".button").val("辅");
    $("#housenumber").css("width", "95%")
    $(".button").css("display", "block")
})

  // 获取辅助按钮
  $(".button").click(function () {
    currentPage = 1;
    currentSize = 5;
    $.ajax({
        url: http + "/chickenhouse/find.do",
        type: "get",
        dataType: "json",
        data: {
            page: currentPage,
            size: currentSize,
            type:type,
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
  var chickenhouseId = $(this).data("id")
  $.ajax({
      url: http + "/chickenhouse/findById.do",
      type: "get",
      dataType: "json",
      data: {
          chickenhouseId: chickenhouseId,
          token:token
      },
      success: function (res) {
          $(".ensure").click(function () {
              if ($("#smallName tr").hasClass("item_tr")) {
                  var housenumber = $("#smallName .item_tr td:nth-of-type(1)").html()
                  $("#housenumber").val(housenumber)
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
        url: http + "/chickenhouse/find.do",
        dataType: "json",
        data: {
            housename: smallMaterial,
            page: currentPage,
            size: currentSize,
            token:token
        },
        success: function (res) {
            var html = template("smallTel", {
                "res": res
            });
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
      if ($("#housenumber").val() == "" || $("#num").val() == "" ) {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("有星号的表单不能有空项");
        return true;
      }
    }
     varieties = $("#varieties").val();
    getData()
    $.ajax({
      url: http + "/chickenshare/insert.do",
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
        getDistributionData()
      }
    })
  })

  function getData() {
    // 获取表单数据
    housenumber = $("#housenumber").val();
    num = $("#num").val();
    remark = $("#remark").val()
    data= {
      varieties:varieties,
      housenumber:housenumber,
      num:num,
      remark:remark,
      type:type,
      buychickenId:buychickenId,
      token:token
    }
  }

    // 修改数据
    $("#distributionTable").delegate(".emit", "click", function () {
      $(".button").css("display", "none")
      $("#housenumber").css("width", "100%")
      // 回显表单数据
      chickenshareId = $(this).data("id");
      $.ajax({
        url: http + "/chickenshare/findById.do",
        type: "post",
        dataType: "json",
        data: {
          chickenshareId: chickenshareId,
          token:token
        },
        success: function (res) {
          $("#housenumber").val(res.housenumber);
          $("#num").val(res.num);
          $("#remark").val(res.remark);
        }
      })
    })

    // 获取修改数据
   $(".preserve_emit").click(function () {
    getData()
    data.id=chickenshareId
    $.ajax({
      url: http + "/chickenshare/update.do",
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
        getDistributionData()
      }
    });
  })

  // 删除数据
 $("#distributionTable").delegate(".distribution_del", "click", function () {
  var chickenshareId = $(this).data("id");
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
      url: http + "/chickenshare/delete.do",
      type: "post",
      dataType: "json",
      data: {
        "chickenshareId": chickenshareId,
        "buychickenId": buychickenId,
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
        getDistributionData()
      }
    })
  });
});

// 返回按钮
$(".back").click(function(){
  if(type=="肉鸡"){
    location.href="chick.html"
  }else{
    location.href="egg_chick.html"
  }
})

})
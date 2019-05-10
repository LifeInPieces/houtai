$(function () {
  // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var fodderdetailsId = 0;
  var buyfodderId = 0;
  var units;

  getDetailsData();
  // 渲染数据
  function getDetailsData() {
    buyfodderId = localStorage.getItem("buyfodderId")
    $.ajax({
      url: http + "/fodderdetails/findAll.do",
      type: "get",
      dataType: "json",
      data: {
        page: page,
        size: size,
        buyfodderId: buyfodderId,
        token:token
      },
      success: function (res) {
        $.each(res.rows, function (i) {
          res.rows[i].money= moneyFormat(res.rows[i].money)
          res.rows[i].weight= moneyFormat(res.rows[i].weight)
          res.rows[i].price= moneyFormat(res.rows[i].price)
      })
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("detailsTel", {
          "res": res
        });
        $("#detailsTable").html(html);
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

  // 点击新增按钮给计量单位赋值
  $(".header_right").click(function () {
    units = $("#units").val("kg/袋");
    weight = $("#weight").val("0.00");
    money = $("#money").val("0.00");
    $(".weight").css("display", "none")
  })


  // 添加数据
  $(".preserve_add").click(function () {
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
      if ($("#foddername").val() == "" || $("#specifications").val() == "" ||
        $("#foddertype").val() == "" || $("#units").val() == "" || $("#price").val() == "" || $("#buynum").val() == "" || $("#weight").val() == "" || $("#money").val() == "") {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("有星号的表单不能有空项");
        return true;
      }
    }
    getData();
    $.ajax({
      url: http + "/fodderdetails/insert.do",
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

  // 修改数据
  $("#detailsTable").delegate(".emit", "click", function () {
    // 回显表单数据
    fodderdetailsId = $(this).data("id");
    $(".weight").css("display", "block")
    $.ajax({
      url: http + "/fodderdetails/findById.do",
      type: "post",
      dataType: "json",
      data: {
        fodderdetailsId: fodderdetailsId,
        token:token
      },
      success: function (res) {
        $("#foddername").val(res.foddername);
        $("#specifications").val(res.specifications);
        $("#foddertype").val(res.foddertype);
        $("#units").val();
        $("#price").val(res.price);
        $("#buynum").val(res.buynum);
        $("#remark").val(res.remark);
        $("#weight").val(res.weight)
      }
    })
  })
  function getData() {
    // 获取表单数据
    foddername = $("#foddername").val();
    specifications = $("#specifications").val();
    foddertype = $("#foddertype").val();
    units = $("#units").val();
    price = $("#price").val();
    buynum = $("#buynum").val();
    remark = $("#remark").val();
    weight = $("#weight").val();
    data = {
      foddername: foddername,
      specifications: specifications,
      foddertype: foddertype,
      units: units,
      price: price,
      buynum: buynum,
      remark: remark,
      buyfodderId: buyfodderId,
      token:token
    }
  }

  // 获取修改数据
  $(".preserve_emit").click(function () {
    getData()
   data.id=fodderdetailsId
    $.ajax({
      url: http + "/fodderdetails/update.do",
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
        getDetailsData()
      }
    });
  })

  // 删除数据
  $("#detailsTable").delegate(".details_del", "click", function () {
    var fodderdetailsId = $(this).data("id");
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
        url: http + "/fodderdetails/delete.do",
        type: "post",
        dataType: "json",
        data: {
          "fodderdetailsId": fodderdetailsId,
          "buyfodderId": buyfodderId,
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
          getDetailsData()
        }
      })
    });
  });

})
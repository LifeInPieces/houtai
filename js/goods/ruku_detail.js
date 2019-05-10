$(function(){
  // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var goodsdetailsId = 0;
  var buygoodsId = 0;

  getDetailsData();
  // 渲染数据
  function getDetailsData() {
    buygoodsId = localStorage.getItem("buygoodsId")
    $.ajax({
      url: http + "/goodsdetails/findAll.do",
      type: "get",
      dataType: "json",
      data: {
        page: page,
        size: size,
        buygoodsId: buygoodsId,
        token:token
      },
      success: function (res) {
        $.each(res.rows, function (i) {
            res.rows[i].money= moneyFormat(res.rows[i].money)
            res.rows[i].price= moneyFormat(res.rows[i].price)
        })
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("ggodsDetailTel", {
          "rows": res.rows
        });
        $("#rukuDetail").html(html);
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
    $("#goodsname").attr("readOnly",false);
    $("#specifications").attr("readOnly",false);
    $("#unit").attr("readOnly",false);
  })

  // 添加数据
  $(".preserve_add").click(function () {
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
      if ($("#goodsname").val() == "" || $("#specifications").val() == "" ||
        $("#price").val() == "" || $("#unit").val() == "" || $("#buynum").val() == "" || $("#money").val() == "" ) {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("有星号的表单不能有空项");
        return true;
      }
    }
    getData();
    $.ajax({
      url: http + "/goodsdetails/insert.do",
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
    goodsname = $("#goodsname").val();
    specifications = $("#specifications").val();
    price = $("#price").val();
    unit = $("#unit").val();
    buynum = $("#buynum").val();
    money = $("#money").val();
    remark = $("#remark").val();
    data = {
      goodsname: goodsname,
      specifications: specifications,
      price: price,
      unit: unit,
      buynum: buynum,
      money: money,
      remark: remark,
      buygoodsId: buygoodsId,
      token:token
    }
  }

    // 修改数据
    $("#rukuDetail").delegate(".emit", "click", function () {
        $("#goodsname").attr("readOnly","true");
        $("#specifications").attr("readOnly","true");
        $("#unit").attr("readOnly","true");
        
        // 回显表单数据
        goodsdetailsId = $(this).data("id");
        $.ajax({
          url: http + "/goodsdetails/findById.do",
          type: "post",
          dataType: "json",
          data: {
            goodsdetailsId: goodsdetailsId,
            token:token
          },
          success: function (res) {
            $("#goodsname").val(res.goodsname);
            $("#specifications").val(res.specifications);
            $("#price").val(res.price);
            $("#unit").val(res.unit);
            $("#buynum").val(res.buynum);
            $("#money").val(res.money);
            $("#remark").val(res.remark);
          }
        })
      })

   // 获取修改数据
   $(".preserve_emit").click(function () {
    getData()
    data.id=goodsdetailsId
    $.ajax({
      url: http + "/goodsdetails/update.do",
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
  $("#rukuDetail").delegate(".ruku_del", "click", function () {
    var goodsdetailsId = $(this).data("id");
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
        url: http + "/goodsdetails/delete.do",
        type: "post",
        dataType: "json",
        data: {
          "goodsdetailsId": goodsdetailsId,
          "buygoodsId": buygoodsId,
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
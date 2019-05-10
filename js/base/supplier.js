$(function () {
  // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var supplierId = 0;
  getCommentsData();
  // 渲染数据
  function getCommentsData() {
    $.ajax({
      url: http + "/supplier/findAll.do",
      type: "get",
      dataType: "json",
      data: {
        page: page,
        size: size,
        token:token
      },
      success: function (res) {
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("supplierTel", {
          "rows": res.rows
        });
        $(".supplier").html(html);
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
    getCommentsData();
  });

  function getData() {
    // 获取表单数据
     companyname = $("#companyname").val();
     contacts = $("#contacts").val();
     phone = $("#phone").val();
     address = $("#address").val();
     type = $("#type").val();
     remarks = $("#remarks").val();
     data = {
      companyname: companyname,
      contacts: contacts,
      phone: phone,
      address: address,
      type: type,
      remarks: remarks,
      token:token
    }
  }

  // 添加数据
  $(".preserve_add").click(function () {
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
      if ($("#companyname").val() == "" || $("#contacts").val() == "" || $("#phone").val() == "" || $("#address").val() == "" || $("#type").val() == "") {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("有星号的表单不能有空项");
        return true;
      }
    }
    getData()
    $.ajax({
      url: http + "/supplier/insert.do",
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
        getCommentsData()
      }
    })
  })

  // 修改数据
  $(".supplier").delegate(".emit", "click", function () {
    // 回显表单数据
    supplierId = $(this).data("id");
    $.ajax({
      url: http + "/supplier/findById.do",
      type: "post",
      dataType: "json",
      data: {
        supplierId: supplierId,
        token:token
      },
      success: function (res) {
        $("#companyname").val(res.companyname);
        $("#contacts").val(res.contacts);
        $("#phone").val(res.phone);
        $("#address").val(res.address);
        $("#type").val(res.type);
        $("#remarks").val(res.remarks);
      }
    })
  })


  // 获取修改数据
  $(".preserve_emit").click(function () {
    getData()
    data.id=supplierId
    $.ajax({
      url: http + "/supplier/update.do",
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
        getCommentsData()
      }
    });
  })
  // 删除数据
  $(".supplier").delegate(".del", "click", function () {
    var supplierId = $(this).data("id");
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
        url: http + "/supplier/delete.do",
        type: "post",
        dataType: "json",
        data: {
          "supplierId": supplierId,
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
          getCommentsData()
        }
      })
    });
  });
  // 关键字查询
  $(".btn_found").click(function () {
    var type = $("#hearder_name").val()
    var companyname = $("#fenlei").val()
    // 数据为空时不能查询
    if (type == "" && companyname == "") {
      return false;
    }
    $.ajax({
      type: "get",
      url: http + "/supplier/find.do",
      dataType: "json",
      data: {
        type: type,
        companyname: companyname,
        page: page,
        size: size,
        token:token
      },
      success: function (res) {
        var html = template("supplierTel", {
          "rows": res.rows
        });
        $(".supplier").html(html);
        if (res.total < 1) {
          $(".data_num").css("display", "table-row")
        }
      }
    })
  })
})
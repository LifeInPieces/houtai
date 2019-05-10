$(function () {
  // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var chickenhouseId = 0;
  getHenhouseData();
  // 渲染数据
  function getHenhouseData() {
    $.ajax({
      url: http + "/chickenhouse/findAll.do",
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
        var html = template("henhouseTel", {
          "rows": res.rows
        });
        $("#henhouse").html(html);
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
    getHenhouseData();
  });

  function getData() {
    // 获取表单数据
     housename = $("#housename").val();
     type = $("#type").val();
     address = $("#address").val();
     introduce = $("#introduce").val();
     farmnum = $("#farmnum").val();
     remarks = $("#remarks").val();
     data = {
      housename: housename,
      type: type,
      address: address,
      introduce: introduce,
      farmnum: farmnum,
      remarks: remarks,
      token:token
    }
  }

  // 添加数据
  $(".preserve_add").click(function () {
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
      if ($("#housename").val() == "" || $("#type").val() == "" ||  $("#farmnum").val() == "") {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("有星号的表单不能有空项");
        return true;
      }
    }
    getData()
    $.ajax({
      url: http + "/chickenhouse/insert.do",
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
        getHenhouseData()
      }
    })
  })

  // 修改数据
  $("#henhouse").delegate(".emit", "click", function () {
    // 回显表单数据
    chickenhouseId = $(this).data("id");
    $.ajax({
      url: http + "/chickenhouse/findById.do",
      type: "post",
      dataType: "json",
      data: {
        chickenhouseId: chickenhouseId,
        token:token
      },
      success: function (res) {
        $("#housename").val(res.housename);
        $("#type").val(res.type);
        $("#address").val(res.address);
        $("#introduce").val(res.introduce);
        $("#farmnum").val(res.farmnum);
        $("#remarks").val(res.remarks);
      }
    })
  })


  // 获取修改数据
  $(".preserve_emit").click(function () {
    getData()
    data.id=chickenhouseId
    $.ajax({
      url: http + "/chickenhouse/update.do",
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
        getHenhouseData()
      }
    });
  })
  // 删除数据
  $("#henhouse").delegate(".henhouse_del", "click", function () {
    var chickenhouseId = $(this).data("id");
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
        url: http + "/chickenhouse/delete.do",
        type: "post",
        dataType: "json",
        data: {
          "chickenhouseId": chickenhouseId,
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
          getHenhouseData()
        }
      })
    });
  });
  // 关键字查询
  $(".btn_found").click(function () {
    var housename = $("#henhouseNum").val()
    // 数据为空时不能查询
    if (housename == "") {
      return false;
    }
    $.ajax({
      type: "get",
      url: http + "/chickenhouse/find.do",
      dataType: "json",
      data: {
        housename: housename,
        page: page,
        size: size,
        token:token
      },
      success: function (res) {
        var html = template("henhouseTel", {
          "rows": res.rows
        });
        $("#henhouse").html(html);
        if (res.total < 1) {
          $(".data_num").css("display", "table-row")
        }
      }
    })
  })

  // 跳转到地图页面
  $("#henhouse").delegate(".mapget", "click", function () {
    var chickenhouseId = $(this).data("id")
    $.ajax({
        url: http + "/chickenhouse/findById.do",
        type: "post",
        async: false,
        dataType: "json",
        data: {
            chickenhouseId: chickenhouseId,
            token:token
        },
        success: function (res) {
          address= res.address;
        }
    })
    localStorage.setItem("address", address)
    location.href="../other/custom_add.html"
})
})
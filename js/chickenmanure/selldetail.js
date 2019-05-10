$(function () {
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var chickenmanureoutId = 0;
    var manureoutdetailsId = 0;
  
    getDetailsData();
    // 渲染数据
    function getDetailsData() {
        chickenmanureoutId = localStorage.getItem("chickenmanureoutId")
      $.ajax({
        url: http + "/manureoutdetails/findAll.do",
        type: "get",
        dataType: "json",
        data: {
          page: page,
          size: size,
          chickenmanureoutId: chickenmanureoutId,
          token:token
        },
        success: function (res) {
          $.each(res.rows, function (i) {
            res.rows[i].money= moneyFormat(res.rows[i].money)
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
money = $("#money").val("0.00")
unit = $("#unit").val("kg")
})

function getData() {
    // 获取表单数据
    type = $("#type").val();
    weight = $("#weight").val();
    unit = $("#unit").val();
    price = $("#price").val();
    money = $("#money").val();
    remark = $("#remark").val();
    data = {
        type: type,
        weight: weight,
        unit: unit,
        price: price,
        money:money,
        remark: remark,
        chickenmanureoutId:chickenmanureoutId,
        token:token
    }
    }

// 添加数据
$(".preserve_add").click(function () {
    getData();
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
    if ( type == "" || weight == "" || unit == "" || price == "" || money == "") {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("有星号的表单不能有空项");
        return true;
    }
    }
    
    $.ajax({
    url: http + "/manureoutdetails/insert.do",
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
    manureoutdetailsId = $(this).data("id");
    $(".weight").css("display", "block")
    $.ajax({
    url: http + "/manureoutdetails/findById.do",
    type: "post",
    dataType: "json",
    data: {
        manureoutdetailsId: manureoutdetailsId,
        token:token
    },
    success: function (res) {
        $("#name").val(res.name);
        $("#num").val(res.num);
        $("#unit").val(res.unit);
        $("#weight").val(res.weight);
        $("#price").val(res.price);
        $("#money").val(res.money);
        $("#remark").val(res.remark);
    }
    })
})


// 获取修改数据
$(".preserve_emit").click(function () {
    getData()
    data.id=manureoutdetailsId
    $.ajax({
    url: http + "/manureoutdetails/update.do",
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
    var manureoutdetailsId = $(this).data("id");
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
        url: http + "/manureoutdetails/delete.do",
        type: "post",
        dataType: "json",
        data: {
        "chickenmanureoutId": chickenmanureoutId,
        "manureoutdetailsId": manureoutdetailsId,
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
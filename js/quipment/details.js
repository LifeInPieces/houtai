$(function(){
  // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var buyequipmentId = 0;
  var equipmentdetailsId=0
  getquipmentData();
  // 渲染数据
  function getquipmentData() {
    buyequipmentId = localStorage.getItem("buyequipmentId")
    $.ajax({
      url: http + "/equipmentdetails/findAll.do",
      type: "get",
      dataType: "json",
      data: {
        page: page,
        size: size,
        buyequipmentId:buyequipmentId,
        token:token
      },
      success: function (res) {
        $.each(res.rows, function (i) {
          res.rows[i].money = moneyFormat(res.rows[i].money)
          res.rows[i].price = moneyFormat(res.rows[i].price)
        })
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("quipmentdetailsTel", {
          "rows": res.rows
        });
        $("#quipmentdetailsTable").html(html);
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
    getquipmentData();
  });

  function getData() {
    // 获取表单数据
    equipmentname = $("#equipmentname").val();
    brand = $("#brand").val();
    model = $("#model").val();
    material = $("#material").val();
    specifications = $("#specifications").val();
    num = $("#num").val();
    unit = $("#unit").val();
    price = $("#price").val();
    money = $("#money").val();
    manufactor = $("#manufactor").val();
    address = $("#address").val();
    phone = $("#phone").val();
    remark = $("#remark").val();
    data = {
      equipmentname: equipmentname,
      brand: brand,
      model: model,
      material: material,
      specifications: specifications,
      num:num,
      unit:unit,
      price:price,
      money:money,
      manufactor:manufactor,
      address:address,
      phone:phone,
      remark:remark,
      buyequipmentId: buyequipmentId,
      token:token
    }
  }

  
  // 点击新增按钮给计量单位赋值
  $(".header_right").click(function () {
    money = $("#money").val("0.00");

  })
   // 添加数据
   $(".preserve_add").click(function () {
      getData()
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
      if (equipmentname == "" || brand == "" || model == "" || 
      specifications == "" || num == "" || unit == "" || price == "" || money == ""
      || manufactor == "" || phone == "") {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("有星号的表单不能有空项");
        return true;
      }
    }
    $.ajax({
      url: http + "/equipmentdetails/insert.do",
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
        getquipmentData()
      }
    })
  })

// 修改数据
$("#quipmentdetailsTable").delegate(".emit", "click", function () {
  // 回显表单数据
  equipmentdetailsId = $(this).data("id");
  $.ajax({
      url: http + "/equipmentdetails/findById.do",
      type: "post",
      dataType: "json",
      data: {
        equipmentdetailsId: equipmentdetailsId,
        token:token
      },
      success: function (res) {
           // 格式化时间
           equipmentname = $("#equipmentname").val(res.equipmentname);
           brand = $("#brand").val(res.brand);
           model = $("#model").val(res.model);
           material = $("#material").val(res.material);
           specifications = $("#specifications").val(res.specifications);
           num = $("#num").val(res.num);
           unit = $("#unit").val(res.unit);
           price = $("#price").val(res.price);
           money = $("#money").val(res.money);
           manufactor = $("#manufactor").val(res.manufactor);
           address = $("#address").val(res.address);
           phone = $("#phone").val(res.phone);
           remark = $("#remark").val(res.remark);
      }
  })
})

// 获取修改数据
$(".preserve_emit").click(function () {
  getData()
  data.id=equipmentdetailsId
  $.ajax({
    url: http + "/equipmentdetails/update.do",
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
      getquipmentData()
    }
  });
})

 // 删除数据
 $("#quipmentdetailsTable").delegate(".details_del", "click", function () {
  var equipmentdetailsId = $(this).data("id");
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
      url: http + "/equipmentdetails/delete.do",
      type: "post",
      dataType: "json",
      data: {
        "equipmentdetailsId": equipmentdetailsId,
        "buyequipmentId":buyequipmentId,
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
        getquipmentData()
      }
    })
  });
});

})
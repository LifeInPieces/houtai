$(function(){
 // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var drugdayId = 0;
  var chickenstockId=0;
  function each(res){
    $.each(res.rows, function (i) {
      var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
      res.rows[i].date = dataTime;
      res.rows[i].drugprice = moneyFormat(res.rows[i].drugprice)
      res.rows[i].drugmoney = moneyFormat(res.rows[i].drugmoney)
  })
  }
  getDrugData();
  // 渲染数据
  function getDrugData() {
    chickenstockId = localStorage.getItem("chickenstockId")
    $.ajax({
      url: http + "/drugday/findAll.do",
      type: "get",
      dataType: "json",
      data: {
        page: page,
        size: size,
        chickenstockId:chickenstockId,
        token:token
      },
      success: function (res) {
        each(res)
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("drugTel", {
          "rows": res.rows
        });
        $("#drugTable").html(html);
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
    getDrugData();
  });

  $(".header_right").click(function () {
    drugmoney = $("#drugmoney").val("0.00");
  })

   // 添加数据
   $(".preserve_add").click(function () {
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
        if ($("#date").val() == "" || $("#drugname").val() == "" || $("#specifications").val() == "" || $("#drugusage").val() == "" ||
            $("#drugunits").val() == "" || $("#drugprice").val() == "" || $("#drugmoney").val() == "" || $("#usedrugname").val() == "") {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            toastr.error("有星号的表单不能有空项");
            return true;
        }
    }
    getData()
    $.ajax({
        url: http + "/drugday/insert.do",
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
            getDrugData()
        }
    })
})

function getData() {
  // 获取表单数据
  date = $("#date").val();
  drugname = $("#drugname").val();
  specifications = $("#specifications").val();
  drugusage = $("#drugusage").val();
  drugunits = $("#drugunits").val();
  drugprice = $("#drugprice").val();
  drugmoney = $("#drugmoney").val();
  usedrugname = $("#usedrugname").val();
  remarks = $("#remarks").val();
  data={
      date: date,
      drugname: drugname,
      specifications: specifications,
      drugusage: drugusage,
      drugunits: drugunits,
      drugprice: drugprice,
      drugmoney: drugmoney,
      usedrugname: usedrugname,
      remarks: remarks,
      chickenstockId:chickenstockId,
      token:token
  }
}

// 修改数据
$("#drugTable").delegate(".emit", "click", function () {
  // 回显表单数据
  drugdayId = $(this).data("id");
  $.ajax({
      url: http + "/drugday/findById.do",
      type: "post",
      dataType: "json",
      data: {
          drugdayId: drugdayId,
          token:token
      },
      success: function (res) {
          // 格式化时间
          res.date = moment(res.date).format('YYYY-MM-DD');
          $("#date").val(res.date);
          $("#drugname").val(res.drugname);
          $("#specifications").val(res.specifications);
          $("#drugusage").val(res.drugusage);
          $("#drugunits").val(res.drugunits);
          $("#drugprice").val(res.drugprice);
          $("#drugmoney").val(res.drugmoney)
          $("#usedrugname").val(res.usedrugname)
          $("#remarks").val(res.remarks);
      }
  })
})
// 获取修改数据
$(".preserve_emit").click(function () {
  getData() 
  data.id=drugdayId
  $.ajax({
      url: http + "/drugday/update.do",
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
          getDrugData()
      }
  });
})

 // 删除数据
 $("#drugTable").delegate(".drug_del", "click", function () {
  var drugdayId = $(this).data("id");
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
          url: http + "/drugday/delete.do",
          type: "post",
          dataType: "json",
          data: {
              drugdayId: drugdayId,
              chickenstockId:chickenstockId,
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
              getDrugData()
          }
      })
  });
});

 // 关键字查询
 $(".buttonDate").click(function () {
  var beforeDate = $("#beforeDate").val()
  var afterDate = $("#afterDate").val()
  if (beforeDate == "" && afterDate == "") {
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
      url: http + "/drugday/findByDate.do",
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
          var html = template("drugTel", {
            "rows": res.rows
          });
          $("#drugTable").html(html);
          if (res.total < 1) {
              $(".data_num").css("display", "table-row")
          }
      }
  })
})

$(".btn_found").click(function () {
  var drugname = $("#drug").val()
  // 数据为空时不能查询
  if (drugname == "") {
      return false;
  }
  $.ajax({
      type: "get",
      url: http + "/drugday/find.do",
      dataType: "json",
      data: {
          drugname: drugname,
          page: page,
          size: size,
          token:token
      },
      success: function (res) {
          each(res)
          var html = template("drugTel", {
            "rows": res.rows
          });
          $("#drugTable").html(html);
          if (res.total < 1) {
              $(".data_num").css("display", "table-row")
          }
      }
  })
})


})
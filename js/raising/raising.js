$(function(){
 // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var chickenstockId;
  var feeddayId = 0;
  getRaisingData();
  // 渲染数据
  function getRaisingData() {
    chickenstockId = localStorage.getItem("chickenstockId")
    $.ajax({
      url: http + "/feedday/findAll.do",
      type: "get",
      dataType: "json",
      data: {
        page: page,
        size: size,
        chickenstockId:chickenstockId,
        token:token
      },
      success: function (res) {
        $.each(res.rows, function (i) {
            var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
            res.rows[i].date = dataTime;
            res.rows[i].price= moneyFormat(res.rows[i].price)
            res.rows[i].money= moneyFormat(res.rows[i].money)
        })
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("raisingTel", {
          "rows": res.rows
        });
        $("#raisingTable").html(html);
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
    getRaisingData();
  });

  $(".header_right").click(function () {
    money = $("#money").val("0.00");
    $(".button").val("辅");
    $("#feedname").css("width","95%")
    $(".button").css("display","block")
    $("#type").val("成品料")
  })

  // 获取辅助按钮
$(".button").click(function(){
   currentPage=1;
   currentSize=5;
  $.ajax({
    url:http+"/finishfodderhouse/findAll.do",
    type:"get",
    dataType:"json",
    data:{page:currentPage,size:currentSize,token:token},
    success:function(res){
      var html=template("smallTel",{"res":res});
      $("#smallName").html(html)
    }
  })
  $(".smallTable").show();
})
// 点击取消按钮
$(".cancel").click(function(){
  $(".smallTable").hide()
})
$("#smallName").delegate("tr", "click", function () {
  $(this).addClass("item_tr").siblings().removeClass("item_tr")
  var finishfodderhouseId=$(this).data("id")
  $.ajax({
    url:http+"/finishfodderhouse/findById.do",
    type:"get",
    dataType:"json",
    data:{finishfodderhouseId:finishfodderhouseId,token:token},
    success:function(res){
      $(".ensure").click(function(){
        if($("#smallName tr").hasClass("item_tr")){
         var finishfoddername=$("#smallName .item_tr td:nth-of-type(1)").html()
         var unit=$("#smallName .item_tr td:nth-of-type(2)").html()
         $("#feedname").val(finishfoddername)
         $("#units").val(unit)
         $(".smallTable").hide()
        }
        
       })
    }
  })
})
// 关键字查询
$(".btn_found").click(function () {
  var finishfoddername = $("#smallMaterial").val()
  // 数据为空时不能查询
  if (finishfoddername == "") {
    return false;
  }
  $.ajax({
    type: "get",
    url: http + "/finishfodderhouse/find.do",
    dataType: "json",
    data: {
      finishfoddername: finishfoddername,
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
        if ($("#date").val() == "" || $("#feedname").val() == "" || $("#type").val() == "" ||
            $("#feedusage").val() == "" || $("#units").val() == "" || $("#price").val() == "" || $("#money").val() == "" || $("#people").val() == "") {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            toastr.error("有星号的表单不能有空项");
            return true;
        }
    }
    getData()
    $.ajax({
        url: http + "/feedday/insert.do",
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
            getRaisingData()
        }
    })
})

function getData() {
  // 获取表单数据
  date = $("#date").val();
  feedname = $("#feedname").val();
  type = $("#type").val();
  feedusage = $("#feedusage").val();
  units = $("#units").val();
  price = $("#price").val();
  money = $("#money").val();
  people = $("#people").val();
  remarks = $("#remarks").val();
  data={
      date: date,
      feedname: feedname,
      type: type,
      feedusage: feedusage,
      units: units,
      price: price,
      money: money,
      people:people,
      remarks: remarks,
      chickenstockId:chickenstockId,
      token:token
  }
}

 // 修改数据
 $("#raisingTable").delegate(".emit", "click", function () {
  // 回显表单数据
  feeddayId = $(this).data("id");
  $.ajax({
      url: http + "/feedday/findById.do",
      type: "post",
      dataType: "json",
      data: {
          feeddayId: feeddayId,
          token:token
      },
      success: function (res) {
          // 格式化时间
          res.date = moment(res.date).format('YYYY-MM-DD');
          $("#date").val(res.date);
          $("#feedname").val(res.feedname);
          $("#type").val(res.type);
          $("#feedusage").val(res.feedusage);
          $("#units").val(res.units);
          $("#price").val(res.price);
          $("#money").val(res.money)
          $("#people").val(res.people)
          $("#remarks").val(res.remarks);
      }
  })
})
// 获取修改数据
$(".preserve_emit").click(function () {
  getData() 
  data.id=feeddayId
  $.ajax({
      url: http + "/feedday/update.do",
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
          getRaisingData()
      }
  });
})

 // 删除数据
 $("#raisingTable").delegate(".raising_del", "click", function () {
  var feeddayId = $(this).data("id");
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
          url: http + "/feedday/delete.do",
          type: "post",
          dataType: "json",
          data: {
              "feeddayId": feeddayId,
              "chickenstockId":chickenstockId,
              "token":token
          },
          success: function (res) {
              toastr.options.positionClass = 'toast-center-center';
              toastr.options.timeOut = '3000';
              if (res.success == true) {
                  toastr.success(res.message);
              } else {
                  toastr.error(res.message);
              }
              getRaisingData()
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
      url: http + "/feedday/findByDate.do",
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
            res.rows[i].price= moneyFormat(res.rows[i].price)
            res.rows[i].money= moneyFormat(res.rows[i].money)
        })
        var html = template("raisingTel", {
          "rows": res.rows
        });
        $("#raisingTable").html(html);
          if (res.total < 1) {
              $(".data_num").css("display", "table-row")
          }
      }
  })
})

})
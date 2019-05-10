$(function () {
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var fodderformulaId = 0;
    var foddermaterialsId=0;
    var units;
  
    getDetailsData();
    // 渲染数据
    function getDetailsData() {
      fodderformulaId = localStorage.getItem("fodderformulaId")
      $.ajax({
        url: http + "/foddermaterials/findAll.do",
        type: "get",
        dataType: "json",
        data: {
          page: page,
          size: size,
          fodderformulaId: fodderformulaId,
          token:token
        },
        success: function (res) {
          $.each(res.rows, function (i) {
            res.rows[i].money= moneyFormat(res.rows[i].money)
            res.rows[i].price= moneyFormat(res.rows[i].price)
        })
          // 分页页数
          pageCount = Math.ceil(res.total / size);
          var html = template("outlineTel", {
            "rows": res.rows
          });
          $("#outDetTable").html(html);
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
    $(".button").val("辅");
    $("#materialsname").css("width","95%")
    $(".button").css("display","block")
    $("#money").val("0.00")
  })

  // 获取辅助按钮
$(".button").click(function(){
   currentPage=1;
   currentSize=5;
  $.ajax({
    url:http+"/fodderhouse/findAll.do",
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
  var fodderhouseId=$(this).data("id")
  $.ajax({
    url:http+"/fodderhouse/findById.do",
    type:"get",
    dataType:"json",
    data:{fodderhouseId:fodderhouseId,token:token},
    success:function(res){
      $(".ensure").click(function(){
        if($("#smallName tr").hasClass("item_tr")){
         var materialsname=$("#smallName .item_tr td:nth-of-type(1)").html()
         var specifications=$("#smallName .item_tr td:nth-of-type(2)").html()
         var unit=$("#smallName .item_tr td:nth-of-type(3)").html()
         $("#materialsname").val(materialsname)
         $("#specifications").val(specifications)
         $("#unit").val(unit)
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
    url: http + "/fodderhouse/find.do",
    dataType: "json",
    data: {
      foddername: smallMaterial,
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
        if ($("#materialsname").val() == "" || $("#specifications").val() == "" || $("#num").val() == "" 
        || $("#unit").val() == "" || $("#price").val() == "" || $("#money").val() == "") {
          toastr.options.positionClass = 'toast-center-center';
          toastr.options.timeOut = '3000';
          toastr.error("有星号的表单不能有空项");
          return true;
        }
      }
      getData();
      $.ajax({
        url: http + "/foddermaterials/insert.do",
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
    $("#outDetTable").delegate(".emit", "click", function () {
        $(".button").css("display","none")
        $("#materialsname").css("width","100%")
      // 回显表单数据
      foddermaterialsId = $(this).data("id");
      $.ajax({
        url: http + "/foddermaterials/findById.do",
        type: "post",
        dataType: "json",
        data: {
          foddermaterialsId: foddermaterialsId,
          token:token
        },
        success: function (res) {
          $("#materialsname").val(res.materialsname);
          $("#specifications").val(res.specifications);
          $("#num").val(res.num);
          $("#unit").val(res.unit);
          $("#price").val(res.price);
          $("#money").val(res.money);
          $("#remaker").val(res.remaker)
        }
      })
    })

    
    function getData() {
      // 获取表单数据
      materialsname = $("#materialsname").val();
      specifications = $("#specifications").val();
      num = $("#num").val();
      unit = $("#unit").val();
      price = $("#price").val();
      money = $("#money").val();
      remaker = $("#remaker").val()
      data = {
        materialsname: materialsname,
        specifications: specifications,
        num: num,
        unit: unit,
        price: price,
        money: money,
        remaker: remaker,
        fodderformulaId: fodderformulaId,
        token:token
      }
    }
  
    // 获取修改数据
    $(".preserve_emit").click(function () {
      getData()
      data.id=foddermaterialsId
      $.ajax({
        url: http + "/foddermaterials/update.do",
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
    $("#outDetTable").delegate(".outline_del", "click", function () {
      var foddermaterialsId = $(this).data("id");
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
          url: http + "/foddermaterials/delete.do",
          type: "post",
          dataType: "json",
          data: {
            "foddermaterialsId": foddermaterialsId,
            "fodderformulaId": fodderformulaId,
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
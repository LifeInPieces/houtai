$(function(){
 // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var pledgeId = 0;
  var pic;
  function each(res){
   $.each(res.rows, function (i) {
        var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
        res.rows[i].date = dataTime;
        res.rows[i].money= moneyFormat(res.rows[i].money)
    })
  }
  getpledgeData();
  // 渲染数据
  function getpledgeData() {
    $.ajax({
      url: http + "/pledge/findAll.do",
      type: "get",
      dataType: "json",
      data: {
        page: page,
        size: size,
        token:token
      },
      success: function (res) {
        each(res)
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("pledgeTel", {
          "rows": res.rows
        });
        $("#pledgeTable").html(html);
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
    getpledgeData();
  });

  $(".header_right").click(function () {
    $(".button").val("辅");
    $("#equipmentname").css("width", "95%")
    $(".button").css("display", "block")
})

// 获取辅助按钮
$(".button").click(function () {
    currentPage = 1;
    currentSize = 5;
    $.ajax({
        url: http + "/equipmenthouse/find.do",
        type: "get",
        dataType: "json",
        data: {
            page: currentPage,
            size: currentSize,
            token: token
        },
        success: function (res) {
            var html = template("smallTel", {
                "rows": res.rows
            });
            $("#smallName").html(html)
        }
    })
    $(".smallTable").show();
})

$("#smallName").delegate("tr", "click", function () {
    $(this).addClass("item_tr").siblings().removeClass("item_tr")
    var equipmenthouseId = $(this).data("id")
    $.ajax({
        url: http + "/equipmenthouse/findById.do",
        type: "get",
        dataType: "json",
        data: {
            equipmenthouseId: equipmenthouseId,
            token: token
        },
        success: function (res) {
            $(".ensure").click(function () {
                if ($("#smallName tr").hasClass("item_tr")) {
                    var equipmentname = $("#smallName .item_tr td:nth-of-type(1)").html()
                    var brand = $("#smallName .item_tr td:nth-of-type(2)").html()
                    var model = $("#smallName .item_tr td:nth-of-type(3)").html()
                    var material = $("#smallName .item_tr td:nth-of-type(4)").html()
                    $("#equipmentname").val(equipmentname)
                    $("#brand").val(brand)
                    $("#model").val(model)
                    $("#material").val(material)
                    $("#manufactor").val(material)
                    $(".smallTable").hide()
                }

            })
        }
    })
})


// 点击取消按钮
$(".cancel").click(function () {
    $(".smallTable").hide()
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
        url: http + "/equipmenthouse/find.do",
        dataType: "json",
        data: {
            equipmentname: smallMaterial,
            page: currentPage,
            size: currentSize,
            token: token
        },
        success: function (res) {
            var html = template("smallTel", {
                "rows": res.rows
            });
            $("#smallName").html(html)
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

$("#pledgeTable").delegate(".draw", "click", function () {
    $(".mengban_over").show()
    $(".add_draw").show()
    $(".draw_add").css("display", "inline-block");
    $(".preserve_emit").css("display", "none");
    pledgeId=$(this).data("id") 
  })

  // 上传图片
  $(".draw_add").click(function(){
    var formData = new FormData();
    formData.append("file",$("#input-1").get(0).files[0]);
    formData.append("token",token);
    formData.append("pledgeId",pledgeId);
    $.ajax({
      url: http + "/pledge/uploadimg.do",
      type: "post",
      dataType: "json",
      cache: false,
      processData: false,
      contentType:false,
      data: formData,
      success: function (res) {
          toastr.options.positionClass = 'toast-center-center';
          toastr.options.timeOut = '3000';
          if (res.success == true) {
              toastr.success(res.message);
              var m = 200; // 几秒后跳转 自定义
              var timd =setInterval(function(){
              m--;
              if(m==0){
              clearInterval(timd);
              location.reload()
               }
             })
          } else {
              toastr.error(res.message);
          }
      }
  })

  })

   // 添加数据
   $(".preserve_add").click(function () {
    getData()
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
        if ( equipmentname == "" || brand == "" || model=="" || date == "" || 
             num == "" || money == "" || mechanism == "" || pledgenumber=="") {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            toastr.error("有星号的表单不能有空项");
            return true;
        }
    }

    $.ajax({
        url: http + "/pledge/insert.do",
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
            getpledgeData()
        }
    })
})

function getData() {
  // 获取表单数据
  pledgenumber = $("#pledgenumber").val();
  equipmentname = $("#equipmentname").val();
  brand = $("#brand").val();
  model = $("#model").val();
  material = $("#material").val();
  date = $("#date").val();
  num = $("#num").val();
  money = $("#money").val();
  mechanism = $("#mechanism").val();
  remarks = $("#remarks").val();
  data={
      pledgenumber:pledgenumber,
      equipmentname: equipmentname,
      brand: brand,
      model: model,
      material: material,
      date: date,
      num: num,
      money: money,
      mechanism:mechanism,
      remarks:remarks,
      token:token
  }
}

// 修改数据
$("#pledgeTable").delegate(".emit", "click", function () {
    $("#equipmentname").css("width", "100%")
    $(".button").css("display", "none")
    // 回显表单数据
    pledgeId = $(this).data("id");
    $.ajax({
        url: http + "/pledge/findById.do",
        type: "post",
        dataType: "json",
        data: {
          pledgeId: pledgeId,
          token:token
        },
        success: function (res) {
             // 格式化时间
            res.date = moment(res.date).format('YYYY-MM-DD');
            pledgenumber = $("#pledgenumber").val(res.pledgenumber);
            equipmentname = $("#equipmentname").val(res.equipmentname);
            brand = $("#brand").val(res.brand);
            model = $("#model").val(res.model);
            material = $("#material").val(res.material);
            date = $("#date").val(res.date);
            num = $("#num").val(res.num);
            money = $("#money").val(res.money);
            mechanism = $("#mechanism").val(res.mechanism);
            remarks = $("#remarks").val(res.remarks);
            pic=res.pic;
        }
    })
})

// 获取修改数据
$(".preserve_emit").click(function () {
    getData()
    data.id=pledgeId;
    data.pic=pic;
    $.ajax({
      url: http + "/pledge/update.do",
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
        getpledgeData()
      }
    });
  })

  // 删除数据
  $("#pledgeTable").delegate(".pledge_del", "click", function () {
    var pledgeId = $(this).data("id");
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
        url: http + "/pledge/delete.do",
        type: "post",
        dataType: "json",
        data: {
          "pledgeId": pledgeId,
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
          getpledgeData()
        }
      })
    });
  });

  $(".btn_found").click(function () {
    var equipmentname = $("#Name").val()
    // 数据为空时不能查询
    if (equipmentname == "") {
        return false;
    }
    $.ajax({
        type: "get",
        url: http + "/pledge/find.do",
        dataType: "json",
        data: {
            equipmentname: equipmentname,
            page: page,
            size: size,
            token:token
        },
        success: function (res) {
            each(res)
            var html = template("pledgeTel", {
            "rows": res.rows
            });
            $("#pledgeTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

 //   图片放大
 $("#pledgeTable").delegate(".images>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })

})

$("#pledgeTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
  })

})
$(function(){
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var buychickenId = 0;
    var pic;
    var type=$("#type").val()
    getchickData();
    function each(res){
        $.each(res.rows, function (i) {
            var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
            res.rows[i].date = dataTime;
            res.rows[i].payable= moneyFormat(res.rows[i].payable)
            res.rows[i].payamount= moneyFormat(res.rows[i].payamount)
            res.rows[i].amountowed= moneyFormat(res.rows[i].amountowed)
        })
    }
    // 渲染数据
    function getchickData() {
    $.ajax({
        url: http + "/buychicken/findAll.do",
        type: "get",
        dataType: "json",
        data: {
        page: page,
        size: size,
        type:type,
        token:token
        },
        success: function (res) {
           each(res)
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("eggChickTel", {
            "rows": res.rows
        });
        $("#eggChickTable").html(html);
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
    getchickData();
    });
    
      $(".header_right").click(function () {
        payable = $("#payable").val("0.00");
        amountowed = $("#amountowed").val("0.00");
      })

      $("#eggChickTable").delegate(".draw", "click", function () {
        $(".mengban_over").show()
        $(".add_draw").show()
        $(".draw_add").css("display", "inline-block");
        $(".preserve_emit").css("display", "none");
        buychickenId=$(this).data("id") 
      })
    
      // 上传图片
      $(".draw_add").click(function(){
        var formData = new FormData();
        formData.append("file",$("#input-1").get(0).files[0]);
        formData.append("token",token);
        formData.append("buychickenId",buychickenId);
        $.ajax({
          url: http + "/buychicken/uploadimg.do",
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
        for (var i = 0; i < document.newUser.elements.length - 1; i++) {
          if ($("#buynumber").val() == "" || $("#date").val() == "" || $("#varieties").val() == "" || $("#num").val() == "" 
          || $("#price").val() == "" || $("#payable").val() == "" || $("#payamount").val() == "" || $("#amountowed").val() == "") {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            toastr.error("有星号的表单不能有空项");
            return true;
          }
        }
        getData()
        $.ajax({
          url: http + "/buychicken/insert.do",
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
            getchickData()
          }
        })
      })
    
      function getData() {
        // 获取表单数据
        buynumber = $("#buynumber").val();
        date = $("#date").val();
        varieties = $("#varieties").val();
        num = $("#num").val();
        price = $("#price").val();
        payable = $("#payable").val();
        payamount = $("#payamount").val();
        amountowed = $("#amountowed").val();
        supplier = $("#supplier").val();
        remark = $("#remark").val();
        data={
            buynumber:buynumber,
            date:date,
            varieties:varieties,
            num:num,
            price:price,
            payable:payable,
            payamount:payamount,
            amountowed:amountowed,
            supplier:supplier,
            remark:remark,
            type:type,
            token:token
        }
      }
      // 修改数据
     $("#eggChickTable").delegate(".emit", "click", function () {
        // 回显表单数据
        buychickenId = $(this).data("id");
        $.ajax({
            url: http + "/buychicken/findById.do",
            type: "post",
            dataType: "json",
            data: {
                buychickenId: buychickenId,
                token:token
            },
            success: function (res) {
                // 格式化时间
                res.date = moment(res.date).format('YYYY-MM-DD');
                $("#buynumber").val(res.buynumber);
                $("#date").val(res.date);
                $("#varieties").val(res.varieties);
                $("#num").val(res.num);
                $("#price").val(res.price);
                $("#payable").val(res.payable);
                $("#payamount").val(res.payamount);
                $("#amountowed").val(res.amountowed)
                $("#supplier").val(res.supplier)
                $("#remark").val(res.remark);
                pic=res.pic;
            }
        })
    })
    
    
    // 获取修改数据
    $(".preserve_emit").click(function () {
         getData()
        data.id=buychickenId;
        data.pic=pic;
        $.ajax({
            url: http + "/buychicken/update.do",
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
                getchickData()
            }
        });
    })
    
     // 删除数据
     $("#eggChickTable").delegate(".chick_del", "click", function () {
        var buychickenId = $(this).data("id");
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
                url: http + "/buychicken/delete.do",
                type: "post",
                dataType: "json",
                data: {
                    "buychickenId": buychickenId,
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
                    getchickData()
                }
            })
        });
    });
    
    // 关键字查询
    $(".buttonDate").click(function () {
        var beforeDate = $("#beforeDate").val()
        var afterDate = $("#afterDate").val()
        if(beforeDate == "" && afterDate == ""){
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
            url: http + "/buychicken/findByDate.do",
            dataType: "json",
            data: {
                beforeDate: beforeDate,
                afterDate: afterDate,
                type:type,
                page: page,
                size: size,
                token:token
            },
            success: function (res) {
                // 转换时间
                each(res)
                var html = template("eggChickTel", {
                    "rows": res.rows
                  });
                 $("#eggChickTable").html(html);
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })
    
    $(".btn_found").click(function () {
        var varieties = $("#varietiesKind").val()
        // 数据为空时不能查询
        if (varieties == "") {
          return false;
        }
        $.ajax({
          type: "get",
          url: http + "/buychicken/find.do",
          dataType: "json",
          data: {
            varieties:varieties,
            type:type,
            page: page,
            size: size,
            token:token
          },
          success: function (res) {
            each(res)
            var html = template("eggChickTel", {
                "rows": res.rows
              });
             $("#eggChickTable").html(html);
            if (res.total < 1) {
              $(".data_num").css("display", "table-row")
            }
          }
        })
      })
      
    // 点击进入入库明细
    $("#eggChickTable").delegate(".distribution", "click", function () {
        var buychickenId = $(this).data("id")
        // 品种
        $.ajax({
            url: http + "/buychicken/findById.do",
            type: "post",
            async: false,
            dataType: "json",
            data: {
                buychickenId: buychickenId,
                token:token
            },
            success: function (res) {
              varieties= res.varieties;
            }
        })
       
        localStorage.setItem("varieties", varieties)
        localStorage.setItem("buychickenId", buychickenId);
        localStorage.setItem("type",type)
        location.href = "distribution.html"
    })

//   图片放大
$("#eggChickTable").delegate(".images>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})

$("#eggChickTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
})

})
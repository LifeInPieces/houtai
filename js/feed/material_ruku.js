$(function () {
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var buyfodderId = 0;
    var receiptimg;
    getMaterialData();
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
    function getMaterialData() {
        $.ajax({
            url: http + "/buyfodder/findAll.do",
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
                var html = template("materialRukuTel", {
                    "rows": res.rows
                });
                $("#materialTable").html(html);
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
        getMaterialData();
    });

    $("#materialTable").delegate(".draw", "click", function () {
        $(".mengban_over").show()
        $(".add_draw").show()
        $(".draw_add").css("display", "inline-block");
        $(".preserve_emit").css("display", "none");
        buyfodderId=$(this).data("id") 
      })
    
      // 上传图片
      $(".draw_add").click(function(){
        var formData = new FormData();
        formData.append("file",$("#input-1").get(0).files[0]);
        formData.append("token",token);
        formData.append("buyfodderId",buyfodderId);
        $.ajax({
          url: http + "/buyfodder/uploadimg.do",
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

    // 点击新增按钮给计量单位赋值
    $(".header_right").click(function () {
        payable = $("#payable").val("0.00");
        amountowed = $("#amountowed").val("0.00")
    })

    function getData() {
        // 获取表单数据
         listnumber = $("#listnumber").val();
         date = $("#date").val();
         agent = $("#agent").val();
         buycompany = $("#buycompany").val();
         payamount = $("#payamount").val();
         remarks = $("#remarks").val();
         payable = $("#payable").val()
         amountowed = $("#amountowed").val()
         data = {
            listnumber: listnumber,
            date: date,
            agent: agent,
            buycompany: buycompany,
            payamount: payamount,
            payable: payable,
            amountowed: amountowed,
            remarks: remarks,
            token:token
        }
      }

    // 添加
    $(".preserve_add").click(function () {
        getData()
        for (var i = 0; i < document.newUser.elements.length - 1; i++) {
            if ( listnumber == "" || agent == "" || date=="" || payamount == ""
                  || payable=="" || amountowed=="" || buycompany=="") {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                toastr.error("有星号的表单不能有空项");
                return true;
            }
        }
        $.ajax({
            url: http + "/buyfodder/insert.do",
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
                getMaterialData()
            }
        })
    })

    // 修改数据
    $("#materialTable").delegate(".emit", "click", function () {
        // 回显表单数据
        buyfodderId = $(this).data("id");
        $.ajax({
            url: http + "/buyfodder/findById.do",
            type: "post",
            dataType: "json",
            data: {
                buyfodderId: buyfodderId,
                token:token
            },
            success: function (res) {
                // 格式化时间
                res.date = moment(res.date).format('YYYY-MM-DD');
                $("#listnumber").val(res.listnumber);
                $("#date").val(res.date);
                $("#agent").val(res.agent);
                $("#buycompany").val(res.buycompany);
                $("#payamount").val(res.payamount);
                $("#payable").val(res.payable);
                $("#amountowed").val(res.amountowed)
                $("#remarks").val(res.remarks);
                receiptimg=res.receiptimg;
            }
        })
    })

    // 获取修改数据
    $(".preserve_emit").click(function () {
        getData()
        data.id=buyfodderId;
        data.receiptimg=receiptimg;
        $.ajax({
            url: http + "/buyfodder/update.do",
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
                getMaterialData()
            }
        });
    })
    // 删除数据
    $("#materialTable").delegate(".material_del", "click", function () {
        var buyfodderId = $(this).data("id");
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
                url: http + "/buyfodder/delete.do",
                type: "post",
                dataType: "json",
                data: {
                    "buyfodderId": buyfodderId,
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
                    getMaterialData()
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
            url: http + "/buyfodder/findByDate.do",
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
                var html = template("materialRukuTel", {
                    "rows": res.rows
                });
                $("#materialTable").html(html);
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })
    $(".btn_found").click(function () {
        var agent = $("#agentHeader").val()
      
        // 数据为空时不能查询
        if (agent == "") {
            return false;
        }
        $.ajax({
            type: "get",
            url: http + "/buyfodder/find.do",
            dataType: "json",
            data: {
                agent: agent,
                page: page,
                size: size,
                token:token
            },
            success: function (res) {
                // 转换时间
                each(res)
                var html = template("materialRukuTel", {
                    "rows": res.rows
                });
                $("#materialTable").html(html);
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })

    // 点击进入入库明细
    $("#materialTable").delegate(".details", "click", function () {
        var buyfodderId = $(this).data("id")
        localStorage.setItem("buyfodderId", buyfodderId);
        location.href = "details.html"
    })

//   图片放大
$("#materialTable").delegate(".images>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})

$("#materialTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
})

})
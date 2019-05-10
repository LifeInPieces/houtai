$(function () {
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var equipmentoutId=0;
    var pic;
    // 转换时间
    function each(res) {
        $.each(res.rows, function (i) {
            var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
            res.rows[i].date = dataTime;
            res.rows[i].outmoney = moneyFormat(res.rows[i].outmoney)
        })
    }
    getoutlineData();
    // 渲染数据
    function getoutlineData() {
        $.ajax({
            url: http + "/equipmentout/findAll.do",
            type: "get",
            dataType: "json",
            data: {
                page: page,
                size: size,
                token: token
            },
            success: function (res) {
                // 转换时间
                each(res)
                // 分页页数
                pageCount = Math.ceil(res.total / size);
                var html = template("outlineTel", {
                    "rows": res.rows
                });
                $("#outlineTable").html(html);
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
        getoutlineData();
    });

    $("#outlineTable").delegate(".draw", "click", function () {
        $(".mengban_over").show()
        $(".add_draw").show()
        equipmentoutId=$(this).data("id") 
      })
    
      // 上传图片
      $(".draw_add").click(function(){
        var formData = new FormData();
        formData.append("file",$("#input-1").get(0).files[0]);
        formData.append("token",token);
        formData.append("equipmentoutId",equipmentoutId);
        $.ajax({
          url: http + "/equipmentout/uploadimg.do",
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
                        var manufactor = $("#smallName .item_tr td:nth-of-type(5)").html()
                        $("#equipmentname").val(equipmentname)
                        $("#brand").val(brand)
                        $("#model").val(model)
                        $("#material").val(material)
                        $("#manufactor").val(manufactor)
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

    function getData() {
        // 获取表单数据
        outnumber = $("#outnumber").val();
        equipmentname = $("#equipmentname").val();
        brand = $("#brand").val();
        model = $("#model").val();
        material = $("#material").val();
        date = $("#date").val();
        outtype = $("#outtype").val();
        outnum = $("#outnum").val();
        outmoney = $("#outmoney").val();
        operator = $("#operator").val();
        manufactor = $("#manufactor").val();
        remark = $("#remark").val();
        data = {
            outnumber: outnumber,
            equipmentname: equipmentname,
            brand: brand,
            model: model,
            material: material,
            date: date,
            outtype: outtype,
            outnum: outnum,
            outmoney: outmoney,
            operator: operator,
            manufactor: manufactor,
            remark: remark,
            token: token
        }
    }

    // 添加数据
    $(".preserve_add").click(function () {
        getData()
        for (var i = 0; i < document.newUser.elements.length - 1; i++) {
            if (outnumber == "" || equipmentname == "" || brand == "" ||
                model == "" || date == "" || outtype == "" || outmoney == "") {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                toastr.error("有星号的表单不能有空项");
                return true;
            }
        }
        $.ajax({
            url: http + "/equipmentout/insert.do",
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
                getoutlineData()
            }
        })
    })


    // 修改数据
    $("#outlineTable").delegate(".emit", "click", function () {
        $("#equipmentname").css("width", "100%")
        $(".button").css("display", "none")
        // 回显表单数据
        equipmentoutId = $(this).data("id");
        $.ajax({
            url: http + "/equipmentout/findById.do",
            type: "post",
            dataType: "json",
            data: {
                equipmentoutId: equipmentoutId,
                token: token
            },
            success: function (res) {
                // 格式化时间
                res.date = moment(res.date).format('YYYY-MM-DD');
                outnumber = $("#outnumber").val(res.outnumber);
                equipmentname = $("#equipmentname").val(res.equipmentname);
                brand = $("#brand").val(res.brand);
                model = $("#model").val(res.model);
                material = $("#material").val(res.material);
                date = $("#date").val(res.date);
                outtype = $("#outtype").val(res.outtype);
                outnum = $("#outnum").val(res.outnum);
                outmoney = $("#outmoney").val(res.outmoney);
                operator = $("#operator").val(res.operator);
                manufactor = $("#manufactor").val(res.manufactor);
                remark = $("#remark").val(res.remark);
                pic=res.pic;
            }
        })
    })

    // 获取修改数据
    $(".preserve_emit").click(function () {
        getData()
        data.id = equipmentoutId;
        data.pic=pic;
        $.ajax({
            url: http + "/equipmentout/update.do",
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
                getoutlineData()
            }
        });
    })


    // 删除数据
    $("#outlineTable").delegate(".outline_del", "click", function () {
        var equipmentoutId = $(this).data("id");
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
                url: http + "/equipmentout/delete.do",
                type: "post",
                dataType: "json",
                data: {
                    "equipmentoutId": equipmentoutId,
                    token: token
                },
                success: function (res) {
                    toastr.options.positionClass = 'toast-center-center';
                    toastr.options.timeOut = '3000';
                    if (res.success == true) {
                        toastr.success(res.message);
                    } else {
                        toastr.error(res.message);
                    }
                    getoutlineData()
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
        url: http + "/equipmentout/findByDate.do",
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
            var html = template("outlineTel", {
                "rows": res.rows
            });
            $("#outlineTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

 $(".btn_found").click(function () {
    var equipmentname = $("#henhouseNum").val()
    // 数据为空时不能查询
    if (equipmentname == "") {
      return false;
    }
    $.ajax({
      type: "get",
      url: http + "/equipmentout/find.do",
      dataType: "json",
      data: {
        equipmentname:equipmentname,
        page: page,
        size: size,
        token:token
      },
      success: function (res) {
        // 转换时间
        each(res)
        var html = template("outlineTel", {
            "rows": res.rows
        });
        $("#outlineTable").html(html);
        if (res.total < 1) {
          $(".data_num").css("display", "table-row")
        }
      }
    })
  })

   //   图片放大
   $("#outlineTable").delegate(".images>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})

$("#outlineTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
  })

})
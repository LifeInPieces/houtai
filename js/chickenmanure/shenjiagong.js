$(function () {
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var buyfodderId = 0;
    getshenjiagongData();
    // 渲染数据
    function getshenjiagongData() {
        $.ajax({
            url: http + "/chickenmanureprocessing/findAll.do",
            type: "get",
            dataType: "json",
            data: {
                page: page,
                size: size,
                token:token
            },
            success: function (res) {
                // 分页页数
                $.each(res.rows, function (i) {
                    var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                    res.rows[i].date = dataTime;
                    res.rows[i].money= moneyFormat(res.rows[i].money)
                })
                pageCount = Math.ceil(res.total / size);
                var html = template("shenjiagongTel", {
                    "rows": res.rows
                });
                $("#shenjiagongTable").html(html);
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
        getshenjiagongData();
    });

    $("#shenjiagongTable").delegate(".draw", "click", function () {
        $(".mengban_over").show()
        $(".add_draw").show()
        $(".draw_add").css("display", "inline-block");
        $(".preserve_emit").css("display", "none");
        chickenmanureprocessingId=$(this).data("id") 
      })
    
      // 上传图片
      $(".draw_add").click(function(){
        var formData = new FormData();
        formData.append("file",$("#input-1").get(0).files[0]);
        formData.append("token",token);
        formData.append("chickenmanureprocessingId",chickenmanureprocessingId);
        $.ajax({
          url: http + "/chickenmanureprocessing/uploadimg.do",
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
        unit = $("#unit").val("kg");
        money = $("#money").val("0.00")
    })

    function getData() {
        // 获取表单数据
         number = $("#number").val();
         type = $("#type").val();
         date = $("#date").val();
         person = $("#person").val();
         processingnum = $("#processingnum").val();
         unit = $("#unit").val();
         money = $("#money").val()
         remark = $("#remark").val()
         data = {
            number: number,
            type: type,
            date: date,
            person: person,
            processingnum: processingnum,
            unit: unit,
            money: money,
            remark: remark,
            token:token
        }
      }

    // 添加
    $(".preserve_add").click(function () {
        getData()
        for (var i = 0; i < document.newUser.elements.length - 1; i++) {
            if ( number == "" || type == "" || date=="" || person == ""
                  || processingnum=="" || unit=="" || money=="") {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                toastr.error("有星号的表单不能有空项");
                return true;
            }
        }
        $.ajax({
            url: http + "/chickenmanureprocessing/insert.do",
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
                getshenjiagongData()
            }
        })
    })

    // 修改数据
    $("#shenjiagongTable").delegate(".emit", "click", function () {
        // 回显表单数据
        chickenmanureprocessingId = $(this).data("id");
        $.ajax({
            url: http + "/chickenmanureprocessing/findById.do",
            type: "post",
            dataType: "json",
            data: {
                chickenmanureprocessingId: chickenmanureprocessingId,
                token:token
            },
            success: function (res) {
                // 格式化时间
                res.date = moment(res.date).format('YYYY-MM-DD');
                $("#number").val(res.number);
                $("#type").val(res.type);
                $("#date").val(res.date);
                $("#person").val(res.person);
                $("#processingnum").val(res.processingnum);
                $("#unit").val(res.unit);
                $("#money").val(res.money)
                $("#remark").val(res.remark);
                pic=res.pic;
            }
        })
    })

    // 获取修改数据
    $(".preserve_emit").click(function () {
        getData()
        data.id=chickenmanureprocessingId;
        data.pic=pic;
        $.ajax({
            url: http + "/chickenmanureprocessing/update.do",
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
                getshenjiagongData()
            }
        });
    })
    // 删除数据
    $("#shenjiagongTable").delegate(".shenjiagong_del", "click", function () {
        var chickenmanureprocessingId = $(this).data("id");
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
                url: http + "/chickenmanureprocessing/delete.do",
                type: "post",
                dataType: "json",
                data: {
                    "chickenmanureprocessingId": chickenmanureprocessingId,
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
                    getshenjiagongData()
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
            url: http + "/chickenmanureprocessing/findByDate.do",
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
                    res.rows[i].money= moneyFormat(res.rows[i].money)
                })
                var html = template("shenjiagongTel", {
                    "rows": res.rows
                });
                $("#shenjiagongTable").html(html);
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })
    $(".btn_found").click(function () {
        var type = $("#typechick").val()
      
        // 数据为空时不能查询
        if (type == "") {
            return false;
        }
        $.ajax({
            type: "get",
            url: http + "/chickenmanureprocessing/find.do",
            dataType: "json",
            data: {
                type: type,
                page: page,
                size: size,
                token:token
            },
            success: function (res) {
                // 转换时间
                $.each(res.rows, function (i) {
                    var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                    res.rows[i].date = dataTime;
                    res.rows[i].money= moneyFormat(res.rows[i].money)
                })
                var html = template("shenjiagongTel", {
                    "rows": res.rows
                });
                $("#shenjiagongTable").html(html);
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })

// 点击进入入库明细
$("#shenjiagongTable").delegate(".details", "click", function () {
    var chickenmanureprocessingId = $(this).data("id")
    localStorage.setItem("chickenmanureprocessingId", chickenmanureprocessingId);
    location.href = "shenjiagongdetails.html"
})

//   图片放大
$("#shenjiagongTable").delegate(".images>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})

$("#shenjiagongTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
})

})
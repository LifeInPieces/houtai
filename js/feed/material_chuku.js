$(function () {
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var fodderoutId = 0;
    var pic;
    getOutData();
    // 渲染数据
    function getOutData() {
        $.ajax({
            url: http + "/fodderout/findAll.do",
            type: "get",
            dataType: "json",
            data: {
                page: page,
                size: size,
                token:token
            },
            success: function (res) {
                $.each(res.rows, function (i) {
                    var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                    res.rows[i].date = dataTime;
                })
                // 分页页数
                pageCount = Math.ceil(res.total / size);
                var html = template("outTel", {
                    "rows": res.rows
                });
                $("#outTable").html(html);
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
        getOutData();
    });

    $("#outTable").delegate(".draw", "click", function () {
        $(".mengban_over").show()
        $(".add_draw").show()
        $(".draw_add").css("display", "inline-block");
        $(".preserve_emit").css("display", "none");
        fodderoutId=$(this).data("id") 
      })
    
      // 上传图片
      $(".draw_add").click(function(){
        var formData = new FormData();
        formData.append("file",$("#input-1").get(0).files[0]);
        formData.append("token",token);
        formData.append("fodderoutId",fodderoutId);
        $.ajax({
          url: http + "/fodderout/uploadimg.do",
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

    function getData() {
        // 获取表单数据
         outnumber = $("#outnumber").val();
         date = $("#date").val();
         person = $("#person").val();
         purpose = $("#purpose").val();
         remark = $("#remark").val();
         data = {
            outnumber: outnumber,
            date: date,
            person: person,
            purpose: purpose,
            remark: remark,
            token:token
        }
      }

    // 添加
    $(".preserve_add").click(function () {
        for (var i = 0; i < document.newUser.elements.length - 1; i++) {
            if ($("#outnumber").val() == "" || $("#date").val() == "" || $("#person").val() == "") {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                toastr.error("有星号的表单不能有空项");
                return true;
            }
        }
        getData()
        $.ajax({
            url: http + "/fodderout/insert.do",
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
                getOutData()
            }
        })
    })

    // 修改数据
    $("#outTable").delegate(".emit", "click", function () {
        // 回显表单数据
        fodderoutId = $(this).data("id");
        $.ajax({
            url: http + "/fodderout/findById.do",
            type: "post",
            dataType: "json",
            data: {
                fodderoutId: fodderoutId,
                token:token
            },
            success: function (res) {
                // 格式化时间
                res.date = moment(res.date).format('YYYY-MM-DD');
                $("#outnumber").val(res.outnumber);
                $("#date").val(res.date);
                $("#person").val(res.person);
                $("#purpose").val(res.purpose);
                $("#remark").val(res.remark);
                pic=res.pic;
            }
        })
    })

    // 获取修改数据
    $(".preserve_emit").click(function () {
        getData()
        data.id=fodderoutId;
        data.pic=pic;
        $.ajax({
            url: http + "/fodderout/update.do",
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
                getOutData()
            }
        });
    })


    // 删除数据
    $("#outTable").delegate(".material_del", "click", function () {
        var fodderoutId = $(this).data("id");
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
                url: http + "/fodderout/delete.do",
                type: "post",
                dataType: "json",
                data: {
                    "fodderoutId": fodderoutId,
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
                    getOutData()
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
            url: http + "/fodderout/findByDate.do",
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
                })
                var html = template("outTel", {
                    "rows": res.rows
                });
                $("#outTable").html(html);
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })
    $(".btn_found").click(function () {
        var person = $("#personHeader").val()
        // 数据为空时不能查询
        if (personHeader == "") {
            return false;
        }
        $.ajax({
            type: "get",
            url: http + "/fodderout/find.do",
            dataType: "json",
            data: {
                person: person,
                page: page,
                size: size,
                token:token
            },
            success: function (res) {
                // 转换时间
                $.each(res.rows, function (i) {
                    var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                    res.rows[i].date = dataTime;
                })
                var html = template("outTel", {
                    "rows": res.rows
                });
                $("#outTable").html(html);
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })

    // 点击进入出库明细
    $("#outTable").delegate(".details", "click", function () {
        var fodderoutId = $(this).data("id")
        localStorage.setItem("fodderoutId", fodderoutId);
        location.href = "outline_details.html"
    })

//   图片放大
$("#outTable").delegate(".images>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})

$("#outTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
})

})
$(function(){
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    getdeathData();
    // 渲染数据
    function getdeathData() {
      $.ajax({
        url: http + "/chickendeathhandle/findAll.do",
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
          var html = template("deathTel", {
            "rows": res.rows
          });
          $("#deathTable").html(html);
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
      getdeathData();
    });

    $("#deathTable").delegate(".draw", "click", function () {
        $(".mengban_over").show()
        $(".add_draw").show()
        chickendeathhandleId=$(this).data("id") 
      })
    
      // 上传图片
      $(".draw_add").click(function(){
        var formData = new FormData();
        formData.append("file",$("#input-1").get(0).files[0]);
        formData.append("token",token);
        formData.append("chickendeathhandleId",chickendeathhandleId);
        $.ajax({
          url: http + "/chickendeathhandle/uploadimg.do",
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
        number = $("#number").val();
        date = $("#date").val();
        num = $("#num").val();
        type = $("#type").val();
        money = $("#money").val();
        person = $("#person").val();
        remark = $("#remark").val();
        data = {
            number: number,
            date: date,
            num: num,
            type: type,
            money: money,
            person: person,
            remark: remark,
            token: token
        }
    }

    // 添加数据
    $(".preserve_add").click(function () {
        getData()
        for (var i = 0; i < document.newUser.elements.length - 1; i++) {
            if ( number == "" || date == "" || num == "" || type == "" || money == "" || person == "") {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                toastr.error("有星号的表单不能有空项");
                return true;
            }
        }
        $.ajax({
            url: http + "/chickendeathhandle/insert.do",
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
                getdeathData()
            }
        })
    })


    // 修改数据
    $("#deathTable").delegate(".emit", "click", function () {
        // 回显表单数据
        chickendeathhandleId = $(this).data("id");
        $.ajax({
            url: http + "/chickendeathhandle/findById.do",
            type: "post",
            dataType: "json",
            data: {
                chickendeathhandleId: chickendeathhandleId,
                token: token
            },
            success: function (res) {
                // 格式化时间
                res.date = moment(res.date).format('YYYY-MM-DD');
                number = $("#number").val(res.number);
                date = $("#date").val(res.date);
                num = $("#num").val(res.num);
                type = $("#type").val(res.type);
                money = $("#money").val(res.money);
                person = $("#person").val(res.person);
                remark = $("#remark").val(res.remark);
                pic=res.pic;
            }
        })
    })

    // 获取修改数据
    $(".preserve_emit").click(function () {
        getData()
        data.id = chickendeathhandleId;
        data.pic=pic;
        $.ajax({
            url: http + "/chickendeathhandle/update.do",
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
                getdeathData()
            }
        });
    })


    // 删除数据
    $("#deathTable").delegate(".death_del", "click", function () {
        var chickendeathhandleId = $(this).data("id");
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
                url: http + "/chickendeathhandle/delete.do",
                type: "post",
                dataType: "json",
                data: {
                     chickendeathhandleId: chickendeathhandleId,
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
                    getdeathData()
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
        url: http + "/chickendeathhandle/findByDate.do",
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
            var html = template("deathTel", {
                "rows": res.rows
              });
              $("#deathTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

//   图片放大
$("#deathTable").delegate(".images>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})

$("#deathTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
  })

})
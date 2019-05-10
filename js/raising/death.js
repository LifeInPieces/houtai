$(function(){
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var chickenstockId = 0;
    var chickendeathId=0;
    getdeathData();
    // 渲染数据
    function getdeathData() {
        chickenstockId = localStorage.getItem("chickenstockId")
        $.ajax({
            url: http + "/chickendeath/findAll.do",
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
                    var dataTime = moment(res.rows[i].deathdate).format('YYYY-MM-DD');
                    res.rows[i].deathdate = dataTime;
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

    // 添加数据
   $(".preserve_add").click(function () {
    for (var i = 0; i < document.newUser.elements.length - 1; i++) {
        if ($("#deathdate").val() == "" || $("#deathnum").val() == "" || $("#cause").val() == "") {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            toastr.error("有星号的表单不能有空项");
            return true;
        }
    }
    getData()
    $.ajax({
        url: http + "/chickendeath/insert.do",
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
            getdeathData()
        }
    })
})

function getData() {
    // 获取表单数据
    deathdate = $("#deathdate").val();
    deathnum = $("#deathnum").val();
    cause = $("#cause").val();
    remarks = $("#remarks").val();
    data={
        deathdate: deathdate,
        deathnum: deathnum,
        cause: cause,
        remarks: remarks,
        chickenstockId:chickenstockId,
        token:token
    }
  }

  $("#deathnum").attr({maxlength:"11"});
   // 修改数据
   $("#deathTable").delegate(".emit", "click", function () {
    // 回显表单数据
    chickendeathId = $(this).data("id");
    $.ajax({
        url: http + "/chickendeath/findById.do",
        type: "post",
        dataType: "json",
        data: {
            chickendeathId: chickendeathId,
            token:token
        },
        success: function (res) {
            // 格式化时间
            res.deathdate = moment(res.deathdate).format('YYYY-MM-DD');
            $("#deathdate").val(res.deathdate);
            $("#deathnum").val(res.deathnum);
            $("#cause").val(res.cause);
            $("#remarks").val(res.remarks)
        }
    })
})
// 获取修改数据
$(".preserve_emit").click(function () {
    getData() 
    data.id=chickendeathId
    $.ajax({
        url: http + "/chickendeath/update.do",
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
            getdeathData()
        }
    });
})
  
  // 删除数据
  $("#deathTable").delegate(".death_del", "click", function () {
    var chickendeathId = $(this).data("id");
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
            url: http + "/chickendeath/delete.do",
            type: "post",
            dataType: "json",
            data: {
                "chickendeathId": chickendeathId,
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
                getdeathData()
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
        url: http + "/chickendeath/findByDate.do",
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
                var dataTime = moment(res.rows[i].deathdate).format('YYYY-MM-DD');
                res.rows[i].deathdate = dataTime;
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

})
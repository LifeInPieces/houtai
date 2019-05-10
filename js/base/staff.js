$(function () {
    // 动态渲染数据的根路径
   http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var employeeId = 0;
    staff()

    function staff() {
        $.ajax({
            type: "get",
            url: http + "/employee/findAll.do",
            dataType: "json",
            data: {
                page: page,
                size: size,
                token:token
            },
            success: function (res) {
                // 分页页数
                pageCount = Math.ceil(res.total / size);
                // 转换时间
                $.each(res.rows, function (i) {
                    var dataTime = moment(res.rows[i].createtime).format('YYYY-MM-DD');
                    res.rows[i].createtime = dataTime;
                })
                var html = template("staffTel", {
                    "rows": res.rows
                })
                $("#staff_table").html(html)
                makePageButton(page, pageCount)
            }
        })

        //   初始化头部用户昵称
        usernme()

    }
    makePageButton(page, pageCount)
    // 点击分页按钮
    $(".pagination").on("click", ".item", function () {
        page = parseInt($(this).attr("data-page"));
        staff()
    });

    function getData() {
        // 获取表单数据
         employeenum = $("#employeenum").val();
         name = $("#name").val();
         sex = $("#sex").val();
         job = $("#job").val();
         phone = $("#phone").val();
         createtime = $("#createtime").val();
         incumbency = $("#incumbency").val();
         remark = $("#remark").val();
         data = {
            employeenum: employeenum,
            name: name,
            sex: sex,
            phone: phone,
            job: job,
            createtime: createtime,
            incumbency: incumbency,
            remark: remark,
            token:token
        }
      }

    // 添加
    $(".preserve_add").click(function () {
        for (var i = 0; i < document.newUser.elements.length - 1; i++) {
            if ($("#phone").val() == "" || $("#name").val() == "" || $("#job").val() == "" || $("#incumbency").val() == "") {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                toastr.error("有星号的表单不能有空项");
                return true;
            }
        }
        getData()
        $.ajax({
            url: http + "/employee/insert.do",
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
                staff()
            }
        })
    })

    // 修改数据
    $("#staff_table").delegate(".emit", "click", function () {
        // 回显表单数据
        employeeId = $(this).data("id");
        $.ajax({
            url: http + "/employee/findById.do",
            type: "post",
            dataType: "json",
            data: {
                employeeId: employeeId,
                token:token
            },
            success: function (res) {
                // 格式化时间
                res.createtime = moment(res.createtime).format('YYYY-MM-DD');
                $("#employeenum").val(res.employeenum);
                $("#name").val(res.name);
                $("#sex").val(res.sex);
                $("#phone").val(res.phone);
                $("#job").val(res.job);
                $("#createtime").val(res.createtime);
                $("#incumbency").val(res.incumbency);
                $("#remark").val(res.remark);
            }
        })
    })


    // 获取修改数据
    $(".preserve_emit").click(function () {
        getData()
        data.id=employeeId
        $.ajax({
            url: http + "/employee/update.do",
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
                staff()
            }
        });
    })

    // 删除数据
    $("#staff_table").delegate(".staff_del", "click", function () {
        var employeeId = $(this).data("id");
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
                url: http + "/employee/delete.do",
                type: "post",
                dataType: "json",
                data: {
                    "employeeId": employeeId,
                     token:token
                },
                success: function (res) {
                    toastr.options.positionClass = 'toast-center-center';
                    toastr.options.timeOut = '3000';
                    if(res.success==true){
                        toastr.success(res.message);
                    }else{
                        toastr.error(res.message);
                    }
                    staff()
                }
            })
        });
    });
    // 关键字查询
    $(".btn_found").click(function () {
        var userName = $("#userName").val()
        var job = $("#staff").val()
        // 数据为空时不能查询
        if (userName == "" && staff == "") {
            return false;
        }
        $.ajax({
            type: "get",
            url: http + "/employee/find.do",
            dataType: "json",
            data: {
                job: job,
                name: userName,
                page: page,
                size: size,
                token:token
            },
            success: function (res) {
                // 转换时间
                $.each(res.rows, function (i) {
                    var dataTime = moment(res.rows[i].createtime).format('YYYY-MM-DD');
                    res.rows[i].createtime = dataTime;
                })
                var html = template("staffTel", {
                    "rows": res.rows
                })
                $("#staff_table").html(html)
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })
})
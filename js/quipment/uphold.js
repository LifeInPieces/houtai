$(function () {
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var upholdId = 0;
    getupholdData();
    // 渲染数据
    function getupholdData() {
        $.ajax({
            url: http + "/equipmentmaintenance/findAll.do",
            type: "get",
            dataType: "json",
            data: {
                page: page,
                size: size,
                token: token
            },
            success: function (res) {
                $.each(res.rows, function (i) {
                    var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                    res.rows[i].date = dataTime;
                })
                // 分页页数
                pageCount = Math.ceil(res.total / size);
                var html = template("quipmentTel", {
                    "rows": res.rows
                });
                $("#quipmentTable").html(html);
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
        getupholdData();
    });

    // 添加数据
    $(".preserve_add").click(function () {
        for (var i = 0; i < document.newUser.elements.length - 1; i++) {
            if ($("#maintenancename").val() == "" || $("#date").val() == "" || $("#equipmentname").val() == "" || $("#brand").val() == "" ||
                $("#model").val() == "" || $("#operator").val() == "" || $("#statues").val() == "") {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                toastr.error("有星号的表单不能有空项");
                return true;
            }
        }
        getData()
        $.ajax({
            url: http + "/equipmentmaintenance/insert.do",
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
                getupholdData()
            }
        })
    })

    function getData() {
        // 获取表单数据
        maintenancename = $("#maintenancename").val();
        date = $("#date").val();
        equipmentname = $("#equipmentname").val();
        brand = $("#brand").val();
        model = $("#model").val();
        operator = $("#operator").val();
        statues = $("#statues").val();
        remarks = $("#remarks").val();
        data = {
            maintenancename: maintenancename,
            date: date,
            equipmentname: equipmentname,
            brand: brand,
            model: model,
            operator: operator,
            statues: statues,
            remarks: remarks,
            token: token
        }
    }

    // 修改数据
    $("#quipmentTable").delegate(".emit", "click", function () {
        // 回显表单数据
        upholdId = $(this).data("id");
        $.ajax({
            url: http + "/equipmentmaintenance/findById.do",
            type: "post",
            dataType: "json",
            data: {
                equipmentmaintenanceId: upholdId,
                token: token
            },
            success: function (res) {
                // 格式化时间
                res.date = moment(res.date).format('YYYY-MM-DD');
                maintenancename = $("#maintenancename").val(res.maintenancename);
                date = $("#date").val(res.date);
                equipmentname = $("#equipmentname").val(res.equipmentname);
                brand = $("#brand").val(res.brand);
                model = $("#model").val(res.model);
                operator = $("#operator").val(res.operator);
                statues = $("#statues").val(res.statues);
                remarks = $("#remarks").val(res.remarks);
            }
        })
    })

    // 获取修改数据
    $(".preserve_emit").click(function () {
        getData()
        data.id = upholdId
        $.ajax({
            url: http + "/equipmentmaintenance/update.do",
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
                getupholdData()
            }
        });
    })

    // 删除数据
    $("#quipmentTable").delegate(".uphold_del", "click", function () {
        var equipmentmaintenanceId = $(this).data("id");
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
                url: http + "/equipmentmaintenance/delete.do",
                type: "post",
                dataType: "json",
                data: {
                    "equipmentmaintenanceId": equipmentmaintenanceId,
                    "token": token
                },
                success: function (res) {
                    toastr.options.positionClass = 'toast-center-center';
                    toastr.options.timeOut = '3000';
                    if (res.success == true) {
                        toastr.success(res.message);
                    } else {
                        toastr.error(res.message);
                    }
                    getupholdData()
                }
            })
        });
    });

    // 关键字查询
    $(".btn_found").click(function () {
        var equipmentname = $("#upholdname").val()
        // 数据为空时不能查询
        if (equipmentname == "") {
            return false;
        }

        $.ajax({
            type: "get",
            url: http + "/equipmentmaintenance/find.do",
            dataType: "json",
            data: {
                equipmentname: equipmentname,
                page: page,
                size: size,
                token: token
            },
            success: function (res) {
                // 转换时间
                $.each(res.rows, function (i) {
                    var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                    res.rows[i].date = dataTime;
                })
                var html = template("quipmentTel", {
                    "rows": res.rows
                });
                $("#quipmentTable").html(html);
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })

})
$(function () {
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var goodsoutdetailsId = 0
    var goodsoutId = 0;
    var unit;
    getOutlineData();
    // 渲染数据
    function getOutlineData() {
        goodsoutId = localStorage.getItem("goodsoutId")
        $.ajax({
            url: http + "/goodsoutdetails/findAll.do",
            type: "get",
            dataType: "json",
            data: {
                page: page,
                size: size,
                goodsoutId: goodsoutId,
                token:token
            },
            success: function (res) {
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
        getOutlineData();
    });

    // 点击新增按钮给计量单位赋值
    $(".header_right").click(function () {
        $(".button").val("辅");
        $("#goodsname").css("width", "95%")
        $(".button").css("display", "block")
    })

    // 获取辅助按钮
    $(".button").click(function () {
        currentPage = 1;
        currentSize = 5;
        $.ajax({
            url: http + "/goodshouse/findAll.do",
            type: "get",
            dataType: "json",
            data: {
                page: currentPage,
                size: currentSize,
                token:token
            },
            success: function (res) {
                var html = template("smallTel", {
                    "res": res
                });
                $("#smallName").html(html)
            }
        })
        $(".smallTable").show();
    })
    // 点击取消按钮
    $(".cancel").click(function () {
        $(".smallTable").hide()
    })

    $("#smallName").delegate("tr", "click", function () {
        $(this).addClass("item_tr").siblings().removeClass("item_tr")
        var goodshouseId = $(this).data("id")
        $.ajax({
            url: http + "/goodshouse/findById.do",
            type: "get",
            dataType: "json",
            data: {
                goodshouseId: goodshouseId,
                token:token
            },
            success: function (res) {
                $(".ensure").click(function () {
                    if ($("#smallName tr").hasClass("item_tr")) {
                        var goodsname = $("#smallName .item_tr td:nth-of-type(1)").html()
                        var specification = $("#smallName .item_tr td:nth-of-type(2)").html()
                        var unit = $("#smallName .item_tr td:nth-of-type(3)").html()
                        stock = $("#smallName .item_tr td:nth-of-type(4)").html()
                        $("#goodsname").val(goodsname)
                        $("#specifications").val(specification)
                        $("#unit").val(unit)
                        $(".smallTable").hide()
                    }

                })
            }
        })
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
            url: http + "/goodshouse/find.do",
            dataType: "json",
            data: {
                goodsname: smallMaterial,
                page: currentPage,
                size: currentSize,
                token:token
            },
            success: function (res) {
                var html = template("smallTel", {
                    "res": res
                });
                $("#smallName").html(html)
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })


    // 添加数据
    $(".preserve_add").click(function () {
        for (var i = 0; i < document.newUser.elements.length - 1; i++) {
            if ($("#goodsname").val() == "" || $("#num").val() == "" ||
                $("#unit").val() == "") {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                toastr.error("有星号的表单不能有空项");
                return false;
            }
        }
        getData();
        $.ajax({
            url: http + "/goodsoutdetails/insert.do",
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
                getOutlineData()
            }
        })
    })

    function getData() {
        // 获取表单数据
        goodsname = $("#goodsname").val();
        specifications = $("#specifications").val()
        num = $("#num").val();
        unit = $("#unit").val();
        remark = $("#remark").val()
        data = {
            goodsname: goodsname,
            specifications: specifications,
            num: num,
            unit: unit,
            remark: remark,
            goodsoutId: goodsoutId,
            token:token
        }
    }

    // 修改数据
    $("#outlineTable").delegate(".emit", "click", function () {
        $(".button").css("display", "none")
        $("#goodsname").css("width", "100%")
        // 回显表单数据
        goodsoutdetailsId = $(this).data("id");
        $.ajax({
            url: http + "/goodsoutdetails/findById.do",
            type: "post",
            dataType: "json",
            data: {
                goodsoutdetailsId: goodsoutdetailsId,
                token:token
            },
            success: function (res) {
                $("#goodsname").val(res.goodsname);
                $("#specifications").val(res.specifications);
                $("#num").val(res.num);
                $("#unit").val(res.unit);
                $("#remark").val(res.remark);
            }
        })
    })

    // 获取修改数据
    $(".preserve_emit").click(function () {
        getData()
        data.id=goodsoutdetailsId
        $.ajax({
            url: http + "/goodsoutdetails/update.do",
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
                getOutlineData()
            }
        });
    })

    // 删除数据
    $("#outlineTable").delegate(".outline_del", "click", function () {
        var goodsoutdetailsId = $(this).data("id");
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
                url: http + "/goodsoutdetails/delete.do",
                type: "post",
                dataType: "json",
                data: {
                    "goodsoutdetailsId": goodsoutdetailsId,
                    "goodsoutId": goodsoutId,
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
                    getOutlineData()
                }
            })
        });
    });

})
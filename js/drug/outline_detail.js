$(function(){
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var drugoutdetailsId=0
    var drugoutId = 0;
    var unit;
    getOutlineData();
    // 渲染数据
    function getOutlineData() {
        drugoutId = localStorage.getItem("drugoutId")
        $.ajax({
            url: http + "/drugsoutdetails/findAll.do",
            type: "get",
            dataType: "json",
            data: {
                page: page,
                size: size,
                drugoutId: drugoutId,
                token:token
            },
            success: function (res) {
                // 分页页数
                pageCount = Math.ceil(res.total / size);
                var html = template("drugOutTel", {
                    "rows": res.rows
                });
                $("#drugOutTable").html(html);
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
        $("#duruname").css("width", "95%")
        $(".button").css("display", "block")
    })
      // 获取辅助按钮
      $(".button").click(function () {
        currentPage = 1;
        currentSize = 5;
        $.ajax({
            url: http + "/drugshouse/findAll.do",
            type: "get",
            dataType: "json",
            data: {
                page: currentPage,
                size: currentSize,
                token:token
            },
            success: function (res) {
                console.log(res)
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
        var drugshouseId = $(this).data("id")
        $.ajax({
            url: http + "/drugshouse/findById.do",
            type: "get",
            dataType: "json",
            data: {
                drugshouseId: drugshouseId,
                token:token
            },
            success: function (res) {
                $(".ensure").click(function () {
                    if ($("#smallName tr").hasClass("item_tr")) {
                        var drugsname = $("#smallName .item_tr td:nth-of-type(1)").html()
                        var type = $("#smallName .item_tr td:nth-of-type(2)").html()
                        var specifications = $("#smallName .item_tr td:nth-of-type(3)").html()
                        var unit=$("#smallName .item_tr td:nth-of-type(4)").html()
                        stock = $("#smallName .item_tr td:nth-of-type(5)").html()
                        $("#duruname").val(drugsname)
                        $("#type").val(type)
                        $("#specifications").val(specifications)
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
            url: http + "/drugshouse/find.do",
            dataType: "json",
            data: {
                drugsname: smallMaterial,
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
            if ($("#duruname").val() == "" || $("#type").val() == "" || $("#specifications").val() == "" || $("#unit").val() == "" || $("#num").val() == "") {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                toastr.error("有星号的表单不能有空项");
                return false;
            }
        }
        getData();
        $.ajax({
            url: http + "/drugsoutdetails/insert.do",
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
        duruname = $("#duruname").val();
        type = $("#type").val();
        specifications=$("#specifications").val()
        unit = $("#unit").val();
        num = $("#num").val();
        remark = $("#remark").val()
        data = {
            duruname: duruname,
            type:type,
            specifications: specifications,
            unit: unit,
            num:num,
            remark: remark,
            drugoutId: drugoutId,
            token:token
        }
      }

      // 修改数据
  $("#drugOutTable").delegate(".emit", "click", function () {
    $(".button").css("display","none")
    $("#duruname").css("width","100%")
    // 回显表单数据
    drugoutdetailsId = $(this).data("id");
    $.ajax({
        url: http + "/drugsoutdetails/findById.do",
        type: "post",
        dataType: "json",
        data: {
            drugoutdetailsId: drugoutdetailsId,
            token:token
        },
        success: function (res) {
            $("#duruname").val(res.duruname);
            $("#type").val(res.type);
            $("#specifications").val(res.specifications);
            $("#unit").val(res.unit);
            $("#num").val(res.num);
            $("#remark").val(res.remark);
        }
    })
})

// 获取修改数据
$(".preserve_emit").click(function () {
    getData()
    data.id=drugoutdetailsId
    $.ajax({
        url: http + "/drugsoutdetails/update.do",
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
$("#drugOutTable").delegate(".outlineDetail", "click", function () {
    var drugoutdetailsId = $(this).data("id");
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
            url: http + "/drugsoutdetails/delete.do",
            type: "post",
            dataType: "json",
            data: {
                "drugoutdetailsId": drugoutdetailsId,
                "drugoutId": drugoutId,
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
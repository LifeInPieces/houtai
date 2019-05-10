$(function(){
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    getOutData();
    // 渲染数据
    function getOutData() {
        $.ajax({
            url: http + "/equipmenthouse/findAll.do",
            type: "get",
            dataType: "json",
            data: {
                page: page,
                size: size,
                token:token
            },
            success: function (res) {
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
        getOutData();
    });

   // 关键字查询
   $(".btn_found").click(function () {
       var equipmentname = $("#btnname").val()
       // 数据为空时不能查询
       if (equipmentname == "") {
           return false;
       }
       $.ajax({
           type: "get",
           url: http + "/equipmenthouse/find.do",
           dataType: "json",
           data: {
               equipmentname: equipmentname,
               page: page,
               size: size,
               token:token
           },
           success: function (res) {
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
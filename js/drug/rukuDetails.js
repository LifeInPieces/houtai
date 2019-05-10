$(function(){
     // 动态渲染数据的根路径
     http()
     var size = 10;
     var page = 1;
     var pageCount = 0;
     getrukuData();
     function each(res){
        $.each(res.rows, function (i) {
            var dataTime = moment(res.rows[i].buydrugs.date).format('YYYY-MM-DD');
            res.rows[i].buydrugs.date = dataTime;
            res.rows[i].buydrugsdetails.money= moneyFormat(res.rows[i].buydrugsdetails.money)
            res.rows[i].buydrugsdetails.price= moneyFormat(res.rows[i].buydrugsdetails.price)
        })
     }
     // 渲染数据
     function getrukuData() {
         $.ajax({
             url: http + "/buydrugsdetails/findAll.do",
             type: "get",
             dataType: "json",
             data: {
                 page: page,
                 size: size,
                 token:token
             },
             success: function (res) {
                 // 转换时间
                 each(res)
                 // 分页页数
                 pageCount = Math.ceil(res.total / size);
                 var html = template("rukuTel", {
                     "rows": res.rows
                 });
                 $("#rukuTable").html(html);
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
         getrukuData();
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
            url: http + "/buydrugsdetails/findByDate.do",
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
                var html = template("rukuTel", {
                    "rows": res.rows
                });
                $("#rukuTable").html(html);
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })
    $(".btn_found").click(function () {
        var drugsname = $("#drugsName").val()
        // 数据为空时不能查询
        if (drugsname == "") {
            return false;
        }

        $.ajax({
            type: "get",
            url: http + "/buydrugsdetails/find.do",
            dataType: "json",
            data: {
                drugsname: drugsname,
                page: page,
                size: size,
                token:token
            },
            success: function (res) {
                // 转换时间
                each(res)
                var html = template("rukuTel", {
                    "rows": res.rows
                });
                $("#rukuTable").html(html);
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })
})
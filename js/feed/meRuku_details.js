$(function(){
       // 动态渲染数据的根路径
       http()
       var size = 10;
       var page = 1;
       var pageCount = 0;
       var fodderoutId=0;
       var unit;
       getMerukuData();
       function each(res){
        $.each(res.rows, function (i) {
            var dataTime = moment(res.rows[i].buyfodder.date).format('YYYY-MM-DD');
            res.rows[i].buyfodder.date = dataTime;
            res.rows[i].fodderdetails.money= moneyFormat(res.rows[i].fodderdetails.money)
            res.rows[i].fodderdetails.price= moneyFormat(res.rows[i].fodderdetails.price)
            res.rows[i].fodderdetails.weight= moneyFormat(res.rows[i].fodderdetails.weight)
        })
       }
       // 渲染数据
       function getMerukuData() {
           $.ajax({
               url: http + "/buyfodderdetails/findAll.do",
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
                   var html = template("materialRukuTel", {
                       "rows": res.rows
                   });
                   $("#materialTable").html(html);
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
           getMerukuData();
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
            url: http + "/buyfodderdetails/findByDate.do",
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
                var html = template("materialRukuTel", {
                    "rows": res.rows
                });
                $("#materialTable").html(html);
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })
    $(".btn_found").click(function () {
        var foddername = $("#fodderName").val()
        // 数据为空时不能查询
        if (foddername == "") {
            return false;
        }

        $.ajax({
            type: "get",
            url: http + "/buyfodderdetails/find.do",
            dataType: "json",
            data: {
                foddername: foddername,
                page: page,
                size: size,
                token:token
            },
            success: function (res) {
                // 转换时间
                each(res)
                var html = template("materialRukuTel", {
                    "rows": res.rows
                });
                $("#materialTable").html(html);
                if (res.total < 1) {
                    $(".data_num").css("display", "table-row")
                }
            }
        })
    })
})
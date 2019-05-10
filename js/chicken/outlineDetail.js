$(function(){
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var type="肉鸡";
     // 转换时间
    function each(res){
        $.each(res.rows, function (i) {
            var dataTime = moment(res.rows[i].chickenout.date).format('YYYY-MM-DD');
            res.rows[i].chickenout.date = dataTime;
            res.rows[i].chickenout.receivablemoney = moneyFormat(res.rows[i].chickenout.receivablemoney)
            res.rows[i].chickenout.receivedmoney = moneyFormat(res.rows[i].chickenout.receivedmoney)
            res.rows[i].chickenout.needmoney = moneyFormat(res.rows[i].chickenout.needmoney)
            res.rows[i].chickenoutdetails.money = moneyFormat(res.rows[i].chickenoutdetails.money)
            res.rows[i].chickenoutdetails.price = moneyFormat(res.rows[i].chickenoutdetails.price)
        })
    }
    getcukuData();
    // 渲染数据
    function getcukuData() {
        $.ajax({
            url: http + "/outchickendetails/findAll.do",
            type: "get",
            dataType: "json",
            data: {
                page: page,
                size: size,
                type:type,
                token:token
            },
            success: function (res) {
                // 转换时间
                each(res)
                // 分页页数
                pageCount = Math.ceil(res.total / size);
                var html = template("roujiDetailTel", {
                    "rows": res.rows
                });
                $("#chickTable").html(html);
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
        getcukuData();
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
          url: http + "/outchickendetails/findByDate.do",
          dataType: "json",
          data: {
              beforeDate: beforeDate,
              afterDate: afterDate,
              page: page,
              size: size,
              type:type,
              token:token
          },
          success: function (res) {
              // 转换时间
              each(res)
              var html = template("roujiDetailTel", {
                  "rows": res.rows
              });
              $("#chickTable").html(html);
              if (res.total < 1) {
                  $(".data_num").css("display", "table-row")
              }
          }
      })
  })
  $(".btn_found").click(function () {
      var varieties = $("#kindoff").val()
      // 数据为空时不能查询
      if (varieties == "") {
          return false;
      }

      $.ajax({
          type: "get",
          url: http + "/outchickendetails/find.do",
          dataType: "json",
          data: {
              varieties: varieties,
              type:type,
              page: page,
              size: size,
              token:token
          },
          success: function (res) {
              // 转换时间
              each(res)
              var html = template("roujiDetailTel", {
                  "rows": res.rows
              });
              $("#chickTable").html(html);
              if (res.total < 1) {
                  $(".data_num").css("display", "table-row")
              }
          }
      })
  })


})
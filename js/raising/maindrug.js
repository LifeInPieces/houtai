$(function(){
     // 动态渲染数据的根路径
     http()
     var size = 10;
     var page = 1;
     var pageCount = 0;
     var buychickenId = 0;
    //  转换时间和金额
     function each(res){
        $.each(res.rows, function (i) {
          var dataTime = moment(res.rows[i].drugday.date).format('YYYY-MM-DD');
          res.rows[i].drugday.date = dataTime;
          res.rows[i].drugday.drugprice= moneyFormat(res.rows[i].drugday.drugprice)
          res.rows[i].drugday.drugmoney= moneyFormat(res.rows[i].drugday.drugmoney)
      })
     }
     getmaindrugData();
     // 渲染数据
     function getmaindrugData() {
       $.ajax({
         url: http + "/usedrug/findAll.do",
         type: "get",
         dataType: "json",
         data: {
           page: page,
           size: size,
           token:token
         },
         success: function (res) {
          each(res)
           // 分页页数
           pageCount = Math.ceil(res.total / size);
           var html = template("maindrugTel", {
             "rows": res.rows
           });
           $("#maindrugTable").html(html);
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
       getmaindrugData();
     });

    // 关键字查询
     $(".btn_found").click(function () {
      var housenumber = $("#kind").val()
      // 数据为空时不能查询
      if (housenumber == "") {
          return false;
      }

      $.ajax({
          type: "get",
          url: http + "/usedrug/find.do",
          dataType: "json",
          data: {
              housenumber: housenumber,
              page: page,
              size: size,
              token:token
          },
          success: function (res) {
              // 转换时间
              each(res)
              var html = template("maindrugTel", {
                "rows": res.rows
              });
              $("#maindrugTable").html(html);
              if (res.total < 1) {
                  $(".data_num").css("display", "table-row")
              }
          }
      })
  })

})
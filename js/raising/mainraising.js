$(function(){
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    // 转换时间
    function each(res){
      $.each(res.rows, function (i) {
          var dataTime = moment(res.rows[i].feedday.date).format('YYYY-MM-DD');
          res.rows[i].feedday.date = dataTime;
          res.rows[i].feedday.price = moneyFormat(res.rows[i].feedday.price)
          res.rows[i].feedday.money = moneyFormat(res.rows[i].feedday.money)
      })
    }
    getmainraisingData();
    // 渲染数据
    function getmainraisingData() {
        $.ajax({
            url: http + "/usefodder/findAll.do",
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
                var html = template("mainraisingTel", {
                    "rows": res.rows
                });
                $("#mainraisingTable").html(html);
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
  $(".btn_found").click(function () {
      var housenumber = $("#kind").val()
      // 数据为空时不能查询
      if (housenumber == "") {
          return false;
      }

      $.ajax({
          type: "get",
          url: http + "/usefodder/find.do",
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
              var html = template("mainraisingTel", {
                "rows": res.rows
            });
            $("#mainraisingTable").html(html);
              if (res.total < 1) {
                  $(".data_num").css("display", "table-row")
              }
          }
      })
  })


})
$(function(){
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var goodshouseId = 0;
    getkucunData();
    // 渲染数据
    function getkucunData() {
      $.ajax({
        url: http + "/chickenmanurehouse/findAll.do",
        type: "get",
        dataType: "json",
        data: {
          token:token
        },
        success: function (res) {
          // 分页页数
          pageCount = Math.ceil(res.total / size);
          var html = template("cunkuTel", {
            "res": res
          });
          $("#cunkuTable").html(html);
          makePageButton(page, pageCount)
        }
      });
  
      //   初始化头部用户昵称
      usernme()
    }
  })
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
      url: http + "/goodshouse/findAll.do",
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
        var html = template("goodsKucunTel", {
          "rows": res.rows
        });
        $("#kucunTable").html(html);
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
    getkucunData();
  });
   // 关键字查询
  $(".btn_found").click(function () {
    var goodsname = $("#goods").val()
    // 数据为空时不能查询
    if (goodsname == "") {
      return false;
    }
    $.ajax({
      type: "get",
      url: http + "/goodshouse/find.do",
      dataType: "json",
      data: {
        goodsname: goodsname,
        page: page,
        size: size,
        token:token
      },
      success: function (res) {
        var html = template("goodsKucunTel", {
          "rows": res.rows
        });
        $("#kucunTable").html(html);
        if (res.total < 1) {
          $(".data_num").css("display", "table-row")
        }
      }
    })
  })
})
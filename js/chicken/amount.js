$(function(){
  // 动态渲染数据的根路径
  http()
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var goodshouseId = 0;
  var type = "肉鸡"
  getamountData();
  // 渲染数据
  function getamountData() {
    $.ajax({
      url: http + "/chickenstock/findAll.do",
      type: "get",
      dataType: "json",
      data: {
        page: page,
        size: size,
        type:type,
        token:token
      },
      success: function (res) {
        // 分页页数
        pageCount = Math.ceil(res.total / size);
        var html = template("amountTel", {
          "rows": res.rows
        });
        $("#amountTable").html(html);
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
    getamountData();
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
      url: http + "/chickenstock/find.do",
      dataType: "json",
      data: {
        housenumber: housenumber,
        page: page,
        size: size,
        token:token
      },
      success: function (res) {
        var html = template("amountTel", {
            "rows": res.rows
          });
         $("#amountTable").html(html);
        if (res.total < 1) {
          $(".data_num").css("display", "table-row")
        }
      }
    })
  })
})
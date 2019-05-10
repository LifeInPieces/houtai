$(function () {
  http();
  var size = 10;
  var page = 1;
  var pageCount = 0;
  var materialSaveId = 0;
  var unit;
  getMaterialData();
  // 渲染数据
  function getMaterialData() {
    $.ajax({
      url: http + "/fodderhouse/findAll.do",
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
        var html = template("materialSaveTel", {
          "res": res
        });
        $("#materialSaveTable").html(html);
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
    getMaterialData();
  });
  // 关键字查询
  $(".btn_found").click(function () {
    var materialName = $("#materialName").val()
    // 数据为空时不能查询
    if (materialName == "") {
      return false;
    }
    $.ajax({
      type: "get",
      url: http + "/fodderhouse/find.do",
      dataType: "json",
      data: {
        foddername: materialName,
        page: page,
        size: size,
        token:token
      },
      success: function (res) {
        var html = template("materialSaveTel", {
          "res": res
        });
        $("#materialSaveTable").html(html);
        if (res.total < 1) {
          $(".data_num").css("display", "table-row")
        }
      }
    })
  })

})
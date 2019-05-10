$(function(){
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var goodshouseId = 0;
    var type = "肉鸡"
    geteggsaveData();
    // 渲染数据
    function geteggsaveData() {
      $.ajax({
        url: http + "/egghouse/findAll.do",
        type: "get",
        dataType: "json",
        data:{
          token:token
        },
        success: function (res) {
          if(res !=null){
            var html = template("eggSaveTel", {"res":res});
            $("#eggSaveTable").html(html);
          }
        }
      });
      //   初始化头部用户昵称
      usernme()
    }
  })
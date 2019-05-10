$(function(){
// 动态渲染数据的根路径
http()
var size = 10;
var page = 1;
var pageCount = 0;
var chickenmanurehandleId = 0;
getmanureData();
// 渲染数据
function getmanureData() {
    $.ajax({
        url: http + "/chickenmanurehandle/findAll.do",
        type: "get",
        dataType: "json",
        data: {
            page: page,
            size: size,
            token:token
        },
        success: function (res) {
            $.each(res.rows, function (i) {
                var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                res.rows[i].date = dataTime;
            })
            // 分页页数
            pageCount = Math.ceil(res.total / size);
            var html = template("manureTel", {
                "rows": res.rows
            });
            $("#manureTable").html(html);
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
    getmanureData();
});

$(".header_right").click(function () {
    unit = $("#unit").val("kg");
  })

// 添加数据
$(".preserve_add").click(function () {
    getData()
for (var i = 0; i < document.newUser.elements.length - 1; i++) {
    if ( date == "" || dailyoutput == "" || heaped == "" || fermentation == "" ||
         unit == "" || person == "" ) {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("有星号的表单不能有空项");
        return true;
    }
}

$.ajax({
    url: http + "/chickenmanurehandle/insert.do",
    type: "post",
    dataType: "json",
    data:data,
    success: function (res) {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        if (res.success == true) {
            toastr.success(res.message);
        } else {
            toastr.error(res.message);
        }
        getmanureData()
    }
})
})

function getData() {
  // 获取表单数据
  date = $("#date").val();
  dailyoutput = $("#dailyoutput").val();
  heaped = $("#heaped").val();
  fermentation = $("#fermentation").val();
  unit = $("#unit").val();
  person = $("#person").val();
  remark = $("#remark").val();
  data={
      date: date,
      dailyoutput: dailyoutput,
      heaped: heaped,
      fermentation: fermentation,
      unit: unit,
      person: person,
      remark: remark,
      token:token
  }
}

// 修改数据
$("#manureTable").delegate(".emit", "click", function () {
    // 回显表单数据
    chickenmanurehandleId = $(this).data("id");
    $.ajax({
        url: http + "/chickenmanurehandle/findById.do",
        type: "post",
        dataType: "json",
        data: {
            chickenmanurehandleId: chickenmanurehandleId,
            token:token
        },
        success: function (res) {
             // 格式化时间
            res.date = moment(res.date).format('YYYY-MM-DD');
            date = $("#date").val(res.date);
            dailyoutput = $("#dailyoutput").val(res.dailyoutput);
            heaped = $("#heaped").val(res.heaped);
            fermentation = $("#fermentation").val(res.fermentation);
            unit = $("#unit").val(res.unit);
            person = $("#person").val(res.person);
            remark = $("#remark").val(res.remark);
        }
    })
})

// 获取修改数据
$(".preserve_emit").click(function () {
    getData()
    data.id=chickenmanurehandleId;
    $.ajax({
      url: http + "/chickenmanurehandle/update.do",
      type: "post",
      dataType: "json",
      data: data,
      success: function (res) {
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        if(res.success==true){
            toastr.success(res.message);
        }else{
            toastr.error(res.message);
        }
        getmanureData()
      }
    });
  })

  // 删除数据
  $("#manureTable").delegate(".manure_del", "click", function () {
    var chickenmanurehandleId = $(this).data("id");
    swal({
      title: "操作提示", //弹出框的title
      text: "确定删除吗？", //弹出框里面的提示文本
      type: "warning", //弹出框类型
      showCancelButton: true, //是否显示取消按钮
      confirmButtonColor: "#DD6B55", //确定按钮颜色
      cancelButtonText: "取消", //取消按钮文本
      confirmButtonText: "是的，确定删除！", //确定按钮上面的文档
      closeOnConfirm: true
    }, function () {
      $.ajax({
        url: http + "/chickenmanurehandle/delete.do",
        type: "post",
        dataType: "json",
        data: {
          "chickenmanurehandleId": chickenmanurehandleId,
          "token":token
        },
        success: function (res) {
          toastr.options.positionClass = 'toast-center-center';
          toastr.options.timeOut = '3000';
          if(res.success==true){
              toastr.success(res.message);
          }else{
              toastr.error(res.message);
          }
          getmanureData()
        }
      })
    });
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
        url: http + "/chickenmanurehandle/findByDate.do",
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
            $.each(res.rows, function (i) {
                var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                res.rows[i].date = dataTime;
            })
            var html = template("manureTel", {
                "rows": res.rows
            });
            $("#manureTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

})
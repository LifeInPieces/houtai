$(function () {
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var fodderOutlineId=0;
    var unit;
    getOutlineData();
    // 渲染数据
    function getOutlineData() {
      $.ajax({
        url: http + "/finishfodderout/findAll.do",
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
          var html = template("productoutTel", {
            "rows": res.rows
          });
          $("#productoutTable").html(html);
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
      getOutlineData();
    });

  // 点击新增按钮给计量单位赋值
  $(".header_right").click(function () {
    num = $("#num").val("0");
  })
  
  
  $("#productoutTable").delegate(".draw", "click", function () {
    $(".mengban_over").show()
    $(".add_draw").show()
    $(".draw_add").css("display", "inline-block");
    $(".preserve_emit").css("display", "none");
    finishfodderoutId=$(this).data("id") 
  })

  // 上传图片
  $(".draw_add").click(function(){
    var formData = new FormData();
    formData.append("file",$("#input-1").get(0).files[0]);
    formData.append("token",token);
    formData.append("finishfodderoutId",finishfodderoutId);
    $.ajax({
      url: http + "/finishfodderout/uploadimg.do",
      type: "post",
      dataType: "json",
      cache: false,
      processData: false,
      contentType:false,
      data: formData,
      success: function (res) {
          toastr.options.positionClass = 'toast-center-center';
          toastr.options.timeOut = '3000';
          if (res.success == true) {
              toastr.success(res.message);
              var m = 200; // 几秒后跳转 自定义
              var timd =setInterval(function(){
              m--;
              if(m==0){
              clearInterval(timd);
              location.reload()
               }
             })
          } else {
              toastr.error(res.message);
          }
      }
  })
  })

    // 添加数据
    $(".preserve_add").click(function () {
        getData()
      for (var i = 0; i < document.newUser.elements.length - 1; i++) {
        if ( outnumber == "" || date == "" ||
            person == "" || num == "") {
          toastr.options.positionClass = 'toast-center-center';
          toastr.options.timeOut = '3000';
          toastr.error("有星号的表单不能有空项");
          return false;
        }
      }
      $.ajax({
        url: http + "/finishfodderout/insert.do",
        type: "post",
        dataType: "json",
        data: data,
        success: function (res) {
          toastr.options.positionClass = 'toast-center-center';
          toastr.options.timeOut = '3000';
          if (res.success == true) {
            toastr.success(res.message);
          } else {
            toastr.error(res.message);
          }
          getOutlineData()
        }
      })
    })
  
  
    function getData() {
      // 获取表单数据
      outnumber = $("#outnumber").val();
      date = $("#date").val();
      person = $("#person").val();
      num = $("#num").val();
      remark = $("#remark").val();
      data = {
        outnumber: outnumber,
        date: date,
        person: person,
        num: num,
        remark: remark,
        token:token
      }
    }
  
  
    // 修改数据
    $("#productoutTable").delegate(".emit", "click", function () {
      // 回显表单数据
      finishfodderoutId = $(this).data("id");
      $.ajax({
          url: http + "/finishfodderout/findById.do",
          type: "post",
          dataType: "json",
          data: {
            finishfodderoutId: finishfodderoutId,
            token:token
          },
          success: function (res) {
              res.date = moment(res.date).format('YYYY-MM-DD');
              $("#outnumber").val(res.outnumber);
              $("#date").val(res.date);
              $("#person").val(res.person);
              $("#num").val(res.num);
              $("#remark").val(res.remark);
              pic=res.pic;
          }
      })
  })
  
   // 获取修改数据
   $(".preserve_emit").click(function () {
    getData()
    data.id=finishfodderoutId
    data.pic=pic;
    $.ajax({
      url: http + "/finishfodderout/update.do",
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
        getOutlineData()
      }
    });
  })
  
  // 删除数据
  $("#productoutTable").delegate(".productout_del", "click", function () {
    var finishfodderoutId = $(this).data("id");
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
        url: http + "/finishfodderout/delete.do",
        type: "post",
        dataType: "json",
        data: {
          "finishfodderoutId": finishfodderoutId,
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
          getOutlineData()
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
        url: http + "/finishfodderout/findByDate.do",
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
            var html = template("productoutTel", {
              "rows": res.rows
            });
            $("#productoutTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})

// 点击进入入库明细
$("#productoutTable").delegate(".details", "click", function () {
  var finishfodderoutId = $(this).data("id")
  localStorage.setItem("finishfodderoutId", finishfodderoutId);
  location.href = "productoutdetail.html"
})

//   图片放大
$("#productoutTable").delegate(".images>img", "click", function () {
  $(".mengban_over").fadeIn(1000);
  $(this).siblings().fadeIn(1000)
  that=this
  $(document).ready(function () {
      $(that).siblings().zoomMarker({
          rate: 0.2,
      });
 })
})

  $("#productoutTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
  })

})
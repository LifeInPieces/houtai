$(function () {
    // 动态渲染数据的根路径
    http()
    var size = 10;
    var page = 1;
    var pageCount = 0;
    var chickenmanureprocessingId = 0;
    var buyfodderId = 0;
  
    getDetailsData();
    // 渲染数据
    function getDetailsData() {
        chickenmanureprocessingId = localStorage.getItem("chickenmanureprocessingId")
      $.ajax({
        url: http + "/manureprocessingdetails/findAll.do",
        type: "get",
        dataType: "json",
        data: {
          page: page,
          size: size,
          chickenmanureprocessingId: chickenmanureprocessingId,
          token:token
        },
        success: function (res) {
          $.each(res.rows, function (i) {
            res.rows[i].money= moneyFormat(res.rows[i].money)
        })
          // 分页页数
          pageCount = Math.ceil(res.total / size);
          var html = template("detailsTel", {
            "res": res
          });
          $("#detailsTable").html(html);
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
      getDetailsData();
    });
  
    function getData() {
        // 获取表单数据
        name = $("#name").val();
        num = $("#num").val();
        unit = $("#unit").val();
        money = $("#money").val();
        remark = $("#remark").val();
        data = {
          name: name,
          num: num,
          unit: unit,
          money: money,
          remark: remark,
          chickenmanureprocessingId:chickenmanureprocessingId,
          token:token
        }
      }

    // 添加数据
    $(".preserve_add").click(function () {
        getData();
      for (var i = 0; i < document.newUser.elements.length - 1; i++) {
        if ( name == "" || num == "" || unit == "" || money == "") {
          toastr.options.positionClass = 'toast-center-center';
          toastr.options.timeOut = '3000';
          toastr.error("有星号的表单不能有空项");
          return true;
        }
      }
      
      $.ajax({
        url: http + "/manureprocessingdetails/insert.do",
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
          getDetailsData()
        }
      })
    })
  
    // 修改数据
    $("#detailsTable").delegate(".emit", "click", function () {
      // 回显表单数据
      manureprocessingdetailsId = $(this).data("id");
      $(".weight").css("display", "block")
      $.ajax({
        url: http + "/manureprocessingdetails/findById.do",
        type: "post",
        dataType: "json",
        data: {
          manureprocessingdetailsId: manureprocessingdetailsId,
          token:token
        },
        success: function (res) {
          $("#name").val(res.name);
          $("#num").val(res.num);
          $("#unit").val(res.unit);
          $("#money").val(res.money);
          $("#remark").val(res.remark);
        }
      })
    })

  
    // 获取修改数据
    $(".preserve_emit").click(function () {
      getData()
      data.id=manureprocessingdetailsId
      $.ajax({
        url: http + "/manureprocessingdetails/update.do",
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
          getDetailsData()
        }
      });
    })
  
    // 删除数据
    $("#detailsTable").delegate(".details_del", "click", function () {
      var manureprocessingdetailsId = $(this).data("id");
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
          url: http + "/manureprocessingdetails/delete.do",
          type: "post",
          dataType: "json",
          data: {
            "chickenmanureprocessingId": chickenmanureprocessingId,
            "manureprocessingdetailsId": manureprocessingdetailsId,
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
            getDetailsData()
          }
        })
      });
    });
  
  })
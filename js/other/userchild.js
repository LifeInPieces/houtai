$(function(){
    // 动态渲染数据的根路径
   http()
   var size = 10;
   var page = 1;
   var pageCount = 0;
   var userId = 0
   getuserData();
   // 渲染数据
   function getuserData() {
    userId = localStorage.getItem("userId")
       $.ajax({
           url: http + "/modules/findAll.do",
           type: "get",
           dataType: "json",
           data: {
               page: page,
               size: size,
               userId:userId,
               token:token
           },
           success: function (res) {
               // 分页页数
               pageCount = Math.ceil(res.total / size);
               var html = template("userchildTel", {
                   "rows": res.rows
               });
               $("#userchildTable").html(html);
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
       getuserData();
   });


// 添加数据
$(".aa").click(function () {
    $(".addshouquan").css("display","block")
    $(".mengban_over").fadeIn(1000);
    $.ajax({
        url: http + "/modules/findNot.do",
        type: "post",
        dataType: "json",
        data: {
            userId:userId,
            token:token
        },
        success: function (res) {
            var html = template("modulesTel", {
                "rows": res.rows
            });
            $("#modulesTable").html(html);
        }
    })
})

var list=[];
var item;
$("#modulesTable").delegate("input", "click", function () {
  item=$(this).data("id")
  addCheckBoxData(list, item)
function addCheckBoxData(list, item){
    if($.inArray(item, list) == -1){
      list.push(item);
    }else{
      for(var i=0; i < list.length; i++){
        if(list[i] == item){
          list.splice(i, 1); //将这个元素移除
        }
      }
    }
}

})

// 添加
$("#modulesTable").delegate(".preservepwd", "click", function () {
    $(".addshouquan").css("display","none")
    $(".mengban_over").fadeOut(1000);
    data= {
        page: page,
        size: size,
        userId:userId,
        token:token,
        ids: list
    }
    $.ajax({
        url: http + "/modules/insert.do ",
        type: "post",
        dataType: "json",
        data:  data,
        success: function (res) {
            toastr.options.positionClass = 'toast-center-center';
            toastr.options.timeOut = '3000';
            if (res.success == true) {
                toastr.success(res.message);
            } else {
                toastr.error(res.message);
            }
            getuserData()
        }
    })
    for(var i=0; i < list.length; i++){
        list.splice(i, data.ids.length);
      }

})


 // 删除数据
 $("#userchildTable").delegate(".userchild_del", "click", function () {
    var modulesId = $(this).data("id");
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
            url: http + "/modules/delete.do",
            type: "post",
            dataType: "json",
            data: {
                 userId:userId,
                 modulesId: modulesId,
                 token:token
            },
            success: function (res) {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                if (res.success == true) {
                    toastr.success(res.message);
                } else {
                    toastr.error(res.message);
                }
                getuserData()
            }
        })
    });
});

// 初始化复选框
const $inputs = document.getElementsByClassName('input');
for (let inputIndex = $inputs.length - 1; inputIndex >= 0; inputIndex--) {
  const $input = $inputs[inputIndex];
  // ...
}
const $checkboxes = document.getElementsByClassName('input--checkbox');
for (let checkboxIndex = $checkboxes.length - 1; checkboxIndex >= 0; checkboxIndex--) {
  const $checkbox = $checkboxes[checkboxIndex];
  // ...
}
setTimeout(() => { /* TODO: prevent this timeout */
  const $preloadElements = document.getElementsByClassName('preload');
  for (let preloadIndex = $preloadElements.length - 1; preloadIndex >= 0; preloadIndex--) {
    const $preload = $preloadElements[preloadIndex];
    $preload.classList.remove('preload');
  }
}, 500);

})
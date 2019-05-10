$(function(){
   // 动态渲染数据的根路径
   http()
   getuserkehuData();
   // 渲染数据
   function getuserkehuData() {
       $.ajax({
           url: http + "/userkehu/findUserInfo.do",
           type: "get",
           dataType: "json",
           data: {
               token:token
           },
           success: function (res) {
               toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
               if(res.success==false){
                toastr.error(res.message);
               }
               var html = template("personalTel", {
                   "res": res
               });
               $("#personalTable").html(html);
            
           }
       });
       //   初始化头部用户昵称
       usernme()
   }

    //   图片放大
 $("#personalTable").delegate(".idphoto>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})
$("#personalTable").delegate(".bigsplice>img", "click", function () {
    $(".mengban_over").fadeIn(1000);
    $(this).siblings().fadeIn(1000)
    that=this
    $(document).ready(function () {
        $(that).siblings().zoomMarker({
            rate: 0.2,
        });
   })
})

$("#personalTable").delegate(".drawerror", "click", function () {
    $(".mengban_over").fadeOut(1000);
    $(".Imgsmall").fadeOut(1000)
    $(".Imgsmalls").fadeOut(1000)
  })

})
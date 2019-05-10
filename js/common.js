$(function () {
    // 修改密码
    $(".rever_password").click(function () {
        $(".outline_time").fadeIn(1000);
        $(".mengban_over").fadeIn(1000)
    })

    $(".open_down ,.preserve").click(function () {
        $(".form_show").fadeOut(1000);
        $(".mengban_over").fadeOut(1000);
        return false;
    })
    // 新增
    $(".header_right").click(function () {
        $(".form_add").css("display", "block");
        $(".form_eimt").css("display", "none");
        // 增加按钮
        $(".preserve_add").css("display", "inline-block");
        $(".preserve_emit").css("display", "none");
        $(".add_form").fadeIn(1000);
        $(".mengban_over").fadeIn(1000);
        // 设置新增框弹出时清除所有数据
        for (var i = 0; i < document.newUser.elements.length; i++) {
            document.newUser.elements[i].value = ""
        }
    })
    // 编辑信息
    $(".tableAll").delegate(".emit", "click", function () {
        $(".form_eimt").css("display", "block");
        $(".form_add").css("display", "none");
        // 编辑按钮
        $(".preserve_emit").css("display", "inline-block");
        $(".preserve_add").css("display", "none");
        $(".add_form").fadeIn(1000);
        $(".mengban_over").fadeIn(1000);
    })
    // 提示信息
    $('[data-toggle="tooltip"]').tooltip();
    var url=localStorage.getItem("url")
    // 一级页面返回
  $(".firstbackhistory").click(function(){
    if(url==-1){
        location.href="../other/jiankong.html"
    }else{
        location.href="../index.html"
    }
  })


      // 退出
      $("#logout").click(function(){ 
        var url=window.location.href.lastIndexOf('index.html')
       $.ajax({
           url: http+"/user/logout.do",
           type: "GET",
           dataType: 'json',
           data:{
               token:token
           },
           success:function(res){
               if(res.success && url !=-1){
                  location.href="login-registe/login.html";
                  window.localStorage.removeItem('token');
               }else if(res.success && url==-1){
                location.href="../login-registe/login.html";
                window.localStorage.removeItem('token');
               }else{
                   toastr.options.positionClass = 'toast-center-center';
                   toastr.options.timeOut = '3000';
                   toastr.error(res.success);
                   return false;
               }
           }
      })
   })
   

//    修改密码
  $(".preservepwd").click(function(){
      var beforepwd=$("#beforepwd").val()
      var newpwd=$("#newpwd").val()
      var lastpwd=$("#lastpwd").val()
      if(beforepwd =="" || newpwd =="" || lastpwd ==""){
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("密码不能为空");
        $("#beforepwd").val("");
        $("#newpwd").val("");
        $("#lastpwd").val("")
        return false;
      }else if(newpwd !=lastpwd){
        toastr.options.positionClass = 'toast-center-center';
        toastr.options.timeOut = '3000';
        toastr.error("密码输入有误,请重新输入");
        $("#beforepwd").val("");
        $("#newpwd").val("");
        $("#lastpwd").val("")
        return false;
      }
      $.ajax({
        url: http + "/user/updatepwd.do",
        type: "post",
        dataType: "json",
        data: {
            beforepwd:beforepwd,
            newpwd:newpwd,
            lastpwd:lastpwd,
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
        }
      })
  })

})

// 分页
function makePageButton(page, pageCount) {
    var start = page - 2;
    if (start < 1) {
        start = 1;
    }
    var end = start + 4;
    if (end > pageCount) {
        end = pageCount;
    }
    var html = "";
    if (page != 1) {
        html += '<li class="item" data-page="' + (page - 1) + '"><a href="javascript:;">上一页</a></li>';
    }
    for (var i = start; i <= end; i++) {
        if (i == page) {
            html += '<li class="item active" data-page="' + i + '"><a href="javascript:;">' + i + '</a></li>';
        } else {
            html += '<li class="item" data-page="' + i + '"><a href="javascript:;">' + i + '</a></li>';
        }
    }
    if (page < pageCount) {
        html += '<li class="item" data-page="' + (page + 1) + '"><a href="javascript:;">下一页</a></li>';
    }
    $(".pagination").html(html);
}


// 小数点后面余两位
function moneyFormat(val) {   
    if (val == "" || val == null) {               
        return "0.00";            
    }            
    var value = Math.round(parseFloat(val) * 100) / 100;            
    var xsd = value.toString().split(".");            
    if (xsd.length == 1) {               
        value = value.toString() + ".00";            
        return value;            
    }            
    if (xsd.length > 1) {               
        if (xsd[1].length < 2) {                  
            value = value.toString() + "0";               
        }               
        return value;            
    }       
}
function http(){
     // 动态渲染数据的根路径
     http = "http://111.67.196.139:80/ssm_lj_web";
}
token=localStorage.getItem("token")

function usernme(){
    //   初始化头部用户昵称
    $.ajax({
        url: http + "/user/getusername.do",
        type: "post",
        dataType: "json",
        data: {
            token:token
        },
        success: function (res) {
            var html = template("usernameTel", {
                "res": res
            });
            $(".username").html(html);
        }
    })
}
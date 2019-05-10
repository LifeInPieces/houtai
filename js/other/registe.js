$(function(){
    function getData() {
        // 获取表单数据
        formData = new FormData();
        formData.append("file",$("#input").get(0).files[0]);
        formData.append("file1",$("#input-1").get(0).files[0]);
        username = $("#username").val();
        password = $("#password").val();
        protectmail = $("#protectmail").val();
        companyname = $("#companyname").val();
        ipgp = $("#ipgp").val();
        contacts = $("#contacts").val();
        industrycategory = $("#industrycategory").val();
        address = $("#address").val();
        phone = $("#phone").val();
        email = $("#email").val();
        legal = $("#legal").val();
        fax = $("#fax").val();
        postcode = $("#postcode").val();
        formData.append("username",username);
        formData.append("password",password);
        formData.append("protectmail",protectmail);
        formData.append("companyname",companyname);
        formData.append("ipgp",ipgp);
        formData.append("contacts",contacts);
        formData.append("industrycategory",industrycategory);
        formData.append("address",address);
        formData.append("phone",phone);
        formData.append("email",email);
        formData.append("legal",legal);
        formData.append("fax",fax);
        formData.append("postcode",postcode);
      }
  // 上传图片
  $(".registelicense").click(function(){
    getData()
    $(".loader-2").css("display","block");
    $(this).addClass("sucessactive")
    that=this;
    $.ajax({
      url: "http://111.67.196.139:80/ssm_lj_web/userkehu/register.do",
      type: "post",
      dataType: "json",
      cache: false,
      processData: false,
      contentType:false,
      data: formData,
      success: function (res) {
          if (res.success == true) {
            $(".errortitle").html(res.message)
            $(".registelicense").css("disabled","true")
            var m = 300; // 几秒后跳转 自定义
            var timd =setInterval(function(){
            m--;
            if(m==0){
            clearInterval(timd);
            $(".registelicense").css("disabled",false)
            $(".loader-2").css("display","none");
            $(that).removeClass("sucessactive")
             location.href="../login-registe/login.html"
            }
            })

          } else {
            $(".loader-2").css("display","none");
            $(that).removeClass("sucessactive")
            $(".errortitle").html(res.message)
            var m = 300; // 几秒后跳转 自定义
            var timd =setInterval(function(){
            m--;
            if(m==0){
              $(".errortitle").html("")
            }
            })
          }
      }
  })

  })

})
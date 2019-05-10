$(function(){   
// 动态渲染数据的根路径
http()
// 转换时间
function each(res){
$.each(res, function (i) {
    res.getnummoney = moneyFormat(res.getnummoney)
    res.paynummoney = moneyFormat(res.paynummoney)
    res.profit = moneyFormat(res.profit)
    res.paydate = moneyFormat(res.paydate)
    res.getrouchickenmoney = moneyFormat(res.getrouchickenmoney)
    res.getdanchickenmoney = moneyFormat(res.getdanchickenmoney)
    res.geteggmoney = moneyFormat(res.geteggmoney)
    res.getmanuremoney = moneyFormat(res.getmanuremoney)
    res.getothermoney = moneyFormat(res.getothermoney)
    res.paydanchickenmoney = moneyFormat(res.paydanchickenmoney)
    res.payrouchickenmoney = moneyFormat(res.payrouchickenmoney)
    res.paydrugmoney = moneyFormat(res.paydrugmoney)
    res.payfoddermoney = moneyFormat(res.payfoddermoney)
    res.paygoodsmoney = moneyFormat(res.paygoodsmoney)
    res.payothermoney = moneyFormat(res.payothermoney)
})
}
// 起始日期
$(".timeDate").show(500)
$(".cancel").click(function(){
    $(".timeDate").hide()
})
$(".ensure").click(function(){
    if($("#enddate").val()=="" || $("#beforedate").val()==""){
        $(".timeDate").hide()
        return;
    }
    enddate=$("#enddate").val()
    beforedate=$("#beforedate").val()
    $(".timeDate").hide()
    getmainraisingData()
    getmoney()
    paymoney()
})
// 渲染数据
function getmainraisingData() {
    $.ajax({
        url: http + "/moneyanalysis/findByDate.do",
        type: "get",
        async:false,
        dataType: "json",
        data: {
            beforeDate:beforedate,
            afterDate:enddate,
            token:token
        },
        success: function (res) {
            // 转换时间
            each(res)
            // 汇总
            var html = template("totalTel", {"res":res});
            $("#totalTable").html(html);
            // 收入
            var html = template("getmoneyTel", {"res":res});
            $("#getmoneyTable").html(html);
             // 支出
             var html = template("paymoneyTel", {"res":res});
             $("#paymoneyTable").html(html);
        }
    });
}
})
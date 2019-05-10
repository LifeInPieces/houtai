$(function(){
     // 动态渲染数据的根路径
     http()
     var size = 10;
     var page = 1;
     var pageCount = 0;
     var chickenhousedayId = 0;
     geteveryData();
     // 渲染数据
     function geteveryData() {
         $.ajax({
             url: http + "/chickenhouseday/findAll.do",
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
                 var html = template("everyTel", {
                     "rows": res.rows
                 });
                 $("#everyTable").html(html);
                 makePageButton(page, pageCount)
             }
         });

         //   初始化头部用户昵称
        usernme()
     }
    //  鸡舍号信息
     getHenhouseData()
     function getHenhouseData() {
        $.ajax({
          url: http + "/chickenhouse/findAll.do",
          type: "get",
          dataType: "json",
          data: {
            page: page,
            size: size,
            token:token
          },
          success: function (res) {
            // 分页页数
            var html = template("optionTel", {
              "rows": res.rows
            });
            $("#housename").html(html);
          }
        });
      }

     // 分页
     makePageButton(page, pageCount)
     // 点击分页按钮
     $(".pagination").on("click", ".item", function () {
         page = parseInt($(this).attr("data-page"));
         geteveryData();
     });

  // 点击新增按钮给计量单位赋值
  $(".header_right").click(function () {
    temperatureunit = '℃';
    humidityunit = "%RH";
    brightnessunit = "cd/m2";
    ammoniaunit = "ppm";
    carbonylunit = "ppm";
    hydrogensulfideunit = "ppm";
    oxygenunit = "ppm";
    carbondioxideunit = "ppm";
    lighttimeunit = "h";
    poweruseunit = "千瓦时";
    wateruseunit = "升";
  })

     function getData() {
        // 获取表单数据
         chickenhousename = $("#housename").val();
         date = $("#date").val();
         temperature = $("#temperature").val();
         humidity = $("#humidity").val();
         brightness = $("#brightness").val();
         hygiene = $("#hygiene").val();
         water = $("#water").val();
         ammonia = $("#ammonia").val();
         carbonyl = $("#carbonyl").val();
         hydrogensulfide = $("#hydrogensulfide").val();
         oxygen = $("#oxygen").val();
         carbondioxide = $("#carbondioxide").val();
         lighttime = $("#lighttime").val();
         poweruse = $("#poweruse").val();
         wateruse = $("#wateruse").val();
         fan = $("#fan").val();
         spray = $("#spray").val();
         remarks = $("#remarks").val();
         data = {
          chickenhousename: chickenhousename,
          date: date,
          temperature: temperature,
          temperatureunit:temperatureunit,
          humidity: humidity,
          humidityunit:humidityunit,
          brightness: brightness,
          brightnessunit:brightnessunit,
          hygiene: hygiene,
          water:water,
          ammonia:ammonia,
          ammoniaunit:ammoniaunit,
          carbonyl:carbonyl,
          carbonylunit:carbonylunit,
          hydrogensulfide:hydrogensulfide,
          hydrogensulfideunit:hydrogensulfideunit,
          oxygen:oxygen,
          oxygenunit:oxygenunit,
          carbondioxide:carbondioxide,
          carbondioxideunit:carbondioxideunit,
          lighttime:lighttime,
          lighttimeunit:lighttimeunit,
          poweruse:poweruse,
          poweruseunit:poweruseunit,
          wateruse:wateruse,
          wateruseunit:wateruseunit,
          fan:fan,
          spray:spray,
          remarks:remarks,
          token:token
        }
      }

      // 添加数据
    $(".preserve_add").click(function () {
        getData()
        for (var i = 0; i < document.newUser.elements.length - 1; i++) {
            if ( chickenhousename == "" || date == "" || temperature == "" || humidity == "" ||
                 brightness == "" || hygiene == "" || water == "" || ammonia == "" || carbonyl == "" || 
                 hydrogensulfide == "" || oxygen == "" || carbondioxide == "" || lighttime == "" || 
                 poweruse == "" || wateruse == "" || fan == "" || spray == "") {
                toastr.options.positionClass = 'toast-center-center';
                toastr.options.timeOut = '3000';
                toastr.error("有星号的表单不能有空项");
                return true;
            }
        }
        $.ajax({
            url: http + "/chickenhouseday/insert.do",
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
                geteveryData()
            }
        })
    })

      // 修改数据
      $("#everyTable").delegate(".emit", "click", function () {
        // 回显表单数据
        chickenhousedayId = $(this).data("id");
        $.ajax({
            url: http + "/chickenhouseday/findById.do",
            type: "post",
            dataType: "json",
            data: {
                chickenhousedayId: chickenhousedayId,
                token:token
            },
            success: function (res) {
                // 格式化时间
                res.date = moment(res.date).format('YYYY-MM-DD');
                $("#housename").val(res.chickenhousename);
                $("#date").val(res.date);
                $("#temperature").val(res.temperature);
                $("#humidity").val(res.humidity);
                $("#brightness").val(res.brightness);
                $("#hygiene").val(res.hygiene);
                $("#water").val(res.water);
                $("#ammonia").val(res.ammonia);
                $("#carbonyl").val(res.carbonyl);
                $("#hydrogenSulfide").val(res.hydrogensulfide);
                $("#oxygen").val(res.oxygen);
                $("#carbonDioxide").val(res.carbondioxide);
                $("#lighttime").val(res.lighttime);
                $("#poweruse").val(res.poweruse);
                $("#wateruse").val(res.wateruse);
                $("#fan").val(res.fan);
                $("#spray").val(res.spray);
                $("#remarks").val(res.remarks);
                temperatureunit=res.temperatureunit;
                humidityunit=res.humidityunit
                brightnessunit=res.brightnessunit;
                ammoniaunit=res.ammoniaunit
                carbonylunit=res.carbonylunit
                hydrogensulfideunit=res.hydrogensulfideunit;
                oxygenunit=res.oxygenunit
                carbondioxideunit=res.carbondioxideunit;
                lighttimeunit=res.lighttimeunit;
                poweruseunit=res.poweruseunit;
                wateruseunit=res.wateruseunit;
            }
        })
    })
    // 获取修改数据
    $(".preserve_emit").click(function () {
      getData()
      data.id=chickenhousedayId
        $.ajax({
            url: http + "/chickenhouseday/update.do",
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
                geteveryData()
            }
        });
    })

     // 删除数据
     $("#everyTable").delegate(".every_del", "click", function () {
        var chickenhousedayId = $(this).data("id");
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
                url: http + "/chickenhouseday/delete.do",
                type: "post",
                dataType: "json",
                data: {
                    "chickenhousedayId": chickenhousedayId,
                    "token":token
                },
                success: function (res) {
                    toastr.options.positionClass = 'toast-center-center';
                    toastr.options.timeOut = '3000';
                    if (res.success == true) {
                        toastr.success(res.message);
                    } else {
                        toastr.error(res.message);
                    }
                    geteveryData()
                }
            })
        });
    });

 // 关键字查询
$(".btn_found").click(function () {
    var chickenhousename = $("#everyNumber").val()
    // 数据为空时不能查询
    if (chickenhousename == "") {
        return false;
    }
    $.ajax({
        type: "get",
        url: http + "/chickenhouseday/find.do",
        dataType: "json",
        data: {
            chickenhousename: chickenhousename,
            page: page,
            size: size,
            token:token
        },
        success: function (res) {
            $.each(res.rows, function (i) {
                var dataTime = moment(res.rows[i].date).format('YYYY-MM-DD');
                res.rows[i].date = dataTime;
            })
            var html = template("everyTel", {
                "rows": res.rows
            });
            $("#everyTable").html(html);
            if (res.total < 1) {
                $(".data_num").css("display", "table-row")
            }
        }
    })
})
})
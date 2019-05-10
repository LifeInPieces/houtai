function paymoney() {
	$.ajax({
		url: http + "/moneyanalysis/findByDate.do",
		type: "get",
		async: false,
		dataType: "json",
		data: {
			beforeDate: beforedate,
			afterDate: enddate,
			token:token
		},
		success: function (res) {
			// Make monochrome colors and set them as default for all pies
			Highcharts.getOptions().plotOptions.pie.colors = (function () {
				var colors = [],
					base = Highcharts.getOptions().colors[0],
					i;
				for (i = 0; i < 10; i += 1) {
					// Start out with a darkened base color (negative brighten), and end
					// up with a much brighter color
					colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
				}
				return colors;
			}());
			// 初始化图表
			var chart = Highcharts.chart('container2', {
				title: {
					text: '各类支出比例图'
				},
				tooltip: {
					pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							format: '<b>{point.name}</b>: {point.percentage:.1f} %',
							style: {
								color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
							}
						}
					}
				},
				series: [{
					type: 'pie',
					name: '各类支出比例',
					data: [
						[res.paydanchicken, res.paydanchickenmoney],
						[res.payrouchicken, res.payrouchickenmoney],
						{
							name: res.paydrug,
							y: res.paydrugmoney,
							sliced: true,
							selected: true
						},
						[res.payfodder, res.payfoddermoney],
						[res.paygoods,res.paygoodsmoney],
						[res.payother, res.payothermoney]
					]
				}]
			});

		}
	});
}
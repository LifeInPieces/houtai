function getmoney(){
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
				Highcharts.chart('container', {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: 'pie'
					},
					title: {
						text: '各类收入比例图'
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
						name: 'Brands',
						colorByPoint: true,
						data: [{
							name: res.getrouchicken,
							y: res.getrouchickenmoney,
							sliced: true,
							selected: true
						}, {
							name: res.getdanchicken,
							y: res.getdanchickenmoney
						}, {
							name: res.getegg,
							y: res.geteggmoney
						}, {
							name: res.getmanure,
							y: res.getmanuremoney
						}, {
							name: res.getother,
							y: res.getothermoney
						} ]
					}]
				});
			}
		});
	}



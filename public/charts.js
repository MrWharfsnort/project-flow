$.get('/api/interval/history', {intervalCount: 7}, function(res) {
		var intervalArray = res.intervals;
		$.get('/api/chunk/history', function(chunkRes) {
			var chunks = chunkRes.chunks;

			//just for testing, delet later
			var challArr = [];
			var skillArr = [];
			var activityLabel = [];
			var caffeineArr = [];
			var snackArr = [];
			var floArr = [];
			var mealsArr = [];
			var sleepArr = [];
			var taskLength = [];
			var dateArr = [];



			function getchallArr (arr){
				for(var i in arr){
					if (arr[i].perceivedChallenge){
						challArr.push(arr[i].perceivedChallenge);
					} else {
						challArr.push(null);
					}
				}
			}
			getchallArr(intervalArray);

			function getskillArr (arr){
				for(var i in arr){
					if (arr[i].percievedSkill){
						skillArr.push(arr[i].percievedSkill);
					} else {
						skillArr.push(null);
					}
				}
			}
			getskillArr(intervalArray);

			function getActivity (arr){
				for(var i in arr){
					if (arr[i].activity) {
						activityLabel.push(arr[i].activity);
					} else {
						activityLabel.push(null);
					}
				}
			}
			getActivity(intervalArray);

			function getSnacks (arr){
				for(var i =0; i <arr.length; i++){
					if (intervalArray[i].snack){
						snackArr.push(intervalArray[i].snack);
					} else {
						snackArr.push(null);
					}
				}
			}
			getSnacks(intervalArray);

			function getCaffeine (arr){
				for(var i =0; i <arr.length; i++) {
					if (intervalArray[i].caffeine){
						caffeineArr.push(intervalArray[i].caffeine);
					} else {
						caffeineArr.push(null);
					}
				}
			}
			getCaffeine(intervalArray);

			function getMadFlo (arr){
				for(var i in arr){
					if (arr[i].flow){
						floArr.push(arr[i].flow);
					} else {
						floArr.push(null);
					}
				}
				console.log("floarr" + floArr);
			}
			getMadFlo(intervalArray);

			function mealsEaten (arr){
				for(var i in arr){
					if(arr[i].mealsEaten) {
						mealsArr.push(arr[i].mealsEaten);
					} else {
						mealsArr.push(null);
					}
				}
			}
			mealsEaten(chunks);

			function sleepSlept (arr){
				for(var i in arr){
					if(arr[i].hoursSlept){
						sleepArr.push(arr[i].hoursSlept);
					} else {
						sleepArr.push(null);
					}
				}
			}
			sleepSlept(chunks);

			console.log(caffeineArr);
			console.log(snackArr);
			console.log(mealsArr);
			console.log(sleepArr);

			//the high chart function
			$(function () {
				$('.custom-bar-chart').highcharts({
					chart: {
						zoomType: 'xy'
					},
					title: {
						text: 'Flow at Break Times'
					},
					subtitle: {
						text: 'Your last 7-days logged'
					},
					xAxis: [{
						categories: activityLabel,
						crosshair: true
					}],
					yAxis: [{ // Primary yAxis
						labels: {
							format: '{value}',
							style: {
								color: Highcharts.getOptions().colors[2]
							}
						},  plotLines: [{
						    color: 'red', // Color value
						    dashStyle: 'dot', // Style of the plot line. Default to solid
						    value: 0, // Value of where the line will appear
						    width: 5 // Width of the line
						 }],
						title: {
							text: 'floPoint® metric',
							style: {
								color: Highcharts.getOptions().colors[2]

							}
						},
						opposite: true

					}, { // Secondary yAxis
						gridLineWidth: 0,
						title: {
							text: 'Bar Values',
							style: {
								color: Highcharts.getOptions().colors[0]
							}
						},
						labels: {
							format: '{value}',
							style: {
								color: Highcharts.getOptions().colors[0]
							}
						}

					}, { // Tertiary yAxis
						gridLineWidth: 5,
						title: {
							text: 'Flo',
							style: {
								color: Highcharts.getOptions().colors[1]
							}
						},
						labels: {
							format: '{value}',
							style: {
								color: Highcharts.getOptions().colors[1]
							}
						},
						opposite: true
					}],
					tooltip: {
						shared: true
					},
					legend: {
						layout: 'vertical',
						align: 'left',
						x: 50,
						verticalAlign: 'top',
						y: 0,
						floating: true,
						backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#ffefd5'
					},
					series: [{
						name: 'Percieved Skill',
						type: 'column',
						yAxis: 1,
						data: skillArr,
						tooltip: {
							valueSuffix: ' self reported'
						}

					}, {
						name: 'Percieved Challenge',
						type: 'column',
						yAxis: 1,
						data: challArr,
						tooltip: {
							valueSuffix: ' self reported'
						}
					}, {
						name: 'Caffeine',
						type: 'column',
						yAxis: 1,
						data: caffeineArr,
						tooltip: {
							valueSuffix: ' self reported'
						}

					}, {
						name: 'Snacks',
						type: 'column',
						yAxis: 1,
						data: snackArr,
						tooltip: {
							valueSuffix: ' self reported'
						}
					}, /*{
						name: 'Hours Slept',
						type: 'column',
						yAxis: 1,
						data: sleepArr,
						tooltip: {
							valueSuffix: ' self reported'
						}

					}, {
						name: 'Meals Eaten',
						type: 'column',
						yAxis: 1,
						data: mealsArr,
						tooltip: {
							valueSuffix: ' self reported'
						}

					},*/  {
						name: 'Flo',
						type: 'spline',
						lineWidth: 2,
						data: floArr,
						tooltip: {
							valueSuffix: ' floPoint®'
						}
					}]
			});






		});
	});
});






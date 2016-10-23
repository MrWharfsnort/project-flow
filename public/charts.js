
$.get(‘/api/interval/history’, {intervalCount: 7}, function(res) {
	console.log(res.intervals[3].activity);
});
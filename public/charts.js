$.get('/api/interval/history', {intervalCount: 7}, function(res) {
	var intervalArray = res.intervals;
    var chartTitle = "Last 7 Break Intervals Named by Activity";
    // var xAxisLabelArray = ['Chunk1', 'Chunk2', 'Chunk3', 'Chunk4', 'Chunk5',"crazyArea"];
    // var yAxisLabelArray = ['salvia','peyote','ergot bread','whippits'];

    //just for testing, delet later
    var challArr = [];
    var skillArr = [];
    var activityLabel = [];
    var caffeineArr = [];
    var snackArr = [];
    var floArr = [];

    function orderByTime(){
        intervalArray.sort(intervalArray.timeFromStart);
    }

    function getchallArr (arr){
        for(var i in arr){
            challArr.push(arr[i].perceivedChallenge);
        }
    }
    getchallArr(intervalArray);

    function getskillArr (arr){
        for(var i in arr){
            skillArr.push(arr[i].percievedSkill);
        }
    }
    getskillArr(intervalArray);

    function getActivity (arr){
        for(var i in arr){
            activityLabel.push(arr[i].activity);
        }
    }
    getActivity(intervalArray);

    function getSnacks (arr){
            for(var i =0; i <arr.length; i++){
                if(arr[i].snack === false){
                    snackArr.push("null");
                } else {
                    snackArr.push("5");
            }
        }
    }
    getSnacks(intervalArray);

    function getCaffeine (arr){
            for(var i =0; i <arr.length; i++) {
                if(arr[i].caffeine === false) {
                    caffeineArr.push("null");
                } else {
                    caffeineArr.push("6");
            }
        }
    }
    getCaffeine(intervalArray);

    function getMadFlo (arr){
        for(var i in arr){
            floArr.push(arr[i].flow);
        }  
    }
    getMadFlo(intervalArray);

    //the high chart function
    $(function () {
        $('#container').highcharts({
            chart: {
            zoomType: 'xy'
            } ,
            title: {
                text: chartTitle
            } ,
            xAxis: {
                categories: activityLabel
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Percieved Challenge',
                data: challArr
            }, {
                name: 'Perceived Skill',
                data: skillArr
            }, {
                name: 'Snacks',//not sure why they produce more values than in array
                data: snackArr
            }, {
                name: 'Caffeine',//not sure why they produce more values than in array
                data: caffeineArr
            }]
        });
    });
});

$.get('/api/chunk/history', {chunkCount: 7}, function(res) {

    var chunkArray = res.chunks;
    var sleepArr = [];
    var mealsArr = [];
    var chunkOrder = [];
    var floArr = [];
    //i need to sort these by time

    function getHoursSlept (arr){
        for(var i in arr){
            sleepArr.push(arr[i].hoursSlept);
        }      
    }
    getHoursSlept(chunkArray);

    function getMealsEaten (arr){
        for(var i in arr){
            mealsArr.push(arr[i].mealsEaten);
        }  
    }
    getMealsEaten(chunkArray);



        $(function () {
            $('#container2').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: chartTitle
                } , 
                yAxis: {
                    title: "Numbers" 
                },
                xAxis: {
                    categories: activityLabel
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Hours of Sleep',
                    data: sleepArr
                }, {
                    name: 'Meals Eaten',
                    data: mealsArr
                }]
            });
        });
        console.log(sleepArr);
        console.log(mealsArr);
});
/* jshint esversion: 6 */
module.exports = (mongoose) => {
   var IntervalSurveySchema = new mongoose.Schema({
    email: String,
	timeFromStart: Number,//values the x of the graph, called labels to chartist
	date: String,
	perceivedChallenge: Number,//1-10 polled at begining an end,
	percievedSkill: Number,//1-10 polled at begining an end,
	activity: String,
	caffeine: Number,
	snack: Number,
	flow: Number
   });

   var Interval = mongoose.model('Interval', IntervalSurveySchema);

   return Interval;
};

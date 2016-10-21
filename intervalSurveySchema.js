/* jshint esversion: 6 */
module.exports = (mongoose) => {
   var IntervalSurveySchema = new mongoose.Schema({
	timeFromStart: Number,//values the x of the graph, called labels to chartist
	perceivedChallenge: Number,//1-10 polled at begining an end,
	percievedSkill: Number,//1-10 polled at begining an end,
	activity: String
   });

   var Interval = mongoose.model('Interval', IntervalSurveySchema);

   return Interval;
};

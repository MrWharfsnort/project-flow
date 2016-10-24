/* jshint esversion: 6 */
module.exports = (mongoose, Interval) => {
   var ChunkSchema = new mongoose.Schema({
	timeSpent: Number,//values the x of the graph, called labels to chartist
	timeOfDay: String,//displayed along x as well
	hoursSlept: Number,//1-10 polled at begining an end,
	mealsEaten: Number,//not sure really how we'll measure this
	intervals: [String],
	skillTotal: Number,
    snackTotal: Number,
    caffeineTotal: Number,
	challengeTotal: Number,
	skillAverage: Number,
	challengeAverage: Number
   });

   var Chunk = mongoose.model('Chunk', ChunkSchema);

   return Chunk;
};

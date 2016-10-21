/* jshint esversion: 6 */
module.exports = (mongoose) => {
   var ChunkSchema = new mongoose.Schema({
	timeSpent: Number,//values the x of the graph, called labels to chartist
	timeOfDay: Number,//displayed along x as well
	perceivedChallenges: Number,//1-10 polled at begining an end,
	percievedSkillsUsed: Number,//1-10 polled at begining an end,
	caffineTaken: Number,//1-10 polled at begining an end,
	sleepSlept: Number,//1-10 polled at begining an end,
	nutrition: Number//not sure really how we'll measure this
   });

   var Chunk = mongoose.model('Chunk', ChunkSchema);

   return Chunk;
};

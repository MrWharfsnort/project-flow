/* jshint esversion: 6 */
module.exports = (mongoose) => {
   var ChunkSchema = new mongoose.Schema({
	timeSpent: Number,
	timeOfDay: Number,
	perceivedChallenges: Number,
	percievedSkillsUsed: Number,
	caffineTaken: Number,
	sleepSlept: Number,
	nutrition: Number
   });

   var Chunk = mongoose.model('Chunk', ChunkSchema);

   return Chunk;
};

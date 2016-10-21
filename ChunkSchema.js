

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

   var User = mongoose.model('User', ChunkSchema);

   return User;
};

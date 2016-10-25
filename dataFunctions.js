/* jshint esversion: 6 */
module.exports = function dataFunctions(mongoose, User, Chunk, Interval) {

	this.getChunkHistory = function(user, days, cb) {
		User.find({email: user}, {chunks: 1, _id: 0}, (err, data) => {
			if (err) { return console.log('error getting chunk history', err); }
			var chunkIds;
			if(days > data[0].chunks.length) {
				chunkIds = data[0].chunks;
			} else {
				chunkIds = data[0].chunks.slice(data[0].chunks.length - days);
			}
			
			Chunk.find({_id: { $in: chunkIds}}, (err, chunks) => {
			// console.log("From get getChunkHistory: " + chunks);
				if(!cb) {
					days(chunks);
				} else{
					cb(chunks);
				}
			});
		});
	};

	this.getChunkByID = function(id) {
		Chunk.find({_id: id}, (err, data) => {
			if (err) { return console.log(err); }
			return data;
		});
	};

	this.getIntervalById = function(id) {
		Interval.find({_id: id}, (err, data) => {
			if (err) { return console.log(err); }
			return data;
		});
	};

	this.getIntervalHistory = function(email, number, cb) {
		
		this.getChunkHistory(email, number, function(chunks) {
			var intervalIds = [];
			for (var i = 0; i < chunks.length; i++) { //create an array of interval ids for the specified number of days
				for (var j = 0; j < chunks[i].intervals.length; j++){
					intervalIds.push(chunks[i].intervals[j]);
				}
			}
// console.log("chunks from interval history: " + chunks);
			Interval.find({_id: {$in: intervalIds}}, (err, data) => {
				if(err) {
					return console.log("error from dataFunctions getIntervalHistory: " + err);
				}
				// console.log("intervals data: " + data);
				cb(data);
			});

		});	
	};

};

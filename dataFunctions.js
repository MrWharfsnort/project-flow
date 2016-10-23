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
      Interval.find({email: email}, (err, data) => {
         if(err) {
            return console.log("error from dataFunctions getIntervalHistory: " + err);
         }
         if(!cb) {
            number(data);
         } else {
            if(number > data.length) {
               cb(data);
            } else {
               cb(data.slice(data.length - number));
            }
         }
      });
   };
};

/* jshint esversion: 6 */
module.exports = (mongoose, ChunkSchema) => {
   var UserSchema = new mongoose.Schema({
      name: String,
      password: String,
      email: String,
      chunks: [Chunks]
   });

   var User = mongoose.model('User', UserSchema);

   return User;
}


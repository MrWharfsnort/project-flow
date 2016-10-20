/* jshint esversion: 6 */
module.exports = (mongoose, Chunk) => {
   var UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String
      // chunks: [Chunk]
   });

   var User = mongoose.model('User', UserSchema);

   return User;
}

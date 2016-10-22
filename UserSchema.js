/* jshint esversion: 6 */

module.exports = (mongoose, Chunk) => {
   var UserSchema = new mongoose.Schema({ // creates a new mongoose schema called UserSchema
      name: String,
      email: String,
      password: String,
      chunks: [String]
   });

   var User = mongoose.model('User', UserSchema); // create a new model called 'User' based on 'UserSchema'

   return User;
};

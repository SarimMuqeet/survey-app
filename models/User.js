const mongoose = require ('mongoose');
const Schema = mongoose.Schema;     //in ES6 can also be written as const { Schema } = mongoose;

// set properties we want from each instance
const userSchema = new Schema({
    //treat all googleids as strings
    googleId: String
});

// tell mongoose to create a new model (collection in mongoDB), called 'users' - will not overwrite existing collections, will merely create if it does not exist already
mongoose.model('users', userSchema);


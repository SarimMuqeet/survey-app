
//common NodeJS modules - system for requiring and sharing code between different files
const express = require('express');

//require mongoose
const mongoose = require('mongoose');
const keys = require('./config/keys.js');

//to access cookies and use them with passportJS
const cookieSession = require('cookie-session');
const passport = require('passport');

//mongoose connect method
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

// require in user.js - mongoose configuration file (to create a collection of users)
require('./models/User.js');
//need to require the passport file in here - since there is no export method in the passport file, we can just leave it as a require statement
require('./services/passport.js');


const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,   //duration of cookie in milliseconds (30 days)
    keys: [keys.cookieKey]
  })
);
app.use(
  passport.initialize()
);
app.use(
  passport.session()
);



/* import authRoutes file - becomes function (being exported from file) that takes app 
    object and attaches the routes from the other file to it */
const authRoutes = require('./routes/authRoutes');
authRoutes(app);

// can combine the two lines above with:    require('./routes/authRoutes')(app);



//heroku has the ability to inject environemnt variables to Node's runtime
//this will help figure out what port heroku is using so instead of port 5000 we use heroku's app (in production)
//port 5000 is used in developer mode
const PORT = process.env.PORT || 5000;

//express telling node (runtime) to watch for any traffic on port
app.listen(PORT);





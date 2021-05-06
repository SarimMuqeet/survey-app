//require newly installed passport libraries
const passport = require('passport');
//ouath module exports multiple properties but we only need the .Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;

/* Note:    ./ refers to current directory
            ../ refers to outer directory (in this case, survey-app folder)
*/
const keys = require('../config/keys.js');

//pull model out of mongoose - User object becomes model class (gives relation to collection in mongoDB)
const mongoose = require('mongoose');
const User = mongoose.model('users');


//generate identifying information (turn mongoose model into user id)
passport.serializeUser((user, done) => {
    done(null, user.id); //user id is assigned by mongodb database, different from google id; using this in case user does not have a google id but another auth method
});

//turn id into a mongoose model instance
passport.deserializeUser((id, done) => {
    //query for user id in database NOTE: accessing mongo db should always be assumed to be ASYNCHRONOUS (returns promise)
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});


/* 
    - new GoogleStrategy creates a new instance of google passport strategy
    - GoogleStrategy() takes in arguments, in this cae (config options, arrow function that is a callback)
    - passport.use is essentially a generic register (informing passport a new stategy is available)
*/

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        //new url that user is sent to once granted permission (google auth sends them back to our server)
        callbackURL: '/auth/google/callback'
    }, 
    // second parameter - callback function with parameters accessToken, refreshToken, profile, and done function
    (accessToken, refreshToken, profile, done) => {

        // query databse for all records inside collection to see if user already exists (Asynchronous so it returns a promise)
        User.findOne({ googleId: profile.id }).then((existingUser) => {     //once query is completed, use whatever is returned to check:
            //if "existingUser" is not null, user already exists (have existing record with profile id)
            if(existingUser){ 
                // user already exists, so simply call the done function
                done(null, existingUser); //argument 1: error object (null in this case as no errors), argument 2: user record
            }
            else {
                /* model instance created inside collection - only care about google id property ; 
                    .save will save instance in mongodb collection
                    .then - need to ensure done function occurs only after save is completed 
                        in promise callback, we get another model instance - user (most updated version of "User" saved 
                        when model instance was initially created)
                */
                new User ({ googleId: profile.id }).save().then(user => { 
                    done(null, user)
                });
            }
        })

        //console.log('access token', accessToken);
        //console.log('refresh token', refreshToken);
        //console.log('profile', profile);
    })
);



// add route handlers

//making use of the passport library so we have to import passport (original npm module, not from passport.js file)
const passport = require('passport');



module.exports = (app) => {

    /* test route handlers
    app.get('/',(req, res) => {
        res.send({ bye: 'buddy'});
    });
    */

    /*route handler key takeaways: 
        - reference the express app object
        - state type of request to be handled, 
        - then as parameters:
            1. PATH you want to handle   2. code to be executed whenever a request comes in from that path route
        - passort.authetnicate arguments:
            1. google (strategy we're using in this case)   2. object with scope - specifies to google to give access to profile and email info (profile and email are two of the options google has under its list of scopes)
    */
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    /*case where user has code available to them (code gets exchanged for personal info and access)
        instead of attempting to authetnicate for the first time, recognizes that they are attempting to turn the code
        into a profile - so it will exchange code for profile instead of sending them through the oauth flow again
    */
    app.get('/auth/google/callback', passport.authenticate('google'))

    //logging out users
    app.get('/api/logout', (req, res) => {
        req.logout();       //automatic function attached to req property by passport, kills cookie related to user id
        res.send(req.user);     // - empty response on route = successful logout
    });
    
    //authetnication test route:
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    })

};




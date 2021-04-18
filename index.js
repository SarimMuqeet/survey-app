//common NodeJS modules - system for requiring and sharing code between different files
const express = require('express');

const app = express();

//route handler with express
app.get('/',(req, res) => {
    res.send({ hi: 'there'});
});

//heroku has the ability to inject environemnt variables to Node's runtime
//this will help figure out what port heroku is using so instead of port 5000 we use heroku's app (in production)
//port 5000 is used in developer mode
const PORT = process.env.PORT || 5000;

//express telling node (runtime) to watch for any traffic on port
app.listen(PORT);


const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8081;
const Datastore = require('nedb');


app.use(bodyParser.json());
app.use("/",express.static('public'));

app.get("/cool", (req,res) => {
    console.log("Requested / route");
    res.send(`<html>
                <body>
                    <h1>`+cool()+`</h1>
                </body>
            </html>`);
});

app.listen(port, () => {
    console.log(`Server ready at port ${port}`);
});

//API Antonio Saborido
/*
const apiext5 = require("./src/back/tennis/apiext5");
apiext5.register(app);

const apiext4 = require("./src/back/tennis/apiext4");
apiext4.register(app);

const apiext3 = require("./src/back/tennis/apiext3");
apiext3.register(app);

const twitch = require("./src/back/tennis/tennistwitch");
twitch.register(app);

const tennislivedata = require("./src/back/tennis/tennislivedata");
tennislivedata.register(app);

const tennis_API = require("./src/back/tennis/tennis.js");
tennis_API.register(app,db_tennis);

const tennis_APIv2 = require("./src/back/tennis/tennisv2.js");
tennis_APIv2.register(app,db_tennis2);
*/

//Proxy Antonio Saborido Campos: 
/*
var paths3='/remoteApiBelen';
var paths4='/remoteApiBelenLoadInitialData';

var apiServerHost3 = 'https://sos2122-22.herokuapp.com/api/v2/coal-stats';
var apiServerHost4 = 'https://sos2122-22.herokuapp.com/api/v2/coal-stats/loadInitialData';

app.use(paths3, function(req, res) {
  var url1 = apiServerHost3 + req.url;
  req.pipe(request(url1)).pipe(res);	
});
app.use(paths4, function(req, res) {
  var url2 = apiServerHost4 + req.url;
  req.pipe(request(url2)).pipe(res);	
});


*/
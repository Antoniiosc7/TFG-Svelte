const bodyParser = require("body-parser");

const BASE_API = "/api/v1";

//API Antonio Saborido

const _ = require('lodash');
const axios = require('axios').default;
/*
*/


module.exports.register = (app) => {
    const options = {
      method: 'GET',
      url: 'https://ultimate-tennis1.p.rapidapi.com/live_leaderboard/50',
      headers: {
        'X-RapidAPI-Host': 'ultimate-tennis1.p.rapidapi.com',
        'X-RapidAPI-Key': 'e950eb3f63msh045c2ecb2e5934ep10bdf6jsne4c2ebde5819'
      }
    };
    

    
    axios.request(options).then(function (response) {
        tennisplayers1=response.data.data;
    }).catch(function (error) {
        console.error(error);
    });   

    app.get(BASE_API + "/tennis-apiext", (req, res) => {
        res.send(JSON.stringify(tennisplayers1));
    });
}
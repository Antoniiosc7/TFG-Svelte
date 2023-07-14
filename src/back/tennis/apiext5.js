const bodyParser = require("body-parser");

const BASE_API = "/api/v1";

//API Antonio Saborido

const _ = require('lodash');
const axios = require('axios').default;
/*
*/
//

module.exports.register = (app) => {
  const options = {
    method: 'GET',
    url: 'https://sportscore1.p.rapidapi.com/tennis-rankings/wta',
    params: {page: '1'},
    headers: {
      'X-RapidAPI-Host': 'sportscore1.p.rapidapi.com',
      'X-RapidAPI-Key': 'e950eb3f63msh045c2ecb2e5934ep10bdf6jsne4c2ebde5819'
    }
  };



  axios.request(options).then(function (response) {
    tennisplayers2 = response.data.data;
  }).catch(function (error) {
    console.error(error);
  });

  app.get(BASE_API + "/apiext5", (req, res) => {
    res.send(JSON.stringify(tennisplayers2));
  });
}
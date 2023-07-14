const bodyParser = require("body-parser");

const BASE_API = "/api/v1";

//API Antonio Saborido

const _ = require('lodash');
const axios = require('axios').default;
/*
*/


module.exports.register = (app) => {
    
    const init = {
        method: 'GET',
        url: 'https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats/loadinitialdata',
    }
    const options = {
      method: 'GET',
      url: 'https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats',
    };
    

    
    axios.request(options).then(function (response) {
        ext3=response.data;
    }).catch(function (error) {
        console.error(error);
    });   

    app.get(BASE_API + "/apiext3", (req, res) => {
        res.send(JSON.stringify(ext3));
    });
}
const fs = require('fs');
var express = require('express');
const NodeCache = require( "node-cache" );

let bigMacIndex = fs.readFileSync('big-mac-index.json');
let bigMacIndexJson = JSON.parse(bigMacIndex);
/**
 * Initializing a local cache of the big mac index on init
 * @type {NodeCache}
 */
const bigMacCache = new NodeCache();
bigMacIndexJson.map(countryData =>{
    console.log(countryData);
    bigMacCache.set(countryData.Country + "." +countryData.Date , countryData, 10000);

});


var app = express();
app.get('/getBigMacIndex', function (req, res) {
    res.send(bigMacCache.keys());
    // res.send(bigMacCache.mget());
});
app.get('/getRate', function (req, res) {
    let country = req.param("country");
    let date = req.param("date");
   let result =  bigMacCache.get(country + "." + date);
    res.send(result);

    // res.send(bigMacCache.mget());
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


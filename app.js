const fs = require('fs');
var express = require('express');
const NodeCache = require( "node-cache" );

let bigMacIndex = fs.readFileSync('big-mac-index.json');
let bigMacIndexJson = JSON.parse(bigMacIndex);

// Initializing a local cache of the big mac index on init
/**
 * NOTE : we are only storing to the cache the latest data from the csv which is stored in the local file as Json.
 */
const bigMacCache = new NodeCache();
const bigMaCountryList  = [];
bigMacIndexJson.map((countryData, i ) =>{
    bigMacCache.set(countryData.Country, countryData, 10000);
    bigMaCountryList[i] = countryData.Country;
});



var app = express();
app.get('/getBigMacIndex', function (req, res) {
    res.send(bigMacCache.keys());
    // res.send(bigMacCache.mget());
});
app.get('/getRate', function (req, res) {
    let country = req.param("country");
    res.send(bigMacCache.get(country));
});
app.get('/getRandom', function (req, res) {
    let otherThanCountry = req.param("country");
    res.send(bigMacCache.get(getRandomCountry(otherThanCountry)));
});


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function getRandomCountry(otherThanCountry){
    let randomIndex = getRandomInt(bigMaCountryList.length);
    let country = bigMaCountryList[randomIndex];
    if(country === otherThanCountry){
        getRandomCountry(otherThanCountry)
    } else {
        return country;
    }
}
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


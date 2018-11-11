const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

//HERE credentials
const hereID = 'AyRwHKodLtAKGHVBupYv';
const hereCode = 'a_oRignpd3xE7kuetWBy9w';

//Twilio credentials:
const twilioSid = 'ACfb1162f7c68d85e92eaee9ea033d32d3';
const twilioToken = '799b7c57a2a43525f668215b02d1c09b';
const client = require('twilio')(twilioSid, twilioToken);

var places = [];

//user enters search query
app.get('/', (req, res) => {
    //const twiml = new MessagingResponse();
    //var incoming = req.body.Body;
    // var searchQuery = incoming;
    // OPTION: USE CURRENT LOCATION OR SEARCH CUSTOM LOCATION

    var locationString = 'university of waterloo';
    var geocodeURL = 'https://geocoder.cit.api.here.com/6.2/geocode.json' +
      '?app_id=' + hereID +
      '&app_code=' + hereCode +
      '&searchtext=' + locationString;

    let geocodePromise = new Promise((resolve, reject) => {
      request.get(geocodeURL, (error, response, body) => {
        resolve(JSON.parse(body));
      });
    });

    geocodePromise.then(result => {
      var coordinates = {
         lat: result.Response.View[0].Result[0].Location.DisplayPosition.Latitude,
         long: result.Response.View[0].Result[0].Location.DisplayPosition.Longitude
      };

      let options = {
          "url": "https://apis.solarialabs.com/shine/v1/parking-rules/meters",
          "method": "GET",
          "qs": {
              "lat": 	42.3451, // FIXED RN CHANGE LATER
              "long": -71.0993,
              //"lat": coordinates.lat,
              //"long": coordinates.long,
              "apikey": "xGl8TOrYGBdHIKEuEA3TNKWgNgyAWWCw"
          }
      }

      request.get(options,(err,resp,body) => {
        let parkings = JSON.parse(body);
        let list = [];
        let parkingListPromise = new Promise((resolve, reject) => {
          for (let i = 0; i < Math.min(5, parkings.length); i++) {
              findParking(parkings[i]).then(result2 => {
                let placesJson = JSON.parse(result2);
                let placeResult = placesJson.Response.View[0].Result[0].Location.Address.Label;
                //let resultAmount = Math.min(1, placeResults.length);

                //parkingDescriptions[i] = "Wtfwtfwtf";
                list[i] = (i + 1) + ". " + placeResult + "\n";

                if (i == Math.min(4, (parkings.length - 1))) {
                  resolve(list);
                }
              });
          }
        });

        parkingListPromise.then(list => {
          /*
          let output = "";
          for (let j = 0; j < list.length; j++) {
            output = output + list[j].toString();
          }
          */
          res.write(list.toString());

          // user chooses parking spot here, let this be list[c];
          let c = 3;

          //location1 = options.qs.lat, options.qs.long
          //location2 = parkings[i].Latitude, parkings[i].Longitude

          findRoute(options.qs.lat, options.qs.long, parkings[c].Latitude, parkings[c].Longitude).then(result3 => {
            let routeJson = JSON.parse(result3);
            let justDirections = routeJson.response.route[0].leg[0].maneuver;


            let instructions = "";
            for (let a = 0; a < justDirections.length; a++) {
              instructions += a + ". " + justDirections[a].instruction + "\n";
            }

            res.write(instructions.toString());
            res.end();
          });
        });
      });
    });
});

function findRoute(l1lat, l1long, l2lat, l2long) {
   let routeURL = 'https://route.api.here.com/routing/7.2/calculateroute.json' +
   '?waypoint0=' + l1lat + ',' + l1long +
   '&waypoint1=' + l2lat + ',' + l2long +
   '&mode=fastest;car;traffic:enabled' +
   '&app_id=' + hereID +
   '&app_code=' + hereCode +
   '&departure=now';

   let routeResult = new Promise((resolve, reject) => {
     request.get(routeURL, (error, response, body) => {
       resolve(body);
     });
   });

   return routeResult;
}

function findParking(parking) {
    let lat = parking.Latitude;
    let long = parking.Longitude;
    let radius = 250;

    let placeURL = 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json' +
       '?prox=' + lat + ',' + long + ',' + radius +
       '&mode=retrieveAddresses&maxresults=1&gen=9' +
       '&app_id=' + hereID +
       '&app_code=' + hereCode;

    let placeResult = new Promise((resolve, reject) => {
       request.get(placeURL, (error, response, body) => {
          resolve(body);
       });
    });

    return placeResult;
}

http.createServer(app).listen(1337, () => {
   console.log('Express server listening on port 1337');
});

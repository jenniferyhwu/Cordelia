const http = require('http');
const express = require('express');
const session = require('express-session');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(session({secret: 'anything-you-want-but-keep-secret'}));

//HERE credentials
const hereID = 'AyRwHKodLtAKGHVBupYv';
const hereCode = 'a_oRignpd3xE7kuetWBy9w';

//Twilio credentials:
const twilioSid = 'ACfb1162f7c68d85e92eaee9ea033d32d3';
const twilioToken = '799b7c57a2a43525f668215b02d1c09b';
const client = require('twilio')(twilioSid, twilioToken);

const response = new MessagingResponse();

app.post('/sms', (req, res) => {
    const smsCount = req.session.counter || 0;
    const pLst = req.session.parkingList;
	const lati = req.session.lati;
	const longi = req.session.longi;
	
    let message;

    if (smsCount == 0) {
      message = "Hi! Give a location to find the closest parking spaces.";

      req.session.counter = smsCount + 1;

      const twiml = new MessagingResponse();
      twiml.message(message);
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());

    } else if (smsCount == 1) {
      let query = req.body.Body;
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
                "lat": 	42.3451, // related to Shine API issue
                "long": -71.0993,
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

                  list[i] = "\n " + (i + 1) + ". " + placeResult + "\n";

                  if (i == Math.min(4, (parkings.length - 1))) {
                    resolve(list);
                  }
                });
             }
           });

          parkingListPromise.then(list => {
            let message = "Hey, pick a parking spot: \n" + list;
            req.session.parkingList = parkings;
			req.session.lati = 42.3451;
			req.session.longi = -71.0993;

            req.session.counter = smsCount + 1;

            const twiml = new MessagingResponse();
            twiml.message(message);
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
          });
        });
    });
  } else if (smsCount == 2) {
      let c = parseInt(req.body.Body);
      if (c > pLst.length) {
        req.session.counter = smsCount;
		message = "I didn't give you that option. Choose again.";
		const twiml = new MessagingResponse();
		twiml.message(message);
		res.writeHead(200, {'Content-Type': 'text/xml'});
		res.end(twiml.toString());
      } else {
        findRoute(lati, longi, pLst[c-1].Latitude, pLst[c-1].Longitude).then(result3 => {
          let routeJson = JSON.parse(result3);
          let justDirections = routeJson.response.route[0].leg[0].maneuver;


          let instructions = "";
          for (let a = 0; a < justDirections.length; a++) {
            instructions += (a+1) + ". " + justDirections[a].instruction + "\n";
          }

          instructions = instructions.replace(/<\/?span[^>]*>/g,"");

          message = "Here's how to get there: \n" + instructions.toString();

          req.session.counter = smsCount + 1;

          const twiml = new MessagingResponse();
          twiml.message(message);
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());

          req.session.destroy();
        });
      }
  }
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
    let lati = parking.Latitude;
    let longi = parking.Longitude;
    let radius = 250;

    let placeURL = 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json' +
       '?prox=' + lati + ',' + longi + ',' + radius +
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

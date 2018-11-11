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

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  twiml.message('Hello, there!');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
   console.log('Express server listening on port 1337');
});

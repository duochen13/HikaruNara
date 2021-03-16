var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var AWS = require('aws-sdk');

var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

var url = 'ttps://2okr71h4ab.execute-api.us-east-1.amazonaws.com/v1/search';

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());


// request({
//     url:'https://2okr71h4ab.execute-api.us-east-1.amazonaws.com/v1/search',
//     qs: { search:"This is A and B" }, function(err, response, body) {
//         if (err) { console.log("ERROR: ", err); return; }
//         console.log("Get response: " + response);
//         console.log("Get response statuscode: " + response.statusCode);
//     }
// });

let URL = 'https://2okr71h4ab.execute-api.us-east-1.amazonaws.com/v1/search';

const options = {
    hostname: URL,
    method: 'GET',
    header: {"Access-Control-Allow-Origin": "*"}
}



URL = 'https://2okr71h4ab.execute-api.us-east-1.amazonaws.com/v1/search'
data = "Hair Text"
function testFunc() {
    request({
            url: URL,
            qs:{
                q:data
            }
        }, function(err, response, body) {
            if (err) { console.log("ERROR:", err); }
            console.log("body: ", body);
            console.log("GET Response: ", response.statusCode);
        }
    );
}

testFunc();

// const req = https.request(options, res => {
//     console.log(`statusCode: ${res.statusCode}`);
//     console.log(`res: ${res}`);
//     // res.on('data', d => {
//     //     console.log('data: ', data)
//     // })
// })

// req.on('error', error => {
//     console.error('error:', error);
// })

// req.end();


console.log("Done!");

// URL = 'https://2okr71h4ab.execute-api.us-east-1.amazonaws.com/v1/search';
// curl -i -H "Accept: application/json" -H "Content-Type: application/json" http://hostname/resource
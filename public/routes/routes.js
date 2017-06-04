'use strict';
var request = require('request');
var eyes = require('eyes');
var fs = require('fs');
var parseString = require('xml2js').parseString;
var http = require('http');

module.exports = function(app){

	app.get('/', function(req, res){
		res.render('index', {title: 'Get Started!'});
	});

	app.post('/res', function(req, res){
		var stop = req.body.stop;
		var service = req.body.service;

		console.log("Searching RT Info for " + stop + " for service " + service + ".");
		if(stop == null){
			res.redirect('/');
			console.log('Please enter a stop number.');
		}

		if(service == "Dublin Bus" || service == "Bus Eireann"){
			var url = "https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=" + stop + "&format=json";
			request.get({
			    url: url,
			    json: true,
			    headers: {'User-Agent': 'request'}
			  }, (err, resp, data) => {
			    if (err) {
			      console.log('Error:', err);
			    } else if (res.statusCode !== 200) {
			      console.log('Status:', res.statusCode);
			    } else {
			      // data is already parsed as JSON:
			      var api_results = data.results;
			      console.log(api_results);
			     
			      	res.render('fetched', {title:service + ' Results', results: api_results});
			    }
			});

		}else if(service == "Luas"){
			var url = "http://luasforecasts.rpa.ie/xml/get.ashx?action=forecast&stop=" + stop + "&encrypt=false";
			request.get({
				url: url,
				xml: true,
				headers: {'User-Agent' : 'request'}
			}, (err, resp, data) => {
				if(err){
					console.log(err);
				}else if(res.statusCode !== 200){
					console.log(resp.statusCode);
				}else{
					parseString(data, {explicitArray : false}, function (err, result) {
					    var api_results = JSON.stringify(result);
					    res.render(service + '-Results', {title:service + ' Results', results: api_results});
					});
				}
			});
			
		}else{
			console.log("service wasn't DB, working on that next.");
			res.redirect('/');
		}
	});

};
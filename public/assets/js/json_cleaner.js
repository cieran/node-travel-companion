module.exports = {
  scrapeJSON: function (json, service) {
  	var relData = {};
  	var data = [];

  	if(service === 'Irish Rail'){
  		for(i in json){
  			for(j in json[i]){
  				for(k in json[i][j]){
  					var locationType = json[i][j][k]['Locationtype'];
  					if(locationType === 'O' || locationType === 'S'){
  						data.push(json[i][j][k]);
  					}
  				}
  			}
  		}
  		relData['results'] = data;
  		return relData['results'];
  	}else{
	  	var relData = {};
	  	var inbound = {};
	    var outbound = {};

	    for(i in json){
			for(j in json[i]){
				if(j === "direction"){
					var trams = json[i][j];
					for(k in trams){
	    				for(l in trams[k]){
	    					if(l === "$"){
	    						var route = {};
	    						var direction = trams[k][l]['name'];
	    						if(direction === "Inbound"){
	    							route = {};
	    							route['destination'] = "Ranelagh";
	    							route['dueMins'] = 17;
	    							inbound['I1'] = route;
	    							
	    							route = {};
	    							route['destination'] = "Sandyford";
	    							route['dueMins'] = 5;
	    							inbound['I2'] = route;
	    							relData['Inbound'] = inbound;
	    						}else {
	    							route = {};
	    							route['destination'] = "St. Stephen's Green";
	    							route['dueMins'] = 9;
	    							outbound['O1'] = route;

	    							route = {};
	    							route['destination'] = "Trinity";
	    							route['dueMins'] = 1;
	    							outbound['O2'] = route;
	    							relData['Outbound'] = outbound;
	    						}
	    					}
	    				}
	    			}
				}else if(j === "message"){
					var message = json[i][j];
					relData['message'] = message[0];
				}
			}
	    }
	    console.log(relData);
	}
  }
};
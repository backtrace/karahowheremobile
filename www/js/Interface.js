var Interface = function(){
	this.schools = new Array();
	var schools = this.schools;
	
	
	
	
	this.getSchools = function(){
		
		$.ajax({
			type: "GET",
			url: "http://www.spokanekaraho.com/karahowhere/gateway.php?callback=?",
			dataType: "text",
			success: function(jsonData){
				jsonData = $.parseJSON(jsonData);
				for(var i = 0; i < jsonData.length; i++){
					schools.push(
						new School(
							jsonData[i].SID,
							jsonData[i].name,
							jsonData[i].rank,
							jsonData[i].instructor,
							jsonData[i].phone,
							jsonData[i].address,
							jsonData[i].city,
							jsonData[i].state,
							jsonData[i].country,
							jsonData[i].lat,
							jsonData[i].lng
						)
					);
				}
			},
			error: function(x, y, z){
				alert("there was an error getting the school data.");
				alert(Object.keys(x));
				alert(x.status);
				alert(x.statusText);
				alert(y);
				alert(z);
			}
		});
	};
	
	
	
	
	var sortSchools = function(sortColumn, sortDirection){
		if(sortColumn == "distance"){
			if(sortDirection == "asc"){
				schools = schools.sort(function(a, b){return a.getDistance() - b.getDistance();});
			}
			else if(sortDirection == "desc"){
				schools = schools.sort(function(a, b){return b.getDistance - a.getDistance();});
			}
		}
		else{
			var sort = function(before, after){
				schools = schools.sort(function(a, b){
					var x = a[sortColumn].toLowerCase();
					var y = b[sortColumn].toLowerCase();
					if(x < y){
						return before;
					}
					if(x > y){
						return after;
					}
					return 0;
				});
			}
			if(sortDirection == "asc"){
				sort(-1, 1);
			}
			else if(sortDirection == "desc"){
				sort(1, -1);
			}
		}		
	};
	/*this.closeSplash = function (){
		$("#splash_content").animate({opacity: 0}, 3000, function(){
			$("#splash_content").css({display: "none"});
		});
		$("#sort_interface").css({display: "block"});
		$("#sort_interface").animate({opacity: 1, top: 0}, 3000, function(){
			$("#body").removeClass("splash_body").addClass("interface_body");
		});
	};*/
	
	
	
	
	this.displaySchools = function(){
		
		if (this.watchID != null) {
            navigator.geolocation.clearWatch(this.watchID);
            this.watchID = null;
        }
		var e = document.getElementById("sortColumn");
		var sortColumn = e.options[e.selectedIndex].value;
		e = document.getElementById("sortOrder");
		var sortOrder = e.options[e.selectedIndex].value;
		sortSchools(sortColumn, sortOrder);
		$(".list_entry").remove();
		for (var i = 0; i < schools.length; i++){
			if(schools[i].name == "" || schools[i].name == null){
				var title = schools[i].instructor;
			}
			else{
				var title = schools[i].name;
			}
			var sortData;
			switch(sortColumn){
				case "phone": sortData = schools[i].phone; break;
				case "city": sortData = schools[i].city+", "+schools[i].state; break;
				case "state": sortData = schools[i].city+", "+schools[i].state; break;
				case "state": sortData = schools[i].state; break;
				case "distance": sortData = schools[i].getDistance()+" Mi"; this.watchID = navigator.geolocation.watchPosition(onWatchSuccess, geoError, { timeout: 30000 }); break;
				case "instructor": sortData = schools[i].rank != "" ? schools[i].rank+" " : ""; sortData += schools[i].instructor; break;
				default: sortData = schools[i].address+", "+schools[i].city+", "+schools[i].state; break;
			}
			$("#list_content").append(
					'<div class="list_entry">'+
					'<a data-role="button" href="#school" data-transition="filp" data-inline="true" onclick="globalInterface.showSchoolInfo('+i+')">'+title+'</a>'+
					'<a data-role="button" href="#directions" data-transition="filp" data-inline="true" onclick="globalInterface.showRoute("directions", '+i+')">Directions</a>'+
					'<a data-role="button" href="#map" data-transition="filp" data-inline="true" onclick="globalInterface.showRoute("map", '+i+')">Map</a>'+
					'<p id="sort_data_'+i+'">'+sortData+'</p>'+
					'</div>';
			);
			
		}
		//$("#list_interface").css({display: "block"});
		//$("#list_interface").animate({opacity: 1});
		//this.hideSortInterface(3000);
	};
	var watchID = null;
	
	
	
	
	this.updateDistances = function(){
		for (var i = 0; i < schools.length; i++){
			$("#sort_data_"+i).text(schools[i].getDistance(true)+" Mi");
		}
	}
	/*var sortInterfaceStartPos;
	this.showSortInterface = function(speed){
		this.clearRouteInterval();
		$("#list_interface").animate({left: 0}, speed);
		$("#sort_interface").animate({top: 0}, speed, function(){
			$("#map").css({display: "none"});
			$("#directions").css({display: "none"});
			$("#school_info").css({display: "none"});
		});
	};
	this.hideSortInterface = function(speed){
		$("#sort_interface").animate({top: this.sortInterfaceStartPos+"px"}, speed);
	};*/
	//var listInterfaceOffset;
	//var currentInterface;
	var lastSchoolIndex = null;
	var routeInterval = null;
	
	
	
	
	this.showRoute = function(element, schoolIndex){
		if (this.lastSchoolIndex != schoolIndex){
			this.lastSchoolIndex = schoolIndex;
			function displayNarrative(data){
			    if(data.route){
			      var legs = data.route.legs, html = '', i = 0, j = 0, trek, maneuver;
			      html += '<table class="centered_table"><tbody><tr><td class="table_heading" colspan="2">Driving Directions</td></tr>';
	
			      for (; i < legs.length; i++) {
			        for (j = 0; j < legs[i].maneuvers.length; j++) {
			          maneuver = legs[i].maneuvers[j];
			          html += '<tr>';
			          html += '<td class="border_bottom">';
	
			          if (maneuver.iconUrl) {
			            html += '<img src="' + maneuver.iconUrl + '">  ';
			          }
	
			          for (k = 0; k < maneuver.signs.length; k++) {
			            var sign = maneuver.signs[k];
			            if (sign && sign.url) {
			              html += '<img src="' + sign.url + '">  ';
			            }
			          }
	
			          html += '</td><td class="border_bottom">' + maneuver.narrative + '</td>';
			          html += '</tr>';
			        }
			      }
	
			      html += '</tbody></table>';
			      $("#directions_wrapper").html(html);
			    }
			}
			function getDirections(){
				MQA.withModule('directions', function() {
					//map.removeAllShapes();
				    map.addRoute([
				      {latLng: {lat: currentLat, lng: currentLng}},
				      {latLng: {lat: schools[schoolIndex].lat, lng: schools[schoolIndex].lng}}], 
				    {},
				    displayNarrative);
				});
				//map.setCenter({lat: currentLat, lng: currentLng});
			}
			getDirections();
			this.clearRouteInterval();
			this.routeInterval = setInterval(getDirections, 30000);
		}
		//$(element).css({display: "block"});
		//var windowHeight = window.innerheight;
		if (element == "directions"){
			$("#directions_footer").html(
					'<a data-role="button" href="#list" data-transition="flip" data-inline="true">List</a>'+
					'<a data-role="button" href="#info" data-transition="flip" data-inline="true" onclick="globalInterface.showSchoolInfo('+i+')">Info</a>'+
					'<a data-role="button" href="#map_page" data-transition="flip" data-inline="true" onclick="globalInterface.showRoute("map", '+i+')">Map</a>'	
			);
		}
		else if (element == "map"){
			$("#footer").html(
					'<a data-role="button" href="#list" data-transition="flip" data-inline="true">List</a>'+
					'<a data-role="button" href="#info" data-transition="flip" data-inline="true" onclick="globalInterface.showSchoolInfo('+i+')">Info</a>'+
					'<a data-role="button" href="#directions" data-transition="flip" data-inline="true" onclick="globalInterface.showRoute("directions", '+i+')">Directions</a>'	
			);
		}
		//$("#list_interface").animate({left: -this.listInterfaceOffset+"px"}, speed);
		//this.currentInterface = element;
	};
	
	
	
	
	
	this.clearRouteInterval = function(){
		if (this.routeInterval != null){
			clearInterval(this.routeInterval);
			this.routeInterval = null;
		}
	};
	
	
	
	
	/*this.hideRoute = function(speed){
		this.clearRouteInterval();
		var currentInterface = this.currentInterface;
		$("#list_interface").animate({left: "0px"}, speed, function(){
			$(currentInterface).css({display: "none"});
		});
	};*/
	
	
	
	
	this.showSchoolInfo = function(schoolIndex){
		this.clearRouteInterval();
		$("#school_wrapper").html('<table class="centered_table" id="school_info_table"><tbody>'+
			'<tr><td class="table_heading" colspan="2">'+schools[schoolIndex].name+'</td></tr>'+
			'<tr><td>Instructor:</td><td>'+schools[schoolIndex].rank+' '+schools[schoolIndex].instructor+'</td></tr>'+
			'<tr><td>Phone:</td><td>'+schools[schoolIndex].phone+'</td></tr>'+
			'<tr><td>Address:</td><td>'+schools[schoolIndex].address+', '+schools[schoolIndex].city+', '+schools[schoolIndex].state+', '+schools[schoolIndex].country+'</td></tr>'+
			'<tr><td>Distance:</td><td>'+schools[schoolIndex].getDistance()+' Mi</td></tr>'+
			'</tbody></table>');
		$("#school_footer").html(
				'<a data-role="button" href="#list" data-transition="flip" data-inline="true">List</a>'+
				'<a data-role="button" href="#map_page" data-transition="flip" data-inline="true" onclick="globalInterface.showRoute("map", '+i+')">Map</a>'+
				'<a data-role="button" href="#directions" data-transition="flip" data-inline="true" onclick="globalInterface.showRoute("directions", '+i+')">Directions</a>'	
		);
		//$("#school_info").css({display: "block"});
		//$("#list_interface").animate({left: this.listInterfaceOffset+"px"}, speed);
	};
	
	
	
	
	
	/*this.hideSchoolInfo = function(speed){
		$("#list_interface").animate({left: 0}, speed, function(){
			$("#school_info").css({display: "none"});
			console.log("school info hidden");
		});
	};*/
	
	
	
	
};
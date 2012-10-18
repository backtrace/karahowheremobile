var School = function(SID, name, rank, instructor, phone, address, city, state, country, lat, lng){
	this.SID = SID;
	this.name = name;
	this.rank = rank;
	this.instructor = instructor;
	this.phone = phone;
	this.address = address;
	this.city = city;
	this.state = state;
	this.country = country;
	this.lat = lat;
	this.lng = lng;
	this.getDistance = function(watch){
		watch = (typeof watch === "undefined") ? false : watch;
		if (watch == false){
			navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
		}
		var distance = MQA.Util.arcDistance({lat: currentLat, lng: currentLng}, {lat: this.lat, lng: this.lng}, "dm");
		return distance.toFixed(1);
	}
	this.distance = this.getDistance();
}
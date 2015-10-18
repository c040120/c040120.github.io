function restaurant(Name, Address,llat,llong) {
    this.name = Name;
    this.address = Address;
    this.llat = llat;
    this.llong = llong;
}

var geocoder;
var map;
var markers = [];
var infos = [];

function initialize() {
	geocoder = new google.maps.Geocoder();
	var styles = [{
	  stylers: [
		{ hue: "#00a1ff" },
		{ gamma: 0.43  }
	  ]}];
	var mapOptions = {
		center: new google.maps.LatLng(38.897997, -77.079247),
		zoom: 12,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		};
	map = new google.maps.Map(document.getElementById('map-canvas'),
	  mapOptions);
	map.setOptions({styles: styles});
	showRestaurant();
}
	
function codeAddress(number,marker) {
    geocoder.geocode( { 'address': restaurantList[number].address}, function(results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
        	map.setZoom(18);
        	var infowindow = new google.maps.InfoWindow({
				content: '<div class="infoStoreName">'+restaurantList[number].name+'</div>'
			});
			infowindow.open(map,marker);
			console.log(infowindow)
			}
      	else {
        	alert("Geocode was not successful for the following reason: " + status);
      	}
    });
  }
  
function showRestaurant() {
	for(var i=0;i<restaurantList.length;i++){
		(function(index){
				var loc = new google.maps.LatLng(restaurantList[index].llat,restaurantList[index].llong)
				addMarker(loc);
				addRow(i);
				addInfoWindow(i);
		})(i);
	};
	var markerCluster = new MarkerClusterer(map, markers);
}  

function addMarker(position) {
  markers.push(new google.maps.Marker({
    position: position,
    map: map
  }));
}

function addInfoWindow(i){
	var infowindow = new google.maps.InfoWindow()
	var content = '<div class="infoStoreName">'+restaurantList[i].name+'</div>'
	google.maps.event.addListener(markers[i],'click', (function(marker,content,infowindow){ 
        return function() {
        	closeInfos();
        	infowindow.setContent(content);
        	infowindow.open(map,marker);
   			infos[0]=infowindow;  
        };
    })(markers[i],content,infowindow)); 
}
function closeInfos(){
   if(infos.length > 0){
      infos[0].set("marker", null);
      infos[0].close();
      infos.length = 0;
   }
}

function addRow(num) {
    var div = document.createElement('div');
    div.className = 'storeName';
    div.innerHTML = restaurantList[num].name;
    div.setAttribute('class', 'storeName');
    div.onclick = (function(index){return function () {
    	codeAddress(index, markers[index]);
    	}
    })(num);
	document.getElementById('toggle-view').appendChild(div);
}


google.maps.event.addDomListener(window, 'load', initialize);

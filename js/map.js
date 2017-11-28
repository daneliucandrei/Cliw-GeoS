var defaultPos = {lat: 47.151726, lng: 27.587914};
var googleMap;
var iconsPath = 'media/map/';
var geolocationMarker = [];
var flickrMarkers = [];

function initMap() {
    googleMap = new google.maps.Map(document.getElementById('map'), {
        center: defaultPos,
        zoom: 6
    });
}

function CreateMarker(pos, title, icn, source) {
    var marker = new google.maps.Marker({
        position: pos,
        icon: icn,
        map: googleMap,
        title: title
    });
    if (source == "geolocation") {
        geolocationMarker.push(marker);
    }
    if (source == "flickr") {
        flickrMarkers.push(marker);
    }
//    if (source == "instagram") {
//        
//    }
    return marker;
}

function Geolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var icn = iconsPath + 'geolocation-marker.png';
            CreateMarker(pos, 'Locatia dumneavoastra.', icn, "geolocation");
            googleMap.setCenter(pos);
            googleMap.setZoom(15);
        }, function() {
            alert("Error: Serviciul Geolocation a esuat. Acesta a fost blocat.");
        });
    } else {
        alert("Error: Browser-ul dumneavoastra nu suporta geolocation.")
    }
}

function CreatePopUpMarker(marker, content) {
    var contentString = "<img src=\"" + content + "\">"
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', function() {
        infowindow.open(googleMap, marker);
    });
}

function GetJsonFlickr() {
    let url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=47510a816a4dcdf3de88893c6d937f27&lat=47.151726&lon=27.587914&radius=32&radius_units=km&extras=geo&per_page=500&page=1&format=json&nojsoncallback=1&api_sig=ae1b5d604975efe2510faac97ab59c41";
    
    fetch(url)
        .then(res => res.json())
        .then((data) => {
            for(var i = 0; i < data.photos.photo.length;i++) {
                var pos = new google.maps.LatLng(
                    data.photos.photo[i].latitude, 
                    data.photos.photo[i].longitude
                );
                var title = data.photos.photo[i].title;
                var icn = iconsPath + 'photos-marker.png';
                var marker = CreateMarker(pos, title, icn, "flickr");
                // http:/farm-id.staticflickr.com/{server-id}/{id}_{secret}{size}.jpg
                var urlPhoto = "http://farm" + 
                    data.photos.photo[i].farm +
                    ".staticflickr.com/" +
                    data.photos.photo[i].server +
                    "/" +
                    data.photos.photo[i].id +
                    "_" +
                    data.photos.photo[i].secret +
                    "_n.jpg"
                    
                CreatePopUpMarker(marker, urlPhoto);
            }
        })
        .catch(err => { throw err });
}

function setMapOnAll(map, markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function CheckFilters(filterId) {
    if (filterId == "geolocation") {
        var value = document.getElementById("geolocation").checked;
        if (!value == true){
            Geolocation();
            var legend = document.getElementById("geolocation_legend");
            legend.classList.remove('hidden-legend-uncecked');
        }
        else {
            setMapOnAll(null, geolocationMarker);
            var legend = document.getElementById("geolocation_legend");
            legend.classList.add('hidden-legend-uncecked');
        }
    }
    
    if (filterId == "flickr_input") {
        var value = document.getElementById("flickr_input").checked;
        if (!value == true) {
            GetJsonFlickr();
            var legend = document.getElementById("flickr_legend");
            legend.classList.remove('hidden-legend-uncecked');
        }
        else {
            setMapOnAll(null, flickrMarkers);
            var legend = document.getElementById("flickr_legend");
            legend.classList.add('hidden-legend-uncecked');
        }
    }
}
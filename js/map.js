var defaultPos = {lat: 47.151726, lng: 27.587914};
var googleMap;
var iconsPath = 'media/map/';

function initMap() {
    googleMap = new google.maps.Map(document.getElementById('map'), {
        center: defaultPos,
        zoom: 6
    });
    Geolocation();
//    icn = iconsPath + 'photos-marker.png';
//    CreateMarker(defaultPos, 'Fotografie', icn);
    GetJsonFlickr();
}

function CreateMarker(pos, title, icn) {
    var marker = new google.maps.Marker({
        position: pos,
        icon: icn,
        map: googleMap,
        title: title
    });
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
            CreateMarker(pos, 'Locatia dumneavoastra.', icn);
            googleMap.setCenter(pos);
            googleMap.setZoom(15);
        }, function() {
            HandleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        HandleLocationError(false, infoWindow, map.getCenter());
    }
}

function HandleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: Serviciul Geolocation a esuat.' :   
        'Error: Browser-ul dumneavoastra nu suporta geolocation.');
    infoWindow.open(map);}


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
    let url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7ca19a0ef7ff00d5aa27bc7916e83540&lat=47.151726&lon=27.587914&extras=geo&per_page=500&format=json&nojsoncallback=1";
    
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
                var marker = CreateMarker(pos, title, icn);
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
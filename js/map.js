var defaultLocation = {lat: 47.151726, lng: 27.587914};
var googleMap, infoWindow;

function initMap() {
    googleMap = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 6
    });
    var infoWindow = new google.maps.Marker;
    Geolocation();
}

function Geolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var marker = new google.maps.Marker({
                position: pos,
                map: googleMap,
                title: 'Locatia ta curenta.'
            });
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
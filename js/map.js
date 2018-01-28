var defaultPos = {lat: 47.151726, lng: 27.587914};
var googleMap;
var iconsPath = 'media/map/';
var geolocationMarker = [];
var flickrMarkers = [];
var pxMarkers = [];
var instagramMarkers = [];

function initMap() {
    googleMap = new google.maps.Map(document.getElementById('map'), {
        center: defaultPos,
        zoom: 6
    });
}

function zoomMap(pos, zoom) {
    console.log(googleMap.zoom)
    googleMap.setCenter(pos);
    googleMap.setZoom(zoom);

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
    if (source == "500px") {
        pxMarkers.push(marker);
    }
//    if (source == "instagram") {
//        
//    }
    return marker;
}

function Geolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var icn = iconsPath + 'geolocation-marker.png';
            CreateMarker(pos, 'Locatia dumneavoastra.', icn, "geolocation");
            googleMap.setCenter(pos);
            googleMap.setZoom(15);
        }, function () {
            alert("Error: Serviciul Geolocation a esuat. Acesta a fost blocat.");
        });
    } else {
        alert("Error: Browser-ul dumneavoastra nu suporta geolocation.")
    }
}

function CreatePopUpMarker(marker, content) {
    var contentString = "<img src=\"" + content + "\">";
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', function () {
        infowindow.open(googleMap, marker);
    });
}

function CreateUrlFlickr(dataFilter) {
    setMapOnAll(null, flickrMarkers);
    flickrMarkers = [];
    let url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d2eab41b196d9ba760b21e0b3004b48d&tag_mode=all&bbox=-180%2C-90%2C180%2C90&has_geo=1&radius=&extras=geo&per_page=500&page=1&format=json&nojsoncallback=1&tags=";
    
    var tags = dataFilter.only.replace(/,/g,'%2C+');
    tags = tags.substr(0, tags.length - 4);   
    url = url + tags;
    console.log(url);
    console.log(tags);
    return url;
}

function GetJsonFlickr(dataFilter) {
    var url = CreateUrlFlickr(dataFilter);
    fetch(url)
        .then(res => res.json()
)
.then((data) => {
        console.log(data);
        for(var i = 0; i < data.photos.photo.length; i++)
        {
            var pos = new google.maps.LatLng(
                data.photos.photo[i].latitude,
                data.photos.photo[i].longitude
            );
            var title = data.photos.photo[i].title;
            var icn = iconsPath + 'flickr-photos-marker.png';
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
}

function jsonFlickr(dataFilter, condition) {
    if (condition) {
        console.log(dataFilter.only);
        GetJsonFlickr(dataFilter);
    }
    else {
        setMapOnAll(null, flickrMarkers);
        flickrMarkers = [];  
    }
}

function setMapOnAll(map, markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

/** 500px **/
var map500px;
_500px.init({
    sdk_key: 'ac79fd2f1e525036f209215b135afd746edf3ecd'
});

function createMap500px(data, fire) {
    setMapOnAll(null, pxMarkers)
    if (fire) {
        _500px.api('/photos/search', data, function (response) {
            map500px = response.data.photos;
            populateMap500px(response.data.photos);
        });
    }
    else {
        populateMap500px({});
    }

}

function populateMap500px(map) {
    for (var mapItem in map) {
        var pos = new google.maps.LatLng(
             map[mapItem].latitude ? map[mapItem].latitude : 0,
             map[mapItem].longitude ? map[mapItem].longitude : 0
         );
         var title = map[mapItem].name;
         var icn = iconsPath + '500px-photos-marker.png';
         var marker = CreateMarker(pos, title, icn, "500px");
         var urlPhoto = map[mapItem].image_url;
         CreatePopUpMarker(marker, urlPhoto);
    }
}

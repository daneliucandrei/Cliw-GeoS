var defaultPos = {lat: 47.151726, lng: 27.587914};
var googleMap;
var iconsPath = 'media/map/';
var geolocationMarker = [];
var flickrMarkers = [];
var pxMarkers =[];
var instagramMarkers = [];

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
    if(source == "500px") {
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

function CreateUrlFlickr() {
    var ok = 0;
    let url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ae1c82d8bc018a4706a0d14117f11f67&";
    var value = document.getElementById("5_natura").checked;
    if (!value == true) {
        console.log("intra");
        url = url + 'tags=nature';
        ok = 1;
    }
    var value = document.getElementById("5_night").checked;
    if (!value == true) {
        if(ok)
            url = url + '%2Cnight'
        else
            url = url + 'tags=night';
    }
    
    url = url + '&tag_mode=all&bbox=-180%2C-90%2C180%2C90&has_geo=1&extras=geo&per_page=500&page=1&format=json&nojsoncallback=1&auth_token=72157668921226929-db905897542e9e02&api_sig=4e80c32dc44f72e2ccb0588b1ac26acb';
    
    return url;
}

function GetJsonFlickr() {
    var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ae1c82d8bc018a4706a0d14117f11f67&format=json&nojsoncallback=1&auth_token=72157668921226929-db905897542e9e02&api_sig=4e80c32dc44f72e2ccb0588b1ac26acb&has_geo=1&extras=geo&per_page=500&bbox=-180%2C-90%2C180%2C90&tag_mode=all&tags=nature%2Cnight&page=1";
    fetch(url)
        .then(res => res.json()
)
.
    then((data) => {
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

function setMapOnAll(map, markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function CheckFilters(filterId) {
    if (filterId == "geolocation") {
        var value = document.getElementById("geolocation").checked;
        if (!value == true) {
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

/** 500px **/
var map500px;
_500px.init({
    sdk_key: 'ac79fd2f1e525036f209215b135afd746edf3ecd'
});

function createMap500px(data,fire) {
    console.log(data)
    setMapOnAll(null,pxMarkers)
    if(fire) {
        _500px.api('/photos/search', data, function (response) {
            map500px = response.data.photos;
            populateMap500px(response.data.photos);
            console.log(map500px);
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

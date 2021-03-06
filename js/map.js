var defaultPos = {lat: 47.151726, lng: 27.587914};
var googleMap;
var iconsPath = 'media/map/';
var geolocationMarker = [];
var flickrMarkers = [];
var pxMarkers = [];
var instagramMarkers = [];
var vector = [1,2,3,4];

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
    if (source == "instagram") {
       instagramMarkers.push(marker);
    }
    return marker;
}

function Geolocation(condition) {
    if(condition) {
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
    else {
        setMapOnAll(null, geolocationMarker);
        geolocationMarker = [];
    }
}

function CreatePopUpMarker(marker, content,source,description) {
    var contentString = "<div style='font-size: 15px;font-weight:600;'>Source:"
        +"<span style='font-size: 15px;font-weight:400;'>"+ source +"</span>"
        +"</div>"+ "<div style='font-size: 15px;font-weight:600;'>Description:"
        +"<span style='font-size: 15px;font-weight:400;'>"+ description +"</span>"
        +"</div>"+"<a href='"+content+"' target='_blank'>"+"<img src=\"" + content + "\">"+"</a>";
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
    let url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=dfc8d2ba032e728f7ee40b81cef4b5af&has_geo=1&extras=geo&per_page=50&page=1&format=json&nojsoncallback=1';
    
    var continents = dataFilter.geo;
    url = url + '&bbox=';
    switch(continents) {
        case '2.070,15.800,4623.261km':
            console.log('Africa.');
            url = url + '-20%2C-30%2C60%2C30';
            break;
        case '52.976,7.857,1923.322km':
            console.log('Europa.');
            url = url + '-5%2C10%2C40%2C80';
            break;
        case '44.330,-109.754,3715.679km':
            console.log('America de Nord.');
            url = url + '-150%2C20%2C-50%2C90';
            break;
        case '-23.030,-67.903,3902.238km':
            console.log('America de Sud.');
            url = url + '-105%2C-55%2C-30%2C12';
            break;
        case '34.969,99.819,3733.764km':
            console.log('Asia.');
            url = url + '45%2C-10%2C160%2C80';
            break;
        case '-30.941,140.810,2334.124km':
            console.log('Australia.');
            url = url + '110%2C-50%2C160%2C-10';
            break;
        default:
            console.log('Filtru fara Continent.');
            url = url + '-180%2C-90%2C180%2C90'
            break;
    }
    console.log(continents);
    
    var tags = dataFilter.only.replace(/,/g,'%2C+');
    url = url + '&tags=';
    tags = tags.substr(0, tags.length - 4);   
    url = url + tags;
    url = url + '&tag_mode=all';
    return url;
}

function GetJsonFlickr(dataFilter) {
    var url = CreateUrlFlickr(dataFilter);
    fetch(url)
        .then(res => res.json()
)
.then((data) => {
        for(var i = 0; i < data.photos.photo.length; i++)
        {  var desctiption =data.photos.photo[i].title;
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

                CreatePopUpMarker(marker, urlPhoto,'Flickr',desctiption);
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
function createMapInsta(data,flag) {
    if(flag) {
        var title = 'No title';
        var icn = iconsPath + 'instagram-photos-marker.png';
        var iterator = 0.0004;

        for (var key in data) {
            var pos = new google.maps.LatLng(43.151726 + Math.random(10)*3+iterator,25.587914 + Math.random(10)*5+iterator);
            var marker = CreateMarker(pos, title, icn, "instagram");
            var urlPhoto = data[key].images.low_resolution.url;
            iterator +=0.004;
            CreatePopUpMarker(marker, urlPhoto, 'instagram', title);
        }
        for (var key in vector) {
            var pos = new google.maps.LatLng(42.151726 + Math.random(10)*4+iterator, 25.587914 + Math.random(10)*4+iterator);
            var marker = CreateMarker(pos, title, icn, "instagram");
            var urlPhoto = iconsPath+'insta_'+(vector[key])+'.jpg';
            iterator += 0.006;
            CreatePopUpMarker(marker, urlPhoto, 'instagram', title);
        }


    }
    else {
        setMapOnAll(null, instagramMarkers)
    }
}
function instagramPhotos(flag) {
    if(flag) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.instagram.com/v1/users/self/media/recent/?access_token=1173973074.1677ed0.9a83d5673d3a4ace956c1030b4d569f6');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText).data;
                createMapInsta(data,true);
            }
            else {
                console.log(xhr.status);
            }
        };
        xhr.send();
    }
    else {
        createMapInsta({},false);
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
         CreatePopUpMarker(marker, urlPhoto,'500px',title);
    }
}

/** functions **/
function push_cookie(name, value) {
    var cookieString = [name, '=', JSON.stringify(value),
        '; domain=.', window.location.host.toString(),
        "; expires="+ new Date(new Date().getTime()+60*60*1000*744/*1 luna*/).toGMTString(),
        '; path=/;'].join('');
    document.cookie = cookieString;
}

function read_cookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
}

/** variables and objects declarations**/
var entity;
var appName = 'geos';
var list = document.getElementsByClassName("input-checkbox-filter");
var mapFilter = {
    values: {}, add: function () {
    }
};
var ApplyFilter = {
    category: {
        'category_natura':'Nature',
        'category_film' :'Film',
        'category_mancare':'Food'
    },
    image_size : {
        '440x440': 440,
        '200x200':200
    }
}
var dataFilter = {};
dataFilter.rpp=50;
dataFilter.only = 'Nudes,Bike,';
dataFilter.resolution=[440];
mapFilter.add = function (key, value) {
    this.values[key] = value;
    return this;
};

function initializeMapFilter() {
    if (read_cookie(appName) === null) {
        console.log('not cookie');
        for (var key in list) {
            if (typeof(list[key].id) === "string") {
                entity = list[key].id;
                mapFilter.add(entity, list[key].checked);
            }
        }
    }
    else {
        console.log('cookie');
        mapFilter.values = read_cookie(appName);
        //console.log(mapFilter.values);
        for (var key in mapFilter.values) {
            if (mapFilter.values[key]) {
                (document.getElementById(key).checked = true);
                console.log(ApplyFilter.category['category_film']);
                if( typeof ApplyFilter.category[key] !== 'undefined') {
                    dataFilter.only+= ApplyFilter.category[key] + ',';
                }

            }
        }
        if(mapFilter.values['500px_input']) {
            window.onload = function () {createMap500px(dataFilter,true)}
        }
    }
}

initializeMapFilter();

function watchStorage(list) {
    var key;
    for (key in list) {
        if (typeof(list[key].id) === "string") {
            list[key].onclick = function () {
                mapFilter.values[this.id] = this.checked;
                push_cookie(appName, mapFilter.values);
                if( typeof ApplyFilter.category[key] !== 'undefined') {
                    dataFilter.only+= ApplyFilter.category[key] + ',';
                }
                if(this.id==='500px_input') {
                   console.log(this.checked);
                    if(this.checked) {
                        createMap500px(dataFilter,true);
                    }
                    else {
                        createMap500px(dataFilter,false);
                    }
                }
            };
        }
    }
}

watchStorage(list);

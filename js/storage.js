/** functions **/
function push_cookie(name, value) {
    var cookieString = [name, '=', JSON.stringify(value),
        '; domain=.', window.location.host.toString(),
        "; expires=" + new Date(new Date().getTime() + 60 * 60 * 1000 * 744/*1 luna*/).toGMTString(),
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
        '5_natura': 'Nature',
        '5_film': 'Film',
        '5_mancare': 'Food',
        '5_fara_categorie': 'Uncategorized',
        '5_abstract': 'Abstract',
        '5_animals': 'Animals',
        '5_fashion': 'Fashion',
        '5_nude': 'Nude',
        '5_night': 'Night',
        '5_people': 'People',
        '5_travel': 'Travel'


    },
    image_size: {
        '70x70': 1,
        '440x440': 440,
        '200x200': 200
    }
    ,
    camera: {}
}
var dataFilterAbstract = {};
dataFilterAbstract.rpp = 50;
dataFilterAbstract.only = 'Nudes,Bike,';
dataFilterAbstract.resolution = 440;
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
        var dataFilter = dataFilterAbstract;
        for (var key in mapFilter.values) {
            if (mapFilter.values[key]) {
                (document.getElementById(key).checked = true);
                if (typeof ApplyFilter.category[key] !== 'undefined') {
                    dataFilter.only += ApplyFilter.category[key] + ',';
                }

            }
        }
        if (mapFilter.values['500px_input']) {
            window.onload = function () {
                createMap500px(dataFilter, true)
            }
        }
    }
}

initializeMapFilter();

function watchStorage(list) {
    var key;
    for (key in list) {
        if (typeof(list[key].id) === "string") {
            list[key].onclick = function () {
                var dataFilter = dataFilterAbstract;
                mapFilter.values[this.id] = this.checked;
                push_cookie(appName, mapFilter.values);
                for (var i in mapFilter.values) {
                    if (mapFilter.values[i]) {
                        if (typeof ApplyFilter.category[i] !== 'undefined') {
                            dataFilter.only += ApplyFilter.category[i] + ',';
                        }
                    }
                }
                if (mapFilter.values['500px_input']) {
                    dataFilter.only!=='' ? createMap500px(dataFilter, true) : createMap500px(dataFilter, false);
                    dataFilter.only='';
                }
                if (this.id === '500px_input') {
                    if (this.checked) {
                        createMap500px(dataFilter, true);
                    }
                    else {
                        createMap500px(dataFilter, false);
                    }
                }
            };
        }
    }
}

watchStorage(list);

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
        console.log(mapFilter.values);
        for (var key in mapFilter.values) {
            if (mapFilter.values[key]) {
                (document.getElementById(key).checked = true);
            }
        }
    }
}

initializeMapFilter();

function watch(list) {
    var key;
    for (key in list) {
        if (typeof(list[key].id) === "string") {
            list[key].onclick = function () {
                console.log(this.checked);
                mapFilter.values[this.id] = this.checked;
                push_cookie(appName, mapFilter.values);
            };
        }
    }
}

watch(list);
console.log(mapFilter);

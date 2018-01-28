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
        '5_people': 'People',
        '5_travel': 'Travel',
        '5_city': 'City',
        '5_night': 'Night'


    },
    image_size: {
        '70x70': 1,
        '440x440': 440,
        '200x200': 200,
        '600x600': 600
    }
    ,
    features: {
        'popular': 'popular',
        'today': 'today',
        'yesterday': 'fresh_yesterday',
        'week': 'fresh_week'
    }
    ,
    camera: {}
    ,
    geo: {
        'america_n_input':'44.330,-109.754,3715.679km',
        'america_s_input':'-23.030,-67.903,3902.238km',
        'antarctica_input':'-81.500,0.000,1883.860km',
        'africa_input':'2.070,15.800,4623.261km',
        'asia_input':'34.969,99.819,3733.764km',
        'australia_input':'-30.941,140.810,2334.124km',
        'europa_input': '52.976,7.857,1923.322km',
    }
};
var dataFilterAbstract = {};
dataFilterAbstract.rpp = 50;
dataFilterAbstract.only = '';
dataFilterAbstract.image_size = 200;
dataFilterAbstract.was_featured_type = '';
var boolCenter = false;
mapFilter.add = function (key, value) {
    this.values[key] = value;
    return this;
};
function triggerEvent(el, type)
{
    if ((el[type] || false) && typeof el[type] == 'function')
    {
        el[type](el);
    }
}
function watchStorage(list) {
    var key;
    for (key in list) {
        if (typeof(list[key].id) === "string") {
            list[key].onchange = function () {
                console.log('change',this.id);
                var dataFilter = dataFilterAbstract;
                mapFilter.values[this.id] = this.checked;
                push_cookie(appName, mapFilter.values);
                for (var i in mapFilter.values) {
                    if (mapFilter.values[i]) {
                        if (typeof ApplyFilter.category[i] !== 'undefined') {
                            dataFilter.only += ApplyFilter.category[i] + ',';
                        }
                        if (typeof ApplyFilter.features[i] !== 'undefined') {
                            dataFilter.was_featured_type = ApplyFilter.features[i];
                        }
                        if (typeof ApplyFilter.image_size[i] !== 'undefined') {
                            dataFilter.image_size = ApplyFilter.image_size[i];
                        }
                        if (typeof ApplyFilter.geo[i] !== 'undefined') {
                            dataFilter.geo = ApplyFilter.geo[i];
                            var location = ApplyFilter.geo[i].split(',');
                            zoomMap({lat: parseFloat(location[0]), lng: parseFloat(location[1])}, 3);
                            boolCenter = true;
                        }
                        if(!boolCenter) {
                            zoomMap(defaultPos,2);
                        }
                    }
                }
                appliedFilters(list);
                if (mapFilter.values['500px_input']) {
                    createMap500px(dataFilter, true);
                    dataFilter.only = '';
                    dataFilter.was_featured_type = '';
                    dataFilter.image_size = 200;
                    dataFilter.geo = '';
                    boolCenter=false;
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
function appliedFilters(list,removeAll) {
    var filterActive;
    document.getElementById('filter-active').innerHTML = "";
    if(typeof removeAll=== 'undefined') {
        removeAll = false;
    }
    if (!removeAll) {
        for (var key in list) {
            if (typeof(list[key].id) === "string") {
                if (list[key].checked)
                    if (typeof list[key].dataset.section !== 'undefined') {
                        console.log(list[key].dataset.section);
                        document.getElementById('filter-active').innerHTML += '<div class="top-filter-active" data-id=' + list[key].id + '>' + list[key].dataset.section + '</div>';
                    }
            }
        }
    }
    else {
        for (var key in list) {
            if(list[key].checked)
            {
                document.getElementById(list[key].id).checked=false;
                triggerEvent(document.getElementById(list[key].id), 'onchange');

            }
        }
    }
}
window.onload = function () {
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
                    if (typeof ApplyFilter.features[key] !== 'undefined') {
                        dataFilter.was_featured_type = ApplyFilter.features[key];
                    }
                    if (typeof ApplyFilter.image_size[key] !== 'undefined') {
                        dataFilter.image_size = ApplyFilter.image_size[key];
                    }
                    if (typeof ApplyFilter.geo[key] !== 'undefined') {
                        dataFilter.geo = ApplyFilter.geo[key];
                        var location = ApplyFilter.geo[key].split(',');
                        zoomMap({lat: parseFloat(location[0]), lng: parseFloat(location[1])}, 3);
                        boolCenter = true;
                    }


                }
            }
            appliedFilters(list);
            if (mapFilter.values['500px_input']) {
                createMap500px(dataFilter, true)
            }
        }
    }

    initializeMapFilter();

    document.getElementById('button-remove-filtre').onclick = function () {
        appliedFilters(list,true);
    };

    watchStorage(list);
}
$(function () {

    // US States Service
    var queryUrl = 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3/query';

    var search = function (stateName) {
        // Do a wildcard search of the state name
        // % is used for widlcards on ArcGIS Server
        // %25 is the URLEncode you can pass in a URL
        var where = "where=STATE_NAME LIKE'%25" + stateName + "%25'";
        // We only want the State Name from the data
        var outFields = 'outFields=STATE_NAME';
        var returnGeometry = 'returnGeometry=false';
        // Now we form the URL
        var url = queryUrl + '?' + where + '&' + outFields + '&' + returnGeometry + '&f=json';
        $.get(url, function(result) {
            var data = $.parseJSON(result);
            console.log(data);
            // the information we are looking for is in the features array of the result
            var items = [];
            $.each(data.features, function (k, v) {
                items.push($('<li></li>').text(v.attributes.STATE_NAME));
            });
            $('#results').empty().append(items);
        });
    };

    $('#btn-search').on('click', function () {
        var stateName = $('#search').val();
        search(stateName);
    });

});

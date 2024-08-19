document.title = 'Adminitrative Map';

$(document).ready(function () {

    console.log("Checking for map container...");

    if ($('#map').length) {
        
        var geoJsonLayers = {};

        var map = L.map('map').setView([23.8041, 90.4152], 7);
        // var map = L.map('map').setView([22.770853482782677, 92.07981993904134], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">CEGIS</a>'
        }).addTo(map);

        // var map = L.map('map').setView([22.78000000, 92.04000000], 8);


        // var subUrl = 'static/upload/1/1/division.json';

        // $.getJSON(subUrl, function(data) {
        //     geoJsonLayers = L.geoJson(data, {
        //         style: {
        //             color: 'black',
        //             weight: 2,
        //             opacity: 1
        //         }
        //     }).addTo(map);
        // });

        var paraUrl = 'static/administrative/admin/district.json';
        $.getJSON(paraUrl, function(data) {
            geoJsonLayers = L.geoJson(data, {
                style: function(feature) {
                    return {
                        color: '#800080',
                        weight: '2',
                        opacity: 0.8,
                        fillColor: 'none'
                    };
                }
            }).addTo(map);
        });

       
    } 
    else 
    {
        console.log("Map container not found");
    }
});

$(document).on('change', '.get-watershed-map', function() {
            
    var mapId = $(this).val();

    if ($(this).is(':checked')) {

        if(mapId == 'r114_para_map'){
            // var mapUrl = 'static/administrative/R114/R114_para_boundary.json';
            window.location.href = '/ghilachari-para';
        }
        else if(mapId == 'r114_lulc_map') {
            window.location.href = '/ghilachari-lulc';
        }
        else if(mapId == 'r114_properties_map') {
            window.location.href = '/ghilachari-para';
        }
        else if(mapId == 'div_map'){
            window.location.href = '/admin-division';
        }
        else if(mapId == 'dis_map') {
            window.location.href = '/admin-district';
        }
        else if(mapId == 'upz_map') {
            window.location.href = '/admin-upazila';
        }

        
    }
    else 
    {
        console.log("Checkbox with value: " + $(this).val() + " is unchecked.");
        if (geoJsonLayers) {
            map.removeLayer(geoJsonLayers);
        }
    }

});
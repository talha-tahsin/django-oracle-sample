


document.title = 'welcome';

$(document).ready(function () {

    console.log("hello from jQuery..");

    $('.select2').css({'border': '1px solid #898AEE', 'border-radius': '5px'});

    var csrftoken = $("meta[name='csrf-token']").attr("content");
    
    $.ajax({
        type: "GET",
        url: "/get-layer-list/",
        headers: { "X-CSRFToken": csrftoken },
        // data: { 'dataToSend' : JSON.stringify(send_data) },
        dataType: "json",
        cache: false,
        success: function (data) {
            console.log(data);
            if(data.status) {
                var jsonData = data.message;
                var appendString = '';

                $.each(jsonData, function(index, item) {
                    appendString += '<a class="dropdown-item" href="#">';
                    appendString += '<input class="form-check-input" type="checkbox" value="'+ item.layer_id +'" id="checkbox_'+ item.layer_name +'">';
                    appendString += ' '+ item.layer_name +' View';
                    appendString += '</a>';
                });
                $('#dynamic_checkbox').append(appendString);
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

});

// var file_path = '/static/administrative/administrative_boundary/bd_map/bangladesh.geojson';
// var file_path = '/static/upload/1/1/division.json';
// var map = L.map('map').setView([23.6850, 90.3563], 7);

// $.getJSON(file_path, function(data) {
//     geoJsonLayers = L.geoJson(data, {
//         style: {
//             color: 'black',
//             weight: 3,
//             opacity: 1
//         }
//     }).addTo(map);
// });

var map = L.map('map').setView([23.8041, 90.4152], 7);
var geoJsonLayers = {};

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">CEGIS</a>'
}).addTo(map);

$(document).on('change', '.form-check-input', function() {

    var layer_id = $(this).val(); 
    var label = $(this).parent().text().trim();

    console.log("Checkbox value: " + layer_id );
    
    if($(this).is(':checked')) 
    {
        var csrftoken = $("meta[name='csrf-token']").attr("content");
        
        send_data = {
            'layer_id' : layer_id,
        };
        
        $.ajax({
            type: "POST",
            url: "/get-layer-file-path/",
            headers: { "X-CSRFToken": csrftoken },
            data: { 'dataToSend' : JSON.stringify(send_data) },
            dataType: "json",
            cache: false,
            success: function (data) {
                // console.log(data);
                if(data.status) {
                    var baseUrl = "http://localhost:8000/";
                    var getLayerFilePath = data.message.layer_file_path;
                    // var getLayerFilePath = '/static/upload/2/2/R65.json';
                    var absoluteUrl = baseUrl + getLayerFilePath;
                    console.log(getLayerFilePath);
           
                    if (geoJsonLayers[layer_id]) {
                        map.removeLayer(geoJsonLayers[layer_id]);
                    }

                    $.getJSON(absoluteUrl, function(data) {
                        var colorOptions = {
                            '4': 'black',  
                            '5': '#800080', 
                            '6': '#A52A2A'
                        };

                        var weightOptions = {
                            '4': '3',  
                            '5': '2', 
                            '6': '1'
                        };

                        geoJsonLayers[layer_id] = L.geoJson(data, {
                            style: function(feature) {
                                return {
                                    color: colorOptions[layer_id],
                                    weight: weightOptions[layer_id],
                                    opacity: 0.8
                                };
                            }
                        }).addTo(map);
                    });

                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        
    } 
    else 
    {
        console.log("Checkbox with value: " + $(this).val() + " is unchecked.");
        var unchecked_layer_id = $(this).val();

        if (geoJsonLayers[unchecked_layer_id]) {
            map.removeLayer(geoJsonLayers[unchecked_layer_id]);
        }
        
    }
});

$(document).on('click', '#btn_edit', function () {

    var csrftoken = $("meta[name='csrf-token']").attr("content");
    // var created_by = $('#userName').val();
    var created_by = 'talha';

    var row_id = $(this).closest('tr').find('#btn_edit').attr('row_id');

    send_data = {
        'row_id' : row_id,
        'created_by' : created_by,
    };
    
    console.log(row_id);

    // clear model message value for every ajax call provide single accurate message
    $('#success_msg').html('');
    $('#error_msg').html('');

    if(row_id == '' || row_id == null || row_id == undefined) {
        alert("Opps! Something is wrong with row id, please check..");
    }
    else {

        $('#myModal_edit').modal({backdrop : 'static', keyboard : false});

        $.ajax({
            url: '/get-student-info/',
            type: 'POST',
            headers: { "X-CSRFToken": csrftoken },
            data: { 'dataToSend' : JSON.stringify(send_data) },
            dataType: "json",
            success: function(data) {
                console.log(data);
                var jsonString = JSON.stringify(data);
                var jsonObject = JSON.parse(jsonString);
    
                var item = jsonObject.data;

                for (var i = 0; i < item.length; i++) {
                    $('#modRowId').val(item[i].id);
                    $('#modStuName').val(item[i].stu_name);
                    $('#modStuRoll').val(item[i].stu_roll);
                    $('#modDepartment').val(item[i].department).change();
                    $('#modGender').val(item[i].gender);
                }
            
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });

    }


});

$(document).on('click', '#btn_update', function () {

    var csrftoken = $("meta[name='csrf-token']").attr("content");
    // var created_by = $('#userName').val();
    var created_by = 'talha';

    var row_id = $('#modRowId').val();
    var studentName = $('#modStuName').val();
    var stuRoll = $('#modStuRoll').val();
    var stuDepartment = $('#modDepartment option:selected').val();
    var stuGender = $('#modGender').val();

    send_data = {
        'row_id' : row_id,
        'student_name' : studentName,
        'student_roll' : stuRoll,
        'student_dept' : stuDepartment,
        'student_gender' : stuGender,
        'created_by' : created_by,
    };
    
    console.log(row_id, send_data);

    // clear model message value for every ajax call provide single accurate message
    $('#success_msg').html('');
    $('#error_msg').html('');

    if(row_id == '' || row_id == null || row_id == undefined) {
        alert("Opps! Something is wrong with row id, please check..");
    }
    else 
    {
        $('#myModal_edit').modal('hide');

        $.ajax({
            url: '/update-student-info/',
            type: 'POST',
            headers: { "X-CSRFToken": csrftoken },
            data: { 'dataToSend' : JSON.stringify(send_data) },
            dataType: "json",
            success: function(data) {
                console.log(data);
                if(data.success) {
                    $('#myModal').modal({backdrop : 'static', keyboard : false});
                    $('#success_msg').html('<span style="color: green;">SUCCESS !! <p>'+ data.message+'</p></span>' );
                    
                    $(document).on('click', '#btn_close', function(){
                        window.location.href = '/show-student-list/';
                    });

                }
                else {
                    $('#myModal').modal({backdrop : 'static', keyboard : false});
                    $('#error_msg').html('<span style="color: red">ERROR!! <p>'+data.message+'</p></span>');
                }
            
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });

    }

    
});

$(document).on('click', '#btn_delete', function () {

    var csrftoken = $("meta[name='csrf-token']").attr("content");
    // var created_by = $('#userName').val();
    var created_by = 'talha';

    var row_id = $(this).closest('tr').find('#btn_edit').attr('row_id');

    send_data = {
        'row_id' : row_id,
        'created_by' : created_by,
    };
    
    console.log(row_id, send_data);

    // clear model message value for every ajax call provide single accurate message
    $('#success_msg').html('');
    $('#error_msg').html('');

    if(row_id == '' || row_id == null || row_id == undefined) {
        alert("Opps! Something is wrong with row id, please check..");
    }
    else 
    {
        $.ajax({
            url: '/delete-student-info/',
            type: 'POST',
            headers: { "X-CSRFToken": csrftoken },
            data: { 'dataToSend' : JSON.stringify(send_data) },
            dataType: "json",
            success: function(data) {
                console.log(data);
                if(data.success) {
                    $('#myModal').modal({backdrop : 'static', keyboard : false});
                    $('#success_msg').html('<span style="color: green;">SUCCESS !! <p>'+ data.message+'</p></span>' );
                    
                    $(document).on('click', '#btn_close', function(){
                        window.location.href = '/show-student-list/';
                    });
                   
                }
                else {
                    $('#myModal').modal({backdrop : 'static', keyboard : false});
                    $('#error_msg').html('<span style="color: red">ERROR!! <p>'+data.message+'</p></span>');
                }
            
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });

    }

    
});


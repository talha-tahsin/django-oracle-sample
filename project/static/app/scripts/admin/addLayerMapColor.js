

document.title = 'Add Layer Map Color';
var csrftoken = $("meta[name='csrf-token']").attr("content");

    
$(document).ready(function () {

    console.log("developed by : talha-tahsin ");
    $('.add_select2').select2();
    $('.add_select2').siblings().children().children().css({'border-radius': '5px', 'border': '2px solid #77c3e1', 'padding-bottom': '30px'});

    loadCategoryNamelist();
    loadWatershedNameList();


    $(document).on('change', '#catgry_id', function(){

        var catgry_id = $('#catgry_id option:selected').text();

        $.ajax({
            type: "POST",
            url: "/get-category-wise-legend-values/",
            headers: { "X-CSRFToken": csrftoken },
            data: { 'dataToSend' : catgry_id },
            dataType: "json",
            cache: false,
            success: function (data) {
                console.log(data);
                if(data.status) {
                    var ret_data = data.response;
                    var appendString = '<option value="" selected disabled>Select Legend Value</option>';
                    $('#legend_value').empty();
                    $('#legend_value').prop('disabled', false);

                    $.each(ret_data, function(index, item) {
                        appendString += '<option value="'+ item.legend_val +'" data-row="'+ item.row_id +'" >'+ item.legend_val +'</option>';
                    });

                    $('#legend_value').append(appendString);
                    
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    });

    $(document).on('change', '#legend_value', function(){

        var p_row_id = $('#legend_value option:selected').data('row');
        console.log(p_row_id);
    
        $.ajax({
            type: "POST",
            url: "/get-legend-value-wise-color/",
            headers: { "X-CSRFToken": csrftoken },
            data: { 'dataToSend' : p_row_id },
            dataType: "json",
            cache: false,
            success: function (data) {
                // console.log(data);
                if(data.status) {
                    var ret_data = data.response;
                    $.each(ret_data, function(index, item) {
                        $('#layer_color').val(item.legend_color);
                    });
                    
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    
    });
    
    $(document).on('change', '#watershed_name', function(){

        var Watershed_Id = $('#watershed_name option:selected').val();

        $.ajax({
            type: "POST",
            url: "/get-watershed-para-list/",
            headers: { "X-CSRFToken": csrftoken },
            data: {'dataToSend' : Watershed_Id },
            dataType: "json",
            cache: false,
            success: function (data) {
                // console.log(data);
                if(data.status) {
                    var ret_data = data.response;
                    var appendString = '<option value="" selected disabled>Select Para Name</option>';
                    $('#para_name').empty();
                    $('#para_name').prop('disabled', false);
    
                    $.each(ret_data, function(index, item) {
                        appendString += '<option value="'+ item.para_name +'" >'+ item.para_name +'</option>';
                    });
    
                    $('#para_name').append(appendString);
                    
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    });

    $('#btn_reset_field').on('click', function(){
        $('.resetTextValue').val('');
        $('.resetSelectValue').val('').trigger('change');
    });

    $(document).on('click', '#btn_save', function(){
        
        var v_catgry_id = $('#catgry_id option:selected').val();
        var v_catgry_name = $('#catgry_id option:selected').text();
        var v_watershed = $('#watershed_name option:selected').val();
        var v_para_name = $('#para_name option:selected').val();
        var v_actual_value = $('#actual_value').val();
        var v_legend_value = $('#legend_value option:selected').val();
        var v_layer_color = $('#layer_color').val();

        var send_data = {
            'cate_id' : v_catgry_id,
            'cate_name' : v_catgry_name,
            'watershed' : v_watershed,
            'para_name' : v_para_name,
            'act_value' : v_actual_value,
            'legend_value' : v_legend_value,
            'layer_color' : v_layer_color,
        };

        $.ajax({
            url: "/save-new-layer-map-color/",
            type: "POST",
            headers: { "X-CSRFToken": csrftoken },
            data: {'dataToSend' : JSON.stringify(send_data)},
            dataType: "JSON",
            cache: false,
            success: function (data) {
                // console.log(data);
                if(data.status) {
                    $('#alertDiv').removeClass('hide');
                    $('#show_msg').html(data.message);
                    autoHideConfirmMessage();
                    $('.resetTextValue').val('');
                    $('.resetSelectValue').val('').trigger('change');
                }
                else {
                    alert(data.message);
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    });

});

function loadCategoryNamelist() {

    $.ajax({
        type: "GET",
        url: "/get-all-categoryId/",
        headers: { "X-CSRFToken": csrftoken },
        dataType: "json",
        cache: false,
        success: function (data) {
            // console.log(data);
            if(data.status) {
                var ret_data = data.response;
                var appendString = '<option value="" selected disabled>Select Category Name</option>';
                $('#catgry_id').empty();

                $.each(ret_data, function(index, item) {
                    appendString += '<option value="'+ item.cate_id +'" >'+ item.cate_name +'</option>';
                });

                $('#catgry_id').append(appendString);
                
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function loadWatershedNameList() {

    $.ajax({
        type: "GET",
        url: "/get-watershed-list/",
        headers: { "X-CSRFToken": csrftoken },
        dataType: "json",
        cache: false,
        success: function (data) {
            // console.log(data);
            if(data.status) {
                var ret_data = data.response;
                var appendString = '<option value="" selected disabled style="font-family: Cambria;">Select Watershed Name</option>';
                $('#watershed_name').empty();

                $.each(ret_data, function(index, item) {
                    appendString += '<option value="'+ item.watershed_id +'" >'+ item.watershed_name +'</option>';
                });

                $('#watershed_name').append(appendString);
                
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function autoHideConfirmMessage() {
    setTimeout(function() {
        var alertDiv = document.getElementById('alertDiv');
        if (alertDiv) {
            alertDiv.classList.add('hidden');
            // Wait for the transition to complete before setting display to none
            setTimeout(function() {
                alertDiv.style.display = 'none';
            }, 1000); // Duration should match the CSS transition duration
        }
    }, 5000); // 5000 milliseconds = 5 seconds
}

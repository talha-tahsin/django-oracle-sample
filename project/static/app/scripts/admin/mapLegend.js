

document.title = 'Map Legend List';

// Declaring impotant variable globally
var csrftoken = $("meta[name='csrf-token']").attr("content");
var userName = $('#userName').val();
    
$(document).ready(function () {

    console.log("developed by : talha-tahsin ");
    $('#n_catgry_id').select2();
    $('#n_catgry_id').siblings().children().children().css({'border-radius': '5px', 'border': '2px solid #77c3e1', 'padding-bottom': '30px'});

    $('#myModal_add').on('shown.bs.modal', function () {
        $('.add_select2').select2({
            dropdownParent: $('#myModal_add') // Ensure the dropdown is appended to the modal to prevent overlay issues
        });
        $('.add_select2').siblings().children().children().css({'border-radius': '5px', 'border': '2px solid #77c3e1', 'padding-bottom': '30px'});
    });
    
    loadMapLegendList();

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
                var appendString = '<option value="" selected disabled>Select One</option>';
                $('#p_catgry_id').empty();

                $.each(ret_data, function(index, item) {
                    appendString += '<option value="'+ item.cate_id +'">'+ item.cate_name +'</option>';
                });

                $('#p_catgry_id').append(appendString);
                
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    $('#btn_refresh').click(function() {
        location.reload(true);
    });

    $(document).on('click', '#btn_add_new', function(){
        $('#myModal_add').modal({backdrop : 'static', keyboard : false});

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
                    var appendString = '<option value="" selected disabled>Select One</option>';
                    $('#n_catgry_id').empty();

                    $.each(ret_data, function(index, item) {
                        appendString += '<option value="'+ item.cate_id +'" >'+ item.cate_name +'</option>';
                    });

                    $('#n_catgry_id').append(appendString);
                    
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    });

    $(document).on('click', '#btn_save_new2', function(){
        
        var n_catgry_id = $('#p_catgry_id option:selected').val();
        var n_catgry_name = $('#p_catgry_id option:selected').text();
        var n_header = $('#p_header').val();
        var n_legend_color = $('#p_legend_color').val();
        var n_legend_value = $('#p_legend_value').val();

        var send_data = {
            'cate_id' : n_catgry_id,
            'cate_name' : n_catgry_name,
            'header' : n_header,
            'color' : n_legend_color,
            'value' : n_legend_value,
        };

        $.ajax({
            url: "/save-new-map-legend/",
            type: "POST",
            headers: { "X-CSRFToken": csrftoken },
            data: {'dataToSend' : JSON.stringify(send_data)},
            dataType: "JSON",
            cache: false,
            success: function (data) {
                // console.log(data);
                if(data.status) {
                    $('#myModal_add').modal('hide'); 
                    $('#myModal').modal({backdrop : 'static', keyboard : false});
                    $('#success_msg').html('<span style="color: green;">SUCCESS !! <p>'+ data.message +'</p></span>' );
                    // loadMapLegendList();
                    location.reload(true);
                    
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

    $(document).on('click', '#btn_edit', function(){

        var row_id = $(this).closest('tr').find('#btn_edit').attr('row_id');
        console.log(row_id);

        if(row_id == '' || row_id == null || row_id == undefined){
            alert("Row id not found...");  
        }
        else 
        {
            $('#myModal_edit').modal({backdrop : 'static', keyboard : false});
            $("#row_id").val(row_id);

            $.ajax({
                url: "/show-map-legend-details-for-edit/",
                type: "POST",
                headers: { "X-CSRFToken": csrftoken },
                data: { 'dataToSend' : row_id },
                dataType: "JSON",
                cache: false,
                success: function (data) {
                    // console.log(data);
                    if(data.status) {
                        $.each(data.response, function (i, v) {
                            $('#row_id').val(v.row_id);
                            $('#m_catgry_name').val(v.cate_name);
                            $('#m_header').val(v.header);
                            $('#m_legend_color').val(v.color);
                            $('#m_legend_value').val(v.value);
                        });
                    }
                    else {
                        alert(data.message);
                    }
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });

        }

    });

    $(document).on('click', '#btn_save_changes', function(){

        var mRowId = $("#row_id").val();
        var m_catgry_name = $('#m_catgry_name').val();
        var m_header = $('#m_header').val();
        var m_legend_color = $('#m_legend_color').val();
        var m_legend_value = $('#m_legend_value').val();

        // console.log(usrId, userStatus);

        var send_data = {
            'row_id' : mRowId,
            'cat_name' : m_catgry_name,
            'header' : m_header,
            'color' : m_legend_color,
            'value' : m_legend_value,
        };

        $.ajax({
            url: "/save-map-legend-changes/",
            type: "POST",
            headers: { "X-CSRFToken": csrftoken },
            data: {'dataToSend' : JSON.stringify(send_data)},
            dataType: "JSON",
            cache: false,
            success: function (data) {
                // console.log(data);
                if(data.status) {
                    $('#myModal_edit').modal('hide'); 
                    $('#myModal').modal({backdrop : 'static', keyboard : false});
                    $('#success_msg').html('<span style="color: green;">SUCCESS !! <p>'+ data.message+'</p></span>' );
                    // loadMapLegendList();
                    location.reload(true);
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

    $(document).on('click', '#btn_delete', function(){

        var row_id = $(this).closest('tr').find('#btn_edit').attr('row_id');
        console.log(row_id);

        var confirmMsg = confirm("Are you sure about this delete..?");
    
        if(confirmMsg) {
    
            $.ajax({
                url: "/delete-map-legend-info/",
                type: "POST",
                headers: { "X-CSRFToken": csrftoken },
                data: { 'dataToSend' : row_id },
                dataType: "JSON",
                cache: false,
                success: function (data) {
                    // console.log(data);
                    if(data.status) {
                        $('#myModal').modal({backdrop : 'static', keyboard : false});
                        $('#success_msg').html('<span style="color: green;">SUCCESS !! <p>'+ data.message+'</p></span>' );
                        // loadMapLegendList();
                        location.reload(true);
                    }
                    else {
                        alert(data.message);
                    }
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
    
        }
    
    });


// -- End document ready -- 
});

function loadMapLegendList(){
    
    $.ajax({
        type: "GET",
        url: "/get-map-legend-list/",
        headers: { "X-CSRFToken": csrftoken },
        dataType: "json",
        cache: false,
        success: function (data) {
            // console.log(data);
            if(data.status) {
                var ret_data = data.response;
                $('#table_body').empty();
                var htmlstring = '';
                var serial = 0;

                $.each(ret_data, function(index, item) {
                    serial = serial + 1;
                    htmlstring += '<tr>';
                    htmlstring += '<td style="text-align: center;font-family: Cambria;">'+ serial +'</td>';
                    htmlstring += '<td style="text-align: left;font-family: Cambria;">'+ item.cate_name +'</td>';
                    htmlstring += '<td style="text-align: left;font-family: Cambria;">'+ item.header +'</td>';
                    htmlstring += '<td style="text-align: left;font-family: Cambria;">'+ item.color +'</td>';
                    htmlstring += '<td style="text-align: left;font-family: Times New Roman;">'+ item.value +'</td>';

                    htmlstring += '<td style="text-align: center;font-family: Cambria;">';
                    htmlstring += '<button type="submit" id="btn_edit" class="btn btn-primary" row_id="'+ item.row_id +'" style="margin-right: 20px;"> Edit </button>';
                    htmlstring += '<button type="submit" id="btn_delete" class="btn btn-warning" row_id="'+ item.row_id +'"> Delete </button>';
                    htmlstring += '</td>';

                    // htmlstring += '<td style="text-align: center;font-family: Cambria;">'; 
                    // htmlstring += '<button type="submit" id="btn_delete" class="btn btn-warning" row_id="'+ item.row_id +'"> Delete </button>';
                    // htmlstring += '</td>';
                    htmlstring += '</tr>';
                });

                $('#table_body').append(htmlstring);
                $('#my_table').DataTable();
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
  
}

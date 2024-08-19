

document.title = 'View Layer Map Color List';

// Declaring impotant variable globally
var csrftoken = $("meta[name='csrf-token']").attr("content");
var userName = $('#userName').val();

var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
    
$(document).ready(function () {

    console.log("developed by : talha-tahsin ");
    $('#n_catgry_id').select2();
    $('#n_catgry_id').siblings().children().children().css({'border-radius': '5px', 'border': '2px solid #77c3e1', 'padding-bottom': '30px'});

    $('#myModal_edit').on('shown.bs.modal', function () {
        $('.add_select2').select2({
            dropdownParent: $('#myModal_edit') // Ensure the dropdown is appended to the modal to prevent overlay issues
        });
        $('.add_select2').siblings().children().children().css({'border-radius': '5px', 'border': '2px solid #77c3e1', 'padding-bottom': '30px'});
    });

    loadLayerMapColorList();

    $('#btn_refresh').click(function() {
        location.reload(true);
    });

    // Toast.fire({
    //     icon: 'success',
    //     title: 'Data deleted successfully..'
    // })

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
                var appendString = '<option value="" selected disabled>Select Legend Value</option>';
                $('#n_catgry_id').empty();

                $.each(ret_data, function(index, item) {
                    appendString += '<option value="'+ item.cate_id +'" >'+ item.cate_id +'</option>';
                });

                $('#n_catgry_id').append(appendString);
                
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

});

$(document).on('click', '#btn_save_new', function(){
    
    var n_catgry_id = $('#n_catgry_id').val();
    var n_catgry_name = $('#n_catgry_name').val();
    var n_header = $('#n_header').val();
    var n_legend_color = $('#n_legend_color').val();
    var n_legend_value = $('#n_legend_value').val();

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
                $('#success_msg').html('<span style="color: green;">SUCCESS !! <p>'+ data.message+'</p></span>' );
                loadLayerMapColorList();
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
    var v_ctgry_name = $(this).closest('tr').find('td:eq(1)').text();
    var v_legend_val = $(this).closest('tr').find('td:eq(5)').text();

    // console.log(row_id);

    if(row_id == '' || row_id == null || row_id == undefined){
        alert("Row id not found...");  
    }
    else 
    {
        $('#myModal_edit').modal({backdrop : 'static', keyboard : false});
        $("#row_id").val(row_id);

        $.ajax({
            url: "/show-layer-map-color-details/",
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
                        $('#m_watershed').val(v.watershed);
                        $('#m_para_name').val(v.para_name);
                        $('#m_actual_value').val(v.act_value);
                        $('#m_legend_value').val(v.legend_value);
                        $('#m_layer_color').val(v.color);
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

        $.ajax({
            type: "POST",
            url: "/get-category-wise-legend-values/",
            headers: { "X-CSRFToken": csrftoken },
            data: { 'dataToSend' : v_ctgry_name },
            dataType: "json",
            cache: false,
            success: function (data) {
                // console.log(data);
                if(data.status) {
                    var ret_data = data.response;
                    var appendString = '<option value="" selected disabled>Select Legend Value</option>';
                    $('#m_legend_value').empty();

                    $.each(ret_data, function(index, item) {
                        var isSelected = item.legend_val === v_legend_val ? ' selected' : '';
                        appendString += '<option value="'+ item.legend_val +'" data-row="'+ item.row_id +'" '+ isSelected +'>'+ item.legend_val +'</option>';
                    });

                    $('#m_legend_value').append(appendString);
                    
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    }

});

$(document).on('change', '#m_legend_value', function(){

    var p_row_id = $('#m_legend_value option:selected').data('row');
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
                    $('#m_layer_color').val(item.legend_color);
                });
                
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

});

$(document).on('click', '#btn_save_changes', function(){

    var mRowId = $("#row_id").val();
    var v_catgry_name = $('#m_catgry_name').val();
    var v_watershed = $('#m_watershed').val();
    var v_para_name = $('#m_para_name').val();
    var v_act_value = $('#m_actual_value').val();
    var v_legend_value = $('#m_legend_value').val();
    var v_color = $('#m_layer_color').val();

    // console.log(usrId, userStatus);

    var send_data = {
        'row_id' : mRowId,
        'p_cat_name' : v_catgry_name,
        'p_watershed' : v_watershed,
        'p_para_name' : v_para_name,
        'P_act_value' : v_act_value,
        'p_legend_value' : v_legend_value,
        'p_color' : v_color,
    };

    $.ajax({
        url: "/save-layer-map-color-changes/",
        type: "POST",
        headers: { "X-CSRFToken": csrftoken },
        data: {'dataToSend' : JSON.stringify(send_data)},
        dataType: "JSON",
        cache: false,
        success: function (data) {
            // console.log(data);
            if(data.status) {
                $('#myModal_edit').modal('hide'); 
                // $('#myModal').modal({backdrop : 'static', keyboard : false});
                // $('#success_msg').html('<span style="color: green;">SUCCESS !! <p>'+ data.message+'</p></span>' );
                // loadLayerMapColorList();
                // successMessageWithToastr();
                location.reload(true);
                // Toast.fire({
                //     icon: 'success',
                //     title: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
                // })
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
            url: "/delete-layer-map-color-info/",
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

function loadLayerMapColorList(){

    $.ajax({
        type: "GET",
        url: "/get-layer-map-color-list/",
        headers: { "X-CSRFToken": csrftoken },
        dataType: "json",
        cache: false,
        success: function (data) {
            // console.log(data);
            if(data.status) {
                var ret_data = data.response;
                $('#table_body').empty();
                var appndStr = '';
                var serial = 0;

                $.each(ret_data, function(index, item) {
                    serial = serial + 1;
                    appndStr += '<tr>';
                    appndStr += '<td style="text-align: center;font-family: Cambria;">'+ serial +'</td>';
                    appndStr += '<td style="text-align: left;font-family: Cambria;">'+ item.cate_name +'</td>';
                    appndStr += '<td style="text-align: left;font-family: Cambria;">'+ item.watershed +'</td>';
                    appndStr += '<td style="text-align: left;font-family: Cambria;">'+ item.para_name +'</td>';
                    appndStr += '<td style="text-align: left;font-family: Times New Roman;">'+ item.act_value +'</td>';
                    appndStr += '<td style="text-align: left;font-family: Times New Roman;">'+ item.legnd_value +'</td>';
                    appndStr += '<td style="text-align: left;font-family: Cambria;">'+ item.color +'</td>';

                    appndStr += '<td style="text-align: center;font-family: Cambria;">';
                    appndStr += '<button type="submit" id="btn_edit" class="btn btn-primary" row_id="'+ item.row_id +'" style="margin-right: 15px;"> Edit </button>';
                    appndStr += '<button type="submit" id="btn_delete" class="btn btn-warning" row_id="'+ item.row_id +'"> Delete </button>';
                    appndStr += '</td>';

                    // appndStr += '<td style="text-align: center;font-family: Cambria;">'; 
                    // appndStr += '<button type="submit" id="btn_delete" class="btn btn-warning" row_id="'+ item.row_id +'"> Delete </button>';
                    // appndStr += '</td>';
                    appndStr += '</tr>';
                });

                $('#table_body').append(appndStr);
                $('#my_table').DataTable();
              
            }
          },
          error: function(xhr, ajaxOptions, thrownError) {
              console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
          }
      });

}

function successMessageWithToastr() {
    
    var successMessage = "Updated data saved successfully !";
    Command: toastr["success"](successMessage);

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

}

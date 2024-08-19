


document.title = 'registration';

$(document).ready(function () {

    console.log("hello from jQuery..");
    $('#stuDepartment').select2();
    $('.select2').css({'border': '1px solid #898AEE', 'border-radius': '5px'});
    // $('#para_list').prop('disabled', true);
    
    $(document).on('change', '#watershedId', function(){
        $("#watershedId").siblings().children().children().css('background-color', 'transparent');
    });

    $(document).on('change', '#para_list', function(){
        $("#para_list").siblings().children().children().css('background-color', 'transparent');
    });

    insertTableRow2();

    // myTable1 = {
    //     '001' : 'Only Jhum',
    //     '002' : 'Only plough',
    //     '003' : 'Only fruit',
    //     '004' : 'Jhum + plough',
    //     '005' : 'Jhum + fruit',
    //     '006' : 'Plough + fruit',
    //     '007' : 'Jhum + fruit + plough',
    // };
    // $.each(myTable1, function(key, value) {
    //     insertTableRow1(value);
    // });

});

$('#add_row2').on('click', function(){
    insertTableRow2();
});

$(document).on('click', '#btn_store1', function () {

    var csrftoken = $("meta[name='csrf-token']").attr("content");
    // var created_by = $('#userName').val();
    var created_by = 'talha';

    var studentName = $('#studentName').val();
    var stuRoll = $('#stuRoll').val();
    var stuDepartment = $('#stuDepartment').val();
    var stuGender = $("input[name='stuGender']:checked").val();

    send_data = {
        'stu_name' : studentName,
        'stu_roll' : stuRoll,
        'stu_department' : stuDepartment,
        'stu_gender' : stuGender,
        'created_by' : created_by,
    };
    
    console.log(csrftoken, send_data);

    // clear model message value for every ajax call provide single accurate message
    $('#success_msg').html('');
    $('#error_msg').html('');

    $.ajax({
        url: "insert-std-info/",
        type: "POST",
        headers: { "X-CSRFToken": csrftoken },
        data: { 'dataToSend' : JSON.stringify(send_data) },
        dataType: "JSON",
        cache: false,
        success: function (data) {
            // console.log(data);
            if(data.success) {
                $('#myModal').modal({backdrop : 'static', keyboard : false});
                $('#success_msg').html('<span style="color: green;">SUCCESS !! <p>'+ data.message+'</p></span>' );
                
                $('.initialval').val('');
                $('.initialSelectVal').val('').change();
                // $('#my_table1 td').find('.resetSelect').prop("selectedIndex", 0);
                // $('#my_table1 td input[type=text]').val('');
            }
            else {
                $('#myModal').modal({backdrop : 'static', keyboard : false});
                $('#error_msg').html('<span style="color: red">ERROR!! <p>'+data.message+'</p></span>');
            }
            
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

    


});

function insertTableRow2() {

    var appendString = '';
    var rowCount = $('#my_table2 > tbody > tr').length;
    rowCount++;

    appendString += '<tr>';

    appendString += '<td class="sl" style="width: 20px;text-align: center;">' + rowCount + '</td>';

    appendString += '<td>';
    appendString += '<input type="text" id="kharif_1" class="form-control" value="" style="width: 150px;text-align: left;" placeholder="Please fill up..">';
    appendString += '</td>';

    appendString += '<td>';
    appendString += '<input type="text" id="kharif_2" class="form-control" value="" style="width: 150px;text-align: left;" placeholder="Please fill up..">';
    appendString += '</td>';

    appendString += '<td>';
    appendString += '<input type="text" id="rabi" class="form-control" value="" style="width: 150px;text-align: left;" placeholder="Please fill up..">';
    appendString += '</td>';

    appendString += '<td>';
    appendString += '<input type="text" id="practicing_site" class="form-control" value="" style="width: 250px;text-align: left;" placeholder="Please fill up..">';
    appendString += '</td>';

    appendString += '<td>';
    appendString += '<input type="text" id="cultivated_area" class="form-control" value="" style="width: 250px;text-align: left;" placeholder="Please fill up..">';
    appendString += '</td>';

    appendString += '<td style="text-align: center;">';
    appendString += '<button type="button" class="btn btn-xs btn-danger btn-info removeHead"><i class="fa fa-remove"></i>Remove</button>';
    appendString += '</td>';

    appendString += '</tr>';


    $('#my_table2 > tbody:last-child').append(appendString);
    
    $(document).on('click', '.removeHead', function () {

        $(this).parent().parent().remove();

        var sl = 1;
        $('#my_table2 > tbody > tr').each(function () {
            $(this).find('.sl').html(sl);
            sl++;
        });
        counter = sl - 1;

    });
}

$(document).on('click', '#btn_store2', function () {

    var token = $("meta[name='csrf-token']").attr("content");
    var created_by = $('#userName').val();

    var watershed_id = $('#watershed_id').val();
    var watershed_name = $('#watershed_name').val();
    var para_id = $('#para_id').val();
    var para_name = $('#para_name').val();

    if(watershed_id == '' || watershed_id == null || watershed_id == undefined){
        alert("Please Select Watershed id first....");
        $("#watershedId").siblings().children().children().css('background-color', '#FFCECE');
    }
    else
    {

        xml_data = '<head>';

        $('#my_table2 > tbody > tr').each(function () {

            // var livestock_name = $(this).find('td:eq(1)').text(); 
            
            var kharif_1 = $(this).find('#kharif_1').val();
            var kharif_2 = $(this).find('#kharif_2').val();
            var rabi = $(this).find('#rabi').val();
            var practicing_site = $(this).find('#practicing_site').val();
            var cultivated_area = $(this).find('#cultivated_area').val();

            // first binding data as xml string
            xml_data += '<row>';

            xml_data += '<watershed_id>' + watershed_id + '</watershed_id>';
            xml_data += '<watershed_name>' + watershed_name + '</watershed_name>';
            xml_data += '<para_id>' + para_id + '</para_id>';
            xml_data += '<para_name>' + para_name + '</para_name>';

            xml_data += '<kharif_1>' + kharif_1 + '</kharif_1>';
            xml_data += '<kharif_2>' + kharif_2 + '</kharif_2>';
            xml_data += '<rabi>' + rabi + '</rabi>';
            xml_data += '<practicing_site>' + practicing_site + '</practicing_site>';
            xml_data += '<cultivated_area>' + cultivated_area + '</cultivated_area>';

            xml_data += '<created_by>' + created_by + '</created_by>';

            xml_data += '</row>';
            
        });

        xml_data += '</head>';
        
        console.log(xml_data);

        // clear model message value for every ajax call provide single accurate message
        $('#success_msg').html('');
        $('#error_msg').html('');

        $.ajax({
            url: "/store_existing_cropping_pattern",
            type: "POST",
            data: { '_token' : token, 'xml_data' : xml_data },
            dataType: "JSON",
            cache: false,
            success: function (data) {
                // console.log(data);
                if(data.status == 'SUCCESS'){
                    $('#myModal').modal({backdrop : 'static', keyboard : false});
                    $('#success_msg').html('<span style="color: green;">SUCCESS !! <p>'+ data.message+'</p></span>' );
                    $('#my_table2 td input[type=text]').val('');
                    // alert(data.message);
                }
                else{
                    $('#myModal').modal({backdrop : 'static', keyboard : false});
                    $('#error_msg').html('<span style="color: red">ERROR!! <p>'+data.message+'</p></span>');
                }
                
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }   



});

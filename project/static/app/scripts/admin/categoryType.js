

document.title = 'Category Type';
var csrftoken = $("meta[name='csrf-token']").attr("content");

    
$(document).ready(function () {

    console.log("developed by : talha-tahsin ");
//    $('.add_select2').select2();
//    $('.add_select2').siblings().children().children().css({'border-radius': '5px', 'border': '2px solid #77c3e1', 'padding-bottom': '30px'});

//    loadCategoryNamelist();

    $('#btn_reset_field').on('click', function(){
        $('.resetTextValue').val('');
        $('.resetSelectValue').val('').trigger('change');
    });

    $(document).on('click', '#btn_save', function(){
        
        var v_categoryId = $('#categoryId').val();
        var v_categoryName = $('#categoryName').val();

        var send_data = {
            'cate_id' : v_categoryId,
            'cate_name' : v_categoryName,
        };
//        console.log(send_data);

        $.ajax({
            type: "POST",
            url: "/store-category-type/",
            headers: { "X-CSRFToken": csrftoken },
            contentType: "application/json",
            data: JSON.stringify(send_data),
            dataType: "json",
            cache: false,
            success: function (data) {
                console.log(data.jsonObj.response);
                var ret_data = data.jsonObj.response;
                if(ret_data.status) {
                    $('#alertDiv').removeClass('hide');
                    $('#show_msg').html(ret_data.result);
                    autoHideConfirmMessage();
                    $('.resetTextValue').val('');
                    $('.resetSelectValue').val('').trigger('change');
                }
                else {
                    alert(ret_data.result);
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

    });

});
//
//function loadCategoryNamelist() {
//
//    $.ajax({
//        type: "GET",
//        url: "/get-all-categoryId/",
//        headers: { "X-CSRFToken": csrftoken },
//        dataType: "json",
//        cache: false,
//        success: function (data) {
//            // console.log(data);
//            if(data.status) {
//                var ret_data = data.response;
//                var appendString = '<option value="" selected disabled>Select Category Name</option>';
//                $('#catgry_id').empty();
//
//                $.each(ret_data, function(index, item) {
//                    appendString += '<option value="'+ item.cate_id +'" >'+ item.cate_name +'</option>';
//                });
//
//                $('#catgry_id').append(appendString);
//
//            }
//        },
//        error: function(xhr, ajaxOptions, thrownError) {
//            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//        }
//    });
//}

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

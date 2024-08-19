

$(document).ready(function() {
    const categorySelect = $('#id_category');
    const categoryNameInput = $('#id_category_name');
    const legendValueSelect = $('#id_legend_value');
    console.log("Hello..boss");

    // Disable the category name input field
    // categoryNameInput.prop('disabled', true);

    categorySelect.change(function() {
        const categoryId = $(this).val();
        console.log(categoryId);

        if (categoryId) {
            $.ajax({
                url: '/get-category-name/',
                data: {
                    'category_id': categoryId
                },
                dataType: 'json',
                success: function(data) {
                    categoryNameInput.val(data.category_name);
                }
            });
        } else {
            categoryNameInput.val('');
        }

        if (categoryId) {
            $.ajax({
                url: '/get-legend-values/',
                data: {
                    'category_id': categoryId
                },
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                    legendValueSelect.empty(); // Clear the existing options
                    // legendValueSelect.prop('disabled', false); // Enable the field
                    legendValueSelect.append('<option value="" selected disabled>-- Select Option --</option>');
                    $.each(data.legend_values, function(index, value) {
                        legendValueSelect.append($('<option>', {
                            value: value.legend_value,
                            text: value.legend_value
                        }));
                    });
                }
            });
        } else {
            legendValueSelect.empty();
            legendValueSelect.append('<option value="" selected></option>');
            // legendValueSelect.prop('disabled', true);
        }

    });

});
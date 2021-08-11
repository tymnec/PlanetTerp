function submitProfessorForm(form_id) {
    if (form_id == '#professor-form-review') {
        rateYo_multiplier = 3.1
        form_type = "review"
        post_url = ""
        container_id = form_id;
    } else {
        rateYo_multiplier = 1.8
        form_type = "add"
        post_url = "/add_professor"
        container_id = "#add-professor-form-container";
    }

    $.ajax({
        type: "POST",
        url: post_url,
        data: $(form_id).serialize(),
        success: function(data) {
            if (!(data['success'])) {
                if (form_type == "add") {
                    $("#add-professor-modal").modal('hide');
                    $(".modal-backdrop").remove();
                }

                $(container_id).html(`${data['form']}`);
                // Remove weird space generated by crispy_forms radio widget
                $("input[type=checkbox].is-invalid").parent().hide();

                $("div.invalid-feedback").each(function() {
                    var element_id = $(this).attr('id');
                    var field_name = element_id.replace("_errors", '').trim()

                    if (field_name == 'type_' || field_name == 'name') {
                        $(this).appendTo($(`#div_id_${field_name}`))
                    }

                    if (field_name == 'other_course') {
                        $("#id_other_course").show();
                    }

                    $(this).show();
                });

                $(".anonymous-checkbox > div.form-group").addClass("mb-0");

                var show_error_styles = $(form_id).find("#rating_errors").length != 0
                initializeRateYo(rateYo_multiplier, form_type, show_error_styles);

                if (form_type == "add") {
                    $("#add-professor-modal").modal('show');
                }
            } else {
                if (form_type == "add") {
                    $("#add-professor-modal").modal('hide');
                    $(".modal-backdrop").remove();
                }

                $(container_id).html(`${data['form']}`);
                $(".anonymous-checkbox > div.form-group").addClass("mb-0");
                initializeRateYo(rateYo_multiplier, form_type);

                $(`#success-banner-${form_type}`).removeClass("d-none").css({"z-index": "1"});

                if (form_type == "add") {
                    $("#success-banner-add").removeClass("w-100").css({"width": "69rem"});
                    $("#add-professor-modal").modal('show');
                }
            }
        },
        error: function () {
            console.log("HTTP ERROR");
            alert("HTTP ERROR");
        }
    });
}

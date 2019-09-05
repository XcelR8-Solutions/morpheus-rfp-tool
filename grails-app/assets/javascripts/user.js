$(document).ready(function () {

    if ($('body').data('page') === 'user-index') {
        $('.edit-user-submit').on("click", function (e) {
            $('.edit-user-form').submit();
        });

        $('.edit-user-form').on("submit", function (event) {
            event.preventDefault();
            //Serialize Form
            var data = $(this).find(":input[value]").serialize();
            $.ajax({
                type: "POST",
                url: $(this).attr('action'),
                data: data,
                success: function (response) {
                    if (response.success) {
                        $('#edit-user-modal').modal('toggle');
                        location.reload();
                    }
                }
            });
        });
    }

    if ($('body').data('page') === 'user-settings') {

        $('.edit-user-submit').on("click", function (e) {
            $('.edit-user-form').submit();
        });

        $('.edit-user-form').on("submit", function (event) {
            event.preventDefault();
            //Serialize Form
            var data = $(this).find(":input[value]").serialize();
            $.ajax({
                type: "POST",
                url: $(this).attr('action'),
                data: data,
                success: function (response) {
                    if (response.success) {
                        $('#edit-user-modal').modal('toggle');
                        location.reload();
                    }
                }
            });
        });
    }

});




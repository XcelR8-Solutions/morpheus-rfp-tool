$(document).ready(function () {
    if ($('body').data('page') === 'settings-index') {

        //display red/blue required field indicator bars to user
        $(".settings-form input[type=text]").on("invalid", function() {
            var $this = $(this);
            $this.prev().css("background-color", "#f26e5e");
        });
        $(".settings-form input[type=text]").on("keypress", function () {
            var $this = $(this);
            $this.prev().css("background-color", "#79c5e1");
        })
/*
        $('.settings-form').on("submit", function (event) {
            event.preventDefault();
            //Serialize Form
            var data = $(this).find(":input[value]").serialize();
            console.log("DATA: "+data)
            $.ajax({
                type: "POST",
                url: $(this).attr('action'),
                data: data,
                success: function (response) {
                    if (response.success) {
                        location.reload();
                    } else {
                        console.log(response)
                        // bad stuff happened
                        showErrors(response.errors);
                    }
                }
            });
        });
        */
    }
});

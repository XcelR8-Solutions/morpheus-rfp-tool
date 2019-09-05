$(document).ready(function () {
    if ($('body').data('page') === 'license-tool') {

        //display red/blue required field indicator bars to user
        $(".license-decode-form input[type=text]").on("invalid", function () {
            var $this = $(this);
            $this.prev().css("background-color", "#f26e5e");
        });
        $(".license-decode-form input[type=text]").on("keypress", function () {
            var $this = $(this);
            $this.prev().css("background-color", "#79c5e1");
        })
        $('.license-decode-form').on("submit", function (event) {
            event.preventDefault();
            //Serialize Form
            var data = $(this).find("textarea[name='licenseContent']").serialize();
            console.log("DATA: " + data)
            $.ajax({
                type: "POST",
                url: '/admin/licenseTool/decodeLicense',
                data: data,
                success: function (response) {
                    if (response.success) {
                        console.log("success response: " + JSON.stringify(response));
                        $(".decoded-license-content").text(JSON.stringify(response.decodedLicense));
                    } else {
                        console.log("failed response: " + response);
                        // bad stuff happened
                        showErrors(response.errors);
                    }
                }
            });
        });
    }
});

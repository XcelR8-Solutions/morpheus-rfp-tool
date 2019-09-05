$(document).ready(function () {
    if ($('body').data('page') === 'add-release') {

        //display red/blue required field indicator bars to user
        $(".update-release-form input[type=text]").on("invalid", function() {
            var $this = $(this);
            $this.prev().css("background-color", "#f26e5e");
        });
        $(".update-release-form input[type=text]").on("keypress", function () {
            var $this = $(this);
            $this.prev().css("background-color", "#79c5e1");
        })
        $(".update-agent-release-form input[type=text], select").on("invalid", function() {
            var $this = $(this);
            $this.prev().css("background-color", "#f26e5e");
        });
        $(".update-agent-release-form input[type=text]").on("keypress", function () {
            var $this = $(this);
            $this.prev().css("background-color", "#79c5e1");
        })
        $(".update-agent-release-form select").on("change", function () {
            var $this = $(this);
            $this.prev().css("background-color", "#79c5e1");
        })

        //html5 required field in grails tries to validate all inputs across all forms, so remove unnecessary validation
        $('.add-appliance-release-submit').on("click", function () {
            $('#agentBuildVersion').removeAttr('required');
            $('#agentType').removeAttr('required');
        });
        $('.add-appliance-agent-release-submit').on("click", function () {
            $('#applianceBuildVersion').removeAttr('required');
            $('#applianceDownloadUrl').removeAttr('required');
        });
        $('.cancel').on("click", function () {
            $('#applianceBuildVersion').removeAttr('required');
            $('#applianceDownloadUrl').removeAttr('required');
            $('#agentBuildVersion').removeAttr('required');
            $('#agentType').removeAttr('required');
        });

    }
});

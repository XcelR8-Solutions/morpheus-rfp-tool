var MorpheusHub = MorpheusHub || {};
MorpheusHub.accounts = MorpheusHub.accounts || {};

(function() {
    var self = this;

    var init = function() {
//        console.log("MorpheusHub.accounts init called");
/*
        if ($('body').data('page') === 'accounts-index') {
            $('.section-container').on("click", ".section-data-row", function() {
                var requestLink = $(this).find('.request-link-td a');
                requestLink = requestLink.attr('href');
                var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
                var newUrl = origin + requestLink
                window.location = newUrl;
            });

            $('.section-container').on("click", ".release-data-row", function() {
                var requestLink = $(this).find('.request-link-td a');
                requestLink = requestLink.attr('href');
                var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
                var newUrl = origin + requestLink
                window.location = newUrl;
            });
        }
*/
/*
        if ($('body').data('page') === 'accounts-edit') {

            //display red/blue required field indicator bars to user
            $(".edit-account-form input[type=text]").on("invalid", function() {
                var $this = $(this);
                $this.prev().css("background-color", "#f26e5e");
            });
            $(".edit-account-form input[type=text]").on("keypress", function() {
                var $this = $(this);
                $this.prev().css("background-color", "#79c5e1");
            })
        }
*/
/*
        if ($('body').data('page') === 'accounts-create') {

            //display red/blue required field indicator bars to user
            $(".create-account-form input[type=text]").on("invalid", function() {
                var $this = $(this);
                $this.prev().css("background-color", "#f26e5e");
            });
            $(".create-account-form input[type=text]").on("keypress", function() {
                var $this = $(this);
                $this.prev().css("background-color", "#79c5e1");
            })
        }
        */
    };

    MorpheusHub.accounts = {
        init: init
    };
})();

$(document).ready(function() {
//    console.log("MorpheusHub.accounts: document is ready");
    MorpheusHub.accounts.init();
});
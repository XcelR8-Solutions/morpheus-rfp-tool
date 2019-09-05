var MorpheusHub = MorpheusHub || {};
MorpheusHub.poc = MorpheusHub.poc || {};

(function() {
    var self = this;

    var init = function() {
        console.log("MorpheusHub.poc init called");

        if ($('body').data('page') === 'applianceLicensePoc-index') {

            //Show POC Details on Key Row click
            $('.poc-list-container').on("click", ".poc-key-row", function() {
                var pocLink = $(this).find('.poc-link-td a');
                pocLink = pocLink.attr('href');
                var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
                var newUrl = origin + pocLink
                window.location = newUrl;
            });

        }

        if ($('body').data('page') === 'applianceLicensePoc-show') {

            //Add/delete additional custom success criteria on the POC Details
            $(".add-custom").on("click", function() {
                var listLength = $(".custom-list li").length;
                if (listLength < 10) {
                    $(".custom-list").append($("li", $(".custom-list")).last().clone(true));
                    var lastLi = $(".custom-list li").last();
                    lastLi.find('input').val('')
                }
                return false;
            });
            $(".delete-custom").on("click", function() {
                var listLength = $(".custom-list li").length;
                if (listLength > 1) {
                    $(this).parent().remove();
                }
                return false;
            });

        }
    };

    MorpheusHub.poc = {
        init: init
    };
})();

$(document).ready(function() {
    console.log("MorpheusHub.poc: document is ready");
    MorpheusHub.poc.init();
});
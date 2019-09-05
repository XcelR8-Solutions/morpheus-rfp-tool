$(function() {

    var dataPage = 'admin/companies/index';

    /**
     * Constructor method only to run if data-page is 'admin/companies/index'
     */
    var init = function() {

        if($('body').data('page') === dataPage) {
            console.log('running ' + dataPage + ' init...');
            _observeEvents();
        }
    };

    /**
     * Registers event listeners for the various buttons and forms on the admin accounts section
     * @private
     */
    function _observeEvents() {
        $('.section-container').on("click", ".section-data-row", function() {
            var requestLink = $(this).find('.request-link-td a');
            requestLink = requestLink.attr('href');
            var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
            var newUrl = origin + requestLink
            window.location = newUrl;
        });
    }

    init();

});

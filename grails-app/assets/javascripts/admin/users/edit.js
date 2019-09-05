$(function() {

    var dataPage = 'admin/users/edit';

    /**
     * Constructor method only to run if data-page is 'admin/users/edit'
     */
    var init = function() {

        if($('body').data('page') === dataPage) {
            console.log('running ' + dataPage + ' init...');
            _observeEvents();
        }
    };

    /**
     * Registers event listeners for the various buttons and forms on the admin edit user section
     * @private
     */
    function _observeEvents() {
    }

    init();

});

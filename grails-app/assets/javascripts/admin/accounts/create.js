$(function() {

    var dataPage = 'admin/accounts/create';

    /**
     * Constructor method only to run if data-page is 'admin/accounts/create'
     */
    var init = function() {

        if($('body').data('page') === dataPage) {
            console.log('running ' + dataPage + ' init...');
            _observeEvents();
        }
    };

    /**
     * Registers event listeners for the various buttons and forms on the admin create account section
     * @private
     */
    function _observeEvents() {
        //display red/blue required field indicator bars to user
        $(".create-account-form input[type=text]").on("invalid", function() {
            var $this = $(this);
            $this.prev().css("background-color", "#f26e5e");
        });
        $(".create-account-form input[type=text]").on("keypress", function() {
            var $this = $(this);
            $this.prev().css("background-color", "#79c5e1");
        });
    }

    init();

});

var MorpheusHub = MorpheusHub || {};

(function() {
    var self = this;

    var init = function() {};

    //Perform AJAX magic to filter appliance license list
    function loadCustomers(phrase) {
        console.log("PHRASES: " + phrase)
        $.ajax({
            url: '/admin/users/customerList',
            method: 'POST',
            data: { phrase: phrase, customer: true }
        }).then(function(response) {
            console.log(response)
            $('.customers-container').html(response);
        })
    }

    MorpheusHub.UserService = {
        loadCustomers: loadCustomers
    };
    init();
})();

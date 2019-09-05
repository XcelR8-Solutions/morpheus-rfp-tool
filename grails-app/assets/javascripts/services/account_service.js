var MorpheusHub = MorpheusHub || {};

(function() {
    var self = this;

    var init = function() {};

    function loadAccountInfo(config) {
        var accountId = config.accountId || '';
        $.ajax({
			url: '/admin/applianceLicenses/getAccountInfo/' + accountId,
			contentType: "application/json",
            method: 'GET',
            data: {}
        }).then(function(response) {
            if (response) {
                if (config.callback) {
                    config.callback({data: response, accountId: accountId});
                }
            }
        })
    }

    MorpheusHub.AccountService = {
		loadAccountInfo: loadAccountInfo
    };
    init();
})();

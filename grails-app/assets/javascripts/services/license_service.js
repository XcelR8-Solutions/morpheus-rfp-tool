var MorpheusHub = MorpheusHub || {};

(function() {
    var self = this;

    var init = function() {};

    function loadLicenseRequestLimits(config) {
        var licenseType = config.licenseType || '';
		$.ajax({
			url: '/licenses/licenseRequestLimits',
			method: 'POST',
			data: {
				phrase: 'foo',
				licenseType: licenseType
			}
		}).then(function(response) {
			console.log("response.success: " + response.success);
			console.log("response.licenseType: " + response.licenseType);
			console.log("response.limits: " + response.limits);
			if (response) {
				if (config.callback) {
					config.callback({data: response, accountId: accountId});
				}
			}
			//      $('.license-keys-container').html(response);
		})
    }

    MorpheusHub.ApplianceLicenseService = {
		loadLicenseRequestLimits: loadLicenseRequestLimits
    };
    init();
})();

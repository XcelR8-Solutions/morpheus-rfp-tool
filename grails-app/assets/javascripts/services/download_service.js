var MorpheusHub = MorpheusHub || {};

(function() {
    var self = this;

    var init = function() {};

    function loadApplianceVersions(config) {
        var branchId = config.branchId || '0';
        $.ajax({
            url: '/download/applianceVersionsList',
            method: 'POST',
            data: { branchId: branchId }
        }).done(function(data) {
            if (data && data.versions) {
                if (config.callback) {
                    config.callback({data: data, branchId: branchId});
                }
            }
        })
    }

    function loadReleaseNote(config) {
        var branchId = config.branchId || '0';
        var versionId = config.versionId || '0';
        $.ajax({
            url: '/download/article?branchId=' + branchId + '&versionId=' + versionId,
            method: 'GET'
        }).then(function(response) {
            if (response) {
                if (config.callback) {
                    config.callback({html: response, branchId: branchId, versionId: versionId});
                }
            }
        })
    }

    MorpheusHub.DownloadService = {
        loadApplianceVersions: loadApplianceVersions,
        loadReleaseNote: loadReleaseNote
    };
    init();
})();

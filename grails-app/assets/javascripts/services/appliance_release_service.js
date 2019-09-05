var MorpheusHub = MorpheusHub || {};

(function() {
    var self = this;

    var init = function() {};

    function loadReleaseVersions(config) {
        var releaseTypeId = config.releaseTypeId || '';
        var max = config.max || '10';
        var offset = config.offset || '0';
        $.ajax({
            url: '/admin/applianceReleases/releaseVersionList',
            method: 'POST',
            data: {
                releaseTypeId: releaseTypeId,
                max: max,
                offset: offset
            }
        }).then(function(response) {
            if (response) {
                if (config.callback) {
                    config.callback({html: response, releaseTypeId: releaseTypeId});
                }
            }
        })
    }

    function loadNextVersionNumber(config) {
        var releaseTypeId = config.releaseTypeId || '';
        if (releaseTypeId != 'null') {
            $.ajax({
                url: '/admin/applianceReleases/loadNextVersionNumber?releaseTypeId=' + releaseTypeId,
                contentType: "application/json",
                method: 'GET',
                data: {}
            }).done(function(response) {
                if (response) {
                    if (config.callback) {
                        config.callback({data: response, releaseTypeId: releaseTypeId});
                    }
                }
            });
        }
    }

    MorpheusHub.ApplianceReleaseService = {
        loadReleaseVersions: loadReleaseVersions,
        loadNextVersionNumber: loadNextVersionNumber
    };
    init();
})();

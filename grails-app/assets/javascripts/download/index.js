$(function() {

    var dataPage = 'downloads/index';

    /**
     * Constructor method only to run if data-page is 'downloads/index'
     */
    var init = function() {

        if($('body').data('page') === dataPage) {
            console.log('running ' + dataPage + ' init...');

            MorpheusHub.DownloadService.loadReleaseNote({
                branchId: $("#downloadBranch option:selected").val(),
                versionId: $("#downloadVersion option:selected").val(),
                callback: _consumeReleaseNoteResponse
            });

            _observeEvents();
        }
    };

    /**
     * Registers event listeners for the various buttons and forms on the appliance releases section
     * @private
     */
    function _observeEvents() {
        $('#downloadBranch').change(function() {
            MorpheusHub.DownloadService.loadApplianceVersions({
                branchId: this.value,
                callback: _consumeApplianceVersionsResponse
            });
        });

        $('#downloadVersion').change(function() {
            MorpheusHub.DownloadService.loadReleaseNote({
                branchId: $("#downloadBranch option:selected").val(),
                versionId: this.value,
                callback: _consumeReleaseNoteResponse
            });
        });

        $('.section-container').on("click", ".section-data-row", function() {
            var requestLink = $(this).find('.request-link-td a');
            requestLink = requestLink.attr('href');
            var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
            var newUrl = origin + requestLink
            window.location = newUrl;
        });
    }

    function _consumeApplianceVersionsResponse(response) {
        if (response) {
            var data = response.data;
            var branchId = response.branchId;
            if (data.versions && data.versions.length > 0) {
                $("#downloadVersion").empty();
                var len = data.versions.length;
                for (var i = 0; i < len; i++) {
                    var id = data.versions[i]['id'];
                    var name = data.versions[i]['name'];

                    $("#downloadVersion").append("<option value='" + id + "'>" + name + "</option>");
                }
            } else {
                $("#downloadVersion").empty();
                $("#downloadVersion").append("<option value=''>No other versions available</option>");
            }
            MorpheusHub.DownloadService.loadReleaseNote({
                branchId: branchId,
                versionId: $("#downloadVersion option:selected").val(),
                callback: _consumeReleaseNoteResponse
            });
        }
    }

    function _consumeReleaseNoteResponse(response) {
        if(response) {
            var branchId = response.branchId;
            var versionId = response.versionId;
            var html = response.html;
            $('.article-test').html(html);
        }
    }

    init();

});

$(function() {

    var dataPage = 'admin/applianceReleases/index';

    /**
     * Constructor method only to run if data-page is 'admin/applianceReleases/index'
     */
    var init = function() {

        if($('body').data('page') === dataPage) {
            console.log('running ' + dataPage + ' init...');
            _observeEvents();
        }
    };

    /**
     * Registers event listeners for the various buttons and forms on the appliance releases section
     * @private
     */
    function _observeEvents() {
        $('.appliance-releases-container').on("click", ".release-data-row", function() {
            var requestLink = $(this).find('.request-link-td a');
            requestLink = requestLink.attr('href');
            var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
            var newUrl = origin + requestLink
            window.location = newUrl;
        });

        $(".select-release-type-dropdown select").on('change', function() {
            var max = _getUrlParams('max');
            console.log("max: " + max);
            var offset = _getUrlParams('offset');
            console.log("offset: " + offset);
            var releaseTypeId = $('div.select-release-type-dropdown').find('select[name="releaseTypeId"]').val()
            if (releaseTypeId != 'null') {
                MorpheusHub.ApplianceReleaseService.loadReleaseVersions({
                    releaseTypeId: releaseTypeId,
                    max:max,
                    offset:offset,
                    callback: _consumeApplianceVersionsResponse
                });
            }
        });
    }

    function _consumeApplianceVersionsResponse(response) {
        if(response) {
            var releaseTypeId = response.releaseTypeId;
            var html = response.html;
            $('.appliance-releases-container').html(html);
        }
    }

    /**
     * JavaScript Get URL Parameter
     *
     * @param String prop The specific URL parameter you want to retrieve the value for
     * @return String|Object If prop is provided a string value is returned, otherwise an object of all properties is returned
     */
    function _getUrlParams( prop ) {
        var params = {};
        var search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ) );
        var definitions = search.split( '&' );

        definitions.forEach( function( val, key ) {
            var parts = val.split( '=', 2 );
            params[ parts[ 0 ] ] = parts[ 1 ];
        } );
		console.log("prop: " + prop);
        return ( prop && prop in params ) ? params[ prop ] : null;
    }

    init();

});

$(function() {

    var dataPage = 'admin/users/index';

    /**
     * Constructor method only to run if data-page is 'admin/users/index'
     */
    var init = function() {

        if($('body').data('page') === dataPage) {
            console.log('running ' + dataPage + ' init...');
            _observeEvents();
        }
    };

    /**
     * Registers event listeners for the various buttons and forms on the admin users section
     * @private
     */
    function _observeEvents() {
        //Show User Details on Key Row click
        $('.section-container').on("click", ".section-data-row", function() {
            var requestLink = $(this).find('.request-link-td a');
            requestLink = requestLink.attr('href');
            var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
            var newUrl = origin + requestLink
            window.location = newUrl;
        });

        //Appliance Key Search Bar
        $('.users-filters').on('keyup', 'input', function() {
            var phrase;
            var activeTab = $('div.tab-content ').find('.active').attr('id');
            if (activeTab == 'customers') {
                phrase = $('.users-filters').find('input[name=customerPhraseFilter]').val();
                loadCustomers(phrase);
            } else if (activeTab == 'users') {
                phrase = $('.users-filters').find('input[name=userPhraseFilter]').val();
                loadUsers(phrase);
            }
        }.debounce(200))

        //FIND ACTIVE Tab
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            var target = $(e.target).attr("href") // activated tab
            target = target.replace('#', '');
            //Toggle the search bars
            $('.phrase').toggle()
        });
    }

    function _consumeApplianceVersionsResponse(response) {
        if(response) {
            var releaseTypeId = response.releaseTypeId;
            var html = response.html;
            $('.appliance-releases-container').html(html);
        }
    }

    init();

});

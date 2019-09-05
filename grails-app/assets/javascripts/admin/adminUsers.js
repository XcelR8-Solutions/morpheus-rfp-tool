var MorpheusHub = MorpheusHub || {};
MorpheusHub.adminUsers = MorpheusHub.adminUsers || {};

(function() {
    var self = this;

    var init = function() {
        console.log("MorpheusHub.adminUsers init called");

        _accountsBloodhound.initialize(); //Initialize TypeAhead Data Source
/*
        if ($(document.body).data('page') == 'adminUser-create') {
            console.log("About to load type ahead");

            $('#accountTypeahead .typeahead').bind('typeahead:select', function(ev, suggestion) {
                console.log('typeahead:select: ' + suggestion.id + ' ' + suggestion.companyName);
                $("#accountTypeahead").find('input[name="account.id"]').val(suggestion.id);
            });

            $('#accountTypeahead .typeahead').bind('typeahead:open', function(ev) {
                console.log('typeahead:open');
            });

            $('#accountTypeahead .typeahead').bind('typeahead:close', function(ev) {
                console.log('typeahead:close');
            });

            $('#accountTypeahead .typeahead').bind('typeahead:change', function(ev) {
                console.log('typeahead:change');
            });

            $('#accountTypeahead .typeahead').typeahead({
                highlight: true,
                hint: true,
                minLength: 2
            }, {
                name: 'create-user-accounts',
                displayKey: 'value',
                source: _accountsBloodhound.ttAdapter(),
                limit: 10,
                templates: {
                    header: ['<div class="tt-header">Select one of the following</div>'],
                    empty: [
                        '<div class="tt-empty-message">',
                        'Unable to find any accounts that match the current query',
                        '</div>'
                    ].join('\n'),
                    suggestion: function(data) {
                        return '<p><strong>ID:' + data.id + '</strong> – ' + data.companyName + ' - ' + data.type + '</p>';
                    }
                }
            });
            console.log("type ahead loaded");

            $("input[name='account.type']").change(function() {
                console.log('account type changed: ' + this.value);
                var inputField = $("#accountTypeahead").find('input[name="account.companyName"]');
                inputField.typeahead('destroy');

                $('#accountTypeahead .typeahead').typeahead({
                    highlight: true,
                    hint: true,
                    minLength: 2
                }, {
                    name: 'create-user-accounts',
                    displayKey: 'value',
                    source: _accountsBloodhound.ttAdapter(),
                    limit: 10,
                    templates: {
                        header: function(query, suggestions) {
                            return '<div class="tt-header">Select one of the following</div>';
                        },
                        footer: function(query, suggestions) {
                            return '<div class="tt-footer"></div>';
                        },
                        notFound: function(query) {
                            return '<div class="tt-empty-message">Unable to find any accounts that match the current query</div>';
                        },
                        suggestion: function(data) {
                            return '<p><strong>ID:' + data.id + '</strong> – ' + data.companyName + ' - ' + data.type + '</p>';
                        }
                    }
                });

                inputField = $("#accountTypeahead").find('input[name="account.companyName"]');
                inputField.focus();
            });
        }
        */
/*
        if ($('body').data('page') === 'admin/users/index') {

            //Show User Details on Key Row click
            $('.users-container').on("click", ".user-data", function() {
                var userLink = $(this).parent('tr').find('.user-link-td a');
                userLink = userLink.attr('href');
                var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
                var newUrl = origin + userLink
                window.location = newUrl;
            });

            //Show Customer User Details on Key Row click
            $('.customers-container').on("click", ".user-data", function() {
                var customerLink = $(this).parent('tr').find('.customer-link-td a');
                customerLink = customerLink.attr('href');
                var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
                var newUrl = origin + customerLink
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
*/
    };

    var _accountsBloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            cache: false,
            url: "/admin/accounts/accountTypeAhead.json",
            prepare: function(query, settings) {
                settings.url += '?q=' + query + '&accountType=' + getSelectedAccountType();
                return settings;
            },
            filter: function(parsedResponse) {
                var matches = []
                for (var counter = 0; counter < parsedResponse.length; counter++) {
                    var currentRow = parsedResponse[counter];
                    if ($('.create-user-accounts-list .create-user-row[data-id=' + currentRow.id + ']').length == 0) {
                        matches.push(currentRow)
                    }
                }
                return matches
            }
        },
        limit: 10
    });

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

    function getSelectedAccountType() {
        var inputField = $("input[name='account.type']:checked").val();
        return inputField;
    }

    triggerCustomEvent = function(name, data) {
        var event;
        event = document.createEvent('Events');
        if (data) {
            event.data = data;
        }
        event.initEvent(name, true, true);
        return document.dispatchEvent(event);
    };

    MorpheusHub.adminUsers = {
        init: init
    };
})();

$(document).ready(function() {
//    console.log("MorpheusHub.adminUsers: document is ready");
//    MorpheusHub.adminUsers.init();
});
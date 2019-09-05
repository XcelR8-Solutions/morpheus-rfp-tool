$(function() {

    var dataPage = 'admin/users/create';

    /**
     * Constructor method only to run if data-page is 'admin/users/create'
     */
    var init = function() {

        if($('body').data('page') === dataPage) {
            console.log('running ' + dataPage + ' init...');

            _accountsBloodhound.initialize(); //Initialize TypeAhead Data Source

            _observeEvents();
        }
    };

    /**
     * Registers event listeners for the various buttons and forms on the admin create user section
     * @private
     */
    function _observeEvents() {
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

    function getSelectedAccountType() {
        var inputField = $("input[name='account.type']:checked").val();
        return inputField;
    }

    init();

});

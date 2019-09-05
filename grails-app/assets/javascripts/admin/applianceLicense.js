var MorpheusHub = MorpheusHub || {};
MorpheusHub.applianceLicense = MorpheusHub.applianceLicense || {};

(function () {
    var self = this;

    var init = function() {

        _accountsBloodhound.initialize(); //Initialize TypeAhead Data Source
        _usersBloodhound.initialize(); //Initialize TypeAhead Data Source

        if ($('body').data('page') === 'applianceLicense-show') {
            setTimeout(function() {
                animateLicenceProgress();
            }, 1000);
            document.querySelector('.copy').addEventListener('click', function(event) {
                document.querySelector('.temp-notification').classList.remove('growl');
                document.querySelector('textarea.license-key').select();
                document.execCommand("copy");
                document.querySelector('textarea.license-key').blur();
                document.querySelector('.temp-notification').classList.add('growl');

            });
            calculateUsedStoragePercentage();
            calculateUsedMemoryPercentage();
        }

        if ($('body').data('page') === 'applianceLicense-index') {

            //Show License Details on Key Row click
            $('.license-keys-container').on("click", ".license-data", function() {
                var licenseLink = $(this).parent('tr').find('.license-link-td a');
                licenseLink = licenseLink.attr('href');
                var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
                var newUrl = origin + licenseLink
                window.location = newUrl;
            });

            //Show License Request Details on Key Row click
            $('.request-keys-container').on("click", ".license-data", function() {
                var requestLink = $(this).parent('tr').find('.request-link-td a');
                requestLink = requestLink.attr('href');
                var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
                var newUrl = origin + requestLink
                window.location = newUrl;
            });

            //Appliance Key Search Bar
            $('.appliance-license-filters').on('keyup', 'input', function() {
                var phrase, type, dateFilter;
                var activeTab = $('div.tab-content ').find('.active').attr('id');
                if (activeTab == 'keys') {
                    phrase = $('section.appliance-license-filters').find('input[name=keyPhraseFilter]').val();
                    type = $('div.select-filters').find('select[name=licenseTypeFilter]').val();
                    dateFilter = $('div.select-filters').find('select[name=dateFilter]').val();
                    loadLicenseKeys(phrase, type, dateFilter);
                } else if (activeTab == 'requests') {
                    phrase = $('section.appliance-license-filters').find('input[name=requestPhraseFilter]').val();
                    loadLicenseRequests(phrase)
                }

            }.debounce(200))

            /*On Appliance License Filter Selection*/
            $(document).on('change', 'select', function() {
                var phrase, type, dateFilter;
                var activeTab = $('div.tab-content ').find('.active').attr('id');
                if (activeTab == 'keys') {
                    phrase = $('section.appliance-license-filters').find('input[name=keyPhraseFilter]').val();
                    type = $('div.select-filters').find('select[name=licenseTypeFilter]').val();
                    dateFilter = $('div.select-filters').find('select[name=dateFilter]').val();
                    loadLicenseKeys(phrase, type, dateFilter);
                } else if (activeTab == 'requests') {
                    phrase = $('section.appliance-license-filters').find('input[name=requestPhraseFilter]').val();
                    loadLicenseRequests(phrase)
                }
            });

            //FIND ACTIVE Tab
            $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                var target = $(e.target).attr("href") // activated tab
                target = target.replace('#', '');
                //Toggle the search bars
                $('.phrase').toggle()
            });
        }

        if ($('body').data('page') === 'applianceLicense-edit') {
            var productTierSelect = $('.product-tier-select');
            var productTier = productTierSelect.val();
            /*
                    var featureChecks = $('.feature-checkbox');
                    featureChecks.each(function() {
                        setFeatureCheckbox(productTier, $(this));
                    });
                    */
            setWorkloadLimit(productTier);

            //display red/blue required field indicator bars to user
            $(".edit-license-form input[type=text], select[name=licenseApprover]").on("invalid", function() {
                var $this = $(this);
                $this.prev().css("background-color", "#f26e5e");
            });
            $(".edit-license-form input[type=text]").on("keypress", function() {
                var $this = $(this);
                $this.prev().css("background-color", "#79c5e1");
            })
            $(".edit-license-form select[name=licenseApprover]").on("change", function() {
                var $this = $(this);
                $this.prev().css("background-color", "#79c5e1");
            })

            $(".edit-license-form input[name=endDate], input[name=startDate]").on("datechanged", function() {
                var startDateField = $(".edit-license-form input[name=startDate]");
                var endDateField = $(".edit-license-form input[name=endDate]");
                var startDate = parseDate(startDateField.val());
                var endDate = parseDate(endDateField.val());

                var days = 24 * 60 * 60 * 1000;
                var totalDays = Math.round((endDate - startDate) / days);
                totalDays = (isNaN(totalDays)) ? 'N/A' : totalDays + ' days'

                console.log("Date difference is: " + totalDays);
                $(".total-length-days").text(totalDays)
            });

            $(document).on('change', '.product-tier-select', function(event) {
                var productTierSelect = $(event.target);
                var productTier = productTierSelect.val();
                var featureChecks = $('.feature-checkbox');
                featureChecks.each(function() {
                    setFeatureCheckbox(productTier, $(this));
                });
                setWorkloadLimit(productTier);
            });
        }
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
                if (parsedResponse.length == 0) {
                    console.log("No matches were found at all!");
//                    $("#accountTypeahead").find('input[name="account.id"]').val(null);

                    $('form.create-license-form').find('input[name=firstName]').val('').prev().css("background-color", "#79c5e1");
                    $('form.create-license-form').find('input[name=lastName]').val('').prev().css("background-color", "#79c5e1");
                    $('form.create-license-form').find('input[name=jobTitle]').val('').prev().css("background-color", "#79c5e1");
                    $('form.create-license-form').find('input[name=contactEmail]').val('').prev().css("background-color", "#79c5e1");
                    $('form.create-license-form').find('input[name=phone]').val('').prev().css("background-color", "#79c5e1");
                    $('form.create-license-form').find('input[name=executiveChampionName]').val('').prev().css("background-color", "#79c5e1");
                    $('form.create-license-form').find('input[name=executiveChampionEmail]').val('').prev().css("background-color", "#79c5e1");

                }
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

    var _usersBloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            cache: false,
            url: '/admin/users/userTypeAhead.json',
            prepare: function(query, settings) {
                settings.url += '?q=' + query + '&accountType=' + getSelectedAccountType();
                return settings;
            },
            filter: function(parsedResponse) {
                var matches = []
                if (parsedResponse.length == 0) {
                    console.log("No matches were found at all!");
                    $("#accountTypeahead").find('input[name="account.id"]').val(null);

                    $('form.create-license-form').find('input[name=firstName]').val('').prev().css("background-color", "#79c5e1");
                    $('form.create-license-form').find('input[name=lastName]').val('').prev().css("background-color", "#79c5e1");
                    $('form.create-license-form').find('input[name=jobTitle]').val('').prev().css("background-color", "#79c5e1");
                    $('form.create-license-form').find('input[name=contactEmail]').val('').prev().css("background-color", "#79c5e1");
                    $('form.create-license-form').find('input[name=phone]').val('').prev().css("background-color", "#79c5e1");
                    $('form.create-license-form').find('input[name=executiveChampionName]').val('').prev().css("background-color", "#79c5e1");
                    $('form.create-license-form').find('input[name=executiveChampionEmail]').val('').prev().css("background-color", "#79c5e1");

                }

                for(var counter=0;counter < parsedResponse.length;counter++) {
                    var currentRow = parsedResponse[counter];
                    if ($('.create-user-accounts-list .create-user-row[data-id=' + currentRow.id + ']').length == 0) {
                        matches.push(currentRow)
                    }
                }
                return matches
            }
        }
    });


    function animateLicenceProgress() {
        var licenseProgressElement = document.querySelector('.license-progress');
        var licenseData = licenseProgressElement.dataset;
        console.log("licenseData.daysLeft: " + licenseData.daysLeft);
        console.log("licenseData.totalDays: " + licenseData.totalDays);
        var pctUsed
        if (licenseData.totalDays === 'Unlimited' || licenseData.daysLeft < 0) {
            pctUsed = 100;
        } else {
            pctUsed = (1 - (parseInt(licenseData.daysLeft) / parseInt(licenseData.totalDays))) * 100;
        }
        if (licenseData.daysLeft < 0) {
            licenseProgressElement.querySelector('.time-left').innerText = (licenseData.daysLeft * -1) + ' days past';
        } else {
            licenseProgressElement.querySelector('.time-left').innerText = licenseData.daysLeft + ' days left';
        }

        var circleOffset = (pctUsed / 100) * 28;
        var bubbleOffset = (document.querySelector('.time-left').getBoundingClientRect().width / 2);
        // - ' + (bubbleOffset  + (circleOffset/2)) + 'px
        document.querySelector('.time-left').style.width = document.querySelector('.time-left').getBoundingClientRect().width + 'px';
        licenseProgressElement.querySelector('.time-left').style.left = 'calc(' + pctUsed + '% - ' + (circleOffset + bubbleOffset - 11) + 'px)';
        licenseProgressElement.querySelector('.current-license').style.width = pctUsed + '%';
        licenseProgressElement.querySelector('.current.circle').style.left = 'calc(' + pctUsed + '% - ' + circleOffset + 'px)';
    }

    function setFeatureCheckbox(productTier, checkbox) {
        if (productTier == 'capacity') {
            checkbox.prop('checked', true);
        } else {
            var dataVal = checkbox.data(productTier);
            checkbox.prop('checked', dataVal);
        }
    }

    function setWorkloadLimit(productTier) {
        var workloadInput = $('.max-instances');
        var newVal = '';
        if (productTier == 'essentials')
            newVal = 1000;
        else if (productTier == 'pro')
            newVal = 10000;
        else if (productTier == 'msp')
            newVal = 100;
        workloadInput.val(newVal);
    }

    //Perform AJAX magic to filter appliance license list
    function loadLicenseKeys(phrase, type, dateFilter) {
        $.ajax({
            url: '/admin/applianceLicense/licenseList',
            method: 'POST',
            data: { phrase: phrase, type: type, dateFilter: dateFilter }
        }).then(function(response) {
            $('.license-keys-container').html(response);
        })
    }

    //Perform AJAX magic to filter license request list
    function loadLicenseRequests(phrase) {
        $.ajax({
            url: '/admin/applianceLicense/requestList',
            method: 'POST',
            data: { phrase: phrase }
        }).then(function(response) {
            $('.request-keys-container').html(response);
        })
    }

    function loadAccountInfo(accountId) {
        console.log("loading account info for id: " + accountId);
        $.ajax({
            url: '/admin/applianceLicenses/getAccountInfo/' + accountId,
            contentType: "application/json",
            method: 'GET',
            data: {}
        }).done(function(data) {
            if (console && console.log && data && data.user) {
                console.log("Sample of data:", data);
                console.log("user:", data.user);
                console.log("user first name:", data.user.firstName);
            }
            if (data && data.user) {
                $('form.create-license-form').find('input[name=firstName]').val(data.user.firstName).prev().css("background-color", "#79c5e1");
                $('form.create-license-form').find('input[name=lastName]').val(data.user.lastName).prev().css("background-color", "#79c5e1");
                $('form.create-license-form').find('input[name=jobTitle]').val(data.user.jobTitle).prev().css("background-color", "#79c5e1");
                $('form.create-license-form').find('input[name=contactEmail]').val(data.user.email).prev().css("background-color", "#79c5e1");
                $('form.create-license-form').find('input[name=phone]').val(data.user.phone).prev().css("background-color", "#79c5e1");
                $('form.create-license-form').find('input[name=executiveChampionName]').val(data.user.firstName + ' ' + data.user.lastName).prev().css("background-color", "#79c5e1");
                $('form.create-license-form').find('input[name=executiveChampionEmail]').val(data.user.email).prev().css("background-color", "#79c5e1");
            }
        });
    }

    function calculateUsedStoragePercentage() {
        $(".appliance-stats").each(function(i) {
            console.log("instance id: " + $(this).data('instance-id'));
            var totalStorage = $(this).find('.appliance-stat.storage').data('total-storage')
            var totalStorageUsed = $(this).find('.appliance-stat.storage').data('total-storage-used')
            console.log("total storage: " + totalStorage);
            console.log("total storage used: " + totalStorageUsed);
            var pctUsed = (parseInt(totalStorageUsed) / parseInt(totalStorage)) * 100;
            console.log("pctUsed: " + pctUsed);
            var pct = Math.round(parseFloat(pctUsed));
            if (pct < 0) {
                pct = 0;
            } else if (totalStorageUsed <= 0 && totalStorage <= 0) {
                pct = 0;
            }
            var pctText = pct.toFixed(0);
            console.log("pctText: " + pctText);
            if (totalStorage > 0) {
                $(this).find('.appliance-stat.storage').find('.stat-pct').html(pct + '%');
                $(this).find('.appliance-stat.storage').find('.stat-progress').find('.bar').css('width', pct + '%');
            } else { //unlimited
                $(this).find('.appliance-stat.storage').find('.stat-pct').html('&#8734;').css({ 'line-height': '16px', 'font-size': '22px' });
                $(this).find('.appliance-stat.storage').find('.stat-progress').find('.bar').css('width', '100%');
            }
            //        $(this).find('.appliance-stat.storage').find('.stat-progress').find('.bar').style = 'width:' + pct + '%';
        });
    }

    function calculateUsedMemoryPercentage() {
        $(".appliance-stats").each(function(i) {
            console.log("instance id: " + $(this).data('instance-id'));
            var totalMemory = $(this).find('.appliance-stat.memory').data('total-memory')
            var totalMemoryUsed = $(this).find('.appliance-stat.memory').data('total-memory-used')
            console.log("total memory: " + totalMemory);
            console.log("total memory used: " + totalMemoryUsed);
            var pctUsed = (parseInt(totalMemoryUsed) / parseInt(totalMemory)) * 100;
            console.log("pctUsed: " + pctUsed);
            var pct = Math.round(parseFloat(pctUsed));
            if (pct < 0) {
                pct = 0;
            } else if (totalMemoryUsed <= 0 && totalMemory <= 0) {
                pct = 0;
            }
            var pctText = pct.toFixed(0);
            console.log("pctText: " + pctText);
            if (totalMemory > 0) {
                $(this).find('.appliance-stat.memory').find('.stat-pct').html(pct + '%');
                $(this).find('.appliance-stat.memory').find('.stat-progress').find('.bar').css('width', pct + '%');
            } else { //unlimited
                $(this).find('.appliance-stat.memory').find('.stat-pct').html('&#8734;').css({ 'line-height': '16px', 'font-size': '22px' });
                $(this).find('.appliance-stat.memory').find('.stat-progress').find('.bar').css('width', '100%');
            }
        });
    }

    function parseDate(str) {
        var mdy = str.split('/');
        return new Date(mdy[2], mdy[0] - 1, mdy[1]);
    }

    //Perform AJAX magic to determine limits on license requests
    function loadLicenseRequestLimits(licenseType) {
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
            //      $('.license-keys-container').html(response);
        })
    }

    function getSelectedAccountType() {
        var inputField = $("input[name='account.type']:checked").val();
        return inputField;
    }

    MorpheusHub.applianceLicense = {
        init: init
    };
})();

$(document).ready(function() {
    var applianceLicensePage = $('body').data('page');
    if ($('body').data('page') === undefined) {
        console.log("page not defined");
    } else if ((applianceLicensePage === "applianceLicense-show") ||
        (applianceLicensePage === "applianceLicense-index") ||
        (applianceLicensePage === "applianceLicense-create") ||
        (applianceLicensePage === "applianceLicense-edit")) {
        console.log("MorpheusHub.applianceLicense: document is ready");
        MorpheusHub.applianceLicense.init();
    }
});
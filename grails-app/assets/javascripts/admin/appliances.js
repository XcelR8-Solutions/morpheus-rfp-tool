var MorpheusHub = MorpheusHub || {};
MorpheusHub.appliances = MorpheusHub.appliances || {};

(function() {
    var self = this;

    var init = function() {
        console.log("MorpheusHub.appliances init called");

        if ($('body').data('page') === 'appliances-index') {

            //Show License Details on Key Row click
            $('.appliances-usage-table').on("click", ".table-data", function() {
                var applianceLink = $(this).parent('tr').find('.appliance-link-td a');
                applianceLink = applianceLink.attr('href');
                var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
                var newUrl = origin + applianceLink;
                if (!$(this).hasClass('license-id')) {
                    window.location = newUrl;
                }
            });

            //Set appliance inactive and check to see if we should hide row
            $('.appliance-active').on("click", function(event) {
                event.stopPropagation();

                var applianceId = $(this)[0].id;
                var isChecked = $(this).is(":checked");
                var applianceRow = $(this).parents('tr');
                var showInactive = $('.show-inactive-appliances').is(":checked");
                if (!isChecked && !showInactive) {
                    applianceRow.addClass("hidden");
                }
                var data = {
                    applianceId: applianceId,
                    applianceActive: isChecked
                }
                console.log(data)
                $.ajax({
                    type: "POST",
                    url: '/admin/appliances/updateInactive',
                    data: data,
                    success: function(response) {
                        if (response.success) {
                            console.log("success response: " + JSON.stringify(response));
                        } else {
                            console.log("failed response: " + JSON.stringify(response));
                        }
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        console.log("failed response: " + response);
                    }
                });
            });

            //Show inactive appliances
            $('.show-inactive-appliances').on("click", function(event) {
                var showInactive = $(this).is(":checked");

                $('.appliances-usage-table tr').each(function(i, row) {
                    if (i > 0) {
                        var $row = $(row)
                        var activeCheckbox = $row.find('input:checkbox:first')[0]
                        var isChecked = activeCheckbox.checked;

                        if (showInactive && !isChecked) {
                            $row.removeClass("hidden");
                        } else if (!showInactive && !isChecked) {
                            $row.addClass("hidden");
                        }
                    }
                });
            });

            //Change appliance license button click populate modal data
            var focusedButton;
            $('.change-appliance-license').on("click", function(event) {

                focusedButton = $(this);
                var applianceRow = $(this).parents('tr');

                var company = applianceRow.find('.company').html();
                var type = applianceRow.find('.type').html();
                var applianceUrl = applianceRow.find('.appliance-name').html();
                var licenseId = applianceRow.find('.license-id-link').html();
                var applianceId = $(this)[0].id;
                var accountId = focusedButton.attr('data-accountid');
                console.log("accountId: " + accountId);
                loadLicensesByAccount(accountId, licenseId);

                var modal = $('#changeLicenseModal')
                $('#companyDisplay').text(company);
                $('#typeDisplay').text(type);
                $('#applianceUrlDisplay').text(applianceUrl);
                $('#licenseIdDisplay').text(licenseId);
                $('#company').val(company);
                $('#type').val(type);
                $('#applianceUrl').val(applianceUrl);
                $('#applianceId').val(applianceId);
                $('#licenseId').val(licenseId);

                $('#newLicenseId').prop('selectedIndex', 0);
            });

            $('#changeLicenseModal').on('hidden.bs.modal', function(e) {
                $('.change-appliance-license').one('focus', function(e) { focusedButton.blur() });
            });

            //Set hover icon on mouseenter
            $('.license-id-action').mouseenter(function() {
                var image = $(this).find('img.icon');
                if (!image.hasClass('disabled')) {
                    image.css("display", "none");
                    var hoverImage = $(this).find('img.hover');
                    hoverImage.css("display", "block");
                }
            });

            //Remove hover icon on mouseleave
            $('.license-id-action').mouseleave(function() {
                var image = $(this).find('img.icon');
                if (!image.hasClass('disabled')) {
                    image.css("display", "none");
                    var defaultImage = $(this).find('img.default');
                    defaultImage.css("display", "block");
                }
            });
        }
    };

    //Perform AJAX magic to retrieve licenses by account
    function loadLicensesByAccount(accountId, currentLicenseId) {

        console.log("loading licenses account id: " + accountId + " " + currentLicenseId);

        var data = { "currentLicenseId": currentLicenseId }
        $.ajax({
            url: '/admin/applianceLicenses/getLicensesByAccount/' + accountId,
            contentType: "application/json",
            method: 'POST',
            data: JSON.stringify(data)
        }).done(function(data) {
            if (console && console.log && data && data.user) {
                console.log("Sample of data:", data);
                console.log("user:", data.user);
                console.log("user first name:", data.user.firstName);
                console.log("licenses:", data.licenses);
            }
            if (data && data.licenses) {
                if (data.licenses.length > 0) {
                    document.getElementById("submitLicenseChangeButton").disabled = false;
                    $("#newLicenseId").empty();
                    //            $("#newLicenseId").append("<option value=''>Select One...</option>");
                    var len = data.licenses.length;
                    for (var i = 0; i < len; i++) {
                        var id = data.licenses[i]['id'];
                        var name = "Unknown License Type";
                        if (data.licenses[i]['type'] != null) {
                            name = data.licenses[i]['type']['name'];
                        }
                        var productTier = data.licenses[i]['productTier'];

                        $("#newLicenseId").append("<option value='" + id + "'>" + id + " - " + capitalize(name) + " - " + capitalize(productTier) + "</option>");
                    }
                } else {
                    console.log("There is only one license available for the given account");
                    document.getElementById("submitLicenseChangeButton").disabled = true;
                    $("#newLicenseId").empty();
                    $("#newLicenseId").append("<option value=''>No other licenses available</option>");
                }
            }
        });
    }

    function capitalize(s) {
        //    console.log("s: " + s);
        if (s) {
            return s && s[0].toUpperCase() + s.slice(1);
        } else {
            return "Capacity";
        }
        //    return s && s[0].toUpperCase() + s.slice(1);
    }

    MorpheusHub.appliances = {
        init: init
    };
})();

$(document).ready(function() {
    console.log("MorpheusHub.appliances: document is ready");
    MorpheusHub.appliances.init();
});
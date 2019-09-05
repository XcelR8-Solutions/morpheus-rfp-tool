$(document).ready(function () {
    if ($('body').data('page') === 'licenses-index') {

        //Show License Details on Key Row click
        $('.licenses-container').on("click", ".license-key-row", function () {
            var licenseLink = $(this).find('.license-link-td a');
            licenseLink = licenseLink.attr('href');
            var origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
            var newUrl = origin + licenseLink
            window.location = newUrl;
        });

		$('.licenses-container').on("click", ".license-data", function () {
			var licenseLink = $(this).parent('tr').find('.license-link-td a');
			licenseLink = licenseLink.attr('href');
			var origin = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
			var newUrl = origin + licenseLink
			window.location = newUrl;
		});

        //Appliance Key Search Bar
        $('.appliance-license-filters').on('keyup', 'input', function () {
            var phrase;
            var activeTab = $('div.tab-content ').find('.active').attr('id');
            if (activeTab == 'keys') {
                phrase = $('.appliance-license-filters').find('input[name=keyPhraseFilter]').val();
                loadUserLicenseKeys(phrase);
            } else if (activeTab == 'requests') {
                phrase = $('.appliance-license-filters').find('input[name=requestPhraseFilter]').val();
                loadUserLicenseRequests(phrase)
            }
        }.debounce(200))

        //FIND ACTIVE Tab
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href") // activated tab
            target = target.replace('#', '');
            //Toggle the search bars
            $('.phrase').toggle()
        });


    }
});

$(document).ready(function () {
    if ($('body').data('page') === 'license-request') {

		loadLicenseRequestLimits();

		//display red/blue required field indicator bars to user
        $(".license-request-form input[type=text], textarea ").on("invalid", function() {
            var $this = $(this);
            $this.prev().css("background-color", "#f26e5e");
        });
        $(".license-request-form input[type=text], textarea ").on("keypress mousedown", function () {
            var $this = $(this);
            $this.prev().css("background-color", "#79c5e1");
        });

        //trial or poc selection
        $('.poc-start-container').hide();
        $('.poc-end-container').hide();
        $('.docker-repo-container').hide();

        $("input[type=radio][name=licenseType]").on("change", function () {
			switch($(this).val()) {
                case 'trial':
                    $('.poc-start-container').hide();
                    $('.poc-end-container').hide();
                    $('.usecase-container').show();
                    $('.clouds-integtrations-container').show();

                    //turn on/off validation
                    $('#startDate').prop('required', false);
                    $("#pocTimeframeDays").prop('required', false);
                    $("#executiveChampionName").prop('required', false);
                    $("#executiveChampionEmail").prop('required', false);
                    $("#approvedBy").prop('required', false);
                    $("#morpheusRepresentative").prop('required', false);

                    //Checkbox groups remove custom validation
					$('.cloud-checkbox:checkbox').prop('checked', false);
//					$('.cloud-checkbox:checkbox')[0].setCustomValidity('');
					$('.instanceType-checkbox:checkbox').prop('checked', false);
                    $('.instanceType-checkbox:checkbox')[0].setCustomValidity('');
					$('.networkRequirement-checkbox:checkbox').prop('checked', false);
                    $('.networkRequirement-checkbox:checkbox')[0].setCustomValidity('');
					$('.serverRequirement-checkbox:checkbox').prop('checked', false);
                    $('.serverRequirement-checkbox:checkbox')[0].setCustomValidity('');
					$('.approved-verification-checkbox:checkbox').prop('checked', false);
                    $('.approved-verification-checkbox:checkbox')[0].setCustomValidity('');

					loadLicenseRequestLimits($(this).val());

					break;
                case 'poc':
                    $('.poc-start-container').show();
                    $('.poc-end-container').show();
                    $('.usecase-container').hide();
                    $('.clouds-integtrations-container').show();

                    //turn on/off validation
                    $('#startDate').prop('required', true);
                    $("#pocTimeframeDays").prop('required', true);
                    $("#executiveChampionName").prop('required', true);
                    $("#executiveChampionEmail").prop('required', true);
                    $("#approvedBy").prop('required', true);
                    $("#morpheusRepresentative").prop('required', true);

                    //Checkbox groups custom validation
                    addCustomValidation('approved-verification-checkbox', 'Please approve the criteria and requirements for this PoC');

					loadLicenseRequestLimits($(this).val());

                    break;
                case 'production':
                    $('.poc-start-container').hide();
                    $('.poc-end-container').hide();
                    $('.usecase-container').hide();
                    $('.clouds-integtrations-container').hide();

                    //turn on/off validation
                    $('#startDate').prop('required', false);
                    $("#pocTimeframeDays").prop('required', false);
                    $("#executiveChampionName").prop('required', false);
                    $("#executiveChampionEmail").prop('required', false);
                    $("#approvedBy").prop('required', false);
                    $("#morpheusRepresentative").prop('required', false);

                    //Checkbox groups remove custom validation
					$('.cloud-checkbox:checkbox').prop('checked', false);
//					$('.cloud-checkbox:checkbox')[0].setCustomValidity('');
					$('.instanceType-checkbox:checkbox').prop('checked', false);
					$('.instanceType-checkbox:checkbox')[0].setCustomValidity('');
					$('.networkRequirement-checkbox:checkbox').prop('checked', false);
					$('.networkRequirement-checkbox:checkbox')[0].setCustomValidity('');
					$('.serverRequirement-checkbox:checkbox').prop('checked', false);
					$('.serverRequirement-checkbox:checkbox')[0].setCustomValidity('');
					$('.approved-verification-checkbox:checkbox').prop('checked', false);
					$('.approved-verification-checkbox:checkbox')[0].setCustomValidity('');

					loadLicenseRequestLimits($(this).val());

					break;
            }
        });

        $('.instanceType-checkbox:checkbox').on("change", function () {
            if ($(this).val() == 11) { //docker
                if ($(this).is(':checked')) {
                    $('.docker-repo-container').show();
                } else {
                    $('.docker-repo-container').hide();
                }
            }
        });

        $(".add-custom").on("click", function () {
            var listLength = $(".custom-list li").length;
            if(listLength < 10) {
                $(".custom-list").append($("li", $(".custom-list")).last().clone(true));
                var lastLi = $(".custom-list li").last();
                lastLi.find('input').val('');
            }
            return false;
        });

        $(".delete-custom").on("click", function () {
            var listLength = $(".custom-list li").length;
            if(listLength > 1) {
                $(this).parent().remove();
            }
            return false;
        });

        //On select (checkbox and radio) --> turn on/off success criteria
//        $('.cloud-checkbox, .integration-checkbox, .networkRequirement-checkbox, .instanceType-checkbox, .dockerRequirement-checkbox, .proxyRequirement, .tenantRequirement').on("change", function () {
        $('.integration-checkbox, .networkRequirement-checkbox, .instanceType-checkbox, .dockerRequirement-checkbox, .proxyRequirement, .tenantRequirement').on("change", function () {
            selectDeselectSuccessCriteria($(this)[0].id, $(this)[0].value)
        })

        //On deselect (radio only) --> turn off success criteria
        var selected = {};
        $('input[type="radio"]').on('click', function() {
            if (this.name in selected && this != selected[this.name])
                $(selected[this.name]).trigger("deselect");
            selected[this.name] = this;
        }).filter(':checked').each(function() {
            selected[this.name] = this;
        });
        $('.proxyRequirement, .tenantRequirement').on('deselect', function() {
            selectDeselectSuccessCriteria($(this)[0].id, $(this)[0].value)
        });

    }
});

function selectDeselectSuccessCriteria(ids, requesterId) {
        var clickedIdsArray = JSON.parse(ids)
        //console.log(clickedIdsArray)
        if (clickedIdsArray.length > 0) {
            var selectedSuccessCriteriaIds = filterSelectedSuccessCriteria();
            //console.log(selectedSuccessCriteriaIds)
            clickedIdsArray.forEach(function(successCriteriaId) {
                if (selectedSuccessCriteriaIds.indexOf(successCriteriaId.toString()) > -1) {
                    //already selected
                    var prevRequestorIds = $("#"+successCriteriaId+".success-criteria").attr("class").split("selected ").pop().split(' ')
                    if (prevRequestorIds.indexOf(requesterId) == -1) {
                        //already selected by other requestor --> only add this requestor id
                        $("#"+successCriteriaId+".success-criteria").addClass(requesterId);
                    } else if (prevRequestorIds.indexOf(requesterId) > -1 && prevRequestorIds.length == 1) {
                        //already selected by this requestor --> remove selected and requestor id
                        $("#"+successCriteriaId+".success-criteria").removeClass('selected');
                        $("#"+successCriteriaId+".success-criteria").removeClass(requesterId);
                        $(".success-criteria-input."+successCriteriaId).prop('disabled', true);
                    } else {
                        //already selected by this requestor and another requestor --> only remove this requestor id
                        $("#"+successCriteriaId+".success-criteria").removeClass(requesterId);
                    }
                } else {
                    //not selected yet
                    $("#"+successCriteriaId+".success-criteria").addClass('selected');
                    $("#"+successCriteriaId+".success-criteria").addClass(requesterId);
                    $(".success-criteria-input."+successCriteriaId).prop('disabled', false);
                }
            });
        } else {
            return false
        }
}

function filterSelectedSuccessCriteria() {
    var successCriteria = $('.success-criteria.selected');

    var successCriteriaIds = [];
    successCriteria.each(function(){
        successCriteriaIds.push(this.id);
    });
    //console.log(successCriteriaIds);
    return successCriteriaIds;
}

//Perform AJAX magic to filter appliance license list
function loadUserLicenseKeys(phrase) {
    $.ajax({
        url: '/keys/listKeys',
        method: 'POST',
        data: {phrase: phrase}
    }).then(function (response) {
        $('.license-keys-container').html(response);
    })
}

//Perform AJAX magic to filter license request list
function loadUserLicenseRequests(phrase, status) {
    $.ajax({
        url: '/keys/listRequestKeys',
        method: 'POST',
        data: {phrase: phrase}
    }).then(function (response) {
        $('.request-keys-container').html(response);
    })
}

$.fn.isValid = function () {
    var validate = true;
    this.each(function () {
        if (this.checkValidity() == false) {
            validate = false;
        }
    });
}

function addCustomValidation(className, validationMessage, min) {
    var checkbox = $('.'+className+':checkbox')
    checkbox[0].setCustomValidity(validationMessage);
    checkbox.on("invalid", function() {
        $('.required-bar.checkbox.'+className).css("background-color", "#f26e5e");
    });
    checkbox.on("change", function () {
        $('.required-bar.checkbox.'+className).css("background-color", "#ffffff");

        var defaultMinLimit = 0;
        var minLimit = (typeof min === "undefined" ? defaultMinLimit : min);
        if($('.'+className+':checkbox:checked').length < minLimit) {
			checkbox.attr('required', 'true');
			checkbox[0].setCustomValidity(validationMessage);
		} else {
            checkbox.removeAttr('required');
            checkbox[0].setCustomValidity('');
        }
    });
}

function addMinMaxValidation(className, validationMessage, maxValidationMessage, min, max) {
	var checkbox = $('.'+className+':checkbox')
	checkbox[0].setCustomValidity(validationMessage);
	checkbox.on("invalid", function() {
		$('.required-bar.checkbox.'+className).css("background-color", "#f26e5e");
	});
	checkbox.on("change", function () {
		$('.required-bar.checkbox.'+className).css("background-color", "#ffffff");

		var defaultMinLimit = 0;
		var minLimit = (typeof min === "undefined" ? defaultMinLimit : min);
		var maxLimit = (typeof max === "undefined" ? null : max);
		if($('.'+className+':checkbox:checked').length < minLimit) {
			checkbox.attr('required', 'true');
			checkbox[0].setCustomValidity(validationMessage);
		} else if(maxLimit != null && $('.'+className+':checkbox:checked').length > maxLimit) {
			checkbox.attr('required', 'true');
			checkbox[0].setCustomValidity(maxValidationMessage);
		} else {
			checkbox.removeAttr('required');
			checkbox[0].setCustomValidity('');
		}
	});
}

function addMaxValidation(className, maxValidationMessage, max) {
	var checkbox = $('.'+className+':checkbox')
//	checkbox[0].setCustomValidity(maxValidationMessage);
	checkbox.on("invalid", function() {
		$('.checkbox.'+className).css("background-color", "#f26e5e");
	});
	checkbox.on("change", function () {
		$('.checkbox.'+className).css("background-color", "#ffffff");

		var maxLimit = (typeof max === "undefined" ? null : max);
		if(maxLimit != null && $('.'+className+':checkbox:checked').length > maxLimit) {
			checkbox.attr('required', 'true');
			checkbox[0].setCustomValidity(maxValidationMessage);
		} else {
			checkbox.removeAttr('required');
			checkbox[0].setCustomValidity('');
		}
	});
}

//Perform AJAX magic to determine limits on license requests
function loadLicenseRequestLimits(licenseType) {
	$.ajax({
		url: '/licenses/licenseRequestLimits',
		method: 'POST',
		data: { licenseType: licenseType }
	}).then(function (response) {
//		$('.license-keys-container').html(response);
		if(typeof response.limits !== "undefined") {
			if(typeof response.limits.clouds !== "undefined") {
				if(typeof response.limits.clouds.min !== "undefined" && typeof response.limits.clouds.max !== "undefined") {
					addMinMaxValidation('cloud-checkbox', response.limits.clouds.minMessage, response.limits.clouds.maxMessage, response.limits.clouds.min, response.limits.clouds.max);
				} else if(typeof response.limits.clouds.max !== "undefined") {
					addMaxValidation('cloud-checkbox', response.limits.clouds.maxMessage, response.limits.clouds.max);
				} else if(typeof response.limits.clouds.min !== "undefined") {
					addCustomValidation('cloud-checkbox', response.limits.clouds.minMessage, response.limits.clouds.min);
				}
			}
			if(typeof response.limits.integrations !== "undefined") {
				if(typeof response.limits.integrations.min !== "undefined" && typeof response.limits.integrations.max !== "undefined") {
					addMinMaxValidation('integration-checkbox', response.limits.integrations.minMessage, response.limits.integrations.maxMessage, response.limits.integrations.min, response.limits.integrations.max);
				} else if(typeof response.limits.integrations.max !== "undefined") {
					addMaxValidation('integration-checkbox', response.limits.integrations.maxMessage, response.limits.integrations.max);
				} else if(typeof response.limits.integrations.min !== "undefined") {
					addCustomValidation('integration-checkbox', response.limits.integrations.minMessage, response.limits.integrations.min);
				}
			}
			if(typeof response.limits.instanceTypes !== "undefined") {
				if(typeof response.limits.instanceTypes.min !== "undefined" && typeof response.limits.instanceTypes.max !== "undefined") {
					addMinMaxValidation('instanceType-checkbox', response.limits.instanceTypes.minMessage, response.limits.instanceTypes.maxMessage, response.limits.instanceTypes.min, response.limits.instanceTypes.max);
				} else if(typeof response.limits.instanceTypes.max !== "undefined") {
					addMaxValidation('instanceType-checkbox', response.limits.instanceTypes.maxMessage, response.limits.instanceTypes.max);
				} else if(typeof response.limits.instanceTypes.min !== "undefined") {
					addCustomValidation('instanceType-checkbox', response.limits.instanceTypes.minMessage, response.limits.instanceTypes.min);
				}
			}
			if(typeof response.limits.networkTypes !== "undefined") {
				if(typeof response.limits.networkTypes.min !== "undefined" && typeof response.limits.networkTypes.max !== "undefined") {
					addMinMaxValidation('networkRequirement-checkbox', response.limits.networkTypes.minMessage, response.limits.networkTypes.maxMessage, response.limits.networkTypes.min, response.limits.networkTypes.max);
				} else if(typeof response.limits.networkTypes.max !== "undefined") {
					addMaxValidation('networkRequirement-checkbox', response.limits.networkTypes.maxMessage, response.limits.networkTypes.max);
				} else if(typeof response.limits.networkTypes.min !== "undefined") {
					addCustomValidation('networkRequirement-checkbox', response.limits.networkTypes.minMessage, response.limits.networkTypes.min);
				}
			}
			if(typeof response.limits.serverRequirements !== "undefined") {
				if(typeof response.limits.serverRequirements.min !== "undefined" && typeof response.limits.serverRequirements.max !== "undefined") {
					addMinMaxValidation('serverRequirement-checkbox', response.limits.serverRequirements.minMessage, response.limits.serverRequirements.maxMessage, response.limits.serverRequirements.min, response.limits.serverRequirements.max);
				} else if(typeof response.limits.serverRequirements.max !== "undefined") {
					addMaxValidation('serverRequirement-checkbox', response.limits.serverRequirements.maxMessage, response.limits.serverRequirements.max);
				} else if(typeof response.limits.serverRequirements.min !== "undefined") {
					addCustomValidation('serverRequirement-checkbox', response.limits.serverRequirements.minMessage, response.limits.serverRequirements.min);
				}
			}
		}
	})
}

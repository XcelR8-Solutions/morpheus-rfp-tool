$(function() {

	var dataPage = 'admin/applianceLicenses/create';

	/**
	 * Constructor method only to run if data-page is 'admin/applianceReleases/create'
	 */
	var init = function() {

		if($('body').data('page') === dataPage) {
			console.log('running ' + dataPage + ' init...');
			_observeEvents();

			console.log("Loading applianceLicense for admin/applianceReleases/create");
			_loadLicenseRequestLimits();

			_accountsBloodhound.initialize(); //Initialize TypeAhead Data Source
			_usersBloodhound.initialize(); //Initialize TypeAhead Data Source

		}
	};

	/**
	 * Registers event listeners for the various buttons and forms on the appliance releases section
	 * @private
	 */
	function _observeEvents() {
		$('.instanceType-checkbox:checkbox').on("change", function() {
			if ($(this).val() == 11) { //docker
				if ($(this).is(':checked')) {
					$('.docker-repo-container').show();
				} else {
					$('.docker-repo-container').hide();
				}
			}
		});

		$(".add-custom").on("click", function() {
			var listLength = $(".custom-list li").length;
			if (listLength < 10) {
				$(".custom-list").append($("li", $(".custom-list")).last().clone(true));
				var lastLi = $(".custom-list li").last();
				lastLi.find('input').val('')
			}
			return false;
		});

		$(".delete-custom").on("click", function() {
			var listLength = $(".custom-list li").length;
			if (listLength > 1) {
				$(this).parent().remove();
			}
			return false;
		});

		//On select (checkbox and radio) --> turn on/off success criteria
		$('.cloud-checkbox, .integration-checkbox, .networkRequirement-checkbox, .instanceType-checkbox, .dockerRequirement-checkbox, .proxyRequirement, .tenantRequirement').on("change", function() {
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

		console.log("About to load type ahead");

		$('#accountTypeahead .typeahead').bind('typeahead:active', function(ev) {
			console.log('typeahead:active');
		});

		$('#accountTypeahead .typeahead').bind('typeahead:idle', function(ev) {
			console.log('typeahead:idle');
		});

		$('#accountTypeahead .typeahead').bind('typeahead:open', function(ev) {
			console.log('typeahead:open');
		});

		$('#accountTypeahead .typeahead').bind('typeahead:close', function(ev) {
			console.log('typeahead:close');
			var inputField = $("#accountTypeahead").find('input[name="account.companyName"]');
			console.log("inputField: " + inputField.val());
			console.log("inputField.length: " + inputField.val().length);
		});

		$('#accountTypeahead .typeahead').bind('typeahead:change', function(ev) {
			console.log('typeahead:change');
			var inputField = $("#accountTypeahead").find('input[name="account.companyName"]');
		});

		$('#accountTypeahead .typeahead').bind('typeahead:select', function(ev, suggestion) {
			console.log('typeahead:select: ' + suggestion.id + ' ' + suggestion.companyName);
			$("#accountTypeahead").find('input[name="account.id"]').val(suggestion.id);


			//              var accountId = $('div.select-account-dropdown').find('select[name="accountId"]').val()
			var accountId = suggestion.id;
			//console.log("accountId: " + accountId);
			if (accountId != 'null') {
				_loadAccountInfo(accountId);
			}

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

		$('#accountTypeahead .typeahead').bind('typeahead:autocomplete', function(ev, suggestion) {
			console.log('typeahead:autocomplete');
		});

		$('#accountTypeahead .typeahead').bind('typeahead:cursorchange', function(ev, suggestion) {
			console.log('typeahead:cursorchange');
		});

		$('#accountTypeahead .typeahead').typeahead({
				highlight: true,
				hint: true,
				minLength: 2
			},
			{
				name: 'create-license-accounts',
				displayKey: 'value',
				source: _usersBloodhound.ttAdapter(),
				limit: 10,
				templates: {
					header: function(query, suggestions) {
						return '<div class="tt-header">Select one of the following</div>';
					},
					footer: function(query, suggestions) {
						return '<div class="tt-footer"></div>';
					},
					notFound: function(query) {
						return '<div class="tt-empty-message">Unable to find any accounts that match the current query. Note: A new account will be created if an existing account is not selected.</div>';
					},
					suggestion: function(data) {
						return '<p><strong>ID:' + data.id + '</strong> – ' + data.companyName + ' - ' + data.name + ' - ' + data.email + '</p>';
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
						return '<div class="tt-empty-message">Unable to find any accounts that match the current query. Note: A new account will be created if an existing account is not selected.</div>';
					},
					suggestion: function(data) {
						return '<p><strong>ID:' + data.id + '</strong> – ' + data.companyName + ' - ' + data.name + ' - ' + data.email + '</p>';
					}
				}
			});

			inputField = $("#accountTypeahead").find('input[name="account.companyName"]');
			inputField.focus();
		});

		$(".select-account-dropdown select").on('change', function() {
			//console.log("account drop down changed!");

			var accountId = $('div.select-account-dropdown').find('select[name="accountId"]').val()
			//console.log("accountId: " + accountId);
			if (accountId != 'null') {
				_loadAccountInfo(accountId);
			}

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

		//display red/blue required field indicator bars to user
		$(".create-license-form input[type=text], textarea, select").on("invalid", function() {
			var $this = $(this);
			$this.prev().css("background-color", "#f26e5e");
		});
		$(".create-license-form input[type=text], textarea, select").on("keypress mousedown change", function() {
			var $this = $(this);
			$this.prev().css("background-color", "#79c5e1");
		});


		$(".create-license-form input[name=endDate], input[name=startDate]").on("datechanged", function() {
			var startDateField = $(".create-license-form input[name=startDate]");
			var endDateField = $(".create-license-form input[name=endDate]");
			var startDate = _parseDate(startDateField.val());
			var endDate = _parseDate(endDateField.val());

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
				_setFeatureCheckbox(productTier, $(this));
			});
			_setWorkloadLimit({"productTier": productTier});
		});

		//Checkbox groups custom validation
//		addCustomValidation('cloud-checkbox', 'Please select at least one cloud');

		$('.clouds-integtrations-container').hide();

		//trial or poc selection
		$('.poc-start-container').hide();
		$('.poc-end-container').hide();
		$('.docker-repo-container').hide();
		$('.product-tier-container').show();

		$("input[type=radio][name=licenseType]").on("change", function() {

			_loadLicenseRequestLimits($(this).val())

			switch ($(this).val()) {
				case 'trial':
					$('.poc-start-container').hide();
					$('.poc-end-container').hide();
					$('.usecase-container').show();
					$('.clouds-integtrations-container').hide();
					_removeCommunityOptionFromProductTier();
					$('.product-tier-container').show();

					//turn on/off validation
					$('#pocStartDate').prop('required', false);
					$("#pocTimeframeDays").prop('required', false);
					$("#executiveChampionName").prop('required', false);
					$("#executiveChampionEmail").prop('required', false);
					$("#approvedBy").prop('required', false);
					$("#morpheusRepresentative").prop('required', false);

					//Checkbox groups custom validation
//					addCustomValidation('cloud-checkbox', 'Please select at least one cloud');

					//Checkbox groups remove custom validation
					$('.instanceType-checkbox:checkbox')[0].setCustomValidity('');
					$('.networkRequirement-checkbox:checkbox')[0].setCustomValidity('');
					$('.serverRequirement-checkbox:checkbox')[0].setCustomValidity('');
					$('.approved-verification-checkbox:checkbox')[0].setCustomValidity('');

					_setWorkloadLimit({"productTier":'capacity'});
					break;
				case 'poc':
					$('.poc-start-container').hide();
					$('.poc-end-container').hide();
					$('.usecase-container').hide();
					$('.clouds-integtrations-container').hide();
					_removeCommunityOptionFromProductTier();
					$('.product-tier-container').show();

					//turn on/off validation
					$('#pocStartDate').prop('required', false);
					$("#pocTimeframeDays").prop('required', false);
					$("#executiveChampionName").prop('required', false);
					$("#executiveChampionEmail").prop('required', false);
					$("#approvedBy").prop('required', false);
					$("#morpheusRepresentative").prop('required', false);

					//Checkbox groups custom validation
					/*
					addCustomValidation('instanceType-checkbox', 'Please select at least one instance type');
					addCustomValidation('networkRequirement-checkbox', 'Please select at least one network type');
					addCustomValidation('serverRequirement-checkbox', 'Please confirm at least one server requirement');
					addCustomValidation('approved-verification-checkbox', 'Please approve the criteria and requirements for this PoC');
*/
					_setWorkloadLimit({"productTier":'capacity'});
					break;
				case 'production':
					$('.poc-start-container').hide();
					$('.poc-end-container').hide();
					$('.usecase-container').hide();
					$('.clouds-integtrations-container').hide();
					_removeCommunityOptionFromProductTier();
					$('.product-tier-container').show();

					//turn on/off validation
					$('#startDate').prop('required', false);
					$("#pocTimeframeDays").prop('required', false);
					$("#executiveChampionName").prop('required', false);
					$("#executiveChampionEmail").prop('required', false);
					$("#approvedBy").prop('required', false);
					$("#morpheusRepresentative").prop('required', false);

					//Checkbox groups remove custom validation
//					$('.cloud-checkbox:checkbox')[0].setCustomValidity('');
					$('.instanceType-checkbox:checkbox')[0].setCustomValidity('');
					$('.networkRequirement-checkbox:checkbox')[0].setCustomValidity('');
					$('.serverRequirement-checkbox:checkbox')[0].setCustomValidity('');
					$('.approved-verification-checkbox:checkbox')[0].setCustomValidity('');

					$('form.create-license-form').find('input[name=freeTrial]').prop('checked', false);
					_setWorkloadLimit({"productTier":'capacity'});
					break;
				case 'community':
					$('.poc-start-container').hide();
					$('.poc-end-container').hide();
					$('.usecase-container').hide();
					$('.clouds-integtrations-container').hide();
					$('.product-tier-container').hide();
					_addCommunityOptionFromProductTier();

					//turn on/off validation
					$('#startDate').prop('required', false);
					$("#pocTimeframeDays").prop('required', false);
					$("#executiveChampionName").prop('required', false);
					$("#executiveChampionEmail").prop('required', false);
					$("#approvedBy").prop('required', false);
					$("#morpheusRepresentative").prop('required', false);

					//Checkbox groups remove custom validation
//					$('.cloud-checkbox:checkbox')[0].setCustomValidity('');
					$('.instanceType-checkbox:checkbox')[0].setCustomValidity('');
					$('.networkRequirement-checkbox:checkbox')[0].setCustomValidity('');
					$('.serverRequirement-checkbox:checkbox')[0].setCustomValidity('');
					$('.approved-verification-checkbox:checkbox')[0].setCustomValidity('');

					_setProductTier({"productTier":"community"});
					_setWorkloadLimit({"productTier":'community'});
					$('form.create-license-form').find('input[name=freeTrial]').prop('checked', true);
					break;
			}
		});

		$("input[type=radio][name=zoneTypeMode]").on("change", function() {
			var zoneTypeMode = $(this).val();
			if (zoneTypeMode == 'custom') {
				$('#zone-types-container').show();
			} else {
				$('#zone-types-container').hide();
			}
		});

	}

	//Perform AJAX magic to determine limits on license requests
	function _loadLicenseRequestLimits(licenseType) {

		MorpheusHub.AccountService.loadAccountInfo({
			licenseType: licenseType,
			callback: _consumeLoadLicenseRequestLimitsResponse
		});
	}

	function _getSelectedAccountType() {
		var inputField = $("input[name='account.type']:checked").val();
		return inputField;
	}

	function _loadAccountInfo(accountId) {
		console.log("loading account info for id: " + accountId);
		MorpheusHub.AccountService.loadAccountInfo({
			accountId: accountId,
			callback: _consumeLoadAccountInfoResponse
		});
	}

	function _consumeLoadAccountInfoResponse(response) {
		if(response) {
			var accountId = response.accountId;
			var data = response.data;

			if (console && console.log && data && data.user) {
				console.log("Sample of data:", data);
//				console.log("user:", data.user);
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
		}
	}

	function _consumeLoadLicenseRequestLimitsResponse(response) {
		if(response) {
			var accountId = response.accountId;
			var data = response.data;

			if (console && console.log && data && data.licenseType) {
				console.log("data.success: " + data.success);
				console.log("data.licenseType: " + data.licenseType);
				console.log("data.limits: " + data.limits);
			}
			if (data && data.licenseType) {
			}
		}
	}

	var _accountsBloodhound = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			cache: false,
			url: "/admin/accounts/accountTypeAhead.json",
			prepare: function(query, settings) {
				settings.url += '?q=' + query + '&accountType=' + _getSelectedAccountType();
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
				settings.url += '?q=' + query + '&accountType=' + _getSelectedAccountType();
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

	function _setFeatureCheckbox(productTier, checkbox) {
		if (productTier == 'capacity') {
			checkbox.prop('checked', true);
		} else {
			var dataVal = checkbox.data(productTier);
			checkbox.prop('checked', dataVal);
		}
	}

	function _setWorkloadLimit(config) {
		var productTier = config.productTier;
		console.log("_setWorkloadLimit for productTier: " + productTier);
		var workloadInput = $('.max-instances');
		var newVal = '';
		if (productTier == 'essentials')
			newVal = 1000;
		else if (productTier == 'pro')
			newVal = 10000;
		else if (productTier == 'msp')
			newVal = 100;
		else if (productTier == 'community') {
			newVal = 20;
		} else {
			newVal = '';
		}
		workloadInput.val(newVal);
	}

	function _parseDate(str) {
		var mdy = str.split('/');
		return new Date(mdy[2], mdy[0] - 1, mdy[1]);
	}

	function _setProductTier(config) {
		var productTier = config.productTier;
		console.log("_setProductTier for productTier: " + productTier);
		var productTierInput = $('.product-tier-select');
		var newVal = '';
		if (productTier == 'essentials')
			newVal = 'essentials';
		else if (productTier == 'pro')
			newVal = 'pro';
		else if (productTier == 'msp')
			newVal = 'msp';
		else if (productTier == 'community')
			newVal = 'community';
		else
			newVal = 'capacity';
		console.log("_setProductTier newVal: " + newVal);
		$(".product-tier-select option[value=" + productTier + "]").attr("selected", true);
//		productTierInput.val(newVal);
		var featureChecks = $('.feature-checkbox');
		featureChecks.each(function() {
			_setFeatureCheckbox(newVal, $(this));
		});
	}

	function _removeCommunityOptionFromProductTier() {
		var productTierInput = $('.product-tier-select');
		productTierInput.find('option[value=community]').remove();
	}

	function _addCommunityOptionFromProductTier() {
		var productTierInput = $('.product-tier-select');
		productTierInput.append('<option value="community">Community</option>');
	}

	init();

});

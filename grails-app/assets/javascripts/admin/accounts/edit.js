$(function() {

    var dataPage = 'admin/accounts/edit';

    /**
     * Constructor method only to run if data-page is 'admin/accounts/edit'
     */
    var init = function() {

        if($('body').data('page') === dataPage) {
            console.log('running ' + dataPage + ' init...');
            _observeEvents();
        }
    };

    /**
     * Registers event listeners for the various buttons and forms on the admin edit account section
     * @private
     */
    function _observeEvents() {
        //display red/blue required field indicator bars to user
        $(".edit-account-form input[type=text]").on("invalid", function() {
            var $this = $(this);
            $this.prev().css("background-color", "#f26e5e");
        });
        $(".edit-account-form input[type=text]").on("keypress", function() {
            var $this = $(this);
            $this.prev().css("background-color", "#79c5e1");
        })
		$(".edit-account-form .hub-button").on("click", function() {
			var $this = $(this);
			console.log("update button clicked");
//			alert("update!");
			var frm = $(".edit-account-form");
			var oldCompanyId = frm.find("input[name=oldCompanyId]").val();
			console.log("oldCompanyId: " + oldCompanyId);

			var destCompanyId = frm.find("select[name='account.company']").val();
			console.log("destCompanyId: " + destCompanyId);
			$.ajax({
				url: "/admin/companies/show/" + destCompanyId,
				method: 'GET',
				contentType: "application/json",
				success: function (result) {
					console.log(JSON.stringify(result));
					var accountId = frm.find("input[name=accountId]").val();
					console.log("accountId: " + accountId);
					console.log("result.company.accountId: " + result.company.accountId);
					if(oldCompanyId == 0 && accountId != result.company.accountId) {
						console.log("old company id is not defined");
						$('#moveAccountModal').modal('show');
					} else {
						console.log("old company id is defined");
						frm.submit();
					}
				},
				error: function (e) {
					console.log(e);
				}
			});
		});
		$('#moveAccountModal').on('shown.bs.modal', function (e) {
			// do something...
			console.log("moveAccountModal shown");
			var frm = $(".edit-account-form");
			var modal = $(e.delegateTarget);
			var onUpdate = function (e) {
				//TODO perform field validation
				console.log("onUpdate called");
				var frm = $(".edit-account-form");
				frm.submit();
			};
			$('.primaryActionBtn', modal).on('click', function (e) {
				//TODO perform field validation
				console.log("onUpdate called");
				var frm = $(".edit-account-form");
				frm.find("input[name=migrateAccount]").val(true);
				frm.submit();
			});
			$('.secondaryActionBtn', modal).on('click', function (e) {
				//TODO perform field validation
				console.log("onUpdate called");
				var frm = $(".edit-account-form");
				frm.submit();
			});
		});
		$('#moveAccountModal').on('show.bs.modal', function (e) {
			// do something...
			console.log("moveAccountModal show");
			var frm = $(".edit-account-form");
			var modal = $(e.delegateTarget);

			var modalBody = modal.find(".modal-body p");
			var srcAccountName = "Z";
			var destAccountName = "Y";
			var modalText = "Are you sure you want to move users into account " + destAccountName + ", this will delete account " + srcAccountName;
			modalBody.text(modalText);

			var accountId = frm.find("input[name=accountId]").val();
			console.log("accountId: " + accountId);
			$.ajax({
				url: "/admin/accounts/show/" + accountId,
				method: 'GET',
				contentType: "application/json",
				success: function (result) {
					console.log(JSON.stringify(result));
					srcAccountName = result.account.name;
					modalText = "Are you sure you want to move users into account " + destAccountName + ", this will delete account " + srcAccountName;
					modalBody.text(modalText);
				},
				error: function (e) {
					console.log(e);
				}
			});
			var oldCompanyId = frm.find("input[name=oldCompanyId]").val();
			var destCompanyId = frm.find("select[name='account.company']").val();
			console.log("destCompanyId: " + destCompanyId);
			if(oldCompanyId == 0) {
				console.log("old company id is not defined");
				$.ajax({
					url: "/admin/companies/show/" + destCompanyId,
					method: 'GET',
					contentType: "application/json",
					success: function (result) {
						console.log(JSON.stringify(result));
						var destAccountId = result.company.id;
						$.ajax({
							url: "/admin/accounts/show/" + destAccountId,
							method: 'GET',
							contentType: "application/json",
							success: function (result) {
								console.log(JSON.stringify(result));
								destAccountName = result.account.name;
								modalText = "Are you sure you want to move users into account " + destAccountName + ", this will delete account " + srcAccountName;
								modalBody.text(modalText);
							},
							error: function (e) {
								console.log(e);
							}
						});
					},
					error: function (e) {
						console.log(e);
					}
				});
			} else {
				console.log("old company id is defined");
				frm.submit();
			}
		});
		$('#moveAccountModal').on('hidden.bs.modal', function (e) {
			// do something...
			console.log("moveAccountModal hidden");
		});
    }

    init();

});

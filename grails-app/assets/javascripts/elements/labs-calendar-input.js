(function() {

	var template = document.createElement('template');
	var tmplStr = ''.concat(
		'<labs-popover orientation="right">',
			'<labs-calendar></labs-calendar>',
		'</labs-popover>'
	);
	template.innerHTML = tmplStr;
	// Creates an object based in the HTML Element prototype
	var element = Object.create(HTMLInputElement.prototype);

	// Fires when an instance of the element is created
	element.createdCallback = function() {
		this.options = {
			date: moment(),
			format: 'MM/DD/YYYY'
		}
		this.events = {
			checkFocus: checkFocus.bind(this),
			checkValidDate:checkValidDate.bind(this),
			setDateFromCalendar: setDateFromCalendar.bind(this),
			showPopover: showPopover.bind(this)
		}
		var clone = document.importNode(template.content, true);
		this.options.popover = clone.querySelector('labs-popover');
		this.options.calendar = clone.querySelector('labs-calendar');
		this.appendChild(clone);
		this.options.calendar.selection = this.value;
		this.options.calendar.visibleDate = this.value;
	};

	// Fires when an instance was inserted into the document
	element.attachedCallback = function() {
		this.addEventListener('focus', this.events.showPopover);
		this.addEventListener('keyup', this.events.checkValidDate);

		this.options.calendar.addEventListener('selected', this.events.setDateFromCalendar);
		document.addEventListener('mousedown', this.events.checkFocus);
	};

	// Fires when an instance was removed from the document
	element.detachedCallback = function() {
		this.removeEventListener('focus', this.events.showPopover);
		this.removeEventListener('keyup', this.events.checkValidDate);

		this.options.calendar.removeEventListener('selected', this.events.setDateFromCalendar);
		document.removeEventListener('mousedown', this.events.checkFocus);
	};

	// Fires when an attribute was added, removed, or updated
	element.attributeChangedCallback = function(attr, oldVal, newVal) {

	};

	function showPopover (event) {
		var tmpDate = moment(this.value, this.options.format);
		if (!tmpDate.isValid()) {
			this.options.date = moment(moment(), this.options.format);
			this.options.calendar.selection = this.options.date;
			this.options.calendar.visibleDate = this.options.date;
		}
		this.options.popover.show()
	}

	function setDateFromCalendar (event) {
		if (document.activeElement !== this) {
			this.options.date = event.detail;
			this.value = this.options.date.format(this.options.format);
			var evt = new CustomEvent('datechanged', { 'detail': this.options.date });
			this.dispatchEvent(evt);
		}
	}

	function checkFocus (event) {
		var path = event.path
		var closePopover = true;
		for (var i = 0; i < path.length; i++) {
			if (path[i] === this.options.popover || path[i] === this) {
				closePopover = false;
			}
		}
		if (closePopover){
			this.options.popover.hide();
		}
	}

	function checkValidDate(event) {
		var tmpDate = moment(this.value, this.options.format)
		if (tmpDate.isValid() || this.value === '') {
			// this.value = tmpDate.format(this.options.format);
			this.options.date = tmpDate;
			this.options.calendar.selection = this.value;
			this.options.calendar.visibleDate = this.options.date;
			this.setCustomValidity("");
			this.options.popover.show();
			var evt = new CustomEvent('datechanged', { 'detail': this.options.date });
			this.dispatchEvent(evt);
		}
		else {
			this.setCustomValidity("Invalid Date");
			// this.options.popover.hide();
		}
	}

	Object.defineProperties(element, {
		date: {
			get: function () {
				return this.options.date;
			},
			set: function (date) {
				if (typeof date === 'string') {
					var tmpDate = moment(date);
					if (tmpDate.isValid()) {
						this.options.date = tmpDate;
					}
				}
				if (moment.isMoment(date)) {
					this.options.date = tmpDate;
				}
				this.value = this.options.date.format(this.options.foramt);
			}
		},
		format: {
			get: function () {
				return this.options.format;
			},
			set: function (format) {
				this.options.format = format;
				this.value = this.options.date.format(this.options.format);
			}
		}
	});

	document.registerElement('labs-calendar-input', {
		prototype: element,
		extends: 'input'
	});
})();

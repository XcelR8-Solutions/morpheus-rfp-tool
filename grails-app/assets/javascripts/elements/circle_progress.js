(function() {
    var template = document.createElement('template');
    var tmplStr = ''.concat(
        '<svg viewBox="0 0 20 20">',
			'<g transform="rotate(-90 10 10)">',
				'<circle class="chart-bg" cy="10" cx="10" r="7.5" stroke="#efefef" stroke-width="3" fill="none"></circle>',
				'<circle class="chart" cy="10" cx="10" r="7.5" stroke="#f46e5d" stroke-width="3" fill="none"></circle>',
			'</g>',
		'</svg>'
    );
    template.innerHTML = tmplStr;
    // Creates an object based in the HTML Element prototype
    var element = Object.create(HTMLElement.prototype);

    // Fires when an instance of the element is created
    element.createdCallback = function() {
        var clone = document.importNode(template.content, true);
        this.appendChild(clone);
		this.opts = {
			value: 0,
			max: 1
		}

		this.circumference = 47.12;

		if (this.hasAttribute('pct')) {
			this.opts.value = this.getAttribute('pct');
		}
		if (this.hasAttribute('max')) {
			this.opts.max = this.getAttribute('max');
		}
		if (this.hasAttribute('color')) {
			this.querySelector('circle.chart').style.stroke = this.getAttribute('color');
		}
		this.querySelector('circle.chart').style.strokeDasharray = this.opts.value/this.opts.max * this.circumference + ' 100';
    };

    // Fires when an instance was inserted into the document
    element.attachedCallback = function() {
    };

    // Fires when an instance was removed from the document
    element.detachedCallback = function() {

    };

    // Fires when an attribute was added, removed, or updated
    element.attributeChangedCallback = function(attr, oldVal, newVal) {

    };

    //define custom element properties and behaviors
    Object.defineProperties(element, {
		value: {
			get: function () {
				return this.opts.value;
			},
			set: function (pct) {
				this.opts.value = pct;
				this.querySelector('circle.chart').style.strokeDasharray = this.opts.value/this.opts.max * this.circumference + ' 100';
				this.querySelector('svg').style.height = this.getBoundingClientRect().height;
				this.querySelector('svg').style.width = this.getBoundingClientRect().height;
			}
		},
		max: {
			set: function (max) {
				this.opts.max = max;
				this.querySelector('circle.chart').style.strokeDasharray = this.opts.value/this.opts.max * this.circumference + ' 100';
				this.querySelector('svg').style.height = this.getBoundingClientRect().height;
				this.querySelector('svg').style.width = this.getBoundingClientRect().height;
			},
			get: function () {
				return this.opts.max;
			}
		}
    });

    document.registerElement('circle-progress', {
        prototype: element
    });
})();

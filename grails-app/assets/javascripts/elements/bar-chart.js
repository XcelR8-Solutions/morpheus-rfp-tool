(function() {
    var template = document.createElement('template');
    var tmplStr = ''.concat(
		'<svg width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none">',
		'<defs>',

		'<linearGradient id="chart-gradient-red" x1="0" x2="0" y1="0" y2="1">',
		'<stop class="stop1" offset="0%" stop-color="#f26e5e"/>',
		'<stop class="stop2" offset="100%" stop-color="#f26e5e" stop-opacity="0"/>',
		'</linearGradient>',

		'<linearGradient id="chart-gradient-yellow" x1="0" x2="0" y1="0" y2="1">',
		'<stop class="stop1" offset="0%" stop-color="#f8d167"/>',
		'<stop class="stop2" offset="100%" stop-color="#f8d167" stop-opacity="0"/>',
		'</linearGradient>',

		'<linearGradient id="chart-gradient-green" x1="0" x2="0" y1="0" y2="1">',
		'<stop class="stop1" offset="0%" stop-color="#70c6a9"/>',
		'<stop class="stop2" offset="100%" stop-color="#70c6a9" stop-opacity="0"/>',
		'</linearGradient>',

		'</defs>',
		'</svg>'
    );
	var gTmplStr = ''.concat(
		'<g>',
			'<text class="count" x=10 y=52 fill="#333" text-anchor="middle">23</text>',
			'<rect x="0" y="55" width="20" height="60" fill="url(#chart-gradient)"> </rect>',
			'<text class="label" x=10 y=130 fill="#333" text-anchor="middle">23</text>',
		'</g>');
    template.innerHTML = tmplStr;
    // Creates an object based in the HTML Element prototype
    var element = Object.create(HTMLElement.prototype);

    // Fires when an instance of the element is created
    element.createdCallback = function() {
		this.opts = {
			gutter:12,
			max:undefined,
			values:[]
		}
        var clone = document.importNode(template.content, true);
		if (this.hasAttribute('values')) {
			this.opts.values = JSON.parse(this.getAttribute('values'));
		}
		if (this.hasAttribute('max')) {
			this.opts.max = parseFloat(this.getAttribute('max'));
		}
        this.appendChild(clone);
		this.querySelector('svg').setAttribute('viewBox', '0 0 ' + this.getBoundingClientRect().width + ' ' + this.getBoundingClientRect().height)
		makeBars.bind(this)();
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
		values: {
			get: function () {
				return this.opts.values;
			},
			set: function (values) {
				this.opts.values = values;
				makeBars.bind(this)();
			}
		},
		max: {
			get: function () {
				if (this.opts.max) {
					return this.opts.max;
				}
				return Math.max.apply(undefined,this.opts.values.map(function(item){return item.value}));
			},
			set: function (max) {
				this.opts.max = max;
				makeBars.bind(this)();
			}
		}
    });

	function makeBars () {
		var canvasH = this.getBoundingClientRect().height;
		var canvasW = this.getBoundingClientRect().width;
		var barW = (canvasW - (this.opts.values.length * this.opts.gutter))/this.opts.values.length;

		this.opts.values.forEach(function (item, index, array) {
			var height = (parseFloat(item.value)/this.max) * (canvasH - 40);
			console.log('height',item.value, this.max,parseFloat(item.value)/this.max, height);
			var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			var tVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			tVal.classList.add('count');
			var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			rect.classList.add(item.classes);
			var tLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			tLabel.classList.add('label');

			g.appendChild(tVal);
			g.appendChild(rect);
			g.appendChild(tLabel);
			g.setAttribute('transform','translate(' + index * (barW + this.opts.gutter) + ')')
			g.querySelector('rect').setAttribute('x', 0);
			g.querySelector('rect').setAttribute('y', (canvasH - parseFloat(height) - 25));

			g.querySelector('rect').setAttribute('rx', 3);
			g.querySelector('rect').setAttribute('ry', 3);

			g.querySelector('rect').setAttribute('height', height);
			g.querySelector('rect').setAttribute('width', barW);
			g.querySelector('rect').setAttribute('fill', 'url(#chart-gradient)');

			g.querySelector('text.count').innerHTML = item.value;
			g.querySelector('text.count').setAttribute('x', barW/2);
			g.querySelector('text.count').setAttribute('text-anchor', 'middle');
			g.querySelector('text.count').setAttribute('y', (canvasH - parseFloat(height) - 28));

			g.querySelector('text.label').innerHTML = item.label;
			g.querySelector('text.label').setAttribute('x', barW/2);
			g.querySelector('text.label').setAttribute('text-anchor', 'middle');
			g.querySelector('text.label').setAttribute('y', (canvasH - 10));

			this.querySelector('svg').appendChild(g);
		}.bind(this));
	}

    document.registerElement('bar-chart', {
        prototype: element
    });
})();

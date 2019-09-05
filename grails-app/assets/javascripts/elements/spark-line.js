(function() {
    var template = document.createElement('template');
    var tmplStr = ''.concat(
        '<svg viewBox="0 0 1000 500" preserveAspectRatio="xMinYMin" style="overflow:hidden;">',
			'<defs>',
				'<linearGradient id="chart-gradient" x1="0" x2="0" y1="0" y2="1">',
					'<stop class="stop1" offset="0%" stop-color="#78c5e1"/>',
					'<stop class="stop2" offset="80%" stop-color="#78c5e1" stop-opacity="0"/>',
				'</linearGradient>',
			'</defs>',
			'<path d="" stroke="#78c5e1" stroke-width="2" fill="url(#chart-gradient)"/>',
		'</svg>'
    );
    template.innerHTML = tmplStr;
    // Creates an object based in the HTML Element prototype
    var element = Object.create(HTMLElement.prototype);

    // Fires when an instance of the element is created
    element.createdCallback = function() {
        var clone = document.importNode(template.content, true);
		this.opts = {
			control: 'chart-gradient-' + Math.random().toString().split('.')[1],
			values:[0,0],
			max: 1
		}
		clone.getElementById('chart-gradient').id = this.opts.control;
		clone.querySelector('path').style.fill = 'url(#' + this.opts.control + ')';

		if (this.hasAttribute('fill-color')) {
			var color = this.getAttribute('fill-color');
			clone.querySelector('path').style.stroke = color;
			clone.querySelectorAll('stop').forEach(function (element) {
				console.log('setting stop color')
				element.style.stopColor = color;
			})
		}
		if (this.hasAttribute('values')) {
			this.opts.values = JSON.parse(this.getAttribute('values'));
		}

		if (this.hasAttribute('max')) {
			this.opts.max = parseFloat(this.getAttribute('max'));
		}

        this.appendChild(clone);
		makeLine.bind(this)();
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
				makeLine.bind(this)();
			},
			set: function (values) {
				this.opts.values = values;

				makeLine.bind(this)();
			}
		},
		max: {
			get: function() {
				return this.opts.max;
			},
			set: function (max) {
				this.opts.max = max;
				makeLine.bind(this)();
			}
		}
    });

    document.registerElement('spark-line', {
        prototype: element
    });


	function makeLine() {
		var cRect = this.getBoundingClientRect();
		var width = cRect.width;
		var height = cRect.height;
		var path = 'M0,' + (height - (this.opts.values[0] * height)) + ' ';
		var ptw = width/(this.opts.values.length-1);
		var nextY;
		this.opts.values.forEach(function(item, index, array) {
			var currentY = height - (item * height);
			path += 'C';
			nextY = currentY;
			if ((index + 1) < array.length) {
				nextY = height - (array[index + 1] * height);
			}
			//x1,y1
			path += (ptw/3) + (index * ptw) + ',' + currentY + ' ';
			//x2, y2
			path += ( (index + 1) * ptw) - (ptw/3) + ',' + nextY + ' ';
			//x3, y3
			path += ( (index + 1) * ptw) + ',' + nextY + ' ';
		});
		path += 'L' + (width + 10) + ',' + nextY + ' L' + (width + 10) + ',' + (height + 10) + ' L0,' + (height + 10);
		this.querySelector('svg').setAttribute('viewBox', '0 0 ' + width + ' ' + height);
		this.querySelector('path').setAttribute('d', path);
	}
})();

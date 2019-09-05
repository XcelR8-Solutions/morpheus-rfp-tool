var MorpheusHub = MorpheusHub || {};

MorpheusHub.AreaChart = function(opts) {
	var options = {
		values: [0,0,0,0,0,0,0],
		svgPoints:'',
		circleCoords:[],
		padding: 6,
		rootClasses: ['area-chart']
	};
	Object.assign(options, opts);

	if (!options.rootElement) {
		console.warn('You must have a root element')
		return
	}

	options.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	options.svg.classList.add.apply(options.svg.classList, options.rootClasses);
	if (options.height !== undefined) {
		options.svg.setAttribute('height', options.height);
	}
	if (options.width !== undefined) {
		options.svg.setAttribute('width', options.width);
	}
	options.areaGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
	options.areaGroup.classList.add('area-group');
	options.circleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
	options.circleGroup.classList.add('circles-group');
	options.svg.appendChild(options.areaGroup);
	options.svg.appendChild(options.circleGroup);
	options.rootElement.appendChild(options.svg);

	function createCircles() {
		for (var j = 0; j < options.circleCoords.length; j++) {
			var circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle")
			circleElement.setAttribute("cx", options.circleCoords[j][0]);
			circleElement.setAttribute("cy", options.circleCoords[j][1]);
			circleElement.setAttribute("r", 4);
			circleElement.setAttribute("stroke", 'currentColor');
			circleElement.setAttribute("fill", "#ffffff");
			if (j != options.circleCoords.length - 1) {
				circleElement.setAttribute("stroke-width", 2);
			}
			else {
				circleElement.setAttribute("stroke-width", 4);
			}
			options.circleGroup.appendChild(circleElement);
		}
	}

	function createArea() {
		var height = options.svg.clientHeight - (options.padding * 2);
		var width = options.svg.clientWidth - (options.padding * 2);
		options.svg.setAttribute('viewBox', '0 0 ' + options.svg.clientWidth + ' ' + options.svg.clientHeight);

		var xDist = width / (options.values.length-1);
		for (var i = 0; i < options.values.length; ++i) {
            var x = (i * xDist) + options.padding;
            var y = height;
            if (options.values[i] != 0) {
                var scaledNum = (height * options.values[i]) / findMaxValue();
                y = (height - scaledNum) + 5
            }
            var dataPoints = [];
            options.svgPoints += ' ' + x + ',' + y;
            dataPoints.push(x);
            dataPoints.push(y);
            options.circleCoords.push(dataPoints);
        }

		var line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
		line.setAttribute('points', options.svgPoints);
		line.classList.add('line');
		options.svgPoints += ' ' + (width + options.padding) + ',' + height;
		options.svgPoints += ' ' + options.padding + ',' + height;
		var area = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		area.setAttribute('points', options.svgPoints);
		area.classList.add('area');
		options.areaGroup.appendChild(area);
		options.areaGroup.appendChild(line);
	}

	function drawChart() {
		createArea();
		createCircles();
	}

	function findMaxValue() {
		return Math.max.apply(Math, options.values);
	}

	return {
		init: function () {
			drawChart();
		},
		redraw: function (values) {
			options.values = values;
			drawChart();
		}
	}
}

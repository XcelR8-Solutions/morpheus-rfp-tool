(function() {
    if (!moment) {
        console.error('momentjs was not detected did you remember to include it before this element?');
    }

    var template = document.createElement('template');
    var tmplStr = ''.concat(
        '<div class="head">',
            '<div class="prev navigation">',
            '<svg viewBox="40.9 141 332.3 512" y="0px" x="0px"><g transform="translate(-374.21785,-62.236374)" id="layer1"><path d="M415.1,459.2l76.3,76.3l179.7,179.7l76.3-76.3L567.6,459.2l179.7-179.7    l-76.3-76.3L491.3,383L415.1,459.2z" id="rect3006" /></g></svg>',
            '</div>',
            '<div class="title"><select name="month"></select><input type="number" name="year" max="9999" min="0"></div>',
            '<div class="next navigation">',
            '<svg viewBox="40.9 141 332.3 512" y="0px" x="0px"><g transform="translate(-374.21785,-62.236374)" id="layer2"><path d="M747.3,459.2L671.1,383L491.3,203.2l-76.3,76.3l179.7,179.7L415.1,639    l76.3,76.3l179.7-179.7L747.3,459.2z" /></g></svg>',
            '</div>',
        '</div>',
        '<div class="body">',
        '<section class="days"></section>',
        '</div>'
    );
    template.innerHTML = tmplStr;
    // Creates an object based in the HTML Element prototype
    var element = Object.create(HTMLElement.prototype);

    // Fires when an instance of the element is created
    element.createdCallback = function() {
        this.options = {
            // prev: '←',
            // next: '→',
            range: this.hasAttribute('range'),
            selectableDays: ['s','m','t','w','tr','f','sa'],
            date: moment(),
            visibleDate: moment()
        }

        var clone = document.importNode(template.content, true);
        this.appendChild(clone);
        this.head = this.querySelector('div.head .title');
        this.dayTable = this.querySelector('section.days');

		this.addEventListener('click', evtSelectDate.bind(this));
		this.addEventListener('click', evtNavigation.bind(this));
		this.addEventListener('change', evtSelectMonth.bind(this));
		this.addEventListener('change', evtSelectYear.bind(this));
		
        setup.bind(this)();

    };

    // Fires when an instance was inserted into the document
    element.attachedCallback = function() {
    };

    // Fires when an instance was removed from the document
    element.detachedCallback = function() {
        this.addEventListener('remove', evtSelectDate.bind(this));

    };

    // Fires when an attribute was added, removed, or updated
    element.attributeChangedCallback = function(attr, oldVal, newVal) {

    };

    //EVENTS

    function evtSelectDate(event) {
        if (event.target.classList.contains('calendar-day')) {
            var selection = moment(event.target.dataset.date);
            if (this.options.range) {
                if (!this.options.date) {
                    this.selection = [selection,undefined];
                    return;
                }
                if (selection.isSame(this.options.date, 'day')) {
                    if (this.options.endDate) {
                        this.selection = [this.options.endDate, undefined];
                    }
                }

                else if (selection.isSame(this.options.endDate, 'day')) {
                    this.selection = [this.options.endDate, undefined];
                }

                else if (this.options.endDate && this.options.endDate.isBefore(selection)){
                    this.selection = [this.options.date,selection];
                }

                else if (this.options.date && this.options.date.isBefore(selection)){
                    this.selection = [this.options.date,selection];
                }

                else if (this.options.endDate && this.options.date.isAfter(selection)) {
                    this.selection = [selection, this.options.endDate];
                }
                else if (!this.options.endDate && this.options.date.isAfter(selection)) {
                    this.selection = [selection, this.options.date];
                }
                else if (event.target.classList.contains('selection-end')) {
                    this.selection = [selection, undefined];
                }
            }
            else {
                this.selection = selection;
            }
        }
    }

    function evtSelectMonth(event) {
        if (event.target.tagName === "SELECT") {
            this.visibleDate = this.options.visibleDate.month(parseInt(event.target.value));
        }
    }

    function evtSelectYear(event) {
        if (event.target.tagName === "INPUT") {
            this.visibleDate = this.options.visibleDate.year(event.target.value);
        }
    }

    function evtNavigation(event) {
        pathElem = findInEventPath(event, 'navigation');
        if (pathElem) {
            if (pathElem.classList.contains('prev')) {
                this.visibleDate = this.visibleDate.subtract(1,'month');
            }
            else if (pathElem.classList.contains('next')) {
                this.visibleDate = this.visibleDate.add(1,'month');
            }
        }
    }

    function findInEventPath(event, className) {
        var path = event.path;
        var elem = undefined;
        for (var i = 0; i < path.length; i++) {
            if (path[i].classList && path[i].classList.contains(className)) {
                elem = path[i];
                 break;
            }
        }
        return elem;
    }

    //DISPLAY METHODS

    function setup () {
        makeControls.bind(this)();
        makeDayHeaders.bind(this)();
        buildDayGrid.bind(this)();
    }

    function makeControls() {
        makeYears.bind(this)();
        makeMonths.bind(this)();
        if (this.options.prev) {
            this.querySelector('.prev').textContent = this.options.prev;
        }
        if (this.options.next) {
            this.querySelector('.next').textContent = this.options.next;
        }
    }

    function makeYears() {
        this.querySelector('input[name=year]').value = this.options.visibleDate.year();
    }

    function makeMonths() {
        for (var i = 0; i < 12; ++i) {
            opt = document.createElement('option');
            opt.value = i;
            var currentMonth = moment().month(i);
            opt.textContent = currentMonth.format('MMMM');
            if (currentMonth.isSame(this.options.visibleDate,'month')) {
                opt.setAttribute('selected', 'selected');
            }
            this.querySelector('select[name=month]').appendChild(opt);
        }
    }

    function makeDayHeaders() {
        var thead = document.createElement('div');
        thead.classList.add('heading');
        var th;
        for (var i = 0; i < 7; ++i) {
            th = document.createElement('div');
            th.textContent = moment().weekday(i).format('dd');
            thead.appendChild(th);
        }
        this.dayTable.appendChild(thead);

    }

    function buildDayGrid() {
        var currentMonth  = this.options.visibleDate.month();
        var firstDateInGrid = this.options.visibleDate.clone().startOf('month').startOf('week');
        var lastDateInGrid = this.options.visibleDate.clone().endOf('month').endOf('week');
        // this.head.textContent = this.options.date.format('MMMM YYYY');
        var tbody = makeWeeks.bind(this)(firstDateInGrid, lastDateInGrid, currentMonth);

        var currentBody = this.dayTable.querySelector('div.body');
        if (currentBody) {
            this.dayTable.replaceChild(tbody, currentBody);
            return;
        }
        this.dayTable.appendChild(tbody);

    }

    function makeWeeks(firstDate, lastDate, currentMonth) {
        var tbody = document.createElement('div');
        tbody.classList.add('body');
        var day = firstDate.clone();
        while(day.isBefore(lastDate,'day') ) {
            var tr = document.createElement('div');
            tr.classList.add('calendar-week');
            for (var i = 0; i < 7; ++i) {
                td = document.createElement('div');
                td.classList.add('calendar-day');
                if (i === 0) {
                    td.textContent = day.format('D');
                }
                else {
                    td.textContent = day.add(1,'d').format('D');
                }
                td.dataset.date = day.toISOString();
                tr.appendChild(td);
                if (day.month() !== currentMonth) {
                    td.classList.add('not-current')
                }
                if (this.options.date && day.isSame(this.options.date, 'day')){
                    td.classList.add('selected', 'selection-start');
                }

                if (this.options.endDate && day.isSame(this.options.endDate, 'day')) {
                    td.classList.add('selected', 'selection-end');
                }
                if (this.options.range) {
                    if (this.options.endDate && day.isBetween(this.options.date, this.options.endDate, 'day')) {

                        td.classList.add('selected');
                    }
                }
            }
            tbody.appendChild(tr);
            day.add(1,'d');

        }
        return tbody;
    }

    //SELECT PROPERTIES

    Object.defineProperties(element, {
        selection: {
            get: function() {
                if (this.range) {
                    return {
                        startDate: this.options.date,
                        endDate: this.options.endDate,
                        selectableDays:'all'
                    }
                }
                return this.options.date;
            },
            set: function (date) {
                if (Array.isArray(date)) {
                    if (date[0]) {
                        this.options.date = moment(date[0]);
                    }
                    else {
                        this.options.date = undefined;
                    }
                    if (date[1]) {
                        this.options.endDate = moment(date[1]);
                    }
                    else {
                        this.options.endDate = undefined;
                    }
                    this.options.range = true;
                    this.setAttribute('range','')
                }
                else {
                    this.options.date = moment(date);
                }
                buildDayGrid.bind(this)();
                var evt = new CustomEvent('selected', { 'detail': this.selection });
                this.dispatchEvent(evt);
            }
        },
        range: {
            get: function () {
                return this.options.range;
            },
            set: function (range) {
                this.options.range = range;
            }
        },
        selectableDays: {
            get: function () {
                return this.options.selectableDays;
            },
            set: function (days) {
                this.options.selectableDays = days;
                //set selection
            }
        },
        visibleDate: {
            get: function () {
                return this.options.visibleDate;
            },
            set: function (date) {
                this.options.visibleDate = moment(date);
                this.querySelector('[name=month]').value = this.options.visibleDate.month();
                this.querySelector('[name=year]').value = this.options.visibleDate.year();
                buildDayGrid.bind(this)();
            }
        }
    });

    document.registerElement('labs-calendar', {
        prototype: element
    });
})();

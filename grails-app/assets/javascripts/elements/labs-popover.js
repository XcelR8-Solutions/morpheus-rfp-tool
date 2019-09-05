(function() {
    var template = document.createElement('template');
    var tmplStr = ''.concat(
    );
    template.innerHTML = tmplStr;
    // Creates an object based in the HTML Element prototype
    var element = Object.create(HTMLElement.prototype);

    // Fires when an instance of the element is created
    element.createdCallback = function() {
		this.options = {
			orientation: 'bottom',
			rootElem:  document.querySelector('body')
		};
		if (this.hasAttribute('root')){
			if (document.querySelectorAll(this.getAttribute('root')).length !== 1) {
				console.warn('Detected a number of elements != 1 so this may not work!');
			}
			this.options.rootElem = document.querySelector(this.getAttribute('root'));
		}


		if (this.hasAttribute('orientation')) {
			this.options.orientation = this.getAttribute('orientation');
		}
        var clone = document.importNode(template.content, true);
		this.appendChild(clone);
		// var content = this.childNodes;
		// var slot = clone.querySelector('slot');
		// while (content.length > 0) {
		// 	slot.appendChild(this.removeChild(content[0]));
		// }


    };

    // Fires when an instance was inserted into the document
    element.attachedCallback = function() {
		if (this.options.rootElem !== this.parentElement){
			if (this.hasAttribute("attach-to")){
				this.options.attachElem = document.querySelector(this.getAttribute('attach-to'));
			}
			else if (!this.hasAttribute("attach-to")){
				this.options.attachElem = this.previousElementSibling
			}
			if (!this.options.attachElem) {
				this.options.attachElem = this.parentElement;
			}
			this.options.rootElem.appendChild(this.parentElement.removeChild(this));
		}
    };

    // Fires when an instance was removed from the document
    element.detachedCallback = function() {

    };

    // Fires when an attribute was added, removed, or updated
    element.attributeChangedCallback = function(attr, oldVal, newVal) {

    };

	function setPosition() {
		var position = this.options.attachElem.getBoundingClientRect();
		var yOffset = window.scrollY;
		var xOffset = window.scrollX;

		if (this.options.orientation === 'bottom') {
			this.style.left = position.left + xOffset + 'px';
			this.style.top = position.bottom + yOffset + 'px';
		}
		else if (this.options.orientation === 'right') {
			this.style.left = position.right + xOffset + 'px';
			this.style.top = position.top + yOffset + 'px';
		}
		else if (this.options.orientation === 'left') {
			this.style.right = (window.innerWidth - position.left + xOffset) + 'px';
			this.style.top = position.top + yOffset + 'px';
		}
		else if (this.options.orientation === 'top') {
			this.style.left = position.left + xOffset + 'px';
			this.style.bottom = (window.innerHeight - position.top + yOffset) + 'px';
		}
	}

	element.toggle = function () {

		var evt = new CustomEvent('hidden', {});

		if (!this.classList.contains('shown')){
			evt = new CustomEvent('shown', {});
			setPosition.bind(this)();
		}
		this.classList.toggle('shown');
		this.dispatchEvent(evt);
	}

	element.show = function () {
		setPosition.bind(this)();
		this.classList.add('shown');
		var evt = new CustomEvent('shown', {});
		this.dispatchEvent(evt);
	}

	element.hide = function () {
		this.classList.remove('shown');
		var evt = new CustomEvent('hidden', {});
		this.dispatchEvent(evt);
	}

    //define custom element properties and behaviors
    Object.defineProperties(element, {
		isShown: {
			get: function () {
				return this.classList.contains('shown');
			}
		}
    });

    document.registerElement('labs-popover', {
        prototype: element
    });
})();

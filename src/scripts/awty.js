(function() {
	/** 			Are We There Yet ?
	 - JS Tool for adding / removing classes on scroll -

	Optional Config :
	{
		tidy: true,
		defaultClass: 'awty',
		fn: null
		mobile: true,
		desktop: true

	}

	tidy {boolean} -> if true, detaches the 'scroll' event listener when all classes were added / removed
	defaultClass {String} -> defines the class used by the awty instance to detect which elements should be processed

	**/

	var Awty, root;

	Awty = (function(){

		function Awty (config) {

			var elems,
				// Default config object
				_config = {
							tidy: true,
							defaultClass: 'awty',
							fn: null,
							mobile: true,
							desktop: true
						}
				;

			for (var key in _config) {
				if (_config.hasOwnProperty(key)) {
					if (config && typeof config[key] !== 'undefined') {
						_config[key] = config[key];
					}
				}
			}

			isElTotallyInViewport = function (rect) {
				return (
			        rect.top >= 0 &&
			        rect.left >= 0 &&
			        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
			    );
			};

			isElInViewport = function (el, mode, space) {
				var rect,
					topBorder,
					bottomBorder,
					middleScreen,
					screenHeight = (window.innerHeight || document.documentElement.clientHeight);

			    // for jQuery element or nodelist resulted from document.querySelectorAll
			    if (el instanceof Array || (typeof jQuery !== 'undefined' && el instanceof jQuery)) {
			        el = el[0];
			    }

			    rect = el.getBoundingClientRect();

			    switch (mode) {
			    	case 'PEEK':
			    	case 'peek': 	space = space || 0;
			    					topBorder = rect.top + rect.height * space;
			    				 	bottomBorder = rect.bottom - rect.height * space;
		    				 	 	return isElTotallyInViewport(rect) ||
		    				 	 		( bottomBorder >= 0 && topBorder <= screenHeight );
					case 'MARGIN':
					case 'margin': 	space = space || 0;
									topBorder = rect.top - space;
			    				 	bottomBorder = rect.bottom + space;
			    				 	return (topBorder >= 0 && bottomBorder <= screenHeight);
					case 'CENTER':
					case 'center': 	space = space || 20;
									middleLine = parseInt(rect.bottom - (rect.height / 2), 10);
									middleScreen = parseInt(((window.innerHeight || document.documentElement.clientHeight)/2), 10);
		    				 	   	return middleLine >= middleScreen - space && middleLine < middleScreen + space;
					default: return isElTotallyInViewport(rect);
			    }
			};

			getElems = function() {
				var nodeList = document.querySelectorAll('.' + _config.defaultClass),
					res = [],
					node;

				for(var i = 0, e; e = nodeList[i]; i++) { // jshint ignore:line
					if(e.dataset.awty) {
						node = {
							e: e,
							mode: e.dataset.awtyMode,
			    			space: parseFloat(e.dataset.awtySpace, 10)
		    			};
						res.push(node);
					}
				}
				return res;
			};

			roundTo = function(num, to) {
			    var remainder = num%to;
			    if (remainder <= (to/2)) {
			        return num-remainder;
			    } else {
			        return num+to-remainder;
			    }
			};

			removeClass = function (el, classes) {
				if (el.classList) {
					for(var i = 0, c; c = classes[i]; i++) { // jshint ignore:line
						el.classList.remove(c);
					}
				} else {
					for(var i = 0, c; c = classes[i]; i++) { // jshint ignore:line
						el.className = el.className.replace(new RegExp('(^|\\b)' + (c).split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
					}
				}
			};

			addClass = function (el, classes) {
				if (el.classList) {
					for(var i = 0, c; c = classes[i]; i++) { // jshint ignore:line
						el.classList.add(c);
					}

				} else {
					for(var i = 0, c; c = classes[i]; i++) { // jshint ignore:line
						el.className += ' ' + c;
					}

				}
			};

			update = function(el, index) {
				// get classes from data-attr
				var classes = el.dataset.awty.split(',');
				if (el.dataset.awtyRemove && el.dataset.awtyRemove === 'true') {
					removeClass(el, classes);
				} else {
					addClass(el, classes);
				}
				if (_config.tidy === true) {
					elems.splice(index,1);
					if (elems.length === 0) {
						removeListeners();
					}
				}
			};

			addListeners = function() {
				if (window.addEventListener) {
				    addEventListener('DOMContentLoaded', handler, false);
				    addEventListener('load', handler, false);
				    addEventListener('scroll', handler, false);
				    addEventListener('resize', handler, false);
				} else if (window.attachEvent)  {
				    attachEvent('onDOMContentLoaded', handler); // IE9+ :(
				    attachEvent('onload', handler);
				    attachEvent('onscroll', handler);
				    attachEvent('onresize', handler);
				}
				listening = true;
			};

			removeListeners = function() {
				if (window.removeEventListener) {
				    removeEventListener('DOMContentLoaded', handler, false);
				    removeEventListener('load', handler, false);
				    removeEventListener('scroll', handler, false);
				    removeEventListener('resize', handler, false);
				} else if (window.detachEvent)  {
				    detachEvent('onDOMContentLoaded', handler); // IE9+ :(
				    detachEvent('onload', handler);
				    detachEvent('onscroll', handler);
				    detachEvent('onresize', handler);
				}
				listening = false;
			};

			handler = function() {
				var fn;
		    	for(var i = 0, node ; node =  elems[i]; i++) { // jshint ignore:line
		    		if((node.mode && isElInViewport(node.e, node.mode, node.space)) || isElTotallyInViewport(node.e.getBoundingClientRect())) {
	    				update(node.e, i);
	    				if (node.fn || _config.fn) {
	    					fn = node.fn || _config.fn;
	    					fn.call(this);
	    				}
		    		}
			    }
			};

		    start = function() {
		    	// Check environment configs
	    		if ((!isMobile.any() && _config.desktop === true) || (isMobile.any() && _config.mobile === true)) {
				    elems = getElems();				
					// Listen for scrolling / loading / resizing events
					addListeners();
				}
			};

			updateElems = function(node) {
				elems.push(node);
			};

	    	/** Utilis **/ 

	    	var isMobile = {
			    Android: function() {
			        return navigator.userAgent.match(/Android/i);
			    },
			    BlackBerry: function() {
			        return navigator.userAgent.match(/BlackBerry/i);
			    },
			    iOS: function() {
			        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			    },
			    Opera: function() {
			        return navigator.userAgent.match(/Opera Mini/i);
			    },
			    Windows: function() {
			        return navigator.userAgent.match(/IEMobile/i);
			    },
			    any: function() {
			        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			    }
			};
	    
		}

		Awty.prototype.init = function() {
			var _docReadyState;

			if ((_docReadyState = document.readyState) === 'interactive' || _docReadyState === 'complete') {
				start();
			} else {
				document.addEventListener('DOMContentLoaded', start);
			}
	    };	    

	    /** Registers a new element on the awty instance
	    * @argument e - Element
	    * @argument opts - Object
	    *
	    **/
	    Awty.prototype.register = function(e, opts, fn) {
	    	var node = {};
	    	node.e = e;
	    	if(e.dataset.awty) {
				node.mode = e.dataset.awtyMode;
    			node.space = parseFloat(e.dataset.awtySpace,10);
			} else if (typeof opts !== 'undefined') {
				node.mode = opts.mode || null;
				node.space = typeof opts.space === 'number' ? parseFloat(opts.space,10) : 0;
				node.e.dataset.awty = typeof opts.awty !== 'undefined' ? opts.awty : '';
			}
			node.fn = typeof fn === 'function' ? fn : undefined;
			updateElems(node);
			handler();
	    };

	    Awty.prototype.getElements = function() {
			return getElems();
	    };


	    return Awty;
	})();

	root = typeof exports !== 'undefined' && exports !== null ? exports : window;

  	root.Awty = Awty;

}).call(this);
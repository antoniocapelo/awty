(function() {   
	/** 			Are We There Yet ?
	 - JS Tool for adding / removing classes on scroll -

	Optional Config :
	{
		tidy: true,
		defaultClass: 'awty',
	}

	tidy {boolean} -> if true, detaches the 'scroll' event listener when all classes were added / removed
	defaultClass {String} -> defines the class used by the awty instance to detect which elements should be processed

	**/  

	var Awty, root;

	Awty = (function(){

		function Awty (config) {		
		
			var elems, _config;

			// Default config object
			_config = {
								tidy: true,
								defaultClass: 'awty'
							};

			for (key in _config) {
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
			}

			isElInViewport = function (el, mode, space) {
				var rect, 
					topBorder,
					bottomBorder,
					middleScreen;

			    // for jQuery element or nodelist resulted from document.querySelectorAll
			    if (el instanceof Array || (typeof jQuery !== 'undefined' && el instanceof jQuery)) {
			        el = el[0];
			    }

			    rect = el.getBoundingClientRect();

			    switch (mode) {
			    	case 'PEEK':
			    	case 'peek': 	space = space ? space : 0;
			    					topBorder = rect.top + rect.height * space;
			    				 	bottomBorder = rect.bottom - rect.height * space; 
		    				 	 	return isElTotallyInViewport(rect) || 
		    				 	 		( bottomBorder >= 0 && topBorder <= (window.innerHeight || document.documentElement.clientHeight) );
			    				break;
					case 'MARGIN':
					case 'margin': 	space = space ? space : 0;
									topBorder = rect.top - space;
			    				 	bottomBorder = rect.bottom + space; 
		    				 	   	return ( topBorder >= 0 && bottomBorder <= (window.innerHeight || document.documentElement.clientHeight) );
			    				break; 
					case 'CENTER':
					case 'center': 	space = space ? space : 20;
									middleLine = parseInt(rect.bottom - (rect.height / 2), 10); 
									middleScreen = parseInt(((window.innerHeight || document.documentElement.clientHeight)/2), 10);
		    				 	   	return middleLine >= middleScreen - space && middleLine < middleScreen + space;
		    				 	break; 	    				 
					default: return isElTotallyInViewport(rect);
			    }
			};	

			getElems = function() {
				var nodeList = document.querySelectorAll('.' + _config.defaultClass),
					res = [];
				for(var i = 0, e; e = nodeList[i]; i++) {
					if(e.dataset.awty) {
						res.push(e);
					}
				}
				return res;
			}

			roundTo = function(num, to) {
			    var remainder = num%to;
			    if (remainder <= (to/2)) { 
			        return num-remainder;
			    } else {
			        return num+to-remainder;
			    }
			}

			removeClass = function (el, classes) {
				if (el.classList) {
					for(var i = 0, c; c = classes[i]; i++) {
						el.classList.remove(c);							
					}
				} else {
					for(var i = 0, c; c = classes[i]; i++) {
						el.className = el.className.replace(new RegExp('(^|\\b)' + (c).split(' ').join('|') + '(\\b|$)', 'gi'), ' ');					
					}
				}				  	
			}

			addClass = function (el, classes) {
				if (el.classList) {
					for(var i = 0, c; c = classes[i]; i++) {
						el.classList.add(c);					
					}
					  
				} else {
					for(var i = 0, c; c = classes[i]; i++) {
						el.className += ' ' + c;
					}
					  
				}
			}

			update = function(el, index) {
				// get classes from data-attr
				var classes = el.dataset.awty.split(',');
				if (el.dataset.awtyRemove && el.dataset.awtyRemove === 'true') {
						removeClass(el, classes);					
				} else {
					addClass(el, classes)
				}
				if (_config.tidy === true) {
					elems.splice(index,1);
					if (elems.length === 0) {
						removeListeners();
					}
				}
			}

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
			}

			removeListeners = function() {
				if (window.removeEventListener) {
				    removeEventListener('DOMContentLoaded', handler, false); 
				    removeEventListener('load', handler, false); 
				    removeEventListener('scroll', handler, false); 
				    removeEventListener('resize', handler, false); 
				} else if (window.attachEvent)  {
				    detachEvent('onDOMContentLoaded', handler); // IE9+ :(
				    detachEvent('onload', handler);
				    detachEvent('onscroll', handler);
				    detachEvent('onresize', handler);
				}
			}

			handler = function() {
		    	for(var i = 0, e ; e =  elems[i]; i++) {
		    		var mode = e.dataset.awtyMode,
		    			space = parseFloat(e.dataset.awtySpace,10);
		    		if(mode) {
		    			if(isElInViewport(e, mode, space)) {
		    				update(e, i);		    				
		    			}
		    		} else {
			    		if(isElTotallyInViewport(e.getBoundingClientRect())) {
				    		update(e, i);
				    	}	
		    		}
			    }
			}	

		    start = function() {
			    elems = getElems();	    
				// Listen for scrolling / loading / resizing events
				addListeners();
			};
			
		};

		Awty.prototype.init = function() {	
			var _docReadyState;	

			if ((_docReadyState = document.readyState) === "interactive" || _docReadyState === "complete") {
				start();
			} else {
				document.addEventListener('DOMContentLoaded', start);
			}
	    };

	    Awty.prototype.getElements = function() {	
			return getElems();
	    };

	    return Awty;

	})();

	root = typeof exports !== "undefined" && exports !== null ? exports : window;

  	root.Awty = Awty;

}).call(this);
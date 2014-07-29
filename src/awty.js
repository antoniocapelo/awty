(function() {   
	/**

	data-awty="blue"
	data-awty-remove="true"
	data-awty-timeout="600ms"
	data-awty-mode="peek,margin"
	data-awty-space="0.2,50px"

	{
		tidy: true,
		defaultClass: 'awty',
	}

	**/  
	var elems;

	function isElementInViewportOld (el) {
		var rect;

	    // for jQuery element or nodelist resulted from document.querySelectorAll
	    if (el instanceof Array || (typeof jQuery !== 'undefined' && el instanceof jQuery)) {
	        el = el[0];
	    }

	    rect = el.getBoundingClientRect();

	    return (
	        rect.top >= 0 &&
	        rect.left >= 0 &&
	        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
	        rect.right <= (window.innerWidth || document.documentElement.clientWidth) 
	    );
	};	

	function isElementPartiallyInViewport (el, partial, measure) {
		var rect, 
			topBorder,
			bottomBorder;

	    // for jQuery element or nodelist resulted from document.querySelectorAll
	    if (el instanceof Array || (typeof jQuery !== 'undefined' && el instanceof jQuery)) {
	        el = el[0];
	    }

	    rect = el.getBoundingClientRect();

	    switch (partial) {
	    	case 'PEEK': topBorder = rect.top + rect.height * measure;
	    				 bottomBorder = rect.bottom - rect.height * measure; break;
	    }

	    return (
	    	( rect.top >= 0 &&
	        rect.left >= 0 &&
	        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
	        rect.right <= (window.innerWidth || document.documentElement.clientWidth) ) ||
	        ( bottomBorder >= 0 && topBorder <= (window.innerHeight || document.documentElement.clientHeight) )
	    );
	};	


	isElTotallyInViewport = function (rect) {
		return (
	        rect.top >= 0 &&
	        rect.left >= 0 &&
	        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
	        rect.right <= (window.innerWidth || document.documentElement.clientWidth) 
	    );
	}

	function isElInViewport (el, mode, space) {
		var rect, 
			topBorder,
			bottomBorder;

	    // for jQuery element or nodelist resulted from document.querySelectorAll
	    if (el instanceof Array || (typeof jQuery !== 'undefined' && el instanceof jQuery)) {
	        el = el[0];
	    }

	    rect = el.getBoundingClientRect();

	    switch (mode) {
	    	case 'PEEK':
	    	case 'peek': 	topBorder = rect.top + rect.height * space;
	    				 	bottomBorder = rect.bottom - rect.height * space; 
    				 	 	return isElTotallyInViewport(rect) || 
    				 	 		( bottomBorder >= 0 && topBorder <= (window.innerHeight || document.documentElement.clientHeight) );
	    				 break;
			case 'MARGIN':
			case 'margin': 	topBorder = rect.top - space;
	    				 	bottomBorder = rect.bottom + space; 
    				 	   	return isElTotallyInViewport(rect) &&
    				 	 	( topBorder >= 0 && bottomBorder <= (window.innerHeight || document.documentElement.clientHeight) );
	    				 break; 
			default: return isElTotallyInViewport(rect);
	    }

	};	

	getElems = function () {
		var nodeList = document.querySelectorAll('.' + _config.defaultClass),
			res = [];
		for(var i = 0, e; e = nodeList[i]; i++) {
			if(e.dataset.awty) {
				res.push(e);
			}
		}
		return res;
	}

	function update(el, index) {
		// get classes from data-attr
		var classes = el.dataset.awty.split(',');
		if (el.dataset.awtyRemove && el.dataset.awtyRemove === 'true') {
			if (el.classList) {
				for(var i = 0, c; c = classes[i]; i++) {
					el.classList.remove(c);							
				}
			} else {
				for(var i = 0, c; c = classes[i]; i++) {
					el.className = el.className.replace(new RegExp('(^|\\b)' + (c).split(' ').join('|') + '(\\b|$)', 'gi'), ' ');					
				}			  
			}
		} else {
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
    		if(mode && space) {
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

	init = function(config) {
		var _docReadyState;
		for (key in _config) {
			if (_config.hasOwnProperty(key)) {
				if (config && typeof config[key] !== 'undefined') {
					_config[key] = config[key];
				}
			}
		}

      if ((_docReadyState = document.readyState) === "interactive" || _docReadyState === "complete") {
        start();
      } else {
        document.addEventListener('DOMContentLoaded', start);
      }
    };

    start = function() {
	    elems = getElems();
	    
		// Listen for scrolling / loading / resizing events
		addListeners();
	};

	// Default config object
	_config = 	{
					tidy: true,
					defaultClass: 'awty'
				}


	// pass to prototyping
	init();

}).call(this);
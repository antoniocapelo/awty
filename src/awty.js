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
			case 'CENTER':
			case 'center': 	middleLine = parseInt(rect.bottom - (rect.height / 2), 10); 
							middleScreen = parseInt(((window.innerHeight || document.documentElement.clientHeight)/2), 10);
    				 	   	return middleLine >= middleScreen - 5 && middleLine < middleScreen + 5;
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

	function roundTo (num, to) {
    var remainder = num%to;
    if (remainder <= (to/2)) { 
        return num-remainder;
    } else {
        return num+to-remainder;
    }
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
    			space = parseFloat(e.dataset.awtySpace,10) ? parseFloat(e.dataset.awtySpace,10): 0;
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
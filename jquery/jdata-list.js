/********************************************************************************************/
/*                                                                                          */
/*                                       jData - list                                       */
/*                                            0.1                                           */
/*                                                                                          */
/********************************************************************************************/

(function($, jdata) {
	
	var datalist = {};
	
	datalist.create = function($el, data) {
		for (var i=0; i<data.length; i++) {
			$el.append(this.createElement(data[i]));
		}
	}
	
	datalist.createElement = function(data) {
		var $li = $('<li></li>');
		
		$li.attr('value', data.value);
		$li.text(data.label);
			
		return $li;
	}
	
	$.fn.jdataList = function(data) {
		datalist.create(this, data);
	}

})($, jdata);
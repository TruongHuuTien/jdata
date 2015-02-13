/********************************************************************************************/
/*																							*/
/*										jData - JQuery										*/
/*											 0.1											*/
/*																							*/
/********************************************************************************************/

var jData = (function(JData, $){
	
	jData.appendTo = function($el, template, data) {
		$($el).append(this.apply(template, data).toString());
	}
	
	return JData;
})(jData, jQuery);
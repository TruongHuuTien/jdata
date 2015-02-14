/********************************************************************************************/
/*																							*/
/*										jData - JQuery										*/
/*											 0.1											*/
/*																							*/
/********************************************************************************************/

var jData = (function(JData, $){
	
	JData.append = function($el, template, data) {
		$($el).append(this.apply(template, data).toString());
	}
	
	JData.html = function($el, template, data) {
		$($el).html(this.apply(template, data).toString());
	}
	
	JData.val = function($el, template, data) {
		$($el).val(this.apply(template, data).toString());
	}
	
	JData.render = function($el, template, data) {
		$($el).find('[jdata]').each(function() {
			var $this = $(this);
			var t = template[$this.attr('jdata')];
			if ($this.is('input')) {
				JData.val($this, t, data);
			} else {
				JData.html($this, t, data)
			}
		});
	}
	
	return JData;
})(jData, jQuery);
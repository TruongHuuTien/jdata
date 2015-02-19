/********************************************************************************************/
/*																							*/
/*										jData - JQuery										*/
/*											 0.1											*/
/*																							*/
/********************************************************************************************/

var jdata = (function(JData, $){
	
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
	
	
	
	
	
	/****************************************************************/
	/*							DataTable							*/
	/****************************************************************/
	
	JData.datatable = (function($, JData){
		function thead(template) {
			var $thead = $('<thead></thead>');
			var $tr = $('<tr></tr>');
			
			for (var c in template.column) {
				var $th = $('<th></th>');	
				$th.attr('data-column-name', c);
				if (template.column[c].label) {
					var string = '<span class="column-label">'+template.column[c].label+'</span>';
				} else {
					 var string = '<span class="column-label">'+c+'</span>';
				 }
				if (template.column[c].sort) {
					string += '<span class="column-sort"></span>';
				}
				if (template.column[c].classes) {
					for (var j=0; j< template.column[c].classes.length; j++) {
						$th.addClass(template.column[c].classes[j]);
					}
				}
				$th.html(string);
				$tr.append($th);
			}
			$thead.append($tr);
			
			return $thead;
		}
		
		function tbody(template, data) {
			var $tbody = $('<tbody></tbody>');
			
			for (var i=0; i<data.length; i++) {
				var row = data[i];
				var $tr = $("<tr></tr>");
				
				$tr.attr("row-index", i);
				if (template.row.attribute) {
					for (var a in template.row.attribute) {
						$tr.attr(a, JData.apply(template.row.attribute[a], row).toString());
					}
				}
				for (var c in template.column) {
					var $td = $('<td data-column-name="'+c+'"></td>');
					
					if (template.column[c].classes) {
						for (var j=0; j< template.column[c].classes.length; j++) {
							$td.addClass(template.column[c].classes[j]);
						}
					}
					if (template.column[c].attribute) {
						for (ca in template.column[c].attribute) {
							$td.attr(ca, template.column[c].attribute[ca]);
						}
					}
					if (template.column[c].value) {
						$td.html(JData.apply(template.column[c].value, row).toString());
					}
					$tr.append($td);
				}
				$tbody.append($tr);
			}
			return $tbody;
		}
		
		function tfoot(template) {
			var $tfoot = $('<tfoot></tfoot>');
			var $tr = $('<tr></tr>');
			
			for (var c in template.column) {
				var $td = $('<td></td>');
				if (template.column[c].classes) {
					for (var j=0; j< template.column[c].classes.length; j++) {
						$td.addClass(template.column[c].classes[j]);
					}
				}
				$tr.append($td);
			}
			$tfoot.append($tr);
			
			return $tfoot;
		}
		
		var Datatable = function($el, template, data) {
			this.$thead = thead(template);
			this.$tbody = tbody(template, data);
			this.$tfoot = tfoot(template);
			this.$table = $($el);
			
			this.$table.append(this.$thead);
			this.$table.append(this.$tbody);
			this.$table.append(this.$tfoot);
		}
		
		return Datatable;
	})(jQuery, JData);
	
	
	
	
	$.fn.jdata = function(template, data) {
		JData.render(this, template, data)
	}
	
	return JData;
})(jdata, jQuery);


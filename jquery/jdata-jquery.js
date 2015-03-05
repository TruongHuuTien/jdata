/********************************************************************************************/
/*                                                                                          */
/*                                      jData - JQuery                                      */
/*                                           1.0                                            */
/*                                                                                          */
/********************************************************************************************/

var jdata = (function(JData, $){
	
	JData.append = function($el, data, template) {
		$($el).append(jdata.print(data, template));
	}
	
	JData.html = function($el, data, template) {
		$($el).html(jdata.print(data, template));
	}
	
	JData.val = function($el, data, template) {
		$($el).val(jdata.print(data, template));
	}
	
	JData.render = function($el, data, template) {
		if (typeof(data) === "object") {
			if (typeof(template) === "object") {
				$($el).find('[jdata]').each(function() {
					var $this = $(this);
					var t = template[$this.attr('jdata')];
					if ($this.is('input')) {
						JData.val($this, data, t);
					} else {
						JData.html($this, data, t);
					}
				});
			} else {
				JData.html($el, data, template);
			}
		} else {
			$.getJSON(data, function(data) {
				JData.render($el, data, template);
			});
		}
	}
	
	JData.ajax = function(url, template, callback) {
		$.getJSON(url, function(data) {
			var jd = new jdata(data, template);
			if (callback) {
				callback(jd);
			}
		});
	}
	
	
	
	
	
	/****************************************************************/
    /*                          DataTable                           */
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
		
		function tbody(data, template) {
			var $tbody = $('<tbody></tbody>');
			
			for (var i=0; i<data.length; i++) {
				var row = data[i];
				var $tr = $("<tr></tr>");
				
				$tr.attr("row-index", i);
					for (var a in template.row.attribute) {
						var tr = new jdata(row, template.row.attribute[a]);
						$tr.attr(a, tr.get());
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
						var td = new jdata(row, template.column[c].value);
						$td.html(td.get());
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
		
		var Datatable = function($el, data, template, handle) {
			this.$thead = thead(template);
			this.$tbody = tbody(data, template);
			this.$tfoot = tfoot(template);
			this.$table = $($el);
			
			this.$table.append(this.$thead);
			this.$table.append(this.$tbody);
			this.$table.append(this.$tfoot);
			
			if (handle) {
				this.handle = handle;
				this.handle(this);
			}
			
			return this;
		}
		
		return Datatable;
	})(jQuery, JData);
	
	
	
	/****************************************************************/
    /*                      Div's Datagrid                          */
	/****************************************************************/
	
	JData.datagrid = (function($, JData){
		function thead(template) {
			var $thead = $('<div class="thead"></div>');
			var $tr = $('<div class="tr"></div>');
			
			for (var c in template.column) {
				var $th = $('<div class="th"></div>');
				$th.attr('data-column-name', c);
				if (template.column[c].label != null) {
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
		
		function tbody(data, template) {
			var $tbody = $('<div class="tbody"></div>');
			
			for (var i=0; i<data.length; i++) {
				var row = data[i];
				var $tr = $('<div class="tr"></div>');
				
				$tr.attr("row-index", i);
				if (template.row.attribute) {
					for (var a in template.row.attribute) {
						var tr = new jdata(row, template.row.attribute[a]);
						$tr.attr(a, tr.get());
					}
				}
				for (var c in template.column) {
					var $td = $('<div data-column-name="'+c+'" class="td"></div>');
					
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
						var td = new jdata(row, template.column[c].value);
						$td.html(td.get());
					}
					$tr.append($td);
				}
				$tbody.append($tr);
			}
			return $tbody;
		}
		
		function tfoot(template) {
			var $tfoot = $('<div class="tfoot"></div>');
			var $tr = $('<div class="tr"></div>');
			
			for (var c in template.column) {
				var $td = $('<div class="td"></div>');
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
		
		var Datatable = function($el, data, template, handle) {
			this.$thead = thead(template);
			this.$tbody = tbody(data, template);
			this.$tfoot = tfoot(template);
			this.$table = $($el);
			
			this.$table.append(this.$thead);
			this.$table.append(this.$tbody);
			this.$table.append(this.$tfoot);
			
			if (handle) {
				this.handle = handle;
				this.handle(this);
			}
			
			return this;
		}
		
		return Datatable;
	})(jQuery, JData);
	
	
	
	
	$.fn.jdata = function(data, template) {
		JData.render(this, data, template);
	}
	
	JData.extend = $.fn.jdata;
	
	return JData;
})(jdata, jQuery);


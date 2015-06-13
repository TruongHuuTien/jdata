/********************************************************************************************/
/*                                                                                          */
/*                                      jdata - Core                                        */
/*                                           3.0                                            */
/*                                                                                          */
/********************************************************************************************/

var jdata = (function( $ ){
	
	/****************************************************************/
	/*                          constructor                         */
	/****************************************************************/
	var jdata = function(template, data) {
		this.src.set(JSON.parse(JSON.stringify(template)), data);
		this.apply();
	};
	
	
	/****************************************************************/
	/*                           get / set                          */
	/****************************************************************/
	jdata.prototype.get = function(path) { // To do;
		if (path == null) {
			return this;
		} else {
			return this[path];
		}
	}
	
	jdata.prototype.set = function(template, data) {
		this.clear();
		this.src.setTemplate(JSON.parse(JSON.stringify(template)));
		this.src.setData(data);
		this.apply();
		return this;
	}
	
	jdata.prototype.getTemplate = function() {
		return this.src.getTemplate();
	}
	
	jdata.prototype.setTemplate = function(template) {
		this.clear();
		this.src.setTemplate(template);
		this.apply();
		return this;
	}
	
	jdata.prototype.getData = function() {
		return this.src.getData();
	}
	
	jdata.prototype.setData = function(data) {
		this.src.setData(data);
		this.apply();
		return this;
	}
	
	
	/****************************************************************/
	/*                           utilities                          */
	/****************************************************************/
	jdata.prototype.toString = function() {
		return JSON.stringify(this);
	}
	
	jdata.prototype.clear = function() {
		for (var o in this.src.template) {
			delete this[o];
		}
		return this;
	}
	
	
	/****************************************************************/
	/*                              src                             */
	/****************************************************************/
	jdata.prototype.src = {};
	
	jdata.prototype.src.set = function(template, data) {
		this.template = template;
		this.data = data;
	}
	
	jdata.prototype.src.getTemplate = function() {
		return this.template;
	}
	
	jdata.prototype.src.setTemplate = function(template) {
		this.template = template;
	}
	
	jdata.prototype.src.getData = function() {
		return this.data;
	}
	
	jdata.prototype.src.setData = function(data) {
		this.data = data;
	}
	
	
	/****************************************************************/
	/*                             apply                            */
	/****************************************************************/
	jdata.prototype.apply = function() {
		for (var o in this.src.template) {
			this[o] = this.src.template[o];
		}
		applyTemplate(this, this.src.data);
		this.view.update();
		return this;
	}
	
	function applyTemplate(template, data) {
		for (var t in template) {
			if (typeof(template[t]) === "string") {
				var regexp = template[t].match(/\{ ?[^\{\}]+ ?\}[.a-zA-Z0-9'(), ]*/g);
				for (var r in regexp) {
					template[t] = template[t].replace(regexp[r], transform(regexp[r], data));
				}
			} else if (typeof(template[t]) === "object") {
				//applyTemplate(template[t], data);
			}
		}
	}
	
	/* {name.first}.uppercase(), {name: {first: John}} => JOHN */
	function transform(el, data) {
		var extracted = extract(el);
		var data = parseTemplateValue(extracted.value, data);
		if (data != null) {
			if (extracted.format) {
				data = applyFormat(extracted.format, data);
			}
		} else {
			data = "";
		}
		
		return data;
	}
	
	/* {name.first}, {name: {first: John}} => John */
	function parseTemplateValue(templateValue, data) {
		if (data == null) return null;
		var valuePath = templateValue.split(".");
		for (var i=0; i<valuePath.length; i++) {
			if (data == null) {return null};
			data = data[valuePath[i]];
		}
		return data;
	}
	
	/* uppercase, John => JOHN */
	function applyFormat(format, data) {
		for (var i=0; i<format.length; i++) {
			/*
for (var j=0, f=jdata.format; j<format[i].length; j++) {
				f = f[format[i][j]];
			}
			if (f) data = f(data);
*/
			var f = jdata.format[format[i].fn];
			data = f(data, format[i].params);
		}
		
		return data;
	}
	
	/* {name}.uppercase() => {value: name, format: uppercase} */
	function extract(data) {
		var parsed = data.match(/^\{ ?(?:row.)?([a-zA-Z0-9\._]+) ?\}([.a-zA-Z0-9'(), ]*)$/);
		var extracted = {};
		if (parsed) {
			if (parsed[2]) {
				return { value : parsed[1], format : extractFormat(parsed[2]) }
			} else {
				return { value : parsed[1], format : null }
			}
		} else {
			return { value : data, format : null }
		}
	}
	
	/* phone.post() => [phone, post] */
	function extractFormat(formatRaw) {
		var re = formatRaw.match(/[^()]*\([.a-zA-Z0-9', ]*\)/g);
		var formatArray = [];
		for (var r in re) {
			var r = re[r].match(/^\.([a-zA-Z]*)\(([.a-zA-Z0-9', ]*)\)$/);
			var fn = r[1];
			var paramString = r[2];
			var params = paramString.match(/[\.a-zA-Z0-9]+/g);

			formatArray.push({
				fn : fn,
				params: params
			});
		}
		return formatArray;
	}




/********************************************************************************************/
/*                                                                                          */
/*                                          Format                                          */
/*                                                                                          */
/********************************************************************************************/
	jdata.format = {}
	
	/****************************************************************/
	/*                            String                            */
	/****************************************************************/
	jdata.format.uppercase = function(value) {
		return value.toUpperCase();
	}
	
	jdata.format.lowercase = function(value) {
		return value.toLowerCase();
	}
	
	jdata.format.replace = function(value, params) {
		return value.replace(params[0], params[1]);
	}
	



/********************************************************************************************/
/*                                                                                          */
/*                                          jQuery                                          */
/*                                                                                          */
/********************************************************************************************/

	
	/****************************************************************/
	/*                            append                            */
	/****************************************************************/
	jdata.prototype.append = function($el, path) {
		var value = this.get(path);
		$el.append(value);
	}
	
	jdata.prototype.html = function($el, path) {
		var value = this.get(path);
		$el.html(value);
	}
	
	jdata.prototype.val = function($el, path) {
		var value = this.get(path);
		$el.val(value);
	}
	
	
	/****************************************************************/
	/*                            render                            */
	/****************************************************************/
	jdata.prototype.render = function(el, callback) {
		$(el).find('[jdata]').each(function(index, currentTarget) {
			var $el = $(currentTarget);
			var path = $el.attr('jdata');
			
			if ($el.is('input')) {
				this.val($el, path);
			} else {
				this.html($el, path);
			}
		}.bind(this));
	}
	
	
	/****************************************************************/
	/*                             view                             */
	/****************************************************************/
	jdata.prototype.createView = function(el, handle) {
		this.view.parent = this;
		this.view.create(el, handle);
	}
	
	jdata.prototype.view = {};
	
	jdata.prototype.view.create = function(el, handle) {
		this.$elements = {};
		$(el).find('[jdata]').each(function(index, currentTarget) {
			var $el = $(currentTarget);
			var path = $el.attr('jdata');
			
			this.$elements[path] = $el;
			
			if ($el.is('input')) {
				this.parent.val($el, path);
				this.events($el, path);
			} else {
				this.parent.html($el, path);
			}
		}.bind(this));
	}
	
	jdata.prototype.view.events = function($el, path) {
		$el.on("keyup change", function(event){
			this.parent[path] = $el.val();
		}.bind(this));
	}
	
	jdata.prototype.view.update = function() {
		for (var path in this.$elements) {
			this.parent.val(this.$elements[path], path);
		}
	}
	
	
	return jdata;
})(jQuery);


$.fn.jdata = function() {}

$.fn.jdata.view = function(template, data, handle) {
	var jd = new jdata(template, data);
	jd.createView(this, handle);
}
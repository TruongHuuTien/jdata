/********************************************************************************************/
/*                                                                                          */
/*                                      jdata - Core                                        */
/*                                           3.0                                            */
/*                                                                                          */
/********************************************************************************************/

var jdata = (function(){
	
	/****************************************************************/
	/*                          constructor                         */
	/****************************************************************/
	var jdata = function(template, data) {
		this.src.set(template, data);
		this.apply();
	};
	
	
	/****************************************************************/
	/*                            public                            */
	/****************************************************************/
	jdata.prototype.set = function(template, data) {
		this.clear();
		this.src.setTemplate(template);
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
		return this;
	}
	
	function applyTemplate(template, data) {
		for (var t in template) {
			if (typeof(template[t]) === "string") {
				var regexp = template[t].match(/\{ ?[^\{\}]+ ?\}[.a-zA-Z()]*/g);
				for (var r in regexp) {
					template[t] = template[t].replace(regexp[r], transform(regexp[r], data));
				}
			} else if (typeof(template[t]) === "object") {
				applyTemplate(template[t]);
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
			for (var j=0, f=JData.format; j<format[i].length; j++) {
				f = f[format[i][j]];
			}
			if (f) data = f(data);
		}
		
		return data;
	}
	
	/* {name}.uppercase() => {value: name, format: uppercase} */
	function extract(data) {
		var parsed = data.match(/^\{ ?(?:row.)?([a-zA-Z0-9\._]+) ?\}([.a-zA-Z()]*)$/);
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
		var re = formatRaw.match(/[^()]*\(\)/g);
		var formatArray = [];
		for (var r in re) {
			formatArray.push(re[r].match(/[a-zA-Z]+/g));
		}
		return formatArray;
	}
	
	
	return jdata;
})();
/********************************************************************************************/
/*																							*/
/*											jData											*/
/*											 0.2											*/
/*																							*/
/********************************************************************************************/

var jData = (function(){
	
	/****************************************************************/
	/*								Format							*/
	/****************************************************************/
	
	var Format = {}
	
	
	/********************************/
	/*			  String			*/
	/********************************/
	Format.uppercase = function(str) {
		return str.toUpperCase();
	}
	
	Format.lowercase = function(str) {
		return str.toLowerCase();
	}
	
	
	

	/****************************************************************/
	/*								Core							*/
	/****************************************************************/
	
	var JData = function(template, data) {
		if (template) this.template = template;
		if (data) this.data = data;
	}
	
	JData.prototype.toString = function() {
		if (this.formatted && typeof(this.formatted) != "object") {
			return this.formatted.toString();
		} else {
			return "";
		}
	}
	
	
	
	
	/****************************************************************/
	/*								Apply							*/
	/****************************************************************/
	
	JData.apply = function(template, data) {
		var jd = new JData(template, data);
		
		jd.apply(template);
		
		return jd;
	}
	
	JData.prototype.apply = function(template) {
		this.formatted = template;
		var data = this.data;
		var regexp = template.match(/\{ ?[^\{\}]+ ?\}[.a-zA-Z()]*/g);
		for (var r in regexp) {
			this.formatted = this.formatted.replace(regexp[r], transform(regexp[r], this.data));
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
		var valuePath = templateValue.split(".");
		for (var i=0; i<valuePath.length; i++) {
			//console.log(valuePath, valuePath[i], data);
			data = data[valuePath[i]];
		}
		
		return data;
	}
	
	/* uppercase, John => JOHN */
	function applyFormat(format, data) {
		for (var i=0; i<format.length; i++) {
			for (var j=0, f=Format; j<format[i].length; j++) {
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
	
	
	
	
	/****************************************************************/
	/*								Map								*/
	/****************************************************************/
	
	JData.map = function(template, data) {
		var jd = new JData(template, data);
		
		jd.map(template, data);
		
		return jd;
	}
	
	JData.prototype.map = function(template, data) {
		var dataLength = data.length;
		if (dataLength == null) { // data is not an Array
			this.formatted = duplicateObject(template);
			arrayTransform(template, data, this.formatted);
		} else { // data is an Array, need to iterate
			this.formatted = new Array();
			for (var i=0; i<dataLength; i++) {
				this.formatted[i] = duplicateObject(template);
				arrayTransform(template, data[i], this.formatted[i]);
			}
		}
	}
	
	function arrayTransform(template, data, repository) {
		for (var t in template) {
				var regexp = template[t].match(/\{ ?[^\{\}]+ ?\}[.a-zA-Z()]*/g);
				for (var r in regexp) {
					repository[t] = repository[t].replace(regexp[r], transform(regexp[r], data));
				}
			}
	}
	
	
	
	
	
	/****************************************************************/
	/*						Object functions						*/
	/****************************************************************/
	
	function duplicateObject(object) { // Recursive function
		var newObject = new Object();
		for (var o in object) {
			if (typeof(object[o]) === "object") {
				newObject[o] = duplicateObject(object[o]);
			} else {
				newObject[o] = object[o]
			}
		}
		return newObject;
	}
	
	
	
	return JData;
})();
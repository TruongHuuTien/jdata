/********************************************************************************************/
/*                                                                                          */
/*                                      jdata - Core                                        */
/*                                           1.3                                            */
/*                                                                                          */
/********************************************************************************************/

var jdata = (function(){
	
	
	/****************************************************************/
	/*                              Core                            */
	/****************************************************************/
	var JData = function(data, template) {
		if (data) this.data = data;
		if (template) this.template = template;
		if (this.template && typeof(this.template) === "object") {
			this.map();
		} else {
			this.apply();
		}
	}
	
	JData.print = function(data, template) {
		return new JData(data, template).get();
	}
	
	JData.prototype.get = function() {
		if (typeof(this.formatted) === "object") {
			return duplicateFormattedObject(this.formatted);
		} else {
			return this.formatted;
		}
	}
	
	JData.prototype.set = function(data) {
		if (data) this.data = data;
		if (this.template && typeof(this.template) === "object") {
			this.map();
		} else {
			this.apply();
		}
		// change event
	}
	
	JData.prototype.setTemplate = function(template) {
		if (template) this.template = template;
		if (this.template && typeof(this.template) === "object") {
			this.map();
		} else {
			this.apply();
		}
		// change event
	}
	
	JData.prototype.toString = function() {
		if (this.formatted && typeof(this.formatted) != "object") {
			return this.formatted.toString();
		} else {
			return "";
		}
	}
	
	
	
	
	/****************************************************************/
	/*                              Apply                           */
	/****************************************************************/
	
	JData.prototype.apply = function() {
		this.formatted = this.template;
		var data = this.data;
		var regexp = this.template.match(/\{ ?[^\{\}]+ ?\}[.a-zA-Z()]*/g);
		for (var r in regexp) {
			this.formatted = this.formatted.replace(regexp[r], transform(regexp[r], this.data));
		}
	}
	
	/* {name.first}.uppercase(), {name: {first: John}} => JOHN */
	function transform(el, data) {
		var extracted = extract(el);
		var data = parseTemplateValue(data, extracted.value);
		if (data != null) {
			if (extracted.format) {
				data = applyFormat(data, extracted.format);
			}
		} else {
			data = "";
		}
		
		return data;
	}
	
	/* {name.first}, {name: {first: John}} => John */
	function parseTemplateValue(data, templateValue) {
		if (data == null) return null;
		var valuePath = templateValue.split(".");
		for (var i=0; i<valuePath.length; i++) {
			if (data == null) {return null};
			data = data[valuePath[i]];
		}
		return data;
	}
	
	/* uppercase, John => JOHN */
	function applyFormat(data, format) {
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
	
	
	
	
	/****************************************************************/
	/*                              Map                             */
	/****************************************************************/
	
	JData.prototype.map = function() {
		var dataLength = this.data.length;
		if (dataLength == null) { // data is not an Array
			this.formatted = duplicateObject(this.template);
			arrayTransform(this.data, this.template, this.formatted);
		} else { // data is an Array, need to iterate
			this.formatted = new Array();
			for (var i=0; i<dataLength; i++) {
				this.formatted[i] = duplicateObject(this.template);
				arrayTransform(this.data[i], this.template, this.formatted[i]);
			}
		}
	}
	
	function arrayTransform(data, template, repository) {
		for (var t in template) {
			if (typeof(template[t]) === "string") {
				var regexp = template[t].match(/\{ ?[^\{\}]+ ?\}[.a-zA-Z()]*/g);
				for (var r in regexp) {
					repository[t] = repository[t].replace(regexp[r], transform(regexp[r], data));
				}
			} else if (typeof(template[t]) === "object" && template[t].formatted != null) {
				template[t].set(data);
				repository[t] = template[t];
			} else {
				arrayTransform(data, template[t], repository[t]);
			}
		}
	}
	
	
	
	
	/****************************************************************/
	/*                              Format                          */
	/****************************************************************/
	
	JData.format = {}
	
	/********************************/
	/*            String            */
	/********************************/
	JData.format.uppercase = function(str) {
		return str.toUpperCase();
	}
	
	JData.format.lowercase = function(str) {
		return str.toLowerCase();
	}
	
	
	
	
	/****************************************************************/
	/*                      Object functions                        */
	/****************************************************************/
	
	function duplicateObject(object) { // Recursive function
		var newObject = new Object();
		for (var o in object) {
			if (typeof(object[o]) === "object") {
				newObject[o] = duplicateObject(object[o]);
			} else if (typeof(object[o]) === "function") {
				
			} else {
				newObject[o] = object[o];
			}
		}
		return newObject;
	}
	
	function duplicateFormattedObject(object) { // Recursive function
		var newObject = new Object();
		for (var o in object) {
			if (typeof(object[o]) === "object") {
				if (object[o].formatted != null && object[o].get != null) {
					newObject[o] = object[o].get();
				} else {
					newObject[o] = duplicateFormattedObject(object[o]);
				}
			} else {
				newObject[o] = object[o];
			}
		}
		return newObject;
	}
	


	
	return JData;
})();

/********************************************************************************************/
/*                                                                                          */
/*                                          NPM                                             */
/*                                                                                          */
/********************************************************************************************/

module.exports = jdata;


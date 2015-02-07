/********************************************************************************************/
/*																							*/
/*											jData											*/
/*											 0.1											*/
/*																							*/
/********************************************************************************************/

var jData = (function(){
	
	// { name } => name
	function extract(data) {
		var parsed = data.match(/^\{ ?(?:row.)?([a-zA-Z0-9\._]+) ?\}([.a-zA-Z()]*)$/);
		var extracted = {};
		if (parsed) {
			if (parsed[2]) {
				extracted =  {
					value	: parsed[1],
					format	: extractFormat(parsed[2])
				}
			} else {
				extracted =  {
					value	: parsed[1],
					format	: null
				}
			}
		} else {
			extracted = {
				value	: data,
				format	: null
			}
		}
		return extracted;
	}
	
	function extractFormat(raw) {
		var regexp = raw.match(/[^()]*\(\)/g);
		var returnedArray = [];
		for (var r in regexp) {
			var formatPath = regexp[r].match(/[a-zA-Z]+/g);
			returnedArray.push(formatPath);
		}
		return returnedArray;
	}
	
	var Format = {};
	
	var JData = function(template, data) {
		if (template && typeof(template === "String")) {
			this.template = template;
		}
		
		if (data) {
			this.data = data;
		}
		
		this.apply();
	}
	
	
	JData.prototype.apply = function() {
		this.formatted = this.template;
		var data = this.data;
		var regexp = this.template.match(/\{ ?[^\{\}]+ ?\}[.a-zA-Z()]*/g);
		for (var r in regexp) {
			var extracted = extract(regexp[r]);
			var path = extracted.value.split(".");
			for (var i=0; i<path.length; i++) {
				data = data[path[i]];
			}
			if (data != null) {
				if (extracted.format) {
					for (var i=0; i<extracted.format.length; i++) {
						for (var j=0, f=Format; j<extracted.format[i].length; j++) {
							f = f[extracted.format[i][j]];
						}
						if (f) data = f(data);
					}
				}
			} else {
				data = "";
			}
			this.formatted = this.formatted.replace(regexp[r], data);
		}
		if (this.formatted) {
			return this.formatted;
		} else {
			return "";
		}
	}
	
	JData.prototype.toString = function() {
		if (this.formatted) {
			return this.formatted.toString();
		} else {
			return "";
		}
	}
	
	return JData;
})();
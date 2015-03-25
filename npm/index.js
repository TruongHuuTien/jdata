/********************************************************************************************/
/*                                                                                          */
/*                                      jdata - Core                                        */
/*                                           2.0                                            */
/*                                                                                          */
/********************************************************************************************/
/*                                                                                          */
/*  # New Features:                                                                         */
/*    # Asynchrone                                                                          */
/*    # Ajax Template & Data                                                                */
/*    # Extends                                                                             */
/*    # Events                                                                              */
/*    # param in format                                                                     */
/*                                                                                          */
/********************************************************************************************/

var jdata = (function(){

	
	/********************************************************/
	/*                      Constructor                     */
	/********************************************************/
	
	var jdata = function(data, receipe) {
		if (receipe) this.receipe = receipe;
		if (data) this.data = data;
		
		this.transform();
	}
	
	
	/********************************************************/
	/*                    Static function                   */
	/********************************************************/
	
	jdata.print = function(data, receipe) {
		return new jdata(data, receipe).get();
	}
	
	/********************************************************/
	/*                   Prototype function                 */
	/********************************************************/
	
	jdata.prototype.transform = function() {
		if (this.receipe) {
			if (typeof(this.receipe) === "object") {
				this.result = map(this.data, this.receipe);
			} else {
				this.result = apply(this.data, this.receipe);
			}
		}
	}
	
	jdata.prototype.get = function() {
		if (typeof(this.result) === "object") {
			return this.result;
		} else {
			return this.result;
		}
	}
	
	jdata.prototype.set = function(data) {
		if (data) this.data = data;
		
		this.transform();
	}
	
	jdata.prototype.setReceipe = function(receipe) {
		if (receipe) this.receipe = receipe;
		
		this.transform();
	}
	
	jdata.prototype.toString = function() {
		if (this.result && typeof(this.result) != "object") {
			return this.result.toString();
		} else {
			return "";
		}
	}
	
	
	/********************************************************/
	/*                          Apply                       */
	/********************************************************/
	
	function apply(data, receipe) {
		var result = receipe;
		var sliced = receipe.match(/\{ ?[^\{\}]+ ?\}[.a-zA-Z()]*/g);
		for (var r in sliced) {
			result = result.replace(sliced[r], applyElement(data, sliced[r]));
		}
		
		return result;
	}
	
	function applyElement(data, receipeElement) {
		var analysed = analyseReceipeElement(receipeElement);
		var data = experiment(data, analysed.value);
		
		if (data != null) {
			if (analysed.format) {
				data = applyFormat(data, analysed.format);
			}
		} else {
			data =  "";
		}
		
		return data;
	}
	
	/* {name}.uppercase() => {value: name, format: uppercase} */
	function analyseReceipeElement(receipeElement) {
		var analysed = receipeElement.match(/^\{ ?(?:row.)?([a-zA-Z0-9\._]+) ?\}([.a-zA-Z()]*)$/);
		if (analysed) {
			if (analysed[2]) {
				return { value : analysed[1], format : analyseFormat(analysed[2]) }
			} else {
				return { value : analysed[1], format : null }
			}
		} else {
			return { value : data, format : null }
		}
	}
	
	/* phone.post() => [phone, post] */
	function analyseFormat(formatRaw) {
		var re = formatRaw.match(/[^()]*\(\)/g);
		var formatList = [];
		for (var r in re) {
			formatList.push(re[r].match(/[a-zA-Z]+/g));
		}
		return formatList;
	}
	
	/* {name.first}, {name: {first: John}} => John */
	function experiment(data, receipeElement) {
		if (data == null) return null;
		
		var path = receipeElement.split(".");
		
		for (var i=0; i<path.length; i++) {
			if (data == null) return null;
			data = data[path[i]];
		}
		
		return data;
	}
	
	/* uppercase, John => JOHN */
	function applyFormat(data, format) {
		for (var i=0; i<format.length; i++) {
			for (var j=0, f=jdata.format; j<format[i].length; j++) {
				f = f[format[i][j]];
			}
			if (f) data = f(data);
		}

		return data;
	}
	
	
	/********************************************************/
	/*                           Map                        */
	/********************************************************/
	
	function map(data, receipe) {
		var result;
		
		if (data.length == null) { // data is not an array
			var result = receipe;
			applyArray(data, receipe, result);
		} else { // data is and array, need to iterate
			result = new Array();
			for (var i=0; i<data.length; i++) {
				result[i] = receipe;
				applyArray(data[i], receipe, result[i]);
			}
		}
		
		return result;
	}
	
	function applyArray(data, receipe, result) {
		for (var r in receipe) {
			if (typeof(receipe[r]) == "string") {
				var regexp = receipe[r].match(/\{ ?[^\{\}]+ ?\}[.a-zA-Z()]*/g);
				for (var exp in regexp) {
					result[r] = result[r].replace(regexp[exp], applyElement(data, regexp[exp]));
				}
			} else if (typeof(receipe[r]) == "object" && receipe[r].result != null) {
				receipe[r].set(data);
				result[r] = receipe[r];
			} else {
				applyArray(data, receipe[r], result[r]);
			}
		}
	}
	
	return jdata;
})();

/********************************************************************************************/
/*                                                                                          */
/*                                          NPM                                             */
/*                                                                                          */
/********************************************************************************************/

module.exports = jdata;


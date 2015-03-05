# jdata
A clean way to consume Data [http://truonghuutien.github.io/jdata/](http://truonghuutien.github.io/jdata/)

## String Extend

### jdata.apply
Simply create an dynamics String. Like printf.

    jdata.print({name:{first:"John"}}, "My Name is {name.first}.uppercase()");

## jdata.map

### Bind an Object.
If your data is an Object, like an Instance.

    var templatedObject = new jdata({
        name		: {
            first	: "John",
            last	: "Doe"
        }
    }, {
        firstname	: "{name.first}",
        lastname	: "{name.last}"
    });

### Bind an Collection of object.
If your data is an complex Array. Like a Collection of ressources.

    var dataArray = new jdata([
        {
            name	: {
                first	: "John"
            }
        }, {
            name	: {
                first	: "Peter"
            }
        },{
            name	: {
                first	: "Oliver"
            }
        }
    ], {
        firstname	: "{name.first}"
    });
    
 
# Client's side
If you need some json's template in your interface, checkout the [github repository](https://github.com/TruongHuuTien/jdata.git) to see what you can do with jQuery and Bootstrap.
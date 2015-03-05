# jdata
A clean way to consume Data [http://truonghuutien.github.io/jdata/](http://truonghuutien.github.io/jdata/)

## String Extend

### jdata.apply
Simply create an dynamics String. Like printf.

    jdata.print("My Name is {name.first}.uppercase()", {name:{first:"John"}});

## jdata.map

### Bind an Object.
If your data is an Object, like an Instance.

    var templatedObject = new jdata({
        firstname	: "{name.first}",
        lastname	: "{name.last}"
    },{
        name		: {
            first	: "John",
            last	: "Doe"
        }
    });

### Bind an Collection of object.
If your data is an complex Array. Like a Collection of ressources.

    var dataArray = new jdata({
        firstname	: "{name.first}"
    }, [
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
    ]);
    
## jdata.watch
You can notify a jdata change by placing a watcher on it:

    var watcherSample = new jdata("My Name is {name}.uppercase()", {name: "John"}, function(jd) {
        console.log('watcherSample has changed', jd.get());
    });
 
# Client's side
If you need some json's template in your interface, checkout the [github repository](https://github.com/TruongHuuTien/jdata.git) to see what you can do with jQuery and Bootstrap.
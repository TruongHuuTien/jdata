# jdata
A clean way to consume Data

## String Extend

### jdata.apply
Simply create an dynamics String. Like printf.

    jData.apply("My Name is {name.first}.uppercase()", {name:{first:"John"}})

## jdata.map

### Bind an Object.
If your data is an Object, like an Instance.

    var templatedObject = jData.map({
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

    var dataArray = jData.map({
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
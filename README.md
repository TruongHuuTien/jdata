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


# use json's template to create your interface

## Bootstrap datatable
    <html>
    <head>
        <script>
            var template = {
                column  : {
                    firstname   : {
                        value       : "{ name.first }"
                    },
                    lastname    : {
                        value       : "{ name.last }"
                    }
                }
            };
            
            $(document).ready(function() {
                $.getJSON('./collection.json', function(data){
                    jdata.datatable('#datatable', data, template);
                });
            });
        </script>
    </head>
    <body>
        <div class="container-fluid" style="margin: 40px 20px;">
            <div class="panel panel-default" style="padding: 40px 20px;">
                <table id="datatable" class="table table-hover table-striped"></table>
            </div>
        </div>
    </body>
    </html>
    
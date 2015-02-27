# jdata
A clean way to consume Data

## String Extend

### jdata.apply
Simply create an dynamics String. Like printf.

    jdata.print("My Name is {name.first}.uppercase()", {name:{first:"John"}});

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
                    jdata.datatable('#datatable', template, data);
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
    
    
# Ajax data
the data parameters can be an url. Jdata execute an $.getJSON on this url, then apply jdata template.

    jdata.ajax(template, '/instance.json');
    
 ## The magic function
 
     $('#viewer').jdata(template, 'instance.json');
     
1. Execute the request /instance.json to get data
2. apply the template
3. put data into your interface
 
    
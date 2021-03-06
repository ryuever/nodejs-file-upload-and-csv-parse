/**
 * Node.js nodejs-file-upload-and-csv-parse
 * website http://123.57.150.234:3010
 * Copyright (c) 2015 Liu Youchao
 **/
var express = require('express');
var  format = require('util').format;
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
//Directory to upload file
var uploadPath="upload";
var fs = require('fs');

var app = express();

var csv = require('fast-csv');
// all environments
app.set('port', process.env.PORT || 3010);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser({
	keepExtensions: true,
	limit: 10000000, // 10M limit
	uploadDir: __dirname +'/temp' }));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post("/shoppingcart", function (req, res) { 
    if(req.files){        
	    var filename=req.files.file.name;
	    var extensionAllowed=[".docx",".doc", ".csv"];
	    var maxSizeOfFile=1000;
	    var msg="";
	    var i = filename.lastIndexOf('.');
        
	    // get the temporary location of the file
        var tmp_path = req.files.file.path;
        
	    // set where the file should actually exists - in this case it is in the "images" directory
        var target_path = __dirname +'/upload/' + req.files.file.name;
	    
        var file_extension= (i < 0) ? '' : filename.substr(i);
	    if((contains(extensionAllowed, file_extension))&&((req.files.file.size /1024 )< maxSizeOfFile)){            
		    fs.rename(tmp_path, target_path, function(err) {
                if (err) throw err;
                // delete the temporary file, so that the explicitly set temporary upload dir does
                // not get filled with unwanted files
			    fs.unlink(tmp_path, function() {
				    if (err) throw err; 
			    });
		    });
            var tmp_record = [];
            csv
                .fromPath('upload/' + req.files.file.name)
                .on("data", function(data){
                    console.log(data);
                    tmp_record.push(data);
                })
                .on("end", function(){
                    console.log("done");
                    console.log("record in file", tmp_record);            
                    res.render("shopping-list", {record:tmp_record});            
                });
		    msg="File uploaded sucessfully";
	    }else{
	        // delete the temporary file, so that the explicitly set temporary upload dir does
            // not get filled with unwanted files
		    fs.unlink(tmp_path, function(err) {
                if (err) throw err; 
            });
		    msg="File upload failed.File extension not allowed and size must be less than "+maxSizeOfFile;
            res.send(msg);
	    }
    }else{
        var count = 0;
        var data = [];
        var item = '';
        for(var k in req.body){
            if (count%4 == 0){
                if(item){
                    data.push(item);
                }
                item = [];                
            }
            item.push(req.body[k]);
            count++;
        }
        console.log("data", data);
        res.render("shopping-list", {record:data});            
    }
});   

app.post("/shoppingcart", function (req, res) { 
    if(req.files){        
	    var filename=req.files.file.name;
        var tmp_record = [];
        csv
            .fromPath('upload/' + req.files.file.name)
            .on("data", function(data){
                console.log(data);
                tmp_record.push(data);
            })
            .on("end", function(){
                console.log("done");
                console.log("record in file", tmp_record);            
                res.render("shopping-list", {record:tmp_record});            
            });
    }else{
        var count = 0;
        var data = [];
        var item = '';
        for(var k in req.body){
            if (count%4 == 0){
                if(item){
                    data.push(item);
                }
                item = [];                
            }
            item.push(req.body[k]);
            count++;
        }
        console.log("data", data);
        res.render("shopping-list", {record:data});            
    }
});   

var contains = function(arr, item){
    for (var i =0; i < arr.length; i++){
        if (item === arr[i])
            return true;
    }
    return false;
};

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

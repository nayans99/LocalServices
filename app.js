var express=require("express"); 
var bodyParser=require("body-parser"); 

const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/wtl'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
	console.log("connection succeeded"); 
}) 

var app=express() 


app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
	extended: true
})); 

app.post('/login',function(req,res){

    var name = req.body.name;
    var pass = req.body.password;

    var data = {
        "name":name,
        "password":pass
    }

    db.collection('details').findOne(data,function(err,collection){
        if(err) throw err;
        console.log('Login Success');
        return res.redirect('/main.html');

    })

});
app.post('/sign_up', function(req,res){ 
	var name = req.body.name; 
	var email =req.body.email; 
	var pass = req.body.password; 
    var phone =req.body.phone; 
    var address = req.body.address;

	var data = { 
		"name": name, 
		"email":email, 
		"password":pass, 
        "phone":phone,
        "address":address
    } 
   // db.wtl.insertOne({'name':'Raj'});
db.collection('details').insertOne(data,function(err, collection){ 
		if (err) throw err; 
		console.log("Record inserted Successfully"); 
			
	}); 
		
	return res.redirect('/login.html'); 
}) 


app.get('/',function(req,res){ 
res.set({ 
	'Access-control-Allow-Origin': '*'
	}); 
return res.redirect('/signup.html'); 
}).listen(3009) 


console.log("server listening at port 3009"); 

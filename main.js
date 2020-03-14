var express = require("express");
var bodyParser = require("body-parser")
var session = require('express-session');
var path = require('path');


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wtl');
var db = mongoose.connection;
db.on('error',console.log.bind(console,"connection error"));
db.once('open',function(callback){
    console.log('Conection succeeded');
})

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/sign_up',function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var phone = req.body.phone;

    var data = {
        "name":name,
        "email":email,
        "password":password,
        "phone":phone
    }

    db.collection('accounts').insertOne(data,function(err,collection){
        if(err) throw err;

        console.log('Data entered Successfully');
        res.sendFile(path.join(__dirname + '/login.html'));

    })

});
    
console.log('Listening at port 3000');

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
    var password = request.body.password;

    var data = {
        "name":username,
        "password":password
    }

    db.collection('accounts').findOne(data,function(err,collection){
        if(err) throw err;
        request.session.loggedin = true;
		request.session.username = username;
        response.redirect('/home');
    })
    
});
app.get('/register',function(request,response){
    response.sendFile(path.join(__dirname + '/register.html'));
})

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
    
console.log('Listening at port 3000');
app.listen(3002);
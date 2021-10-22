// Requiring the necessary libraries
require('dotenv').config();
const session = require('express-session')
const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose');

// creating an express server
const app = express();

// Setting up the view engine and static locations
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));
app.set('view engine', 'ejs');

// Connecting to 'ADP-Project' datbase
mongoose.connect('mongodb://localhost:27017/ADP-Project', {useNewUrlParser : true, useUnifiedTopology : true});

// Creating a database schema
const userSchema = new mongoose.Schema({
    userName : {
        type: String,
        unique: true,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    // request : String,
    // d1 : {
    //     type : Date,
    //     required : true
    // },
    // d2 : {
    //     type : Date,
    //     required : true
    // },
    // BID : {
    //     type : String,
    //     required : true,
    // }
});

// Creating a collection of Users and creating user strategy for passport
const User = mongoose.model("User", userSchema);


///////////////////////////////////////////////////////////////////
/////////// All the access and redirect routes below////////////////
///////////////////////////////////////////////////////////////////

app.get('/', function(req,res){
    res.render('register');
});

app.post('/register', function(req,res){
    var name = req.body.userName;
    var pwd = req.body.password;

    const newUser = new User({
        userName : name,
        password : pwd,
        // img : Binary(req.body.file)
    });
    User.find({userName : name}, function(err,found){
        if(err){
            console.log(err);
        }
        else{
            if(found.length === 1){
                res.render('login');
            }
            else{
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("User Created");
                    }
                });
            }
        }
    });
    
})
app.post('/login', function(req,res){
    var name = req.body.userName;
    var pwd = req.body.password;
    User.find({userName : name}, function(err, found){
        if(err){
            console.log("User not found!")
        }
        else{
            console.log(found.length);
        }
    });
});


// The server will listen on port 3000
app.listen(3000, function(){
    console.log("Server running on port 3000");
})
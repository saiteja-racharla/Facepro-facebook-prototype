var mysql = require('./sql');
var sqlConnection=require('mysql');
var pass = require('password-hash-and-salt');
var myuser = [];
var http = require('http');

var mongoSessionStoreURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("../routes/mongo");
var io= require('socket.io').listen(http);
var connection = sqlConnection.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: 'system',
	  database: 'facebook'
	});
exports.checklogin = function(req,res)
{
	var username, password;
	var email = req.param("email");
	password = req.param("password");
	var user=[];
	pass(password).hash(
			function(error, hash){
				if(error){
					throw error;
				}
				user.hash = hash;
				if(user.hash){
					var query = "select * from userprofile where email ="+connection.escape(email)+"";
					console.log(query);
					mysql.getDataFromDatabase(query, function(err, results) {
						if(err){
							
						}
						else{
							if(results.length>0){
								pass(password).verifyAgainst(results[0].password, function(error, verified) {
							        if(error)
							            throw new Error('Something went wrong!');
							        console.log("verified value:"+verified);
							        if(!verified) {
										console.log("Incorrect login");
										res.send({"status":"fail" , 'msg': 'Incorrect Login'});
							        } else {
							        	req.session.email=results[0].email;
										req.session.username=results[0].firstName;
										console.log("initialized");
										console.log("email id and password found in database. Email:"+req.session.email+"Username:"+req.session.username);
										io.sockets.on('connection',function(socket){
											mongo.connect(mongoSessionStoreURL,function(){
												var coll=mongo.collection('sessions');
												coll.find({},function(err,results){
													if(err){
														console.log(err);
													}
													else{
														io.sockets.emit('usernames',results);
													}
												});
											});
										});
										res.send({"status":"success" , 'msg': 'success'});
							        }
							    });
							}
							else{
								console.log("No Such user found");
								res.send({"status":"fail" , 'msg': 'No Such User'});
							}
						}
					});
				}
			}
			
		);
};

exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};

exports.usersignup=function(req,res){
	var firstName=req.param("firstName");
	var lastName=req.param("lastName");
	var email=req.param("email");
	var confirmEmail=req.param("confirmEmail");
	var signupPassword=req.param("signupPassword");
	var gender=req.param("gender");
	var myuser = [];
	console.log(firstName+""+lastName+""+email+""+confirmEmail+""+signupPassword+""+gender);
	var selectQuery = "select * from userprofile where email ="+connection.escape(email)+"";
	mysql.getDataFromDatabase(selectQuery,function(err,results){
		if(err){
			console.log("error occured while getting details for email id");
			res.send({"status":"fail" , 'msg': 'Error'});
		}
		else{		
			if(results.length>0){
				console.log("Entered email id already exists");
				res.send({"status":"fail" , 'msg': 'Email ID Already exists.'});
			}
			else{
				pass(signupPassword).hash(
					function(error, hash) {
						if (error) {
								console.log(error);
						}
							//saving the hash
						myuser.hash = hash;
						if (myuser.hash) {
								//storing the hash in the database
							query = "insert into userprofile (firstName, lastName,email,password,gender) values (?,?,?,?,?)";
							var params = [firstName,lastName,email,myuser.hash,gender];
							console.log(query);
							mysql.insertDatatoDatabase(query, params, function(err, results) {
								if(err){
									res.send({"status":"fail" , 'msg': 'error querying data'});
								}
								else{
									if(err){
										console.log(err);
									}
									console.log(results);
									if(results){
										console.log("successfully inserted");
										req.session.email=email;
										req.session.username=firstName;
										console.log("username and email session created"+req.session.email+"  "+req.session.username);
										res.send({"status":"success" , 'msg': 'Account created successfully'});
									}else{
										res.send({"status":"fail" , 'msg': 'failed insertion'});
									}
								}
							});
						}
					});

			}
		}
	});
};
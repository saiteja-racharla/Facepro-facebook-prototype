
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , app = express()
  , http = require('http').createServer(app)
  , path = require('path')
  , validator = require('./routes/validator')
  , redirect = require('./routes/redirect')
  , io = require('socket.io').listen(http);

var users={};

var mysql = require('./routes/sql');
var mongoSessionStoreURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(expressSession({
	secret: '!Q2w#E4r%T6y&U8i(O0p',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionStoreURL
	})
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/homepage',redirect.redirectToHomepage);
app.get('/gettingStarted',redirect.gettingStarted);
app.get('/getNewsFeed',redirect.getNewsFeed);
app.get('/viewProfile',redirect.redirectToViewProfile);
app.get('/editProfile',redirect.redirectToEditProfile);
app.get('/getProfileDetails',user.getProfileDetails);
app.get('/friends',user.getFriends);
app.get('/groups',redirect.redirectToGroups);
app.get('/createGroup',redirect.redirectToCreateGroup);
app.get('/deleteGroup',redirect.redirectToDeleteGroup);
app.get('/viewGroup',redirect.redirectToViewGroup);
app.get('/groups/viewGroup',redirect.redirectToViewGroup);
app.get('/profile',redirect.redirectToUserPage);
app.get('/partials/:name', partials);

//POST
app.post('/checklogin',validator.checklogin);
app.post('/usersignup',validator.usersignup);
app.post('/logout',validator.logout);
app.post('/editProfileAftersignin',user.storeUserDetails);
app.post('/addFriend',user.addFriend);
app.post('/acceptedRequest',user.acceptedRequest);
app.post('/createGroup',user.createGroup);
app.post('/deleteGroup',user.deleteGroup);
app.post('/deleteMemberFromGroup',user.deleteMemberFromGroup);
app.post('/storePersonalData',user.storePersonalData);
app.post('/searchUser',user.searchFriend);

mysql.initialize();
mongo.connect(mongoSessionStoreURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionStoreURL);
	http.listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});

io.sockets.on('connection',function(socket){
	socket.on('send message',function(data){
		var index=data.indexOf(":");
		var name=data.substr(0,index);
		var msg=data.substr(index+1);
		io.sockets.emit('new message',{'name':name,'msg':msg});
	});
	
	socket.on('send personal message',function(data){
		var index=data.indexOf(":");
		var name=data.substr(0,index);
		var msg=data.substr(index+1);
		console.log("personal message received");
		users[name].emit('new message personal',{'name':name,'msg':msg});
	});
	
	socket.on('getUsersOnline',function(data){
		console.log("Came to retrieve users");
		socket.nickname=data;
		if(!(socket.nickname in users)){
			users[socket.nickname]=socket;
		}
		io.sockets.emit('usernames',Object.keys(users));
	});
	
	socket.on('disconnect',function(data){
		if(!socket.nickname)
			return;
		delete users[socket.nickname];
		io.sockets.emit('usernames',Object.keys(users));
	});
	
});

function partials(req, res) 
{
	var name = req.params.name;
	res.render('partials/' + name);
}
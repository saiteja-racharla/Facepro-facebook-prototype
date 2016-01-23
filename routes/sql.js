/*var mysql =  require('mysql');                  " +
"
  var pool =  mysql.createPool({
	host : “hostName”,
	user : “username”,
	password: “password”
  });	
  
  pool.getConnection(function(err, connection){
	  connection.query( “select * from table1”,  function(err, rows){
	  	if(err)	{
	  		throw err;
	  	}else{
	  		console.log( rows );
	  	}
	  });
	  
	  connection.release();
	});
  
  
  Executing Multiple Statement Queries in MySQL Node.js

For security purpose, by default, executing multiple statement queries is disabled. To use multiple statement queries, you should first enable it while creating a connection as shown below.
  var connection =  mysql.createConnection( { multipleStatements: true } );
  connection.query('select column1; select column2; select column3;', function(err, result){
	  if(err){
	  	throw err;
	  }else{
	  	console.log(result[0]);       // Column1 as a result
	  	console.log(result[1]);       // Column2 as a result
	  	console.log(result[2]);       // Column3 as a result
	  }
	});*/
//connection pooling using while
/*var ejs= require('ejs');
var mysql =  require('mysql');

var connectionPool=[];

exports.initialize=initialize;

function initialize()
{
	//Here we can initialize all the information that we need
	initializeConnectionPool();
}

function initializeConnectionPool()
{
	while(!checkIfConnectionPoolIsFull())
	{
		console.log("Connection Pool is NOT full. Proceeding with adding new connections");
		//Adding new connection instance until the pool is full
		var connection=createNewConnectionForPool();
		connection.connect();
		connectionPool.push(connection);
	}
	console.log("Connection Pool is full.");
}

function checkIfConnectionPoolIsFull()
{
	var MAX_POOL_SIZE = 2;

	//Check if the pool size
	if(connectionPool.length < 2)
	{
		return false;
	}

	return true;
}

function createNewConnectionForPool()
{
	var connection = mysql.createConnection({
		  host: 'localhost',
		  user: 'root',
		  password: 'system',
		  database: 'facebook'
		});

	return connection;
}

function getConnectionFromPool()
{
	var connection;

	//Check if there is a connection available. There are times when all the connections in the pool may be used up
	if(connectionPool.length > 0)
	{
		connection = connectionPool.shift();
		return connection;
	}
	else if(connectionPool.length==0){
		return "wait";
	}
}

function returnConnectionToPool(connection)
{
	//Adding the connection from the client back to the connection pool
	connectionPool.push(connection);
}

function insertDatatoDatabase(query,params,callback){
	query = mysql.format(query,params);
	var connectionFromPool = "wait";
	while(connectionFromPool=="wait"){
		connectionFromPool=getConnectionFromPool();
	}
	console.log(query);
	connectionFromPool.query(query, function(err, rows, fields) {
		  if (!err){
				console.log("data inserted");
				callback(err,rows);
		  }
		  else{
			  json_responses = {"statusCode" : 200};
			  return json_responses; 
		  }
		});
		returnConnectionToPool(connectionFromPool);
}

function getDataFromDatabase(query,callback){
	var connectionFromPool = getConnectionFromPool();
	
	connectionFromPool.query(query, function(err, rows, fields) {
		  if (!err){
			  console.log("data retrieved from database"+rows);
		    callback(err,rows);
		  }
		  else
		    console.log('Error while performing Query in getting data from database');
		});

		returnConnectionToPool(connectionFromPool);
}


function execQuery(query,callback){
	var connectionFromPool = getConnectionFromPool();
	console.log("query is"+query);
	connectionFromPool.query(query, function(err, rows) {
		  if (!err){
		    console.log('The query is executed');
		  }
		  else
		    console.log('Error while performing executing Query.');
		  	callback(err,rows);
		});

		returnConnectionToPool(connectionFromPool);
}
exports.insertDatatoDatabase=insertDatatoDatabase;
exports.execQuery=execQuery;
exports.getDataFromDatabase=getDataFromDatabase;/*

//without connection pooling
/*var ejs= require('ejs');
var mysql =  require('mysql');
var mysql = require('mysql');
var ejs= require('ejs');
function getConnection(){
	var connection = mysql.createConnection({
		  host: 'localhost',
		  user: 'root',
		  password: 'system',
		  database: 'facebook'
		});
		return connection;
}
function insertDatatoDatabase(query,params,callback){
	query = mysql.format(query,params);
	var connection = getConnection();
	connection.connect();
	console.log(query);
	connection.query(query, function(err, rows, fields) {
		  if (!err){
				console.log("data inserted");
				callback(err,rows);
		  }
		  else{
			  json_responses = {"statusCode" : 200};
			  return json_responses; 
		  }
		});

		connection.end();
}

function getDataFromDatabase(query,callback){
	var connection = getConnection();
	connection.connect();
	
	connection.query(query, function(err, rows, fields) {
		  if (!err){
			  console.log("data retrieved from database"+rows);
		    callback(err,rows);
		  }
		  else
		    console.log('Error while performing Query in getting data from database');
		});

		connection.end();
}


function execQuery(query,callback){
	var connection = getConnection();
	connection.connect();
	console.log("query is"+query);
	connection.query(query, function(err, rows) {
		  if (!err){
		    console.log('The query is executed');
		  }
		  else
		    console.log('Error while performing executing Query.');
		  	callback(err,rows);
		});

		connection.end();
}
exports.insertDatatoDatabase=insertDatatoDatabase;
exports.execQuery=execQuery;
exports.getDataFromDatabase=getDataFromDatabase;*/


var ejs= require('ejs');
var mysql =  require('mysql');

var CONNINFO = {
	    host: 'localhost',
	    user: 'root',
		password: 'system',
		database: 'facebook'
};
var MAX_POOL_SIZE = 100;
var Queue = function () {

	var first = 0, last = -1, q = [];

	var enqueue = function (val) {
		q[++last] = val;
	};

	var dequeue = function () {
		if (first > last){
			return undefined;}
		var res = q[first];
		delete q[first];
		first++;
		return res;
	};

	var length = function () {
		return last - first + 1;
	};

	return {
		enqueue: enqueue,
		dequeue: dequeue,
		length: length
	};

};

var Pool = (function (){
	var q = new Queue();
	var pool = [];
	var init = function (size, callback) {
		for(var i=0;i<size;i++){
			if (pool && pool.length < size) { // Add another connection
				var connection = mysql.createConnection({
					  host: 'localhost',
					  user: 'root',
					  password: 'system',
					  database: 'facebook'
				});
				console.log("connection created");
				pool.push(connection);
				console.log("size of pool"+pool.length);
			} else { 
				console.log("Pool has been filled");
				callback(null);
			}
		}
	};
	
	var get = function (callback) {
		if (pool.length > 0) {
			callback(pool.pop());
		} else {
			q.enqueue(callback);
		}
	};
	
	var done = function (conn) {
		// For purposes of experimentation, assume conn is valid
		// Would need to check for real-world use

		// Either give the connection to the next callback in q
		// or return it to the pool
		if (q.length() > 0) {
			process.nextTick(function () {
				(q.dequeue())(conn);
			});
		} else {
			pool.push(conn);
		}
	};
	
	var close = function () {
		while (pool.length > 0) {
			(pool.pop()).close();
		}
	};
	
	return {
		init: init,
		get: get,
		done: done,
		close: close
	};
})();

var initialize = function(){
	Pool.init(MAX_POOL_SIZE, function (err) {
	if (err) {
		console.error('Could not fill connection pool', err);
		return Pool.close(); // Some may succeed before failure
	}
});
};

var insertDatatoDatabase = function(query,params,callback){
	query = mysql.format(query,params);
	Pool.get(function(conn){
		console.log(query);
		conn.query(query, function(err, rows, fields) {
			  if (!err){
					console.log("data inserted");
					Pool.done(conn);
					callback(err,rows);
			  }
			  else{
				  var json_responses = {"statusCode" : 200};
				  return json_responses; 
			  }
		});
	});
};

var getDataFromDatabase=function(query,callback){
	Pool.get(function(conn){
		conn.query(query, function(err, rows, fields) {
			  if (!err){
				  console.log("data retrieved from database"+rows);
				  Pool.done(conn);
				  callback(err,rows);
			  }
			  else{
			    console.log('Error while performing Query in getting data from database');
			  }
		});
	});
};

var execQuery=function(query,callback){
	Pool.get(function(conn){
		console.log("query is"+query);
		conn.query(query, function(err, rows) {
			  if (!err){
				  Pool.done(conn);
				  console.log('The query is executed');
				  callback(err,rows);
			  }
			  else{
				    console.log('Error while performing executing Query.');
			  }
		});
	});
};
exports.insertDatatoDatabase=insertDatatoDatabase;
exports.execQuery=execQuery;
exports.getDataFromDatabase=getDataFromDatabase;
exports.initialize=initialize;

/*
 * GET users listing.
 */
var mysql = require('./sql');
var sqlConnection=require('mysql');
var connection = sqlConnection.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: 'system',
	  database: 'facebook'
	});
exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.getProfileDetails=function(req,res){
	var summary;
	var education;
	var work;
	var contact;
	var lifeevents;
	var music;
	var shows;
	var sports;
	var fullData=[];
	var selectQuery = "select * from userprofile where email ='"+req.session.email+"'";
	mysql.getDataFromDatabase(selectQuery,function(err,results){
		if(err){
			console.log("error occured while getting details for email id");
		}
		else{
			console.log("data retrieved from userprofile table"+results);
			summary = results[0].overview;
			fullData.push(summary);
			var work_query = "select * from work where emailid ='"+req.session.email+"'";
			mysql.getDataFromDatabase(work_query,function(err,results){
				if(err){
					console.log("error while getting details from work table");
				}
				else{
					work=results[0].work;
					fullData.push(work);
					var edu_query="select * from education where emailid ='"+req.session.email+"'";
					mysql.getDataFromDatabase(edu_query,function(err,results){
						if(err){
							console.log("error while getting details from education table");
						}
						else{
							console.log("data retrieved from education table");
							education=results[0].education;
							fullData.push(education);
							var contact_query="select * from contacts where emailid ='"+req.session.email+"'";
							mysql.getDataFromDatabase(contact_query,function(err,results){
								if(err){
									console.log("error while getting details from contacts table");
								}
								else{
									console.log("data retrieved from contact table");
									contact=results[0].contact;
									fullData.push(contact);
									var lifeevents_query="select * from lifeevents where emailid ='"+req.session.email+"'";
									mysql.getDataFromDatabase(lifeevents_query,function(err,results){
										if(err){
											console.log("error while getting details from lifeevents table");
										}
										else{
											console.log("data retrieved from life table");
											lifeevents=results[0].lifeevents;
											fullData.push(lifeevents);
											var interests_query="select * from interests where email='"+req.session.email+"'";
											mysql.getDataFromDatabase(interests_query, function(err, results) {
												if(err){
													console.log("error while getting details from contacts table");
												}
												else{
													music=results[0].music;
													shows=results[0].shows;
													sports=results[0].sports;
													fullData.push(music);
													fullData.push(shows);
													fullData.push(sports);
													res.send(fullData);
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

exports.storeUserDetails=function(req,res){
	if(req.session.email){
		var summary=req.param("summary");
		var work=req.param("work");
		var education=req.param("education");
		var contact=req.param("contact");
		var lifeevent=req.param("lifeevent");
		var music=req.param("music");
		var shows=req.param("shows");
		var sports=req.param("sports");
		var insert_summary_query="update userprofile set overview=? where email=?";
		var params = [summary,req.session.email];
		mysql.insertDatatoDatabase(insert_summary_query,params,function(err,results){
			if(err){
				res.send({"status":"fail" , 'msg': 'error in updating details in userprofile table'});
			}
			else{
				var insert_work_query="update work set work=? where emailid=?";
				var params = [work,req.session.email];
				mysql.insertDatatoDatabase(insert_work_query,params,function(err,results){
					if(err){
						res.send({"status":"fail" , 'msg': 'error in updating details in work table'});
					}
					else{
						var insert_education_query="update education set education=? where emailid=?";
						var params=[education,req.session.email];
						mysql.insertDatatoDatabase(insert_education_query,params,function(err,results){
							if(err){
								res.send({"status":"fail" , 'msg': 'error in updating details in education table'});
							}
							else{
								var insert_contact_query="update contacts set contact=? where emailid=?";
								var params=[contact,req.session.email];
								mysql.insertDatatoDatabase(insert_contact_query,params,function(err,results){
									if(err){
										res.send({"status":"fail" , 'msg': 'error in updating details in contact table'});
									}
									else{
										var insert_lifeevents_query="update lifeevents set lifeevents=? where emailid=?";
										var params=[lifeevent,req.session.email];
										mysql.insertDatatoDatabase(insert_lifeevents_query,params,function(err,results){
											if(err){
												res.send({"status":"fail" , 'msg': 'error in updating details in lifeevents table'});
											}
											else{
												var insert_interests_query="update interests set music=?,shows=?,sports=? where email=?";
												var params=[music,shows,sports,req.session.email];
												mysql.insertDatatoDatabase(insert_interests_query, params, function(err, results) {
													if(err){
														res.send({"status":"fail" , 'msg': 'error in updating details in lifeevents table'});
													}
													else{
														res.send({"status":"success" , 'msg': 'Data saved successfully'});
													}
												});
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
	}
	else{
		res.redirect('/');
	}
};

exports.getFriends=function(req,res){
	var friends;
	var friendsWaiting;
	var friendsRequesting;
	if(req.session.email){
		var get_friends_query="select * from friends where emailID='"+req.session.email+"' AND status='Friend'";
		mysql.getDataFromDatabase(get_friends_query,function(err,results){
			if(err){
				
			}
			else{
				friends=results;
				console.log(friends);
				var get_friends_waiting_query="select * from friends where emailID='"+req.session.email+"' AND status='Waiting'";
				mysql.getDataFromDatabase(get_friends_waiting_query,function(err,results){
					if(err){
						
					}
					else{
						friendsWaiting=results;
						console.log(friendsWaiting);
						var get_friends_requesting_query="select * from friends where emailID='"+req.session.email+"' AND status='Requesting'";
						mysql.getDataFromDatabase(get_friends_requesting_query,function(err,results){
							if(err){
									
							}
							else{
									friendsRequesting=results;
									res.render('friends',{'username':req.session.username,'friends':friends,'friendsWaiting':friendsWaiting,'friendsRequesting':friendsRequesting});
							}
						});
					}
				})
			}
		});
	}
	else{
		res.redirect('/');
	}
};

exports.addFriend=function(req,res){
	var json_responses;
	if(req.session.email){
		var friend=req.param("friend");
		if(req.session.email==friend){
			res.send({"status":"Cannot add self" , 'msg': 'Cannot add self'});
		}
		else{
			var getEmailFriend_query="select firstName,lastName,email from userprofile where email="+connection.escape(friend)+"";
			mysql.getDataFromDatabase(getEmailFriend_query,function(err,results){
				if(err){
					res.send({"status":"fail" , 'msg': 'Error in retrieving data'});
				}
				else{
					console.log(results[0]);
					if(results.length>0){
						var friendEmailID=results[0].email;
						var friendName=results[0].firstName;
						console.log("friend email ID found"+friendEmailID);
						var search_friend_query="select * from friends where emailID='"+req.session.email+"' AND friendEmailID='"+friendEmailID+"'";
						mysql.getDataFromDatabase(search_friend_query,function(err,results){
							if(err){
								res.send({"status":"fail" , 'msg': 'Error in retrieving data'});
							}
							else{
								if(results.length>0){
									var status=results[0].status;
									console.log("friend email ID found in friend table");
									if(status=="Waiting"){
										console.log("waiting");
										res.send({"status":"waiting" , 'msg': 'Request Awaiting'});
									}
									else if(status=="Friend"){
										console.log("already friends");
										res.send({"status":"FriendAlready" , 'msg': 'Friend Already'});
									}
								}
								else{
									var status="Waiting";
									console.log("new friend.waiting status");
									var friend_insert_query="insert into friends values(?,?,?,?)";
									var params=[req.session.email,friendEmailID,status,friendName];
									mysql.insertDatatoDatabase(friend_insert_query,params,function(err,results){
										if(err){
											res.send({"status":"fail" , 'msg': 'Error in retrieving data'});
										}
										else{
											var status="Requesting";
											console.log("requested friend db entry");
											var friend_insert_request_query="insert into friends values(?,?,?,?)";
											console.log(friendEmailID+" "+req.session.username+" "+status+" "+req.session.username);
											var params=[friendEmailID,req.session.email,status,req.session.username];
											mysql.insertDatatoDatabase(friend_insert_request_query,params,function(err,results){
												if(err){
													res.send({"status":"fail" , 'msg': 'Error in retrieving data'});
												}
												else{
													console.log("inserting frnd request data to friend database");
													res.send({"status":"Request Sent" , 'msg': 'Friend Already'});
												}
											});
										}
									});
								}
							}
						});
					}
					else{
						console.log("friend name doesnt exist in database");
						res.send({"status":"Email Does not Exists" , 'msg': 'Friend Already'});
					}
				}
			});
		}
	}
	else{
		res.redirect('/');
	}
};

exports.acceptedRequest=function(req,res){
	if(req.session.email){
		var name=req.param("name");
		var email=req.param("emailid");
		var set_waitingtoFriend_query="update friends set status='Friend' where emailID=? AND friendEmailID=?";
		var params=[req.session.email,email];
		mysql.insertDatatoDatabase(set_waitingtoFriend_query, params, function(err, results) {
			if(err){
				json_responses = {"statusCode" : 200};
				res.send(json_responses); 
			}
			else{
				var set_requestingtoFriend_query="update friends set status='Friend' where emailID=? AND friendEmailID=?";
				var params=[email,req.session.email];
				mysql.insertDatatoDatabase(set_requestingtoFriend_query, params, function(err, results) {
					if(err){
						json_responses = {"statusCode" : 200};
						res.send(json_responses); 
					}
					else{
						json_responses = {"statusCode" : 201};
						res.send(json_responses); 
					}
				})
			}
		})
	}
	else{
		res.redirect('/');
	}
};

exports.createGroup=function(req,res){
	if(req.session.email){
		var creategroup_query="insert into groups values";
		var members=req.param("members");
		var groupName=req.param("groupName");
		creategroup_query+="(?,'Yes',?,?),";
		var searchgroup_query="select * from groups where groupname='"+groupName+"'";
		mysql.getDataFromDatabase(searchgroup_query, function(err, results) {
			if(results.length>0){
				res.send({"status":"fail" , 'msg': 'Group already present'});
			}
			else{
				for(var i=0;i<members.length;i++){
					console.log(members[i].firstname+""+members[i].email);
					creategroup_query+="('"+groupName+"','No','"+members[i].email+"','"+members[i].firstname+"'),";
				}
				creategroup_query=creategroup_query.substring(0,creategroup_query.length-1);
				params=[groupName,req.session.email,req.session.username];
				mysql.insertDatatoDatabase(creategroup_query, params, function(err, results) {
					if(err){
						res.send({"status":"fail" , 'msg': 'Error in creating groups.Please try again later'});
					}else{
						res.send({"status":"success" , 'msg': 'Group created successfully'});
					}
				})
			}
		})
	}
	else{
		res.redirect('/');
	}
};

exports.deleteGroup=function(req,res){
	if(req.session.email){
		var group_name=req.param("groupname");
		group_delete_query="delete from groups where groupname='"+group_name+"'";
		mysql.execQuery(group_delete_query,function(err,results){
			if(err){
				console.log("error");
				return "error";
			}
			else{
				return "success";
			}
		})
	}
	else{
		res.redirect('/');
	}
};

exports.deleteMemberFromGroup=function(req,res){
	if(req.session.email){
		var groupMember = req.param("member");
		var groupName = req.param("groupName");
		var groupMember_deleteQuery="delete from groups where groupname='"+groupName+"' AND groupmembers='"+groupMember+"'";
		mysql.execQuery(groupMember_deleteQuery, function(err, results) {
			if(err){
				res.redirect('/');
			}
			else{
				var location='/viewGroup?groupName='+groupName;
				res.redirect(location);
			}
		});
	}
};

exports.storePersonalData=function(req,res){
	var summary=req.param("summary");
	var work=req.param("worktextbox1");
	var education=req.param("education");
	var contact=req.param("contact");
	var life_events=req.param("life_events");
	var music=req.param("music");
	var shows=req.param("shows");
	var sports=req.param("sports");
	var insert_summary_query="update userprofile set overview=? where email=?";
	var params = [summary,req.session.email];
	mysql.insertDatatoDatabase(insert_summary_query,params,function(err,results){
		if(err){
			res.send({"status":"fail" , 'msg': 'Error in saving data'});
		}
		else{
			var insert_work_query="insert into work (emailid,work) values(?,?)";
			var params = [req.session.email,work];
			mysql.insertDatatoDatabase(insert_work_query,params,function(err,results){
				if(err){
					res.send({"status":"fail" , 'msg': 'Error in saving data'});
				}
				else{
					var insert_education_query="insert into education (emailid,education) values(?,?)";
					var params=[req.session.email,education];
					mysql.insertDatatoDatabase(insert_education_query,params,function(err,results){
						if(err){
							res.send({"status":"fail" , 'msg': 'Error in saving data'});
						}
						else{
							var insert_contact_query="insert into contacts (emailid,contact) values(?,?)";
							var params=[req.session.email,contact];
							mysql.insertDatatoDatabase(insert_contact_query,params,function(err,results){
								if(err){
									res.send({"status":"fail" , 'msg': 'Error in saving data'});
								}
								else{
									var insert_lifeevents_query="insert into lifeevents(emailid,lifeevents) values(?,?)";
									var params=[req.session.email,life_events];
									mysql.insertDatatoDatabase(insert_lifeevents_query,params,function(err,results){
										if(err){
											res.send({"status":"fail" , 'msg': 'Error in saving data'});
										}
										else{
											var insert_interests_query="insert into interests(email,music,shows,sports) values(?,?,?,?)";
											var params=[req.session.email,music,shows,sports];
											mysql.insertDatatoDatabase(insert_interests_query, params, function(err, results) {
												if(err){
													res.send({"status":"fail" , 'msg': 'Error in saving data'});
												}
												else{
												res.send({"status":"success" , 'msg': 'Details are saved successfully'});
												}
											})
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

exports.searchFriend=function(req,res){
	if(req.session.email){
		var searchbox=req.body.search;
		var get_persons_query="select email,firstName from userprofile where firstName LIKE '"+searchbox+"%'";
		var users;
		mysql.getDataFromDatabase(get_persons_query, function(err, results) {
			if(err){
				res.render("error");
			}
			else{
				if(results.length>0){
					users=results;
					console.log(results+""+req.session.username);
					res.render("showUsers",{'users':users,'username':req.session.username});
				}
				else{
					users='';
					res.render("showUsers",{'users':users,'username':req.session.username});
				}
			}
		});
	}
	else{
		res.render("error");
	}
};
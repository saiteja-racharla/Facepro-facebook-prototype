var mysql = require('./sql');
exports.gettingStarted=function(req,res){
	console.log("username and email session created in getting started"+req.session.email+"  "+req.session.username);
	if(req.session.email){
		res.render("gettingStarted",{'username':req.session.username,'email':req.session.email});
	}
	else{
		res.redirect('/');
	}
};

exports.redirectToHomepage = function(req,res)
{
	console.log("entered redirect function");
	//Checks before redirecting whether the session is valid
	if(req.session.email)
	{
		var summary;
		var education;
		var work;
		var contact;
		var lifeevents;
		var newsFeed;
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		var selectQuery = "select * from userprofile where email ='"+req.session.email+"'";
		console.log(selectQuery);
		mysql.getDataFromDatabase(selectQuery,function(err,results){
			if(err){
				console.log("error occured while getting details for email id");
			}
			else{
				console.log("data retrieved from userprofile table"+results);
				summary = results[0].overview;
				var work_query = "select * from work where emailid ='"+req.session.email+"'";
				mysql.getDataFromDatabase(work_query,function(err,results){
					if(err){
						console.log("error while getting details from work table");
					}
					else{
						console.log("data retrieved from work table");
						for(var i=0;i<results.length;i++){
							console.log(results[i]);
						}
						work=results;
						var edu_query="select * from education where emailid ='"+req.session.email+"'";
						mysql.getDataFromDatabase(edu_query,function(err,results){
							if(err){
								console.log("error while getting details from education table");
							}
							else{
								console.log("data retrieved from education table");
								for(var i=0;i<results.length;i++){
									console.log(results[i]);
								}
								education=results;
								var contact_query="select * from contacts where emailid ='"+req.session.email+"'";
								mysql.getDataFromDatabase(contact_query,function(err,results){
									if(err){
										console.log("error while getting details from contacts table")
									}
									else{
										console.log("data retrieved from contact table");
										for(var i=0;i<results.length;i++){
											console.log(results[i]);
										}
										contact=results;
										var lifeevents_query="select * from lifeevents where emailid ='"+req.session.email+"'";
										mysql.getDataFromDatabase(lifeevents_query,function(err,results){
											if(err){
												console.log("error while getting details from lifeevents table");
											}
											else{
												console.log("data retrieved from life table");
												for(var i=0;i<results.length;i++){
													console.log(results[i]);
												}
												lifeevents=results;
												var get_groups_query="select * from groups where groupmembers='"+req.session.email+"'";
												mysql.getDataFromDatabase(get_groups_query, function(err, results) {
													if(err){
														console.log(err);
													}
													else{
														var groups=results;
														res.render("homepage",{'username':req.session.username,'summary':summary,'work':work,'education':education,'contact':contact,'lifeevents':lifeevents,'groups':groups});
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
	}
	else
	{
		res.redirect('/');
	}
};

exports.getNewsFeed=function(req,res){
	var newsfeed_query="select firstName,newsfeed from newsfeed where emailID='"+req.session.email +"' OR emailID IN (SELECT friendEmailID from friends where emailID='"+req.session.email+"' AND status='Friend') ORDER BY date DESC;";
	var newsFeed;
	console.log(newsfeed_query);
	mysql.getDataFromDatabase(newsfeed_query,function(err,results){
		if(err){
			console.log(err);
		}
		else{
			newsFeed=results;
			console.log(newsFeed);
			res.send(newsFeed);
		}
	});
};

exports.redirectToViewProfile=function(req,res){
	if(req.session.email){
		var summary;
		var education;
		var work;
		var contact;
		var lifeevents;
		var music;
		var shows;
		var sports;
		var selectQuery = "select * from userprofile where email ='"+req.session.email+"'";
		mysql.getDataFromDatabase(selectQuery,function(err,results){
			if(err){
				console.log("error occured while getting details for email id");
			}
			else{
				console.log("data retrieved from userprofile table"+results);
				summary = results[0].overview;
				var work_query = "select * from work where emailid ='"+req.session.email+"'";
				mysql.getDataFromDatabase(work_query,function(err,results){
					if(err){
						console.log("error while getting details from work table");
					}
					else{
						console.log("data retrieved from work table");
						for(var i=0;i<results.length;i++){
							console.log(results[i]);
						}
						work=results;
						var edu_query="select * from education where emailid ='"+req.session.email+"'";
						mysql.getDataFromDatabase(edu_query,function(err,results){
							if(err){
								console.log("error while getting details from education table");
							}
							else{
								console.log("data retrieved from education table");
								for(var i=0;i<results.length;i++){
									console.log(results[i]);
								}
								education=results;
								var contact_query="select * from contacts where emailid ='"+req.session.email+"'";
								mysql.getDataFromDatabase(contact_query,function(err,results){
									if(err){
										console.log("error while getting details from contacts table")
									}
									else{
										console.log("data retrieved from contact table");
										for (var i = 0; i <results.length;i++){
											console.log(results[i]);
										}
										contact=results;
										var lifeevents_query="select * from lifeevents where emailid ='"+req.session.email+"'";
										mysql.getDataFromDatabase(lifeevents_query,function(err,results){
											if(err){
												console.log("error while getting details from lifeevents table");
											}
											else{
												console.log("data retrieved from life table");
												for(var i=0;i<results.length;i++){
													console.log(results[i]);
												}
												lifeevents=results;
												var interests_query="select * from interests where email='"+req.session.email+"'";
												mysql.getDataFromDatabase(interests_query, function(err, results) {
													if(err){
														console.log("error while getting details from interests table");
													}
													else{
														music=results[0].music;
														shows=results[0].shows;
														sports=results[0].sports;
														res.render("viewProfile",{'username':req.session.username,'summary':summary,'work':work,'education':education,'contact':contact,'lifeevents':lifeevents,'music':music,'shows':shows,'sports':sports});
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

exports.redirectToEditProfile=function(req,res){
	if(req.session.email){
		res.render("editProfile",{'username':req.session.username});
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
}

exports.redirectToGroups=function(req,res){
	if(req.session.email){
		var admin;
		var member;
		var get_groupadmin_query="select * from groups where groupadmin='Yes' and groupmembers='"+req.session.email+"'";
		mysql.getDataFromDatabase(get_groupadmin_query, function(err, results) {
			if(err){
				res.render("error");
			}else{
				admin=results;
				console.log(admin);
				var get_groupmember_query="select * from groups where groupadmin='No' and groupmembers='"+req.session.email+"'";
				mysql.getDataFromDatabase(get_groupmember_query, function(err, results) {
					if(err){
						res.render("error");
					}
					else{
						member=results;
						console.log(results);
						res.render("groups",{'admin':admin,'members':member,'username':req.session.username});
					}
					
				})
			}
		})
	}
	else{
		res.redirect('/');
	}
};

exports.redirectToCreateGroup=function(req,res){
	if(req.session.email){
		var friendsList;
		get_friends_query="select firstname,friendEmailID from friends where emailID='"+req.session.email+"' and status='Friend'";
		mysql.getDataFromDatabase(get_friends_query, function(err, results) {
			if(err){
				
			}
			else{
				friendsList=results;
				console.log(friendsList);
				var get_groups_query="select * from groups where groupmembers='"+req.session.email+"'";
				mysql.getDataFromDatabase(get_groups_query, function(err, results) {
					if(err){
						
					}
					else{
						var groups=results;
						res.render("createGroup",{"friendsList":friendsList,'username':req.session.username,'groups':groups});
					}
				})
			}
		})
	}
	else{
		res.redirect('/');
	}
};

exports.redirectToDeleteGroup=function(req,res){
	if(req.session.email){
		var group_admin;
		var get_groups_admin_query="select * from groups where groupmembers='"+req.session.email+"' AND groupadmin='Yes'";
		mysql.getDataFromDatabase(get_groups_admin_query, function(err, results) {
			if(err){
				
			}
			else{
				group_admin=results;
				console.log(group_admin);
				var get_groups_query="select * from groups where groupmembers='"+req.session.email+"'";
				mysql.getDataFromDatabase(get_groups_query, function(err, results) {
					if(err){
						
					}
					else{
						res.render("deleteGroup",{'group_admin':group_admin,'username':req.session.username,'groups':results});
					}
				});
			}
		})
	}
	else{
		res.redirect('/');
	}
}

exports.redirectToViewGroup=function(req,res){
	if(req.session.email){
			var groupMembers;
			var groupName=req.param('groupName');
			var get_groupMembers_query="select * from groups where groupname='"+groupName+"'";
			mysql.getDataFromDatabase(get_groupMembers_query, function(err, results) {
				if(err){
					
				}
				else{
					if(results.length>0){
						groupMembers=results;
						console.log(groupMembers);
						var get_groups_query="select * from groups where groupmembers='"+req.session.email+"'";
						var groups;
						mysql.getDataFromDatabase(get_groups_query, function(err, results) {
							if(err){
								
							}
							else{
								groups=results;
								res.render("viewGroup",{'groupName':groupName,'groupMembers':groupMembers,'username':req.session.username,'groups':groups});
							}
						})
					}
				}
			})
	}
	else{
		res.redirect('/');
	}
};

exports.redirectToUserPage=function(req,res){
	if(req.session.email){
		console.log("entered redirect to user page");
		var user=req.param('user');
		var get_relationship_query="select status from friends where emailID='"+req.session.email+"' AND friendEmailID='"+user+"'";
		mysql.getDataFromDatabase(get_relationship_query, function(err, results) {
			if(err){
				res.redirect("error");
			}
			else{
				var status;
				if(results.length>0){
					status=results[0].status;
					res.render("user",{'status':status,'username':req.session.username,'friendEmailID':user});
				}
				else if(results.length==0){
					status='';
					res.render("user",{'status':status,'username':req.session.username,'friendEmailID':user});
				}
			}
		});
	}
	else{
		res.redirect("/");
	}
};
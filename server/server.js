Clients = new Meteor.Collection("clients");
Shifts = new Meteor.Collection("shifts");
Nurses = new Meteor.Collection("nurses");
NursesAvailability = new Meteor.Collection("nurses_availability");
ClientBookRequest = new Meteor.Collection("client_book_request");
function disableClientMongo() {
	_.each(['clients'], function(collection) {
		_.each(['insert', 'update', 'remove'], function(method) {
			Meteor.default_server.method_handlers['/' + collection + '/' + method] = function() {};
		});
	});
};
	
// code to run on server at startup
Meteor.startup(function () {
//	Accounts.loginServiceConfiguration.remove({
//		service: "facebook"
//	});
//
//	Accounts.loginServiceConfiguration.insert({
//		service: "facebook",
//		appId: '469479699768254',
//		secret: '23a7c4dd15c40f1771dc4fcb9cf3f29c'
//	});
	disableClientMongo();
	if (Clients.find().count() === 0) {
		var clients_arr = [["1","user1","user1","a","a@client.com","user1","test", "55.785634", "9.151611"], 
		["2","client1", "client1","a","b@client.com","client1","test", "56.203445", "8.580322"], 
		["3","testuser","testuser","a","c@client.com","testuser","test", "52.431511", "8.684341"], 
		["4","ratan","ratan","a","e@client.com","testuser","test", "56.490318", "8.498703"],
		["5","client2", "client2","a","e@client.com","client2","test", "57.203445", "8.580322"], 
		["6","client3", "client3","a","f@client.com","client3","test", "58.203445", "8.580322"], 
		["7","client4", "client4","a","g@client.com","client4","test", "59.203445", "8.580322"], 
		["8","client5", "client5","a","h@client.com","nurse1","test", "66.203445", "8.580322"], 
		["9","client6", "client6","a","i@client.com","client5","test", "65.203445", "8.580322"], 
		["10","client7", "client7","a","j@client.com","client7","test", "63.203445", "8.580322"], 
		["11","client8", "client8","a","k@client.com","client8","test", "56.203445", "9.580322"], 
		["12","client9", "client9","a","l@client.com","client9","test", "62.203445", "7.580322"]] 
			
		var nurses_arr = [["1","nurse1","nurse1","a","a@nurse.com","nurse1","test", "51.492592", "4.807938"], 
		["2","nurse2","nurse2","b","b@nurse.com","nurse2","test", "52.505968", "5.803818"], 
		["3","nurse3","nurse3","c","c@nurse.com","nurse3","test", "53.52519", "6.806564"], 
		["4","nurse4","nurse4","d","d@nurse.com","nurse4","test", "54.461644", "7.803818"],
		["5","nurse5","nurse5","e","e@nurse.com","nurse5","test", "55.505968", "8.809311"],
		["6","nurse6","nurse6","f","f@nurse.com","nurse6","test", "57.405547", "9.787338"],
		["7","nurse7","nurse7","e","g@nurse.com","nurse7","test", "58.505968", "8.809311"],
		["8","nurse8","nurse8","e","h@nurse.com","nurse8","test", "59.505968", "8.809311"],
		["9","nurse9","nurse9","e","i@nurse.com","nurse9","test", "60.505968", "8.809311"],
		["10","nurse10","nurse10","e","j@nurse.com","nurse10","test", "60.505968", "7.809311"],
		["11","nurse11","nurse11","e","k@nurse.com","nurse11","test", "60.505968", "6.809311"],
		["12","nurse12","nurse12","e","l@nurse.com","nurse12","test", "60.505968", "8.509311"],
		["13","nurse13","nurse13","e","m@nurse.com","nurse13","test", "60.505968", "8.109311"]];
			
		for (var i = 0; i < clients_arr.length; i++) {
			Clients.insert({
				client_id : clients_arr[i][0], 
				first_name:clients_arr[i][1],
				last_name:clients_arr[i][2],
				address:clients_arr[i][3],
				email:clients_arr[i][4],
				username: clients_arr[i][5], 
				password: clients_arr[i][6], 
				latitude : clients_arr[i][7], 
				longitude :clients_arr[i][8]
			});
			for(var j=0;j<=4;j++){
				var nDate=new Date();
				var value=nDate.setDate(nDate.getDate()+j);
				var sDate=formateDate(value);
				Shifts.insert({
				fk_client_id : clients_arr[i][0], 
					shift_date : sDate
				});
			}
		}
		for (var i = 0; i < nurses_arr.length; i++) {
			Nurses.insert({
				nurse_id : nurses_arr[i][0],
				first_name:nurses_arr[i][1],
				last_name:nurses_arr[i][2],
				address:nurses_arr[i][3],
				email:nurses_arr[i][4],
				username: nurses_arr[i][5], 
				password: nurses_arr[i][6], 
				latitude : nurses_arr[i][7], 
				longitude :nurses_arr[i][8]
			});
			for(var j=0;j<=10;j++){
				var nDate=new Date();
				var value=nDate.setDate(nDate.getDate()+j);
				var aDate=formateDate(value);
				NursesAvailability.insert({
					fk_nurse_id : nurses_arr[i][0], 
					availability_date : aDate,
					isBooked:false
				});
			}
			
			//Nurses.insert({nurse_id : nurses_arr[i][0], username: nurses_arr[i][1], password: nurses_arr[i][2], latitude : nurses_arr[i][3], longitude : parseFloat(nurses_arr[i][4]).toFixed(6)});
		}
		
		
			
	}
	function formateDate(value){
		var month=new Array();
		month[0]="January";
		month[1]="February";
		month[2]="March";
		month[3]="April";
		month[4]="May";
		month[5]="June";
		month[6]="July";
		month[7]="August";
		month[8]="September";
		month[9]="October";
		month[10]="November";
		month[11]="December";
		
		//var value=nDate.setDate(nDate.getDate()+j);
		var date = (new Date(value)).getDate();
		var year = (new Date(value)).getFullYear();
		var monthname = month[(new Date(value)).getMonth()];

		return monthname + " " + date + ", "+ year; 
	}
	
});
	
Meteor.methods({
	add_shift : function(client_id, sdate) {
		shift_id = Shifts.insert({
			fk_client_id : client_id, 
			shift_date : sdate
		});
		return shift_id; 
	},
	delete_shift_request : function (id) {
		Shifts.remove({
			_id : id
		});
	},
	register_user : function(first_name,last_name,address,email,username,password,latitude,longitude,user_type) {
		if(user_type.toString().toLowerCase() == "client"){
			var newId=0;
			var lastClient=Clients.findOne({},{
				sort: {
					client_id: -1
				}
			});
			if(lastClient != undefined)
				newId=lastClient.client_id;
			newId++;
			iid=Clients.insert({
				client_id : newId,
				first_name:first_name,
				last_name:last_name,
				address:address,
				email:email,
				username: username, 
				password: password, 
				latitude : latitude, 
				longitude :longitude
			});
			
		}else if(user_type.toString().toLowerCase() == "nurse"){
			var newId=0;
			var lastNurse=Nurses.findOne({},{
				sort: {
					nurse_id: -1
				}
			});
			if(lastNurse != undefined)
				newId=lastNurse.nurse_id;
			newId++;
			console.log(lastNurse);
			iid=Nurses.insert({
				nurse_id : newId,
				first_name:first_name,
				last_name:last_name,
				address:address,
				email:email,
				username: username, 
				password: password, 
				latitude : latitude, 
				longitude :longitude
			});

		}
		console.log(iid);
		return iid; 
	},
	add_availability : function(nurse_id, adate) {
		availability_id = NursesAvailability.insert({
			fk_nurse_id : nurse_id, 
			availability_date : adate,
			isBooked:false
		});
		return availability_id; 
	},
	delete_availability : function (id) {
		NursesAvailability.remove({
			_id : id
		});
	},
	add_client_book_request : function(nurse_av_id,client_id,amount, adate) {
		availability_id = ClientBookRequest.insert({
			fk_nurse_av_id : nurse_av_id, 
			fk_client_id : client_id,
			amount :amount,
			requested_date : adate,
			isBooked:false
		});
		return availability_id; 
	},
	update_client_book_request: function(bid_id,amount) {
		availability_id = ClientBookRequest.update({_id : bid_id},{$set:{amount:amount}});
		return availability_id; 
	},
	delete_client_book_request: function(bid_id) {
		  ClientBookRequest.remove({_id : bid_id});
		  
	}
});
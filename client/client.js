Clients = new Meteor.Collection("clients");
Shifts = new Meteor.Collection("shifts");
Nurses = new Meteor.Collection("nurses");
NursesAvailability = new Meteor.Collection("nurses_availability");
ClientBookRequest = new Meteor.Collection("client_book_request");
 
Meteor.subscribe("clients");
Meteor.subscribe("shifts");
Meteor.subscribe("nurses");
Meteor.subscribe("nurses_availability");
Meteor.subscribe("client_book_request");
	
//Template.Main.shownurse_list = false;
	
Template.login.clients = function (user, pwd,usertype,isFacebook) {
	var userQuery={
		username : user
	};
	if(!isFacebook)
		userQuery.password = pwd;
	console.log(userQuery)
	if(usertype == "client"){
		return Clients.find(userQuery);
	}
	else if (usertype == "nurse"){
		return Nurses.find(userQuery);
	}
			
};
 
Template.login.connect = function () {
	includeFbIfNot(); 
};
	
function includeFbIfNot(){
	if($.trim($("#fb-root").html())==""){
		window.fbAsyncInit=undefined
		FB=undefined;
		window.fbAsyncInit = function() {
			FB.init({
				appId      : '469479699768254', // App ID
				status     : true, // check login status
				cookie     : true, // enable cookies to allow the server to access the session
				xfbml      : true  // parse XFBML
			});
			// Additional init code here
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					SessionAmplify.set("isFacebook",true);
					if(SessionAmplify.get("needToFbLogout")==true){
						SessionAmplify.set("needToFbLogout",null)
						fbLogout();
						setTimeout("includeFbIfNot()",2000);
					}
					else getFbData();
					//chkLogin(,"",true);
					SessionAmplify.set("errorMessage", "connected");
				} else if (response.status === 'not_authorized') {
					// not_authorized
					SessionAmplify.set("errorMessage", "not authoriezed");
				}else {
					// not_logged_in
					SessionAmplify.set("errorMessage", "not logged in");
				}
			});
			FB.Event.subscribe('auth.login', function(r)
			{

				if ( r.status === 'connected' )
				{
					SessionAmplify.set("isFacebook",true);
					getFbData();
					//
					SessionAmplify.set("errorMessage", "connected");
				}
				else 
					SessionAmplify.set("errorMessage", "not authoriezed");
			}
			);
		};

		// Load the SDK Asynchronously
		(function(d){
			var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
			if (d.getElementById(id)) {
			//return;
			}
			js = d.createElement('script');
			js.id = id;
			js.async = true;
			js.src = "//connect.facebook.net/en_US/all.js";
			ref.parentNode.insertBefore(js, ref);
		}(document));
		setTimeout("includeFbIfNot()",1000);
	}else{
		return;
	}
}
Template.registerPage.connect = function () {
	// Additional JS functions here
	window.fbAsyncInit = function() {
		FB.init({
			appId      : '469479699768254', // App ID
			status     : true, // check login status
			cookie     : true, // enable cookies to allow the server to access the session
			xfbml      : true  // parse XFBML
		});
		// Additional init code here
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				SessionAmplify.set("isFacebook",true);
				//chkLogin(,"",true);
				SessionAmplify.set("errorMessage", "connected");
			} else if (response.status === 'not_authorized') {
				// not_authorized
				SessionAmplify.set("errorMessage", "not authoriezed");
			}else {
				fbLogout();
				// not_logged_in
				SessionAmplify.set("errorMessage", "not logged in");
			}
		});
		FB.Event.subscribe('auth.login', function(r)
		{
				  
			if ( r.status === 'connected' )
			{
				SessionAmplify.set("isFacebook",true);
				//
				SessionAmplify.set("errorMessage", "connected");
			}
			else {
				SessionAmplify.set("errorMessage", "not authoriezed");
			}
					
		}
		);
	};

	// Load the SDK Asynchronously
	(function(d){
		var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement('script');
		js.id = id;
		js.async = true;
		js.src = "//connect.facebook.net/en_US/all.js";
		ref.parentNode.insertBefore(js, ref);
	}(document));
		 
};
function fbLogout(){
	FB.logout(function(response) {
		console.log(response)
	});
}
function getFbData(){
	FB.api('/me', function(response) {
		SessionAmplify.set("fbUserName",response.username);
		chkLogin(response.username,"",true);
		console.log('Good to see you, ' + response.name + '.');
	});
}
function setFbData(){
	FB.api('/me', function(response) {
		$("#firstname").val(response.first_name);
		$("#lastname").val(response.last_name);
		$("#email").val(response.email);
		$("#username").val(response.username);
	});
}
function checkFBlogin(){
	FB.login(function(response) {
		if (response.authResponse) {
			setFbData();
		} else {
			console.log('User cancelled login or did not fully authorize.');
		}
	});
}
Template.login.msg = function () {
	return SessionAmplify.get("errorMessage");
};
Template.login.greeting = function () {
	return "Welcome to scheduling.";
};
Template.login.events({
	'click input' : function () {
	// template data, if any, is available in 'this'
	/*if (typeof console !== 'undefined')
			console.log("You pressed the button");*/
	},
	'change #usrNurse':function (){
		$("#password").val("test");
		$("#username").val("nurse1");
	},
	'change #usrClient':function (){
		$("#password").val("testuser");
		$("#username").val("testuser");
	},
	'click #btnLogin' : function () {
		var user = $("#username").val();
		var pwd = $("#password").val();
		chkLogin(user,pwd,false);
	},
	'click #btnRegister' : function () {
		SessionAmplify.set('currentPage', 'registerPage');
	},
	'click #btnCancel' : function () {
		SessionAmplify.set('currentPage', null);
	},
	'click #btnSignup' : function () {
		var firstname=$("#firstname").val();
		var lastname=$("#lastname").val();
		var address=$("#address").val();
		var email=$("#email").val();
		var username=$("#username").val();
		var password=$("#password").val();
		var usertype=$("input:radio[name='usertype']:checked").val()
		var latitude=$("#hdLatitude").val();
		var longitude=$("#hdLongitude").val();
		userid = Meteor.call('register_user', firstname,lastname,address,email,username,password,latitude,longitude,usertype);
		if ( userid != 'undefined' && userid != '' ) {
			Template.registerPage.succmsg('User successfully Registerd..!');
			$("input").emtpy();
		} else {
			Template.registerPage.succmsg('<span style="color:red;">Something went wrong..!</span>');
		}
		console.log(userid);
	//SessionAmplify.set('currentPage', null);
	},
	'click #btnFBData':function(){
		checkFBlogin();
	}
});

function chkLogin(user,pwd,isFacebook){
	var usertype=$("input:radio[name='usertype']:checked").val();
	var loginuser;
	loginuser = Template.login.clients(user, pwd,usertype,isFacebook);
			
	if (loginuser.count() >= 1) {
		loginuser.forEach( function (userinfo){
			if(usertype == "client"){
				SessionAmplify.set("client_id", userinfo.client_id);
			}
			else if(usertype == "nurse"){
				SessionAmplify.set("nurse_id", userinfo.nurse_id);
			}
			SessionAmplify.set("username", user);
			SessionAmplify.set("password", pwd);
			SessionAmplify.set("latitude", userinfo.latitude);
			SessionAmplify.set("longitude", userinfo.longitude);
			SessionAmplify.set("init_dashboard", true);
		});
	} else {
		alert('Invalid Username Or Password');
	}
}
Template.login.NewUser = function () {
	return (typeof SessionAmplify.get("currentPage") == "undefined" || SessionAmplify.get("currentPage") == null) ? false : true;
};
	
Template.Main.SignedIn = function () {
	return (typeof SessionAmplify.get("username") == "undefined" || typeof SessionAmplify.get("password") == "undefined" || SessionAmplify.get("username") == null || SessionAmplify.get("password") == null) ? false : true;
};
Template.Main.IsClient = function () {
	return (typeof SessionAmplify.get("client_id") == "undefined" || SessionAmplify.get("client_id") == null) ? false : true;
};
Template.Main.IsNurse = function () {
	return (typeof SessionAmplify.get("nurse_id") == "undefined"  || SessionAmplify.get("nurse_id") == null) ? false : true;
};
	
Template.clientdashboard.events({
	'click #btnLogout' : function () {
		SessionAmplify.set("nurse_id", null);
		SessionAmplify.set("client_id", null);
		SessionAmplify.set("username", null);
		SessionAmplify.set("password", null);
		SessionAmplify.set("latitude", null);
		SessionAmplify.set("longitude", null);
			
		if(SessionAmplify.get("fbUserName")!=null){
			SessionAmplify.set("needToFbLogout",true);
		}
	},
		
	'mousedown #datepicker' : function () {
		$('#datepicker').datepicker({
			format: 'mm-dd-yyyy',
			minDate: 0
		});
	},
		
	'click #btnCreateShift' : function () {
		var client_id =  SessionAmplify.get("client_id");
		var shift_date = $('#datepicker').val();
			
		if (shift_date != '') {
			shift_date = formatDate(shift_date);
			var chkshifts = Template.clientdashboard.chkshifts(client_id, shift_date);
			if (chkshifts.count() >= 1) {
				Template.clientdashboard.succmsg('<span style="color:red;">You have already made a request for same date, Please choose different date.!</span>');
			//alert('You have already made a request for same date, Please choose different date.!');
			} else {
				shiftid = Meteor.call('add_shift', client_id, shift_date);
				if (shiftid != '' || shiftid != 'undefined') {
					Template.clientdashboard.succmsg('Shift request successfully inserted..!');
				} else {
					Template.clientdashboard.succmsg('<span style="color:red;">Something went wrong..!</span>');
				}
			}
		} else {
			Template.clientdashboard.succmsg('<span style="color:red;">Please select the shift date..</span>');
		}
	},
		
	'click .req_id' : function () {
		latitude = SessionAmplify.get("latitude");
		longitude = SessionAmplify.get("longitude");
		var min = 1;
		var max = 60;
		// and the formula is:
		var random = Math.floor(Math.random() * (max - min + 1)) + min;
		Template.nurselist.nursesinmyarea(random, random, random);	
			 
	}
});
	
Template.clientdashboard.username=Template.nursedashboard.username = function () {
	return SessionAmplify.get("username");
};
	
Template.clientdashboard.succmsg = function (msg) {
	$('#succmsg').html(msg);
	setTimeout(function () {
		$('#succmsg').html("");
	}, 4000);
};
Template.nursedashboard.msg= function () {
	return SessionAmplify.get("msg");
};
Template.nursedashboard.succmsg= function () {
	setTimeout(function () {
		$('#succmsgNurse').html(Template.nursedashboard.msg());
		setTimeout(function () {
			$('#succmsgNurse').html("");
		}, 4000);
	},500);
//	alert("yes")
};
	
Template.clientdashboard.shifts = function () {
	var id = SessionAmplify.get("client_id");
	return Shifts.find({
		fk_client_id : id
	},  {
		sort: {
			shift_date: 1
		}
	});
};
	
Template.clientdashboard.chkshifts = function (id, sdate) {
	return Shifts.find({
		fk_client_id : id, 
		shift_date : sdate
	});
};
	
Template.nursedashboard.chkAvailability = function (id, sdate) {
	return NursesAvailability.find({
		fk_nurse_id : id, 
		availability_date : sdate
	});
};
Template.nurselist.getNurseDetail=function(nurse_id){
	return Nurses.findOne({
		nurse_id : nurse_id
	});
		 
}
Template.nurselist.getNurseBookRequestDetail=function(nurse_av_id){
	console.log("naID ",nurse_av_id)
	return ClientBookRequest.find({
		fk_nurse_av_id : nurse_av_id
	}).fetch();
		 
}
function getNurseDetails(){
	console.log("call");
}
var nurseDetail={};
Template.nursedashboard.events({
	'click #btnLogout' : function () {
		SessionAmplify.set("nurse_id", null);
		SessionAmplify.set("client_id", null);
		SessionAmplify.set("username", null);
		SessionAmplify.set("password", null);
		SessionAmplify.set("latitude", null);
		SessionAmplify.set("longitude", null);
		SessionAmplify.set("a_date", null);
			
	},
		
	'mousedown #datepicker' : function () {
		$('#datepicker').datepicker({
			format: 'mm-dd-yyyy',
			minDate: 0
		});
	},
		
	'click #btnCreateAvailability' : function () {
		var nurse_id =  SessionAmplify.get("nurse_id");
		var availability_date = $('#datepicker').val();
			
		if (availability_date != '') {
			availability_date = formatDate(availability_date);
			var nurse_avaialbility = Template.nursedashboard.chkAvailability(nurse_id, availability_date);
			if (nurse_avaialbility.count() >= 1) {
				SessionAmplify.set("msg",'<span style="color:red;">You have already made a availability for same date, Please choose different date.!</span>');
				Template.nursedashboard.succmsg();
			} else {
				Meteor.call('add_availability', nurse_id, availability_date,function(e,r){
					var msg="";
					if(r != undefined){
							
						msg='Availability successfully inserted..!';
					} else {
						msg='<span style="color:red;">Something went wrong..!</span>';
					}	
					SessionAmplify.set("msg",msg);
					//alert("yes");
					Template.nursedashboard.succmsg();
				});
						
			}
		} else {
			SessionAmplify.set("msg",'<span style="color:red;">Please select the Availability date..</span>');
			Template.nursedashboard.succmsg();
		//Template.nursedashboard.succmsg('<span style="color:red;">Please select the Availability date..</span>');
		}
	},
		
	'click .req_id' : function () {
		latitude = SessionAmplify.get("latitude");
		longitude = SessionAmplify.get("longitude");
		var min = 1;
		var max = 60;
		// and the formula is:
		var random = Math.floor(Math.random() * (max - min + 1)) + min;
		Template.nurselist.nursesinmyarea(random, random, random);	
	}
});
function getNursesForDate(a_date){
		
	SessionAmplify.set("a_date",a_date);
};
function getClientRequest(fk_nurse_av_id,n_date){
	SessionAmplify.set("fk_nurse_av_id",fk_nurse_av_id);
	SessionAmplify.set("nurse_date",n_date);
};
Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};
Template.clientRequestList.nDate=function(){
	return SessionAmplify.get("nurse_date");
}
Template.clientRequestList.availableRequest=function(){
	requestData=ClientBookRequest.find({
			fk_nurse_av_id:SessionAmplify.get("fk_nurse_av_id")
	}).fetch();
	for(var i=0;i<requestData.length;i++){
		var clientDetail=Template.clientRequestList.getClientDetail(requestData[i].fk_client_id);
		requestData[i].name=clientDetail.first_name+" "+clientDetail.last_name;
		requestData[i].email=clientDetail.email;
	}
	console.log(requestData)
	return requestData;
}
Template.clientRequestList.getClientDetail=function(client_id){
	return Clients.findOne({
		client_id : client_id
	});
		 
}
Template.nurselist.nDate=function(){
	return SessionAmplify.get("a_date");
}
Template.nurselist.availablenurses = function () {
		
	var nursesData=NursesAvailability.find({
		isBooked:false,
		availability_date:SessionAmplify.get("a_date")
	}).fetch();
	nursesArray=[];
	markersArray=new Array();
	var client_id=SessionAmplify.get("client_id");
	for(var i=0;i<nursesData.length;i++){
		var nurse=Template.nurselist.getNurseDetail(nursesData[i].fk_nurse_id);
		nursesData[i].email=nurse.email;
		nursesData[i].name=nurse.first_name+" "+nurse.last_name;
		nursesData[i].address=nurse.address;
		nursesData[i].latitude=nurse.latitude;
		nursesData[i].longitude=nurse.longitude;
		var nurseBookReqestData=Template.nurselist.getNurseBookRequestDetail(nursesData[i]._id);
		nursesData[i].bidCount=nurseBookReqestData.length;
		var isBookedByCurrentClient=false;
		var bidArray=[];
		nursesData[i].bidAmount="-";
		for(var j=0;j<nurseBookReqestData.length;j++){
			bidArray.push(nurseBookReqestData[j].amount);
			if(client_id == nurseBookReqestData[j].fk_client_id){
				isBookedByCurrentClient=true;
				nursesData[i].bidAmount=nurseBookReqestData[j].amount;
				nursesData[i].bidID=nurseBookReqestData[j]._id;
				//break;
			}
				
		}
		if(bidArray.length>0){
			nursesData[i].minBid=Array.min(bidArray);
			nursesData[i].maxBid=Array.max(bidArray);
		}
		nursesData[i].isBookedByCurrentClient=isBookedByCurrentClient;
		nursesArray[i]=nurse;
		
			
	}
	Template.nurselist.addToMap();
	return nursesData;
};
 
function sendBookAvailability(nID,aDate){
	$('#bidDialog').dialog('open'); 
	$("#hdNurseID").val(nID);
	$("#hdDate").val(aDate);
	//$("#hdClientID").val(SessionAmplify.get("client_id"));
	setTimeout(function(){
		$("#hdNurseAvID").val(nID);
		$("#hdDate").val(aDate);
		//$("#hdClientID").val(SessionAmplify.get("client_id"));
	},100);
}
function updateBookAvailability(bidID,bidAmount){
	$('#bidUpdateDialog').dialog('open'); 
	$("#hdBidID").val(bidID);
	$("#txtBidUpdate").val(bidAmount);
	
	//$("#hdClientID").val(SessionAmplify.get("client_id"));
	setTimeout(function(){
		$("#hdBidID").val(bidID);
		$("#txtBidUpdate").val(bidAmount);
		//$("#hdClientID").val(SessionAmplify.get("client_id"));
	},100);
}
function cancelBookAvailability(bidID){
	if (confirm('Are you sure you want to delete the request?')) {
		Meteor.call('delete_client_book_request', bidID);
	}
}
	
Template.nursedashboard.nurseAvailability = function () {
	var id = SessionAmplify.get("nurse_id");
	return NursesAvailability.find({
		fk_nurse_id : id,
		isBooked:false
	},  {
		sort: {
			availability_date: 1
		}
	});
};
	
Template.nurselist.nursesinmyarea = function (lat, lng, distanceKilometers) {
	
	var difference = 0.001;
	distanceKilometers = 0.001;
	var distance = distanceKilometers != 0 ? Math.ceil(distanceKilometers/111) : 0;
	// build filter
	var latitude_from = (parseFloat(lat) - difference - distance).toFixed(6);
	var latitude_to = (parseFloat(lat) + difference + distance).toFixed(6);
	var longitude_from = (parseFloat(lng) - difference - distance).toFixed(6);
	var longitude_to = (parseFloat(lng) + difference + distance).toFixed(6);
		
	latitude_from = latitude_from;
	latitude_to = latitude_to;
	longitude_from = longitude_from;
	longitude_to = 9.152;
		
	if(isNaN(latitude_from))
		latitude_from=0;
		 
	if(isNaN(latitude_to))
		latitude_to=180
		
			
	//console.log(latitude_from + " > " + latitude_to);
	//{latitude : {$gt : parseFloat(latitude_from).toFixed(6)}}, {latitude : {$lt : parseFloat(latitude_to).toFixed(6)}},
	//nurselist = Nurses.find({$and : [  {longitude : {$lt : longitude_to}}]});
	var min = 51;
	var max = 57;
	// and the formula is:
	var random = Math.floor(Math.random() * (max - min + 1)) + min;

	//console.log(random)
		
		
	nursesResult= Nurses.find({
		latitude:{
			$gte:random.toString()
		}
	}).fetch();
	//console.log(nursesResult.length)
	//		nursesData=nursesResult.fetch();
	//		nursesArray=new Array();
	//		markersArray=new Array();
	//		for(var i=0;i<nursesData.length;i++){
	//			nursesArray.push(nursesData[i])
	//		}
	//		Template.nurselist.addToMap();
	//		nursesResult.observe({
	//		    changed: function(piePiece) {
	//			   nurseslistGenerateHtml();
	//		    },
	//			added: function (post) {nurseslistGenerateHtml()},
	//			removed: function (post) {cnurseslistGenerateHtml()}
	//
	//		});
	//setTimeout(function(){
	//	var fragment = Template.nurselist();
	//console.log(fragment)
	//},500)

	//$("#divtemp").html(fragment)
	return nursesResult;
};
nurseslistGenerateHtml=function(){
	$tblNurseList=$("#tblNurseList");
	$tblNurseList.html('<tr><th >Name</th><th align="left" >Latitude</th><th>Longitude</th></tr>');
	for(var i=0;i<nursesData.length;i++){
		var rowHtml='<tr id="'+nursesData[i]._id+'">';
		rowHtml+='<td style="border:1px solid #ccc; width:60%;"><a href="javascript:void(0);" class="nursesMap">'+nursesData[i].first_name+' '+nursesData[i].last_name+'</a></td>';
		rowHtml+='<td style="border:1px solid #ccc; width:20%;">'+nursesData[i].latitude+'</td>';
		rowHtml+='<td style="border:1px solid #ccc; width:20%;">'+nursesData[i].longitude+'</td>';
		$tblNurseList.append(rowHtml);
	}
		
}
Template.nurselist.addToMap = function () {
	setTimeout(function(){
		if(map == undefined){
			Template.nurselist.addToMap()
			return;
		}
				
		infoWindowHtml = [];
		for(var i=0;i<nursesArray.length;i++){
			var LatLong=new google.maps.LatLng(nursesArray[i].latitude, nursesArray[i].longitude);
			var point=LatLong;
			map.setCenter(point, 13);
			var marker = new google.maps.Marker({
				position:point,
				map: map,
				infoWindowIndex :i
			});
			markersArray[i]=marker;
			var html="<div class='mapPopup'><b>Email : </b>"+nursesArray[i].email+
			"<br><b>Address :</b>"+nursesArray[i].address+
			"<br><b>UserName :</b>"+nursesArray[i].username+"</div>";
			infoWindowHtml[i]=html;
			var infowindow = new google.maps.InfoWindow({
				content: html
			});

			google.maps.event.addListener(marker, "click", function(a) {
				var index=this.infoWindowIndex;
				infowindow.setContent(infoWindowHtml[index])
				infowindow.open(map,markersArray[index]);

			});
		}
	},100)
};
function viewNurseOnMap(id){
	try{
		var index=$("#"+id).index()-1;
		google.maps.event.trigger(markersArray[index], 'click');
	}catch(e){
		console.log("e click")
		console.log(e)
	}
}
Template.nurselist.rendered =function(){
	$('#bidDialog').dialog({
		autoOpen: false,
		title:"Enter your bid amout",
		modal: true,
		buttons: {
			"Send Request": function() {
				if (isNaN($('#txtBid').val() / 1) == false) {
					Meteor.call('add_client_book_request',$("#hdNurseAvID").val(),SessionAmplify.get("client_id"), $('#txtBid').val(),$("#hdDate").val());
					$( this ).dialog( "close" );
				} else{
					alert("Please Enter Valid Bid Amount")
				}

				
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			$("#txtBid").val("")
		}
	}); 
	$('#bidUpdateDialog').dialog({
		autoOpen: false,
		title:"Update your bid amout",
		modal: true,
		buttons: {
			"Update Request": function() {
				if (isNaN($('#txtBidUpdate').val() / 1) == false) {
					Meteor.call('update_client_book_request',$("#hdBidID").val(), $('#txtBidUpdate').val());
					$( this ).dialog( "close" );
				} else{
					alert("Please Enter Valid Bid Amount")
				}

				
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			$("#txtBid").val("")
		}
	}); 	 
	 

}
	
Template.nurselist.events({
	'click .nursesMap' : function (a) {
		try{
			var index=$("#"+this._id).index()-1;
			google.maps.event.trigger(markersArray[index], 'click');
				
		}catch(e){
			console.log("e click")
			console.log(e)
		}
	}
});
Template.Main.rendered = function(){
	if (! this.initialized){
		this.initialized = true;
	}
	initialize();
	
};
	 
	 
Template.registerPage.events({
	"blur #address" : function () {
		var addr = $('#address').val();
		showAddress(addr);
	}
});
	
Template.registerPage.rendered = function () {
	//SessionAmplify.set("currentPage", "undefined");
	};
	
Template.registerPage.succmsg = function (msg) {
	$('#succmsg').html(msg);
	setTimeout(function () {
		$('#succmsg').html("");
	}, 6000);
};
	
	
Meteor.startup(function () {
		
	});
	
function initialize(){
	//map = new GMap2(document.getElementById("map_canvas"));
	//map.addControl(new GSmallZoomControl());
			
	//map.setCenter(new GLatLng(37.4419, -122.1419), 13);
	//geocoder = new GClientGeocoder();
	var mapCenter = new google.maps.LatLng(37.4419, -122.1419);
	geocoder = new google.maps.Geocoder();

	var mapOptions = {
		zoom: 13,
		center: mapCenter,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map =  new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

		
}
	
function showAddress(address) {
	geocoder.geocode( {
		'address': address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var point=results[0].geometry.location;
			map.setCenter(point, 13);
			$("#hdLatitude").val(point.y);
			$("#hdLongitude").val(point.x);
			var marker = new google.maps.Marker({
				position:point,
				map: map,
				draggable: true
			});
			var infowindow = new google.maps.InfoWindow({
				content: ""
			});
			google.maps.event.addListener(marker, "click", function(point) {
				infowindow.setContent(address +"<br>"+"Lat : "+point.latLng.Ya+"<br>Lng : "+point.latLng.Za)
				infowindow.open(map,marker);
			});
			google.maps.event.addListener(marker, "dragstart", function() {
				infowindow.close(); 
			});
			google.maps.event.addListener(marker, "dragend", function(point) {
				infowindow.setContent(address +"<br>"+"Lat : "+point.latLng.Ya+"<br>Lng : "+point.latLng.Za)
				infowindow.open(map,marker);
				$("#hdLatitude").val(point.latLng.Ya);
				$("#hdLongitude").val(point.latLng.Za);
			});
		//map.addOverlay(marker);
		// As this is user-generated content, we display it as
		// text rather than HTML to reduce XSS vulnerabilities.
		//marker.openInfoWindowHtml(address +"<br>"+"Lat : "+point.y+"<br>Lng : "+point.x);
			 
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});

		 
}
	
function deleteRequest(sid) {
	if (confirm('Are you sure you want to delete the request?')) {
		Meteor.call('delete_shift_request', sid);
	}
};
	
function deleteAvailability(aid) {
	if (confirm('Are you sure you want to delete the availability?')) {
		Meteor.call('delete_availability', aid);
	}
};
	
function shownurselist(sid) {
		
};
	
function formatDate(value) {
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
		
	var date = (new Date(value)).getDate();
	var year = (new Date(value)).getFullYear();
	var monthname = month[(new Date(value)).getMonth()];
		
	return monthname + " " + date + ", "+ year; 
};
	
SessionAmplify = _.extend({}, Session, {
	keys: _.object(_.map(amplify.store(), function(value, key) {
		return [key, JSON.stringify(value)]
	})),
	set: function (key, value) {
		Session.set.apply(this, arguments);
		amplify.store(key, value);
	}
});
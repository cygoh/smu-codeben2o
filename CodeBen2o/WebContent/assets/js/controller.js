angular.module('myApp', ['ngResource']);

function mainCtrl($scope, $resource) {
	
	$scope.remote_url = "codeben2o.elasticbeanstalk.com";
	
	$scope.User = $resource('http://:remote_url/GetUser',
			{},{'get': {method: 'JSONP', isArray: false, params:{callback: 'JSON_CALLBACK'}}});
	
	$scope.getUser = function() {
		data = {"remote_url":$scope.remote_url};
		$scope.User.get(data, function(response) {
			$scope.User = response;
			setOnlineUser(response.displayName);
		});
	};
	
	$scope.getUser();
}

function verifierCtrl($scope, $resource) {
	$scope.solution = "";
	$scope.tests = "assertEquals(\"HI\",a);";
	
    $scope.VerifierModel = $resource('http://ec2-54-251-193-188.ap-southeast-1.compute.amazonaws.com/:language',
    		{},{'get': {method: 'JSONP', isArray: false, params:{vcallback: 'JSON_CALLBACK'}}
    		});
	
	$scope.verify = function() {
		$scope.solution = myEditor.getSession().getValue();
		
		data = {"solution": "", "tests": ""};
		data.solution = $scope.solution;
		data.tests = $scope.tests;
		
		jsonrequest = btoa(JSON.stringify(data));
		$scope.status = "Verifying your code";
		
		$scope.language = "java";
		
		$scope.VerifierModel.get({'language':$scope.language,
			'jsonrequest':jsonrequest},
			function(response) {
				if(response.solved) {
					$scope.result = "Passed";
				} else {
					$scope.result = "Failed";
				}
				
				$scope.status = "Verification completed";
			});  
	};
}

//A helper function to let us set our own state.
function setUserStatus(status, myUserRef, name) {
	// Set our status in the list of online users.
	currentStatus = status;
	myUserRef.set({ name: name, status: status });
}

function setOnlineUser(name) {
	//Prompt the user for a name to use.
	currentStatus = "online";

	// Get a reference to the presence data in Firebase.
	var userListRef = new Firebase("https://codeben2o-presence.firebaseio-demo.com/");

	// Generate a reference to a new location for my user with push.
	var myUserRef = userListRef.push();

	// Get a reference to my own presence status.
	var connectedRef = new Firebase("http://codeben2o-presence.firebaseio-demo.com/.info/connected");
	connectedRef.on("value", function(isOnline) {
		if (isOnline.val()) {
			// If we lose our internet connection, we want ourselves removed from the list.
			myUserRef.onDisconnect().remove();

			// Set our initial online status.
			setUserStatus("online", myUserRef, name);
		} else {

			// We need to catch anytime we are marked as offline and then set the correct status. We
			// could be marked as offline 1) on page load or 2) when we lose our internet connection
			// temporarily.
			setUserStatus(currentStatus, myUserRef, name);
		}
	});
	
	// Update our GUI to show someone"s online status.
	userListRef.on("child_added", function(snapshot) {
		var user = snapshot.val();
		$("#presenceDiv").append($("<div/>").attr("id", snapshot.name()));
		$("#" + snapshot.name()).text(user.name + " is currently " + user.status);
	});

	// Update our GUI to remove the status of a user who has left.
	userListRef.on("child_removed", function(snapshot) {
		$("#" + snapshot.name()).remove();
	});

	// Update our GUI to change a user"s status.
	userListRef.on("child_changed", function(snapshot) {
		var user = snapshot.val();
		$("#" + snapshot.name()).text(user.name + " is currently " + user.status);
	});

	// Use idle/away/back events created by idle.js to update our status information.
	document.onIdle = function () {
		setUserStatus("idle", myUserRef, name);
	};
	document.onAway = function () {
		setUserStatus("away", myUserRef, name);
	};
	document.onBack = function (isIdle, isAway) {
		setUserStatus("online", myUserRef, name);
	};

	setIdleTimeout(20000);
	setAwayTimeout(50000);
}


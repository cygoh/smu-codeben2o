angular.module('myApp', ['ngResource']);

var userName = "";
var cssClass = "";

function mainCtrl($scope, $resource) {
	
	$scope.remote_url = "codeben2o.elasticbeanstalk.com";
	
	$scope.User = $resource('http://:remote_url/GetUser',
			{},{'get': {method: 'JSONP', isArray: false, params:{callback: 'JSON_CALLBACK'}}});
	
	$scope.getUser = function() {
		data = {"remote_url":$scope.remote_url};
		$scope.User.get(data, function(response) {
			$scope.User = response;
			userName = $scope.User.displayName;
			if($scope.User.login) {
				setOnlineUser(userName);
			} else {
				window.location = "index.html";
			}
		});
	};

	$scope.getUser();
}

function verifierCtrl($scope, $resource) {
	
	var editor = null;
	var myEditor = null;
	var friendEditor = null;
	
	// Initialize questions set
	var questions = [{"language": "java", "challenge":"Write two method Hello and World respectively to print out Hello World", "player0Task": "Write a method called Hello() that return a string \"Hello\"", 
		"player1Task": "Write a method called World that return a string \"World\"", "player0Test": "assertEquals(Hello(), \"Hello\")", "player1Test": "assertEquals(World(), \"World\")", 
		"test": "assertEquals(Hello() + \" \" + World(), \"Hello World\");"}];
	
	var sessionListRef = new Firebase("https://codeben2o-collaborate.firebaseio.com/");
	
	// Generate a new session and join as player 0
	$scope.getSession = function() {
		// Re-initialize variable and remove css classes
		$scope.result = "";
		$scope.status = "";
		$('#result').removeClass(cssClass);
		$('#compiledResult').removeClass(cssClass);
		
		var sessionRef = sessionListRef.push();
		
		$scope.session = sessionRef.name();
		
		// Get a random question from the question set
		var randNum = Math.floor(Math.random()*questions.length);
		$scope.question = questions[randNum].challenge;
		$scope.playerTask = questions[randNum].player0Task;
		$scope.language = questions[randNum].language;
		$scope.playerTest = questions[randNum].player0Test;
		
		// Render Ace Editor
		myEditor = ace.edit("my_editor");
		myEditor.setTheme("ace/theme/merbivore");
		myEditor.setReadOnly(false);
		editor = myEditor;

		friendEditor = ace.edit("friend_editor");
		friendEditor.setTheme("ace/theme/merbivore");
		friendEditor.setReadOnly(true);
		
		// Set Ace editor with the appropriate language syntax and code snippet
		myEditor.getSession().setMode("ace/mode/" + $scope.language);
		friendEditor.getSession().setMode("ace/mode/" + $scope.language);
		
		sessionRef.set({ question: $scope.question, language: $scope.language, test: questions[randNum].test });
		
		var player0Ref = new Firebase(sessionRef.toString() + "/player0");
		player0Ref.set({ user: userName, task: $scope.playerTask, solution: "" });
		
		myEditor.getSession().on("change", function(e) {
			player0Ref.update({solution: myEditor.getSession().getValue()});
		});
		
		var player1Ref = new Firebase(sessionRef.toString() + "/player1");
		player1Ref.set({ user: "", task: questions[randNum].player1Task, test: questions[randNum].player1Test, solution: "" });
		player1Ref.on("child_changed", function(snapshot) {
			if(snapshot.name() === 'solution') {
				friendEditor.getSession().setValue(snapshot.val());
			}
		});
	};
	
	// Someone join the session as player 1
	$scope.joinSession = function() {
		var sessionID = prompt("Paste your friend session id here:");
		
		sessionListRef.child(sessionID).once('value', function(data) {
			if(data.val() != null) {
				$scope.session = sessionID;
				
				var sessionRef = new Firebase(sessionListRef.toString() + "/" + sessionID);
				
				sessionRef.child('language').once('value', function(dataSnapShot) {
					$scope.$apply(function() {
						$scope.language = dataSnapShot.val();
						// Set Ace editor with the appropriate language syntax and code snippet
						myEditor.getSession().setMode("ace/mode/" + $scope.language);
						friendEditor.getSession().setMode("ace/mode/" + $scope.language);
					});
					
				});
				
				sessionRef.child('question').once('value', function(dataSnapShot) {
					$scope.$apply(function() {
						$scope.question = dataSnapShot.val();
					});
				});
				
				sessionRef.child('player1').child('task').once('value', function(dataSnapShot) {
					$scope.$apply(function() {
						$scope.playerTask = dataSnapShot.val();
					});
				});
				
				sessionRef.child('player1').child('test').once('value', function(dataSnapShot) {
					$scope.$apply(function() {
						$scope.playerTest = dataSnapShot.val();
					});
				});
				
				// Render Ace Editor
				myEditor = ace.edit("my_editor");
				myEditor.setTheme("ace/theme/merbivore");
				myEditor.setReadOnly(true);

				friendEditor = ace.edit("friend_editor");
				friendEditor.setTheme("ace/theme/merbivore");
				friendEditor.setReadOnly(false);
				editor = friendEditor;

				var player1Ref = new Firebase(sessionRef.toString() + "/player1");
				player1Ref.update({ user: userName, solution: myEditor.getSession().getValue()});
				
				var player0Ref = new Firebase(sessionRef.toString() + "/player0");
				player0Ref.on("child_changed", function(snapshot) {
					if(snapshot.name() === 'solution') {
						myEditor.getSession().setValue(snapshot.val());
					}
				});
				
				friendEditor.getSession().on("change", function(e) {
					player1Ref.update({solution: friendEditor.getSession().getValue()});
				});
			} else {
				alert("Oops, the session id provided is not valid. Please ensure you have the correct session id from your friend!");
			}
		});
	};

	// Verifier-As-a-Service hosted on EC2
    $scope.VerifierModel = $resource('http://ec2-54-251-193-188.ap-southeast-1.compute.amazonaws.com/:language',
    		{},{'get': {method: 'JSONP', isArray: false, params:{vcallback: 'JSON_CALLBACK'}}
    		});
	
    // Function to handle on click event of "Verify your Code" button
	$scope.verify = function() {
		if($scope.session != undefined) {
			$scope.solution = editor.getSession().getValue();
			
			data = {"solution": "", "tests": ""};
			data.solution = $scope.solution;
			data.tests = $scope.playerTest;
			
			jsonrequest = btoa(JSON.stringify(data));
			$scope.status = "Verifying your code";
			
			if($scope.language === "javascript") {
				$scope.language = "js";
			}
			
			$scope.VerifierModel.get({'language':$scope.language, 'jsonrequest':jsonrequest}, 
				function(response) {
					$('#result').removeClass(cssClass);
					if(response.solved) {
						$scope.result = "Test Passed";
						cssClass = "label-success";
					} else {
						$scope.result = "Test Failed";
						cssClass = "label-important";
					}
				
					$scope.status = "Verification completed";
					$('#result').addClass(cssClass);
			});
		} else {
			alert("Oops, there is nothing to verify. Please ensure you have generate or join a session!");
		}
	};
	
	$scope.verifyCompile = function() {
		if($scope.session != undefined) {
			var sessionRef = new Firebase(sessionListRef.toString() + "/" + $scope.session);
			var player0Ref = new Firebase(sessionListRef.toString() + "/" + $scope.session + "/player0");
			var player1Ref = new Firebase(sessionListRef.toString() + "/" + $scope.session + "/player1");
			
			player0Ref.child('solution').once('value', function(player0Solution) {
				player1Ref.child('solution').once('value', function(player1Solution) {
					sessionRef.child("test").once('value', function(questionTest) {
						sessionRef.child("language").once('value', function(questionLanguage) {
							$scope.$apply(function() {
								var compiledSol = player0Solution.val() + "\n" + player1Solution.val();
	
								jsonrequest = btoa(JSON.stringify({"solution": compiledSol, "tests": questionTest.val()}));
								
								var lang = questionLanguage.val();
								
								if(lang == "javascript") {
									lang = "js";
								}
								
								$scope.VerifierModel.get({'language':lang, 'jsonrequest':jsonrequest}, 
									function(response) {
										$('#compiledResult').removeClass(cssClass);
										if(response.solved) {
											$scope.compiledResult = "Compiled Test Passed";
											cssClass = "label-success";
										} else {
											$scope.compiledResult = "Compile Test Failed";
											cssClass = "label-important";
										}
										$('#compiledResult').addClass(cssClass);
								});
							});
						});
					});
				});
			});
		} else {
			alert("Opps, we found no code to compile. Ensure you are in a session with your friend!");
		}
	};
}

//A helper function to let us set our own state.
function setUserStatus(status, myUserRef, name) {
	// Set our status in the list of online users.
	currentStatus = status;
	myUserRef.set({ name: name, status: status });
}

function setOnlineUser(name) {
	currentStatus = "online";
	var childName = name.replace(/ /g,'');
	
	// Get a reference to the user presence data in Firebase.
	var userListRef = new Firebase("https://codeben2o-presence.firebaseio.com/users");
	
	var myUserRef = new Firebase("https://codeben2o-presence.firebaseio.com/users/" + childName);

	// Get a reference to my own presence status.
	var connectedRef = new Firebase("http://codeben2o-presence.firebaseio.com/.info/connected");
	connectedRef.on("value", function(isOnline) {
		if (isOnline.val()) {
			// If we lose our internet connection, we want ourselves removed from the list.
			userListRef.onDisconnect().remove();

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
		$('#presenceDiv').append($('<div/>').attr('id', snapshot.name()));
		$("#" + snapshot.name()).text(user.name + " is " + user.status);
	});

	// Update our GUI to remove the status of a user who has left.
	userListRef.on("child_removed", function(snapshot) {
		$("#" + snapshot.name()).remove();
	});

	// Update our GUI to change a user"s status.
	userListRef.on("child_changed", function(snapshot) {
		var user = snapshot.val();
		$("#" + snapshot.name()).text(user.name + " is " + user.status);
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
<!DOCTYPE html>
<html lang="en" ng-app="myApp">
  <head>
    <meta charset="utf-8">
    <title>Code Ben2o - Social Programming </title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="assets/css/main.css" rel="stylesheet">
    <link href="assets/css/bootstrap.css" rel="stylesheet">
    <link href="assets/css/ace_editor.css" rel="stylesheet">
    <link href="assets/css/bootstrap-responsive.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="../assets/js/html5shiv.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="assets/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="assets/ico/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="assets/ico/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="assets/ico/apple-touch-icon-57-precomposed.png">
    <link rel="shortcut icon" href="assets/ico/favicon.png">
    
    <!-- Angular JS -->
    <script src="assets/lib/angular/angular.js"></script>
    <script src="assets/js/jquery.js"></script>
    <script src="assets/lib/angular/angular-resource.js"></script>
    <script src="assets/lib/angular/angular-ace.js"></script>
    
    <!-- Google Analytics Tracking Code -->
    <script type="text/javascript">
	  var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-39828646-1']);
	  _gaq.push(['_trackPageview']);
	
	  (function() {
	    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	</script> 
	
	<script language="javascript" type="text/javascript">
		angular.module('myApp', ['ngResource','ace']);
		function ctrl($scope, $resource) {
			$scope.solution = "";
			$scope.tests = "assertEquals(10,a);\nassertEquals(3,c);";
			
			//For the loadbalancer version with fewer options. 
	        $scope.VerifierModel = $resource('http://ec2-54-251-193-188.ap-southeast-1.compute.amazonaws.com/:language',
	        		{},{'get': {method: 'JSONP', isArray: false, params:{vcallback: 'JSON_CALLBACK'}}
	        		});
			
			$scope.verify = function() {
				$scope.solution = your_editor.getSession().getValue();
				data = {"solution": "", "tests": ""};
				data.solution = $scope.solution;
				data.tests = $scope.tests;
				jsonrequest = btoa(JSON.stringify(data));
				$scope.status = "Verifying";
				
				$scope.language = "java";
				
				$scope.VerifierModel.get({'language':$scope.language,
					'jsonrequest':jsonrequest},
					function(response) { 
						$scope.result = response;
						$scope.status = "Ready";
					});  
			};
		}
	</script>                          
  </head>

  <body ng-controller="ctrl">
    <div class="container">
      <jsp:include page="header.html"></jsp:include>
     
      <div class="problem_statement">
      	<p>Problem statement:</p>
      	Status: {{status}}
		Result: {{result}}
      </div>
      
      <h6>My code editor</h6>
      <div id="my_editor">**insert**</div>
      <a class="btn btn-small" ng-click="verify()">Verify your code</a>
      
      <h6>Friend's code editor</h6>
      <div id="friend_editor"></div>
      
      <jsp:include page="footer.html"></jsp:include>
    </div> <!-- /container -->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="assets/js/jquery.js"></script>
    <script src="assets/js/bootstrap-transition.js"></script>
    <script src="assets/js/bootstrap-alert.js"></script>
    <script src="assets/js/bootstrap-modal.js"></script>
    <script src="assets/js/bootstrap-dropdown.js"></script>
    <script src="assets/js/bootstrap-scrollspy.js"></script>
    <script src="assets/js/bootstrap-tab.js"></script>
    <script src="assets/js/bootstrap-tooltip.js"></script>
    <script src="assets/js/bootstrap-popover.js"></script>
    <script src="assets/js/bootstrap-button.js"></script>
    <script src="assets/js/bootstrap-collapse.js"></script>
    <script src="assets/js/bootstrap-carousel.js"></script>
    <script src="assets/js/bootstrap-typeahead.js"></script>
    
    <!-- Ace Editor
    ================================================== -->
    <script src="http://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
	<script>
    	var your_editor = ace.edit("my_editor");
    	your_editor.setTheme("ace/theme/merbivore_soft");
    	your_editor.getSession().setMode("ace/mode/javascript");
    	
    	var friend_editor = ace.edit("friend_editor");
    	friend_editor.setTheme("ace/theme/merbivore_soft");
    	friend_editor.getSession().setMode("ace/mode/java");
    	friend_editor.setReadOnly(true);
	</script>
  </body>
</html>
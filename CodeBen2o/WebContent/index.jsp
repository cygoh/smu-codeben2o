<%@ taglib prefix="janrain" uri="http://janrain4j.googlecode.com/tags" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Code Ben2o - Social Programming </title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="assets/css/main.css" rel="stylesheet">
    <link href="assets/css/bootstrap.css" rel="stylesheet">
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
    
    <!-- Janrain start -->
    <script type="text/javascript">
	(function() {
	    if (typeof window.janrain !== 'object') window.janrain = {};
	    if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
	    
	    janrain.settings.tokenUrl = 'www.codeben2o.elasticbeanstalk.com/janrainServlet';
	
	    function isReady() { janrain.ready = true; };
	    if (document.addEventListener) {
	      document.addEventListener("DOMContentLoaded", isReady, false);
	    } else {
	      window.attachEvent('onload', isReady);
	    }
	
	    var e = document.createElement('script');
	    e.type = 'text/javascript';
	    e.id = 'janrainAuthWidget';
	
	    if (document.location.protocol === 'https:') {
	      e.src = 'https://rpxnow.com/js/lib/codeben2o/engage.js';
	    } else {
	      e.src = 'http://widget-cdn.rpxnow.com/js/lib/codeben2o/engage.js';
	    }
	
	    var s = document.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(e, s);
	})();
	</script>
    <!-- Janrain end -->
    
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
  </head>

  <body>
    <div class="container">
      <jsp:include page="header.html"></jsp:include>
      <!-- Jumbotron -->
      <div class="jumbotron">
        <h1>Coding. Made Social</h1>
        <p class="lead">Feeling the loneliness of coding alone? Ever dream of having a platform where you can program with your friends? 
        We offers a Pair-Based programming platform just for you. Grab your friends and join in the fun today.</p>
        <janrain:signInLink styleClass="btn btn-large btn-success">Get started today</janrain:signInLink>
      </div>
      
      <hr>
      <janrain:signInOverlay />
      
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
    
  </body>
</html>
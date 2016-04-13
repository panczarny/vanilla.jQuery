<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title></title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
	<!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
</head>
<body>
  <!--[if lt IE 7]>
  <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
  <![endif]-->
  <div class="row">
  	<div class="container">
  		<?php 

  		function renderAnchor($file) {
  			echo "<a href='$file'>$file</a>";
  		}
  		$cwd = getcwd();
  		$tab = scandir($cwd);
  		unset($tab[0]);
  		unset($tab[1]);
  		$htmls = array();
  		foreach ($tab as $key => $value) {
  			if(strpos($value, '.html') > -1) {
  				renderAnchor($value);
  			}
  		}
  		?>
  	</div>
  </div>

  <script src="http://code.jquery.com/jquery-latest.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
</body>
</html>
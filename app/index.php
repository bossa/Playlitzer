<!DOCTYPE html>
<html lang="en" ng-app="playlistme">
  <head>
    <meta charset="utf-8">
    <title>
      Playlitzer
    </title>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="/css/main.css" />
  </head>
  <body>
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">
              Toggle navigation
            </span>
            <span class="icon-bar">
            </span>
            <span class="icon-bar">
            </span>
            <span class="icon-bar">
            </span>
          </button>
          <a class="navbar-brand" href="#">play<strong>litzer</strong></a>
        </div>
        <div class="navbar-collapse collapse">
          
        <ul class="nav navbar-nav navbar-right" ng-controller="NavController">
          <li ng-hide="signedIn()"><a href="#/register">Register</a></li>
          <li ng-hide="signedIn()"><a ng-href="#/login">Login</a></li>
          <li ng-show="signedIn()"><a ng-href="#" ng-click="logout()">Logout</a></li>
        </ul>

<!--           <form class="navbar-form navbar-left">
            <input type="text" class="form-control" placeholder="Search...">
          </form> -->
        </div>
      </div>
    </div>
    
    <div class="container-fluid" ng-view>

    </div>
    
    <!-- Bootstrap core JavaScript
================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!-- Latest compiled and minified JavaScript -->
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.0/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.0/angular-resource.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.0/angular-route.min.js"></script>
    <script src='https://cdn.firebase.com/js/client/1.0.15/firebase.js'></script>
    <script src="https://cdn.firebase.com/libs/angularfire/0.8.0/angularfire.min.js"></script>
    <!-- Firebase Simple Login -->
    <script src="https://cdn.firebase.com/js/simple-login/1.6.4/firebase-simple-login.js"></script>
    <script src="/js/swfobject/swfobject.js"></script>
    <script src="/js/playlistme.js"></script>
  </body>
</html>
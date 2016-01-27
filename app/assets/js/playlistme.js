var myDataRef = new Firebase('https://playlistme.firebaseio.com/');

angular.module('playlistme', ['ngRoute', 'firebase'])
 
.value('fbURL', 'https://playlistme.firebaseio.com/')
.value('playlistsURL', 'https://playlistme.firebaseio.com/playlists/')

.factory('Songs', function($firebase, fbURL){
   return $firebase(new Firebase(fbURL)).$asArray();
 })

.factory('Playlists', function($firebase, playlistsURL){
   return $firebase(new Firebase(playlistsURL)).$asArray();
 })

.factory(
'Auth', function ($firebaseSimpleLogin, $rootScope) {
  var auth = $firebaseSimpleLogin(myDataRef);

  var Auth = {
    register: function (user) {
      return auth.$createUser(user.email, user.password);
    },
    login: function (user) {
      return auth.$login('password', user);
    },
    logout: function () {
      auth.$logout();
    },
    resolveUser: function() {
      return auth.$getCurrentUser();
    },
    signedIn: function() {
      return !!Auth.user.provider;
    },
    createProfile: function (user){
      var profile = {
        username: user.username,
        md5_hash: user.md5_hash
      };
      var profileRef = myDataRef.child('profile');
      return profileRef.set(user.uid, profile);
    },
    user: {}
  };

  $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
    console.log('logged in');
    angular.copy(user, Auth.user);
  });
  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    console.log('logged out');
    angular.copy({}, Auth.user);
  });

  return Auth;
}
)

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'ListController',
      templateUrl:'/views/playlist.html'
    })
    .when('/new', {
      controller:'ListController',
      templateUrl:'/views/new.html'
    })
    .when('/show/:listId', {
      controller:'ShowController',
      templateUrl:'/views/show.html'
    })
    .when('/register', {
      controller:'AuthController',
      templateUrl:'/views/register.html',
      resolve: {
        user: function(Auth) {
          return Auth.resolveUser();
        }
      }
    })
    .when('/login', {
      controller:'AuthController',
      templateUrl:'/views/login.html',
      resolve: {
        user: function(Auth) {
          return Auth.resolveUser();
        }
      }
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('NavController', function($scope, $location, Auth){
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;

})

.controller('AuthController', function($scope, $location, Auth, user){

  if (user) {
    $location.path('/');
  }

  $scope.login = function () {
      Auth.login($scope.user).then(function () {
        $location.path('/')
      }, function(error){
          $scope.error = error.toString();
      })
    };

  $scope.register = function () {
  Auth.register($scope.user).then(function(user) {
    return Auth.login($scope.user).then(function() {
      user.username = $scope.user.username;
      return Auth.createProfile(user);
    }).then(function() {
      $location.path('/');
    });
  }, function(error) {
    $scope.error = error.toString();
  });
  };


})

.controller('ShowController', function($scope,$location, $routeParams, $firebase, Songs, Playlists, Auth) {
  var listId = $routeParams.listId;

  //var songsRef = myDataRef.child("playlists/-JfnIHFcPElR2nTSEGkt/songs/");
  songsRef = $firebase(new Firebase('https://playlistme.firebaseio.com/playlists/'+listId+'/songs/')).$asArray();

  //console.log(Songs);
  //console.log(songsRef);

  $scope.playlists = Playlists;
  $scope.songs = songsRef;
  $scope.activeClass;

  $scope.playlist_control_button = "play";

  $scope.addSong = function() 
  {

        var input_id = $scope.youtubeId;
        var videoid = input_id.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        if(videoid != null) {
            //console.log("video id = ",videoid[1]);
            youtube_clean_id = videoid[1];


        } else { 
            //console.log("The youtube url is not valid.");
            youtube_clean_id = input_id;
        }

        console.log("youtube_clean_id", youtube_clean_id);

        // Get video info
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("GET", "https://www.googleapis.com/youtube/v3/videos?id="+youtube_clean_id+"&key=AIzaSyC1QlRTGk3ZDVUlyQmRi_BPOYCnpD1r7p8%20&part=snippet", false );
        xmlhttp.send();
        var youtubeArray = JSON.parse(xmlhttp.responseText);
        
        if(youtubeArray.pageInfo.totalResults > 0){
            new_video_title = youtubeArray.items[0].snippet.title;
            // Save on Database
            var songsRef = myDataRef.child("playlists/"+listId+"/songs");
            songsRef.push({id_video : youtube_clean_id, titulo_video : new_video_title, is_active : 0});
            //$scope.songs.push({id_video:$scope.youtubeId, titulo_video: new_video_title});
            $scope.youtubeId = '';

        }
  };

  $scope.change = function(item, index) { 
    $scope.selected = item; 
    $scope.index_selected = index; 
    player.loadVideoById(this.song.id_video);
    $scope.playlist_control_button = "pause";
  };

  $scope.pausePlay = function() { 
    
    if($scope.playlist_control_button === "play"){
      
      // play sin tema sonando
      if(player.getPlayerState() == -1){

      }else{
          player.playVideo();
          $scope.playlist_control_button = "pause";
      }
      
    }else{
      $scope.playlist_control_button = "play";
      player.pauseVideo();
    }
    
  };

   $scope.isActive = function(item) {
      return $scope.selected === item;
    };

})

.controller('ListController', function($scope,$location, $routeParams, Songs, Playlists, Auth) {

      $scope.playlists = Playlists;
      $scope.songs = Songs;
      $scope.activeClass;

      //console.log(Playlists);

      $scope.new = function(){
        var listRef = myDataRef.child("playlists");
        var user = Auth.user;

        var playlist = {
        user: user.id,
        name: $scope.playlist.name,
        url: $scope.playlist.url
        };
        
        listRef.push(playlist);
        $location.path('/');
      };

      $scope.addSong = function() 
      {
        var input_id = $scope.youtubeId;
        var videoid = input_id.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        if(videoid != null) {
            //console.log("video id = ",videoid[1]);
            youtube_clean_id = videoid[1];


        } else { 
            //console.log("The youtube url is not valid.");
            youtube_clean_id = input_id;
        }

        console.log("youtube_clean_id", youtube_clean_id);

        // Get video info
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("GET", "https://www.googleapis.com/youtube/v3/videos?id="+youtube_clean_id+"&key=AIzaSyC1QlRTGk3ZDVUlyQmRi_BPOYCnpD1r7p8%20&part=snippet", false );
        xmlhttp.send();
        var youtubeArray = JSON.parse(xmlhttp.responseText);
        
        if(youtubeArray.pageInfo.totalResults > 0){
            new_video_title = youtubeArray.items[0].snippet.title;
            // Save on Database
            var songsRef = myDataRef.child("playlists/"+listId+"/songs");
            songsRef.push({id_video : youtube_clean_id, titulo_video : new_video_title, is_active : 0});
            //$scope.songs.push({id_video:$scope.youtubeId, titulo_video: new_video_title});
            $scope.youtubeId = '';
        } 
      };

      $scope.change = function(item, index) { 
        $scope.selected = item; 
        $scope.index_selected = index; 
        ytplayer.loadVideoById(this.song.id_video);
      };

      $scope.isActive = function(item) {
        return $scope.selected === item;
      };


});

  // Funciones Eventos de cambio en el reproductor

  function onPlayerReady(event) {
      ytplayer = document.getElementById("player");
      //event.target.playVideo();
  }

  function onPlayerStateChange(event) {
     console.log(event);
   		if(event.data == 0){
          var scope = angular.element('[ng-controller=ShowController]').scope();
          var index_actual = scope.index_selected;
          var next_element = scope.songs[index_actual + 1];
          scope.$apply(function(){
            scope.selected = next_element;
            scope.index_selected = index_actual + 1;
            console.log("next video", next_element.id_video);
          });
          //console.log("next video", next_element.id_video);
          ytplayer.loadVideoById(next_element.id_video);
      }
	}

  $("#controls button").click(
  function(){
    button_play = $(this);
    if(button_play.hasClass( "play" )){
        if(ytplayer.getPlayerState() == -1){
          PlpPlayFirst();

        }else{
          ytplayer.playVideo();
        }
        button_play.removeClass('play');

    }else{
      ytplayer.pauseVideo();
      button_play.addClass('play');
    }
}
  );


// Funciones reproductor Playlist.me

function PlpPlayFirst(){
  var selected_element = $($("#songs tr")[1]);
  PlpPlayThis(selected_element);
  PlpSelectElement(selected_element);
}

function PlpPlayThis(video_id){
  console.log(video_id);
  ytplayer.loadVideoById(video_id);

  //PlpSelectElement(selected_element);
}

function PlpSelectElement(selected_element){
  $("#songs tr").attr('data-active', 'no');
  $("#controls button").removeClass('play').addClass('pause');
  selected_element.attr('data-active', 'yes');
}
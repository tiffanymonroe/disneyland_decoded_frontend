console.log('Welcome to The Happiest Place on Earth');

const app = angular.module("disney", []);

app.controller('mainController', ['$http', '$scope', function($http, $scope){

  const controller = this;
  this.url = 'http://localhost:3000'


  //user info
  this.user = {}; //holds user info
  this.users = {}; //holds all user info
  this.userPass = {};  //holds userPass info
  this.token = {}; //holds token
  this.loginModal = false; //hides login modal
  this.registerModal = false; //hides register modal
  this.loggedin = false; // tracks user's logged in status
  this.account = false; //hides account page -- may not need if using Bootstrap modals
  this.updateUser = {}; //holds updated user info -- may not need if not making full CRUD


  this.map = true; //shows park map

  this.land = {}; //holds current land


  this.allPostts = []; //holds all posts
  this.edit = true; //hides edit tab
  //////////////////////////////////////////

// Toggle between login and register modals

  this.toggleLogin = function(){
    controller.loginModal = !controller.loginModal;
    if (controller.registerModal === true){
      controller.registerModal = false;
    }
  }

  this.toggleRegister = function(){
    controller.registerModal = !controller.registerModal;
    if(controller.loginModal === true){
      controller.loginModal = false;
    }
  }


  //////////////////////////////////////////////

  //User

  //New Route
  this.createUser = function(userPass){
    $http({
      url: this.url + '/users',
      method: 'post',
      data: {user: {username: userPass.username, password: userPass.password}}
    }).then(function(res){
      console.log(res);
      controller.user = res.data.user;
      controller.login(userPass);
    })
  }

//can be any function for 'secret stuff'

//Index Route
  this.getUsers = function(){
    $http({
      url: this.url + '/users',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(res){
      console.log(res);
      console.log(res.data);
      if (res.data.status == 401){
        controller.error = "Cast Members Only";
      } else {
        controller.users = res.data;
      }
    }.bind(this));
  }


  //Show Route
  this.getUser = function(){
    $http({
      url: this.url + '/users/' + this.user.id,
      method: 'get'
    }).then(function(res){
      console.log('get user: ', res);
    })
  }

  //Update Route
  this.updateUser = function(username, password){
    $http({
      method: 'patch',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      },
      url: this.url + '/users/' + this.user.id,
      data: {user: {username: username, password: password}}
    }).then(function(res){
      console.log(res);
      console.log(res.data);
      this.user = res.data;
    }.bind(this));
  }

  //Delete Route
  this.deleteUser = function(userPass){
    $http({
      method: 'delete',
      url: this.url + '/users/' + this.user.id
    }).then(function(res){
      this.logout();
    }.bind(this));
  }


  ///////////////////////////////////////////

  //  User Authentication  //
  this.login = function(userPass){
    console.log(userPass);
    this.userPass = userPass;
    $http({
      method: 'post',
      url: this.url + '/users/login',
      data: {user: {username: userPass.username, password: userPass.password}},
    }).then(function(res){
      this.user = res.data.user;
      localStorage.setItem('token', JSON.stringify(res.data.token));
      if (this.user === undefined){
        this.loggedin = false;
      } else {
        this.loggedin = true;
      }
      console.log('The user is: ', this.user);
      console.log('user logged in? ', this.loggedin);
    }.bind(this));
  }

  this.logout = function(){
    localStorage.clear('token');
    location.reload();
  }


  ////////////////////////////////////////////////


  // Park Data

  this.getLands = function(){
    $http({
      url: this.url + '/lands',
      method: 'get'
    }).then(function(res){
      console.log('==================================');
      console.log(res);
      console.log('this is res.data', res.data);
      controller.lands = res.data;

    })
  }

  this.getLand = function(id){
    $http({
      url: this.url + "/lands/" + id,
      method: 'get'
    }).then(function(res){
      console.log(res.data);
    })
  }

  this.getAttractions = function(id){
    $http({
      url: this.url + "/lands/" + id,
      method: 'get'
    }).then(function(res){
      console.log(res);
      controller.attractions = res.data.attractions;

      console.log('attractions = ', controller.attractions);
    })
  }


  this.getDining = function(id){
    $http({
      url: this.url + "/lands/" + id,
      method: 'get'
    }).then(function(res){
      console.log(res.data);
      controller.dining = res.data.dinings;
    })
  }

  this.toggleAccount = function(){
    controller.account = !controller.account;
    controller.map = !controller.map;
  }



  this.getLands(); //function to run on page load




  //////////////////////////////////////////

  // Posts

 // New Route
  this.createPost = function(){
    $http({
      url: this.url + "/users/" + this.user.id + "/posts",
      method: 'post',
      data: { post: { title: this.post.title, content: this.post.content, land_id: this.post.land_id}}
    }).then(function(res){
      console.log('create post: ', res);
      controller.post = res.data;
    })
  }


  // Index Route
  this.getAllPosts = function(){
    $http({
      url: this.url + "/posts",
      method: 'get'
    }).then(function(res){
      console.log('get all posts: ', res);
      controller.allPosts = res.data;
    })
  }

 this.getPosts = function(){
   $http({
     url: this.url + "/users/" + this.user.id + "/posts",
     method: 'get'
   }).then(function(res){
     console.log('get posts', res);
     controller.posts = res.data;
   })
 }

 //Show Route

 this.getPost = function(id){
   $http({
     url: this.url + "/users/" + this.user.id + "/posts/" + id,
     method: 'get'
   }).then(function(res){
     console.log('get post: ', res);
     controller.post = res.data;
   })
 }

  // Edit Route
  this.editPost = function(title, content, id){
    $http({
      method: 'put',
      url: this.url + '/users/' + this.user.id + '/posts/' + id,
      data: { post: { title: title, content: content, id: id} }
    }).then(function(res){
      console.log(res);
      controller.editPost = res.data;

    }.bind(this));
  }

  // Delete Route
  this.deletePost = function(id){
    $http({
      method: 'delete',
      url: this.url + '/users/' + this.user.id + '/posts/' + id
    }).then(function(res){
      console.log(res);
    })
    this.getPosts();
  }

}]); //end of mainController

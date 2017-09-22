console.log('Welcome to The Happiest Place on Earth');

const app = angular.module("disney", []);

app.controller('mainController', ['$http', function($http){

  const controller = this;
  this.url = 'http://localhost:3000' || 'http://disneyland-decoded-api.herokuapp.com';


  //user info
  this.user = {};
  this.users = {};
  this.userPass = {};
  this.token = {};
  this.loginModal = false;
  this.registerModal = false;
  this.loggedin = false;
  this.account = false;
  this.updateUser = {};

  this.map = true;

  this.land = {};



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

  //New Route
  this.createUser = function(userPass){
    $http({
      url: this.url + '/users',
      method: 'post',
      data: {user: {username: userPass.username, password: userPass.password}}
    }).then(function(res){
      console.log(res);
      controller.user = res.data.user;
    })
  }

  //  User Authentication  //
  this.login = function(userPass){
    console.log(userPass);
    this.userPass = userPass;
    $http({
      method: 'post',
      url: this.url + '/users/login',
      data: {user: {username: userPass.username, password: userPass.password}},
    }).then(function(res){
      controller.user = res.data.user;
      controller.loggedin = true;
      localStorage.setItem('token', JSON.stringify(res.data.token));
    }.bind(this));
  }

//can be any funciton for 'secret stuff'

//Show Route
  this.getUsers = function(){
    $http({
      url: this.url + '/users',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(res){
      console.log(res);
      if (res.data.status == 401){
        controller.error = "Cast Members Only";
      } else {
        controller.users = res.data;
      }
    }.bind(this));
  }

  this.logout = function(){
    localStorage.clear('token');
    location.reload();
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


  ////////////////////////////////////////////////

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


  //functions to run on page load
  this.getLands();
  // this.getLand();
  // this.getAttractions();
  // this.getDining();



}]); //end of mainController

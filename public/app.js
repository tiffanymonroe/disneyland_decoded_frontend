console.log('Welcome to The Happiest Place on Earth');

const app = angular.module("disney", []);

app.controller('mainController', ['$http', function($http){

  const controller = this;
  this.url = 'http://localhost:3000' || 'http://disneyland-decoded-api.herokuapp.com/';


  //user info
  this.user = {};
  this.users = {};
  this.userPass = {};
  this.token = {};
  this.loginModal = false;
  this.registerModal = false;
  this.loggedin = false;
  this.account = false;

  this.map = true;


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




  ////////////////////////////////////////////////

  this.getLands = function(){
    $http({
      url: this.url + '/lands',
      method: 'get'
    }).then(function(res){
      console.log(res);
      controller.lands = res.data;

    })
  }


  this.getAttractions = function(){
    $http({
      url: this.url + '/attractions',
      method: 'get'
    }).then(function(res){
      console.log(res);
      controller.attractions = res.data
    })
  }


  this.getDining = function(){
    $http({
      url: this.url + '/dinings',
      method: 'get'
    }).then(function(res){
      console.log(res);
      controller.dining = res.data;
    })
  }

  this.toggleAccount = function(){
    controller.account = !controller.account;

    controller.map = !controller.map;

  }


  //functions to run on page load
  this.getLands();
  this.getAttractions();
  this.getDining();



}]); //end of mainController

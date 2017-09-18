console.log('Welcome to The Happiest Place on Earth');

const app = angular.module("disney", []);

app.controller('mainController', ['$http', function($http){

  const controller = this;
  this.url = 'http://localhost:3000';
  this.user = {};


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
      localStorage.setItem('token', JSON.stringify(res.data.token));
    }.bind(this));
  }

//can be any funciton for 'secret stuff'
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
  this.getLands();

  this.getAttractions = function(){
    $http({
      url: this.url + '/attractions',
      method: 'get'
    }).then(function(res){
      console.log(res);
      controller.attractions = res.data;
    })
  }
  this.getAttractions();

  this.getDining = function(){
    $http({
      url: this.url + '/dinings',
      method: 'get'
    }).then(function(res){
      console.log(res);
      controller.dining = res.data;
    })
  }
  this.getDining();
}]); //end of mainController

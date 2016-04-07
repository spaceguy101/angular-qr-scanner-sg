angular-qr-scanner-sp
==================
Clone Of (angular-qr-scanner)[https://github.com/sembrestels/angular-qr-scanner]
 
### Bugs Fixed : 
* Cross Compatibility - Works On most Browsers
* Camera Lag
* Video element memory leak issue on chrome 

### Usage

```html
<qr-scanner ng-success="onSuccess(data)" width="400" height="300"></qr>
```

### Install this with bower 

```sh
$ bower install angular-qr-scanner-sg
```

### Example

```html
<html ng-app="App">
<body ng-controller="qrCrtl">
<qr-scanner width="400" height="300" ng-success="onSuccess(data)" ng-error="onError(error)" />

<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular.js"></script>
<script src="bower_components/angular-qr-scanner-sp/qr-scanner.js"></script>
<script src="bower_components/angular-qr-scanner-sp/src/jsqrcode-combined.min.js"></script>
<script>

var App = angular.module('App', ['qrScanner']);

App.controller('qrCrtl', ['$scope', function($scope) {
    $scope.onSuccess = function(data) {
        console.log(data);
    };
    $scope.onError = function(error) {
        console.log(error);
    };
    $scope.onVideoError = function(error) {
        console.log(error);
    };
}]);

</script>
</body>
</html>
```

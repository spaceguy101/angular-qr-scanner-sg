(function() {
  'use strict';

  angular.module('qrScanner', ["ng"]).directive('qrScanner', ['$timeout','$interval', '$window', function($timeout,$interval, $window) {
    return {
      restrict: 'E',
      scope: {
        ngSuccess: '&ngSuccess',
        ngError: '&ngError',
        ngVideoError: '&ngVideoError'
      },
      link: function(scope, element, attrs) {

        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        

        var height = attrs.height || 300;
        var width = attrs.width || 250;

        var video = $window.document.createElement('video');

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        video.setAttribute('autoplay', '');
      //  video.setAttribute('style', '-moz-transform:rotateY(-180deg);-webkit-transform:rotateY(-180deg);transform:rotateY(-180deg);');
        var canvas = $window.document.createElement('canvas');
        canvas.setAttribute('id', 'qr-canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        canvas.setAttribute('style', 'display:none;');


        angular.element(element).append(video);
        angular.element(element).append(canvas);

        var context = canvas.getContext('2d');
        var stopScan;

        var scan = function() {
          if ($window.localMediaStream) {
            context.drawImage(video, 0, 0, 307,250);
            try {
              qrcode.decode();
            } catch(e) {
              scope.ngError({error: e});
            }
          }
           stopScan = $timeout(scan);
        }

        var successCallback = function(stream) {
          $window.localMediaStream = stream;
          $window.stream = stream;
          scope.video = video;
          video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        //  video.src = window.URL.createObjectURL(stream);
          video.play();
          //stopScan = $interval(scan, 10);
          scan();
        }


        var errorCallback = function(error) {
          scope.ngVideoError({error: error});
        }

        function startVideo(videoSource) {
          if (window.stream) {
            video.src = null;
            //window.stream.stop();
            window.stream.getTracks().forEach(function(track){
              track.stop();
            });
          }

          if(videoSource){
            var constraints = {
              video: {
                optional: [{
                  sourceId: videoSource
                }]
              }
            };
          }else{
            var constraints = {
              video:true
            };
          }

          navigator.getUserMedia(constraints, successCallback, errorCallback);
        }

         if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
            startVideo();
          else {
            MediaStreamTrack.getSources(function (sources) {
              var found_env_cam = false;
              for (var i = 0; i < sources.length; i++) {
                if (sources[i].kind == "video" && sources[i].facing == "environment") {
                  var sourceId = sources[i].id;
                  startVideo(sourceId);
                  
                  found_env_cam = true;
                }
              }

              // If no specific environment camera is found (non-smartphone), user chooses
              if (!found_env_cam) startVideo();
            });
          }

        qrcode.callback = function(data) {
          scope.ngSuccess({data: data});
        };


        element.bind('$destroy', function() {

             $timeout.cancel(stopScan);
            
            if ($window.localMediaStream.stop) {
              $window.localMediaStream.stop();
            } else if($window.localMediaStream.getVideoTracks) {
              var videoTracks = $window.localMediaStream.getVideoTracks();
              for(var i = 0 , len = videoTracks.length ; i<len ;i++ ){
                videoTracks[i].stop();
              }
            }
        video.remove();
        canvas.remove();

        });
      }
    }
  }]);
})();
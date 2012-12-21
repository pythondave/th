/*
  services:
    tipService - service for the tip
*/

angular.module('tpp').
  service('tipService', function (userService, $timeout) {
    var tipService = {};
    tipService.tip = {};
    
    tipService.reset = function() {
      tipService.resetTime = new Date().getTime(); //capture time so tips in the middle of a timeout can be cancelled
    };
    
    tipService.setTip = function(tip, options) {
      //blank the tip, transition to the alternate state and wait
      if (tip === tipService.tip.val) return; //tip not changing, so we're done
      options = options || {};
      if (options.instant) { tipService.tip.val = tip; return; }; //instant change, so we're done
      tipService.tip.val = '';
      if (!tip || tip === '') return; //no tip, so we're done
      tipService.tip.transitionClasses = 'border-style-solid border-color-black-0 ease-in-out-200 tip-alternate-state';
      $timeout(function() { tipService.setTipStep2(tip); }, 200*1.1);
    };
    
    tipService.setTipStep2 = function(tip) {
      //transition back to the main state and wait
      tipService.tip.transitionClasses = 'border-style-solid border-color-black-10 ease-in-out-500 tip-main-state';
      $timeout(function() {
        var setBeforeResetTime = ((new Date().getTime()) - tipService.resetTime < 900);
        if (!setBeforeResetTime) { tipService.tip.val = tip; } //set tip if not cancelled
      }, 500);
    };
    
    tipService.clearTip = function() { tipService.setTip('', {instant:true}); };
    
    return tipService;
  });
  
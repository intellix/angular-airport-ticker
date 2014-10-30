(function() {
    'use strict';

    angular.module('airportTicker', [])

        .directive('airportTicker', ['$window', '$timeout', function ($window, $timeout) {
            return {
                restrict: 'EA',
                scope: {
                    endDate: '@',
                    onTick: '&',
                    onFinish: '&'
                },
                templateUrl: 'template/airport-ticker/airport-ticker.tpl.html',
                link: function (scope, element, attrs)
                {
                    var nowDate = $window.moment();
                    var targetDate;
                    var tickTimeoutId, flipTimeoutId; 

                    function updateTime()
                    {
                        // Get 2x pieces for each unit of current time
                        nowDate = $window.moment();
                        var durationNow = $window.moment.duration(targetDate.diff());
                        var units = {
                            days:    durationNow.days() < 0 ? [0, 0] : ('0' + durationNow.days()).slice(-2).split(''),
                            hours:   durationNow.hours() < 0 ? [0, 0] : ('0' + durationNow.hours()).slice(-2).split(''),
                            minutes: durationNow.minutes() < 0 ? [0, 0] : ('0' + durationNow.minutes()).slice(-2).split(''),
                            seconds: durationNow.seconds() < 0 ? [0, 0] : ('0' + durationNow.seconds()).slice(-2).split('')
                        };

                        angular.forEach(units, function(unit, unitKey) {
                            angular.forEach(unit, function(unitPiece, pieceKey) {

                                var digit = scope.units[unitKey].digits[pieceKey];
                                var values = digit.values;

                                // Only add if necessary
                                if (values.length < 1 || unitPiece !== values[0]) {
                                    values.push(unitPiece);
                                }

                                // We only ever need 2
                                if (values.length > 2 || unitPiece !== values[0]) {
                                    digit.flipping = true;
                                    // After flipping, remove last number
                                    flipTimeoutId = $timeout(function() {
                                        digit.flipping = false;
                                        values.shift();
                                    }, 1000);
                                }

                            });
                        });
                    }

                    var tick = function()
                    {
                        updateTime();

                        if (nowDate.isBefore(targetDate)) {

                            if (scope.onTick) {
                                scope.onTick();
                            }

                            tickTimeoutId = $timeout(function () {
                                tick();
                            }, 1 * 1000);

                        } else {

                            if (scope.onFinish) {
                                scope.onFinish();
                            }

                        }
                    };

                    function setup()
                    {
                        scope.units = {
                            days: {
                                label: 'Days',
                                digits: [{
                                    flipping: false,
                                    values: []
                                }, {
                                    flipping: false,
                                    values: []
                                }]
                            },
                            hours: {
                                label: 'Hours', 
                                digits: [{
                                    flipping: false,
                                    values: []
                                }, {
                                    flipping: false,
                                    values: []
                                }]
                            },
                            minutes: {
                                label: 'Minutes',
                                digits: [{
                                    flipping: false,
                                    values: []
                                }, {
                                    flipping: false,
                                    values: []
                                }]
                            },
                            seconds: {
                                label: 'Seconds',
                                digits: [{
                                    flipping: false,
                                    values: []
                                }, {
                                    flipping: false,
                                    values: []
                                }]
                            }
                        };

                        // Clear any previous timeouts
                        $timeout.cancel(tickTimeoutId);
                        $timeout.cancel(flipTimeoutId);

                        tick();
                    }

                    attrs.$observe('endDate', function () {
                        targetDate = $window.moment(scope.$eval(attrs.endDate));
                        setup();
                    });

                }
            };
        }]);

}());

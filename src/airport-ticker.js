(function() {
    'use strict';

    angular.module('airportTicker', [])

        .directive('airportTicker', function ($window, $timeout) {
            return {
                restrict: 'EA',
                scope: {
                    format: '@',
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
                    var format = scope.format || 'dmhs';

                    function updateTime()
                    {
                        // Get 2x pieces for each unit of current time
                        nowDate = $window.moment();
                        var durationNow = $window.moment.duration(targetDate.diff());

                        var units = {};

                        if (angular.isDefined(scope.units.days)) {
                            units.days = durationNow.days() < 0 ? [0, 0] : ('0' + durationNow.days()).slice(-2).split('');
                        }
                        if (angular.isDefined(scope.units.hours)) {
                            units.hours = durationNow.hours() < 0 ? [0, 0] : ('0' + durationNow.hours()).slice(-2).split('');
                        }
                        if (angular.isDefined(scope.units.minutes)) {
                            units.minutes = durationNow.minutes() < 0 ? [0, 0] : ('0' + durationNow.minutes()).slice(-2).split('');
                        }
                        if (angular.isDefined(scope.units.seconds)) {
                            units.seconds = durationNow.seconds() < 0 ? [0, 0] : ('0' + durationNow.seconds()).slice(-2).split('');
                        }

                        angular.forEach(units, function(unit, unitKey) {
                            angular.forEach(unit, function(unitPiece, pieceKey) {

                                var digit = scope.units[unitKey].digits[pieceKey];
                                var values = digit.values;

                                // Only add if necessary
                                if (values.length < 1 || unitPiece !== values[0]) {
                                    values.push(unitPiece);
                                }

                                // We only ever need 2
                                if (values.length > 1 || unitPiece !== values[0]) {
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
                        var unit = {
                            label: '',
                            digits: [{
                                flipping: false,
                                values: []
                            }, {
                                flipping: false,
                                values: []
                            }]
                        };
                        scope.units = {};

                        if (format.indexOf('d') !== -1) {
                            scope.units.days = angular.copy(unit);
                            scope.units.days.label = 'Days';
                        }
                        if (format.indexOf('h') !== -1) {
                            scope.units.hours = angular.copy(unit);
                            scope.units.hours.label = 'Hours';
                        }
                        if (format.indexOf('m') !== -1) {
                            scope.units.minutes = angular.copy(unit);
                            scope.units.minutes.label = 'Minutes';
                        }
                        if (format.indexOf('s') !== -1) {
                            scope.units.seconds = angular.copy(unit);
                            scope.units.seconds.label = 'Seconds';
                        }

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
        });

}());

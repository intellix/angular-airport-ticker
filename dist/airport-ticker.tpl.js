angular.module('airportTicker').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/airport-ticker/airport-ticker.tpl.html',
    "<div class=\"unit\" ng-repeat=\"unit in units\"><div class=\"flippers\"><ul class=\"flipper\" ng-repeat=\"digit in unit.digits\" ng-class=\"{'flipping': digit.flipping }\"><li class=\"now-prev\" ng-repeat=\"v in digit.values track by $index\" ng-class=\"{'now': $index === 0, 'prev': $index === 1}\"><div class=\"digit\"><div class=\"top\"><div class=\"shadow\"></div><div class=\"shadow2\"></div><div class=\"value\">{{v}}</div></div><div class=\"bottom\"><div class=\"shadow\"></div><div class=\"shadow2\"></div><div class=\"value\">{{v}}</div></div></div></li></ul></div><div class=\"unit-label\">{{unit.label}}</div></div>"
  );

}]);

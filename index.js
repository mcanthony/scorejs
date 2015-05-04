'use strict';
(function() {
  var plugins = [
    require('./lib/plugins/time.js'),
    require('./lib/plugins/teoria.js'),
    require('./lib/plugins/chord-player.js')
  ];
  var Score = require('./lib/score.js')(plugins);

  if (typeof define === "function" && define.amd) define(function() { return Score; });
  else if (typeof module === "object" && module.exports) module.exports = Score;
  else this.Score = Score;
})();

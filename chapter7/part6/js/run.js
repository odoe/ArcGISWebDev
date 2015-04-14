(function() {
  var pathRX = new RegExp(/\/[^\/]+$/)
    , locationPath = location.pathname.replace(pathRX, '/');

  require({
    async: true,
    parseOnLoad: true,
    aliases: [['text', 'dojo/text'], ['domReady', 'dojo/domReady']],
    packages: [{
      name: 'controllers',
      location: locationPath + 'js/controllers'
    }, {
      name: 'widgets',
      location: locationPath + 'js/widgets'
    }, {
      name: 'app',
      location: locationPath + 'js',
      main: 'main'
    }]
  }, ['app']);
})();
